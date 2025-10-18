// AddPrompt.jsx — Premium full-page editor (no title, larger, colorful)
// - One tag at a time (Enter to commit)
// - Big type, full-width canvas, ambient gradient beam
// - Cmd/Ctrl+S to save
// - Motion respects prefers-reduced-motion

import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Loader from "../components/Loader";
import Header from "../components/Header";
import SaveBar from "../components/SaveBar";
import { supabase } from "../supabaseClient";

export default function AddPrompt() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Editor state
  const [body, setBody] = useState(""); // main writing surface -> prompt
  const [response, setResponse] = useState(""); // optional response
  const [notes, setNotes] = useState(""); // optional notes
  const [tags, setTags] = useState([]);
  const [tagDraft, setTagDraft] = useState(""); // single tag at a time
  const [status, setStatus] = useState("idle"); // idle | saving | saved
  const [isLoading, setIsLoading] = useState(false);

  const bodyRef = useRef(null);
  const notesRef = useRef(null);
  const responseRef = useRef(null);

  // If navigated with state.initialPrompt, prefill the body
  useEffect(() => {
    try {
      const initial = location?.state?.initialPrompt;
      if (initial && typeof initial === "string") {
        setBody(initial);
        // focus the editable div and move caret to end
        requestAnimationFrame(() => {
          const el = bodyRef.current;
          if (el) {
            el.focus();
            // place caret at end
            const range = document.createRange();
            const sel = window.getSelection();
            range.selectNodeContents(el);
            range.collapse(false);
            sel.removeAllRanges();
            sel.addRange(range);
          }
        });
      }
    } catch (err) {
      // defensive: don't block the page if DOM APIs fail
      console.error("Error applying initial prompt:", err);
    }
    // Only run on mount / when location changes
  }, [location]);

  // Cmd/Ctrl+S to save without leaving the editor
  useEffect(() => {
    const onKeyDown = (e) => {
      const isSave =
        (e.metaKey || e.ctrlKey) && String(e.key).toLowerCase() === "s";
      if (isSave) {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", onKeyDown, { capture: true });
    return () =>
      window.removeEventListener("keydown", onKeyDown, { capture: true });
  }, [body, notes, tags]); // contenteditable emits input events, keep fresh [web:120]

  // Keep contenteditable surfaces in sync with state
  const setText = (el, text = "") => {
    if (el && el.innerText !== text) el.innerText = text;
  }; // [web:120]
  useEffect(() => setText(bodyRef.current, body), [body]); // [web:121]
  useEffect(() => setText(notesRef.current, notes), [notes]); // [web:121]
  useEffect(() => setText(responseRef.current, response), [response]);

  // One-tag-at-a-time helpers
  const normalizeTag = (t) =>
    t
      .toLowerCase()
      .trim()
      .replace(/[^\p{L}\p{N}\s-]/gu, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 24); // [web:156]

  const commitTag = () => {
    const t = normalizeTag(tagDraft);
    if (!t) return;
    if (!tags.includes(t)) setTags((prev) => [...prev, t]);
    setTagDraft("");
  };

  const removeTag = (t) => setTags((prev) => prev.filter((x) => x !== t)); // [web:156]

  const handleSave = async () => {
    if (!user) {
      alert("You must be logged in to save prompts!");
      return;
    } // [web:120]
    const trimmed = body.trim();
    if (!trimmed || tags.length === 0) {
      alert("Main text and at least 1 tag are required.");
      return;
    } // [web:174]

    setStatus("saving");
    setIsLoading(true);

    const textToSummarize = response
      ? `${trimmed}\n\nResponse:\n${response}`
      : trimmed; // [web:120]

    try {
      // Summarize via backend (adjust endpoint as needed)
      const baseUrl =
        import.meta.env.VITE_RENDER_URL ||
        import.meta.env.RENDER_URL ||
        process.env.RENDER_URL ||
        "http://localhost:5000";
      const res = await fetch(`${baseUrl.replace(/\/+$/, "")}/api/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `Summarize the following text into a concise 1–2 line paragraph, preserving key details:\n\n${textToSummarize}`,
        }),
      });
      const data = await res.json();
      if (!data.summary) throw new Error("Failed to generate summary"); // [web:156]

      // Persist to Supabase (no title field)
      const { error } = await supabase.from("prompts").insert([
        {
          user_id: user.id,
          prompt: trimmed,
          response: response || null,
          summary: data.summary,
          tags,
        },
      ]);
      if (error) throw error; // [web:156]

      setStatus("saved");
      setTimeout(() => navigate("/"), 350);
    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
      setStatus("idle");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-neutral-50 text-neutral-900">
      {/* Full-viewport ambient color field */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,rgba(79,70,229,0.08),transparent_60%)]" />

      <Header />
      <SaveBar status={status} onSave={handleSave} />

      {/* Full-width editor canvas with premium beam */}
      <main className="relative">
        <div className="max-w-[90rem] mx-auto px-8 pt-12 pb-32 relative">
          {/* Rotating, blurred gradient beam for premium depth */}
          <div className="pointer-events-none absolute -z-10 inset-0 rounded-[36px] overflow-hidden">
            <div
              className="absolute -inset-[22%] animate-[spin_26s_linear_infinite] will-change-transform"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 0deg, rgba(99,102,241,0.12) 80deg, rgba(16,185,129,0.12) 160deg, rgba(245,158,11,0.12) 240deg, transparent 320deg)",
                filter: "blur(30px)",
              }}
            />
          </div>

          {/* Tags — one at a time, larger scale */}
          <div className="mb-10">
            <div className="flex flex-wrap items-center gap-3">
              {tags.map((t) => (
                <button
                  key={t}
                  onClick={() => removeTag(t)}
                  className="group/Tag inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-100 text-neutral-800 text-base hover:bg-neutral-200 transition-colors"
                  title="Remove tag"
                >
                  #{t}
                  <svg
                    viewBox="0 0 20 20"
                    className="h-4 w-4 text-neutral-500 group-hover/Tag:text-neutral-700"
                  >
                    <path
                      d="M6 6l8 8M14 6l-8 8"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              ))}

              {/* Single tag draft input */}
              <div className="relative">
                <input
                  value={tagDraft}
                  onChange={(e) => setTagDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      commitTag();
                    }
                  }}
                  placeholder={tags.length ? "Add another tag…" : "Add a tag…"}
                  className="bg-transparent outline-none text-xl text-neutral-800 placeholder:text-neutral-400 caret-indigo-600"
                />
                <div className="h-[2px] w-full bg-gradient-to-r from-indigo-400 via-emerald-400 to-amber-400 rounded-full mt-1 opacity-60" />
              </div>
            </div>
            <p className="mt-2 text-xs text-neutral-500">
              Press Enter to add the tag, then type the next one. One tag at a
              time for clarity.
            </p>
          </div>

          {/* Body editor — bigger, premium type scale */}
          <section className="relative">
            <div
              ref={bodyRef}
              contentEditable
              role="textbox"
              aria-label="Write here"
              suppressContentEditableWarning
              onInput={(e) => setBody(e.currentTarget.innerText)}
              className="prose max-w-none outline-none text-[1.35rem] md:text-[1.45rem] leading-9 min-h-[58vh] whitespace-pre-wrap caret-indigo-600 selection:bg-indigo-100 selection:text-indigo-900"
            />
            {!body.trim() && (
              <div className="pointer-events-none absolute top-0 left-0 text-neutral-400 text-[1.35rem] md:text-[1.45rem] leading-9 select-none">
                Begin writing…
              </div>
            )}
          </section>

          {/* Optional Response — styled to match */}
          <details className="mt-12">
            <summary className="cursor-pointer text-sm text-neutral-600 hover:text-neutral-900">
              Add a response (optional)
            </summary>
            <div className="mt-3 relative">
              <div
                ref={responseRef}
                contentEditable
                role="textbox"
                aria-label="Response"
                suppressContentEditableWarning
                onInput={(e) => setResponse(e.currentTarget.innerText)}
                className="outline-none text-[1.25rem] leading-9 min-h-[14rem] whitespace-pre-wrap text-neutral-800 caret-indigo-600 selection:bg-indigo-100 selection:text-indigo-900"
              />
              {!response.trim() && (
                <div className="pointer-events-none absolute top-0 left-0 text-neutral-400 text-[1.1rem] leading-8 select-none">
                  Paste or write an optional response…
                </div>
              )}
            </div>
          </details>
        </div>
      </main>

      {/* Save overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-white/40 backdrop-blur-[1px] grid place-items-center">
          <div className="flex items-center gap-3 text-neutral-700">
            <Loader />
            <span>Saving…</span>
          </div>
        </div>
      )}

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .animate-[spin_26s_linear_infinite] { animation: none !important; }
        }
        ::selection { background: rgba(129, 140, 248, 0.18); color: #111827; }
      `}</style>
    </div>
  );
}

// Prevent horizontal scroll on mobile Safari
document.documentElement.style.overflowX = "hidden";
