import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Loader from "./Loader";
import { Menu, X } from "lucide-react";

export default function Header() {
  const { user, signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  return (
    <>
      {/* Sign Out Overlay */}
      {isSigningOut && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center">
            <Loader />
            <p className="text-amber-700 font-medium mt-4">Signing you out...</p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-md border-b border-neutral-200/60">
        {/* Glow background */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 z-[-1] w-[110vw] h-20 pointer-events-none">
          <div
            className="w-full h-full animate-[spin_18s_linear_infinite]"
            style={{
              background:
                "radial-gradient(ellipse 60% 40% at 50% 30%, rgba(251,191,36,0.18) 0%, rgba(245,158,11,0.12) 60%, rgba(99,102,241,0.10) 100%, transparent 100%)",
              filter: "blur(18px)",
              opacity: 1,
            }}
          />
        </div>

        <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between relative">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-300 to-amber-400/80 shadow-sm flex items-center justify-center">
                <span className="text-lg">✨</span>
              </div>
              <h1 className="text-xl font-light tracking-tight text-neutral-800">
                Promptly
              </h1>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-2">
            <Link
              to="/library"
              className="px-3 py-2 text-sm text-neutral-700 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              Library
            </Link>

            <Link
              to="/add"
              className="px-3 py-2 text-sm text-neutral-700 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              Compose
            </Link>

            <Link
              to="/add"
              className="ml-1 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm text-white bg-neutral-900 hover:bg-neutral-800 shadow-sm transition-colors"
            >
              <span>New Prompt</span>
            </Link>

            <div className="w-px h-6 mx-1 bg-neutral-200" />

            <div className="flex items-center gap-3 pl-1">
              {user?.user_metadata?.avatar_url && (
                <img
                  src={user.user_metadata.avatar_url}
                  alt="Profile"
                  className="w-8 h-8 rounded-full border border-neutral-200"
                />
              )}
              <span className="text-sm text-neutral-700 truncate max-w-[140px]">
                {user?.user_metadata?.full_name || user?.email}
              </span>
              <button
                onClick={handleSignOut}
                disabled={isSigningOut}
                className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                  isSigningOut
                    ? "text-neutral-400 cursor-not-allowed"
                    : "text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100"
                }`}
              >
                {isSigningOut ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader />
                    Signing out…
                  </span>
                ) : (
                  "Sign Out"
                )}
              </button>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X size={22} className="text-neutral-800" />
            ) : (
              <Menu size={22} className="text-neutral-800" />
            )}
          </button>
        </div>

        {/* Mobile Nav Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-neutral-200 bg-white/90 backdrop-blur-md px-5 py-3 flex flex-col gap-2">
            <Link
              to="/library"
              className="px-3 py-2 text-sm text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Library
            </Link>
            <Link
              to="/add"
              className="px-3 py-2 text-sm text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Compose
            </Link>
            <Link
              to="/add"
              className="px-3 py-2 text-sm rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 transition-colors text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              New Prompt
            </Link>
            <div className="border-t border-neutral-200 my-2" />
            <div className="flex items-center gap-3 pl-1">
              {user?.user_metadata?.avatar_url && (
                <img
                  src={user.user_metadata.avatar_url}
                  alt="Profile"
                  className="w-8 h-8 rounded-full border border-neutral-200"
                />
              )}
              <span className="text-sm text-neutral-700">
                {user?.user_metadata?.full_name || user?.email}
              </span>
            </div>
            <button
              onClick={handleSignOut}
              disabled={isSigningOut}
              className={`mt-2 px-3 py-2 text-sm rounded-lg w-full text-left transition-colors ${
                isSigningOut
                  ? "text-neutral-400 cursor-not-allowed"
                  : "text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100"
              }`}
            >
              {isSigningOut ? (
                <span className="inline-flex items-center gap-2">
                  <Loader />
                  Signing out…
                </span>
              ) : (
                "Sign Out"
              )}
            </button>
          </div>
        )}
      </header>
    </>
  );
}
