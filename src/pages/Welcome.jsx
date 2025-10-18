import { useState } from "react";
import { supabase } from "../supabaseClient";
import Loader from "../components/Loader";

export default function Welcome() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      if (error) throw error;
    } catch (err) {
      console.error("Sign-in error:", err);
      alert("Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen relative flex flex-col overflow-hidden overflow-x-hidden bg-black">
      {/* Background video */}
      <div className="absolute inset-0 overflow-hidden">
        <iframe
          src="https://streamable.com/e/eetj0r?autoplay=1&nocontrols=1"
          allow="autoplay; fullscreen"
          allowFullScreen
          className="absolute inset-0 w-full h-full -z-10"
          style={{
            border: "none",
            pointerEvents: "none",
            transform: "scale(1.25)",
            transformOrigin: "center center",
          }}
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-none" />
      </div>

      {/* Foreground */}
      <div className="relative z-10 flex flex-col justify-center items-center flex-grow p-6">
        {/* Glow orb behind card */}
        <div className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-r from-purple-600/30 to-pink-600/30 blur-[120px] animate-pulse" />

        {/* Main glass card */}
        <div className="relative w-full max-w-md mx-auto bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-8 text-center z-10">
          {/* Logo */}
          <div className="mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500/90 to-pink-500/90 rounded-2xl mx-auto mb-3 flex items-center justify-center shadow-lg ring-4 ring-white/20 animate-float">
              <span className="text-3xl">✨</span>
            </div>
            <h1 className="text-3xl font-light text-white tracking-wide">
              Welcome to <span className="font-semibold">Promptly</span>
            </h1>
            <p className="text-white/80 text-sm mt-1">
              Your personal prompt diary
            </p>
          </div>

          {/* Sign-in button */}
          <div className="space-y-5">
            <p className="text-white/90 text-base">
              Start organizing your AI prompts
            </p>

            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className={`w-full py-4 px-6 rounded-2xl font-medium flex items-center justify-center gap-3 text-white transition-all duration-300 transform shadow-lg
                ${
                  isLoading
                    ? "bg-gradient-to-r from-purple-400/70 to-pink-400/70 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105 hover:shadow-xl hover:from-purple-600 hover:to-pink-600 hover:ring-4 hover:ring-white/20"
                }`}
            >
              {isLoading ? (
                <>
                  <Loader />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </>
              )}
            </button>

            <p className="text-xs text-white/60 mt-2">
              By signing in, you agree to our terms of service
            </p>
          </div>
        </div>

        {/* Feature cards below */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl w-full">
          {[
            {
              icon: "💭",
              title: "Smart Prompts",
              desc: "Capture & organize ideas",
            },
            {
              icon: "🏷️",
              title: "Smart Tags",
              desc: "Auto-organize with tags",
            },
            {
              icon: "📚",
              title: "Personal Library",
              desc: "Access all in one place",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="bg-white/10 border border-white/20 backdrop-blur-md rounded-xl p-4 text-center transition-all duration-300 hover:bg-white/15 hover:scale-105 group"
            >
              <span className="text-2xl mb-2 block transform transition-transform group-hover:-translate-y-1">
                {f.icon}
              </span>
              <h3 className="text-sm font-medium text-white mb-0.5">
                {f.title}
              </h3>
              <p className="text-xs text-white/70">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
