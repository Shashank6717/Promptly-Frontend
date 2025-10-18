import React from "react";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";

export default function SaveBar({ status, isLoading, onSave }) {
  const navigate = useNavigate();

  return (
    <div className="sticky top-[57px] z-30 backdrop-blur-sm bg-neutral-50/70 border-b border-neutral-200/60">
      <div className="max-w-[90rem] mx-auto px-8 h-16 flex items-center justify-between">
        <button
          onClick={() => navigate("/")}
          className="text-sm text-neutral-600 hover:text-neutral-900"
        >
          ← Library
        </button>
        <div className="text-sm">
          <span className="text-neutral-500">
            {status === "saving"
              ? "Saving…"
              : status === "saved"
              ? "Saved"
              : "Draft"}
          </span>
        </div>
        <button
          onClick={onSave}
          disabled={isLoading}
          className={`px-4 py-2.5 rounded-lg text-sm transition-colors ${
            isLoading
              ? "bg-neutral-200 text-neutral-500 cursor-not-allowed"
              : "bg-neutral-900 text-white hover:bg-neutral-800"
          }`}
        >
          {isLoading ? (
            <span className="inline-flex items-center gap-2">
              <Loader />
              Saving...
            </span>
          ) : (
            "Save"
          )}
        </button>
      </div>
    </div>
  );
}
