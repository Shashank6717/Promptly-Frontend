import { useState } from "react";

export default function TagsInput({ tags, setTags }) {
  const [inputValue, setInputValue] = useState("");

  const addTag = (e) => {
    e.preventDefault();
    const tag = inputValue.trim();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setInputValue("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      addTag(e);
    }
  };

  return (
    <div className="group">
      <label className="block text-sm font-medium mb-3 text-amber-700">
        🏷️ Tags <span className="text-orange-500">*</span>
      </label>

      {/* Tags Display */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <div
              key={index}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-amber-100 text-amber-700 px-4 py-2 rounded-full border border-orange-200 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <span className="text-orange-500">🏷️</span>
              <span className="text-sm font-medium">{tag}</span>
              <button
                onClick={() => removeTag(tag)}
                className="text-amber-500 hover:text-orange-600 transition-colors ml-1"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Tag Input */}
      <form onSubmit={addTag} className="relative">
        <div className="flex items-center bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 rounded-2xl p-4 focus-within:ring-4 focus-within:ring-orange-200 focus-within:border-orange-300 transition-all duration-200 shadow-sm hover:shadow-md">
          <span className="text-orange-400 mr-3">🏷️</span>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a tag..."
            className="flex-1 bg-transparent text-amber-700 placeholder-amber-400 focus:outline-none"
          />
          <button
            type="submit"
            className="ml-3 px-4 py-2 bg-gradient-to-r from-orange-400 to-amber-400 text-white rounded-xl hover:from-orange-500 hover:to-amber-500 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
          >
            Add
          </button>
        </div>
      </form>

      <p className="text-xs text-amber-500 mt-2 ml-1">
        Press Enter or click Add to create tags
      </p>
    </div>
  );
}
