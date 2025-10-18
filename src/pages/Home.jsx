// Home.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Loader from "../components/Loader";
import Header from "../components/Header";
import { supabase } from "../supabaseClient";

function Home() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [isSigningOut, setIsSigningOut] = useState(false);
  const [prompts, setPrompts] = useState([]);
  const [isLoadingPrompts, setIsLoadingPrompts] = useState(true);
  const [quickPrompt, setQuickPrompt] = useState("");

  useEffect(() => {
    const fetchPrompts = async () => {
      if (!user) return;
      try {
        setIsLoadingPrompts(true);
        const { data, error } = await supabase
          .from("prompts")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(10);

        if (error) {
          console.error("Error fetching prompts:", error);
          setPrompts([]);
        } else {
          setPrompts(data || []);
        }
      } finally {
        setIsLoadingPrompts(false);
      }
    };

    fetchPrompts();
  }, [user]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleQuickSubmit = (e) => {
    e.preventDefault();
    navigate("/add", { state: { initialPrompt: quickPrompt } });
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 relative">
      {/* subtle background glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_50%_at_50%_-10%,rgba(252,211,77,0.08),transparent_60%)]" />

      <Header />

      {/* Main */}
      <main className="max-w-6xl mx-auto px-5 py-10">
        {/* Large prompt textarea */}
        <section className="mb-10">
          <div className="text-center mb-6">
            <h2 className="text-4xl font-light tracking-tight text-neutral-900">
              Start a new prompt
            </h2>
            <p className="text-neutral-500 mt-1">
              Minimal interface, maximal focus
            </p>
          </div>

          <form
            onSubmit={handleQuickSubmit}
            className="mx-auto max-w-3xl"
            aria-label="Prompt composer"
          >
            {/* Wrapper that clips the animated light to the card */}
            <div className="relative rounded-2xl p-[2px] overflow-hidden">
              {/* Rotating + pulsing light layer under the content */}
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none z-0 animate-spin-slow animate-pulse-light"
                style={{
                  background: `conic-gradient(
                    from 0deg,
                    rgba(251,191,36,0) 0deg,
                    rgba(251,191,36,0.35) 90deg,
                    rgba(253,230,138,0.5) 180deg,
                    rgba(251,191,36,0.35) 270deg,
                    rgba(251,191,36,0) 360deg
                  )`,
                }}
              />

              {/* Card surface (stays static above the light) */}
              <div className="relative z-10 rounded-[calc(1rem-2px)] bg-white shadow-sm">
                <div className="px-4 pt-4">
                  <textarea
                    value={quickPrompt}
                    onChange={(e) => setQuickPrompt(e.target.value)}
                    onKeyDown={(e) => {
                      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                        e.preventDefault();
                        e.currentTarget.form?.requestSubmit();
                      }
                    }}
                    rows={8}
                    placeholder="Write your prompt…"
                    className="w-full bg-transparent outline-none text-base md:text-lg leading-7 placeholder:text-neutral-400 resize-none font-sans font-medium tracking-tight"
                    style={{
                      fontFamily:
                        "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
                    }}
                  />
                </div>

                <div className="flex items-center justify-end gap-3 p-3">
                  <span className="text-xs text-neutral-500">
                    Tip: Ctrl/Cmd+Enter to add
                  </span>
                  <button
                    type="submit"
                    aria-label="Add prompt"
                    className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white
                      transition"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="h-5 w-5"
                      fill="none"
                    >
                      <path
                        d="M5 12h12M13 6l6 6-6 6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </section>

        {/* Recent Activity */}
        <section className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
          <div className="px-6 py-5 border-b border-neutral-200 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-neutral-900">
              Recent Activity
            </h3>
            {prompts.length > 0 && (
              <Link
                to="/library"
                className="text-sm text-amber-600 hover:text-amber-800 font-medium transition-colors"
              >
                View all →
              </Link>
            )}
          </div>

          {isLoadingPrompts ? (
            <div className="py-12 text-center">
              <Loader />
              <p className="text-neutral-500 mt-3">Loading your prompts…</p>
            </div>
          ) : prompts.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-neutral-500">
                No prompts yet—use the big box above to add your first one.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-neutral-200">
              {prompts.slice(0, 8).map((prompt) => (
                <li
                  key={prompt.id}
                  className="px-6 py-4 group transition-all hover:scale-[1.01] hover:shadow-lg rounded-xl mb-2 bg-white"
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
                    <div className="flex-1">
                      {prompt.summary && (
                        <p className="text-base md:text-lg font-semibold text-neutral-900 mb-1 leading-tight">
                          {prompt.summary}
                        </p>
                      )}
                      <h4 className="text-sm md:text-base font-normal text-neutral-500 line-clamp-1 md:line-clamp-2">
                        {prompt.prompt}
                      </h4>
                      {Array.isArray(prompt.tags) && prompt.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {prompt.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-amber-200 via-amber-300 to-amber-400 text-neutral-900"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Date badge */}
                    <div className="flex-shrink-0 mt-2 md:mt-0">
                      <span className="text-xs font-medium text-neutral-600 bg-neutral-100 px-3 py-1 rounded-full">
                        {new Date(prompt.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

export default Home;
