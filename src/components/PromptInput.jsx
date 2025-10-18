export default function PromptInput({ value, onChange }) {
  return (
    <div className="group">
      <label className="block text-sm font-medium mb-3 text-amber-700">
        💭 Your Prompt <span className="text-orange-500">*</span>
      </label>
      <div className="relative">
        <textarea
          className="w-full bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 rounded-2xl p-6 text-amber-800 placeholder-amber-400 focus:outline-none focus:ring-4 focus:ring-orange-200 focus:border-orange-300 transition-all duration-200 resize-none shadow-sm hover:shadow-md"
          rows={6}
          placeholder="Share your creative prompt or question..."
          value={value}
          onChange={onChange}
        />
        <div className="absolute top-4 right-4 text-amber-300 group-focus-within:text-orange-400 transition-colors">
          ✨
        </div>
      </div>
      <p className="text-xs text-amber-500 mt-2 ml-1">
        Be specific and clear for better results
      </p>
    </div>
  );
}
