"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

      // Send token to our secure Next.js API to create a session cookie
      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (res.ok) {
        // Sign out of client-side auth since we rely entirely on the HTTP-only cookie now
        await auth.signOut();
        router.push("/admin");
        router.refresh();
      } else {
        setError("Failed to create secure session.");
      }
    } catch (err: any) {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mist flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-olive text-cream mb-4">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-center text-3xl font-serif text-olive">Admin Portal</h2>
        <p className="mt-2 text-center text-sm text-ink/60">Teuk Massage & Spa</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-warm py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-mist">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-ink/80">Email address</label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-mist rounded-lg shadow-sm placeholder-ink/40 focus:outline-none focus:ring-olive focus:border-olive sm:text-sm bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink/80">Password</label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-mist rounded-lg shadow-sm placeholder-ink/40 focus:outline-none focus:ring-olive focus:border-olive sm:text-sm bg-white"
                />
              </div>
            </div>

            {error && <div className="text-red-500 text-sm text-center">{error}</div>}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-full shadow-sm text-sm tracking-widest uppercase font-medium text-cream bg-olive hover:bg-gold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-olive transition-colors disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
