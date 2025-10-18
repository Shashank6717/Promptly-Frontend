import React from "react";
import Header from "../components/Header";

function PromptDetail() {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <Header />
      <main className="max-w-6xl mx-auto px-5 py-10">
        <div className="text-3xl font-bold underline">Prompt Details</div>
      </main>
    </div>
  );
}

export default PromptDetail;
