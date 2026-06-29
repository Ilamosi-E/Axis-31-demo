import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { TwinIQLogo } from "@/components/TwinIQLogo";
import { toast } from "sonner";

export const Route = createFileRoute("/signin")({
  head: () => ({
    meta: [
      { title: "Sign in - TwinIQ" },
      { name: "description", content: "Sign in to your TwinIQ operational intelligence dashboard." },
    ],
  }),
  component: SignInPage,
});

type Mode = "signin" | "forgot-username" | "forgot-password";

function SignInPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("signin");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Please enter your username and password");
      return;
    }
    toast.success("Signed in successfully");
    navigate({ to: "/dashboard" });
  }

  function handleRecover(e: React.FormEvent) {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    toast.success(
      mode === "forgot-username"
        ? "If that email is registered, your username has been sent."
        : "If that email is registered, a password reset link has been sent.",
    );
    setMode("signin");
    setEmail("");
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-border bg-card/40 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <TwinIQLogo className="h-8 w-8" />
            <div>
              <div className="font-semibold tracking-tight">TwinIQ</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">by Axis31</div>
            </div>
          </Link>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">Back to home</Link>
        </div>
      </header>

      <main className="flex-1 grid place-items-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-xl border border-border bg-card/60 backdrop-blur p-6 md:p-8 shadow-lg">
            {mode === "signin" && (
              <>
                <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
                <p className="text-sm text-muted-foreground mt-1">Sign in to your TwinIQ dashboard.</p>

                <form onSubmit={handleSignIn} className="mt-6 space-y-4">
                  <div>
                    <label htmlFor="username" className="block text-xs font-medium text-muted-foreground mb-1.5">Username</label>
                    <input
                      id="username"
                      type="text"
                      autoComplete="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-3 py-2 rounded-md bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="your.username"
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-xs font-medium text-muted-foreground mb-1.5">Password</label>
                    <input
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 rounded-md bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="••••••••"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-md bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition"
                  >
                    Sign in
                  </button>
                </form>

                <div className="mt-5 flex items-center justify-between text-xs">
                  <button onClick={() => setMode("forgot-username")} className="text-muted-foreground hover:text-primary">
                    Forgot username?
                  </button>
                  <button onClick={() => setMode("forgot-password")} className="text-muted-foreground hover:text-primary">
                    Forgot password?
                  </button>
                </div>
              </>
            )}

            {(mode === "forgot-username" || mode === "forgot-password") && (
              <>
                <h1 className="text-2xl font-semibold tracking-tight">
                  {mode === "forgot-username" ? "Recover username" : "Reset password"}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Enter your account email and we'll send you {mode === "forgot-username" ? "your username" : "a reset link"}.
                </p>

                <form onSubmit={handleRecover} className="mt-6 space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-xs font-medium text-muted-foreground mb-1.5">Email address</label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-md bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="you@business.com"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-md bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition"
                  >
                    {mode === "forgot-username" ? "Send my username" : "Send reset link"}
                  </button>
                </form>

                <button
                  onClick={() => setMode("signin")}
                  className="mt-5 text-xs text-muted-foreground hover:text-primary"
                >
                  ← Back to sign in
                </button>
              </>
            )}
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Don't have an account?{" "}
            <Link to="/" className="text-primary hover:underline">Request a demo</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
