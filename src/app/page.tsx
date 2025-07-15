"use client";
import AuthForm from "./AuthForm";
import { useEffect, useState } from "react";
import { getUser, signOut } from "../auth";
import { supabase } from "../supabaseClient";

export default function Home() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [comboValue, setComboValue] = useState("1");
  const [messageBox, setMessageBox] = useState<string | null>(null);

  // Listen for auth state changes and update userId
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
      } else {
        setUserId(null);
      }
    });
    return () => listener?.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      const user = await getUser();
      setUserId(user ? user.id : null);
      setLoading(false);
    }
    fetchUser();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AuthForm />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8">
      <select
        className="border rounded px-3 py-2 text-base"
        value={comboValue}
        onChange={e => setComboValue(e.target.value)}
      >
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
      </select>
      <button
        className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
        onClick={async () => {
          try {
            await import("../userData").then(({ saveUserData }) => saveUserData(userId!, { comboValue }));
            setMessageBox("Saved!");
          } catch {
            setMessageBox("Error saving");
          }
        }}
      >
        Save
      </button>
      <button
        className="bg-gray-600 text-white px-6 py-3 rounded hover:bg-gray-700"
        onClick={async () => {
          try {
            const { loadUserData } = await import("../userData");
            const data = await loadUserData(userId!);
            if (data && data.comboValue) {
              setComboValue(data.comboValue);
              setMessageBox("Loaded!");
            } else {
              setMessageBox("No saved value found.");
            }
          } catch {
            setMessageBox("Error loading");
          }
        }}
      >
        Load
      </button>
      <button
        className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
        onClick={async () => {
          await signOut();
          setUserId(null);
          setComboValue("1"); // Reset combo to 1 on logout
        }}
      >
        Logout
      </button>
      {messageBox && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative bg-white rounded shadow-lg p-8 flex flex-col items-center">
            <div className="mb-6 text-lg">{messageBox}</div>
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              onClick={() => setMessageBox(null)}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
