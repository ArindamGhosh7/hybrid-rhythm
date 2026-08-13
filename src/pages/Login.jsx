import { useState } from "react";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const success = await onLogin(email.trim().toLowerCase());

    if (!success) {
      setError("Email not found.");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl bg-slate-800 border border-slate-700 p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-white text-center">
          Hybrid Rhythm
        </h1>

        <p className="mt-2 text-center text-slate-400">
          Sign in using your IBM email
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="block text-sm text-slate-300 mb-2">
              IBM Email
            </label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-500"
              placeholder="name@in.ibm.com"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            disabled={loading}
            className="w-full rounded-lg bg-emerald-500 hover:bg-emerald-600 py-3 font-semibold text-white"
          >
            {loading ? "Signing In..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
