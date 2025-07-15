"use client";
import { useState } from "react";
import { signInWithEmail, signUpWithEmail } from "../auth";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    try {
      if (mode === "login") {
        const { error } = await signInWithEmail(email, password);
        if (error) throw error;
        setMessage("Logged in!");
      } else {
        const { error } = await signUpWithEmail(email, password);
        if (error) throw error;
        setMessage("Registered! Please check your email.");
      }
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'message' in err && typeof (err as any).message === 'string') {
        setMessage((err as any).message);
      } else {
        setMessage('Error');
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 max-w-xs w-full">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        className="border rounded px-3 py-2"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        className="border rounded px-3 py-2"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {mode === "login" ? "Login" : "Register"}
        </button>
        <button
          type="button"
          className="underline text-sm"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
        >
          {mode === "login" ? "Need an account?" : "Have an account?"}
        </button>
      </div>
      {message && <div className="text-sm text-red-600 mt-2">{message}</div>}
    </form>
  );
}
