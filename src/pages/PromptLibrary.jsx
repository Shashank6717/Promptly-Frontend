import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Calendar,
  Tag,
  Clock,
  ChevronDown,
  Copy,
  Check,
  Trash2,
} from "lucide-react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../contexts/AuthContext";
import Header from "../components/Header";

function PromptLibrary() {
  const { user } = useAuth();

  const [prompts, setPrompts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortBy, setSortBy] = useState("newest");
  const [expandedId, setExpandedId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Fetch prompts from Supabase
  useEffect(() => {
    if (user) {
      fetchPrompts();
    }
  }, [user]);

  const fetchPrompts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("prompts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPrompts(data || []);
    } catch (err) {
      console.error("Error fetching prompts:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete prompt
  const deletePrompt = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this prompt?"
    );
    if (!confirmDelete) return;

    try {
      const { error } = await supabase.from("prompts").delete().eq("id", id);
      if (error) throw error;

      setPrompts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting prompt:", err);
      alert("Failed to delete prompt. Please try again.");
    }
  };

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set();
    prompts.forEach((p) => p.tags?.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, [prompts]);

  // Filter and sort prompts
  const filteredPrompts = useMemo(() => {
    let filtered = prompts.filter((p) => {
      const matchesSearch =
        !searchTerm ||
        p.prompt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.response?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => p.tags?.includes(tag));

      return matchesSearch && matchesTags;
    });

    // Sort
    filtered.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [prompts, searchTerm, selectedTags, sortBy]);

  // Group by date for timeline view
  const timelineGroups = useMemo(() => {
    const groups = {};
    filteredPrompts.forEach((p) => {
      const date = new Date(p.created_at);
      const key = date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      if (!groups[key]) groups[key] = [];
      groups[key].push(p);
    });
    return groups;
  }, [filteredPrompts]);

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const copyPrompt = (prompt, id) => {
    navigator.clipboard.writeText(prompt);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-neutral-50 grid place-items-center">
        <div className="flex items-center gap-3 text-neutral-700">
          <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span>Loading your prompts...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-neutral-50 text-neutral-900">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,rgba(79,70,229,0.08),transparent_60%)]" />

      <Header />

      <main className="max-w-[90rem] mx-auto px-8 py-8">
        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search prompts, responses, summaries..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-neutral-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
            />
          </div>

          {/* Tags and Sort */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="w-4 h-4 text-neutral-500" />
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    selectedTags.includes(tag)
                      ? "bg-indigo-600 text-white"
                      : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>

            <div className="ml-auto flex items-center gap-2">
              <Calendar className="w-4 h-4 text-neutral-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-white border border-neutral-200 text-sm font-medium outline-none cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        {filteredPrompts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-100 grid place-items-center">
              <Search className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-medium text-neutral-900 mb-2">
              No prompts found
            </h3>
            <p className="text-neutral-600">
              Try adjusting your filters or search term
            </p>
          </div>
        ) : (
          /* Timeline View */
          <div className="space-y-8">
            {Object.entries(timelineGroups).map(([date, items]) => (
              <div key={date}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-shrink-0 w-3 h-3 rounded-full bg-gradient-to-br from-indigo-400 to-emerald-400" />
                  <h2 className="text-lg font-semibold text-neutral-900">
                    {date}
                  </h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-neutral-200 to-transparent" />
                </div>

                <div className="ml-6 pl-6 border-l-2 border-neutral-200 space-y-6">
                  {items.map((prompt) => (
                    <article
                      key={prompt.id}
                      className="group relative bg-white rounded-xl border border-neutral-200 hover:border-indigo-300 hover:shadow-md transition-all p-5"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2 text-xs text-neutral-500">
                          <Clock className="w-3.5 h-3.5" />
                          {formatTime(prompt.created_at)}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => copyPrompt(prompt.prompt, prompt.id)}
                            className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
                          >
                            {copiedId === prompt.id ? (
                              <Check className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Copy className="w-4 h-4 text-neutral-400" />
                            )}
                          </button>

                          <button
                            onClick={() => deletePrompt(prompt.id)}
                            className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
                            title="Delete prompt"
                          >
                            <Trash2 className="w-4 h-4 text-rose-500" />
                          </button>
                        </div>
                      </div>

                      <h3 className="text-lg md:text-xl font-semibold text-neutral-900 mb-2 leading-tight">
                        {prompt.summary}
                      </h3>

                      <p className="text-sm text-neutral-500 mb-3 line-clamp-1 md:line-clamp-2">
                        {prompt.prompt}
                      </p>

                      <div className="flex flex-wrap gap-1.5">
                        {prompt.tags?.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 text-xs font-medium"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={() =>
                          setExpandedId(
                            expandedId === prompt.id ? null : prompt.id
                          )
                        }
                        className="mt-3 text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                      >
                        {expandedId === prompt.id
                          ? "Show less"
                          : "View details"}
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            expandedId === prompt.id ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {expandedId === prompt.id && (
                        <div className="mt-4 pt-4 border-t border-neutral-100 space-y-3">
                          <div>
                            <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">
                              Full Prompt
                            </h4>
                            <p className="text-sm text-neutral-700 whitespace-pre-wrap">
                              {prompt.prompt}
                            </p>
                          </div>
                          {prompt.response && (
                            <div>
                              <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">
                                Response
                              </h4>
                              <p className="text-sm text-neutral-800 whitespace-pre-wrap">
                                {prompt.response}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>
    </div>
  );
}

export default PromptLibrary;
