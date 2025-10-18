export default function ResponseInput({ value, onChange }) {
  return (
    <div className="group">
      <label className="block text-sm font-medium mb-3 text-amber-600">
        🤖 AI Response{" "}
        <span className="text-amber-400 text-xs">(optional)</span>
      </label>
      <div className="relative">
        <textarea
          className="w-full bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-2xl p-6 text-amber-700 placeholder-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-200 focus:border-amber-300 transition-all duration-200 resize-none shadow-sm hover:shadow-md"
          rows={4}
          placeholder="Paste the AI's response here if you'd like to save it..."
          value={value}
          onChange={onChange}
        />
        <div className="absolute top-4 right-4 text-amber-300 group-focus-within:text-amber-400 transition-colors">
          🤖
        </div>
      </div>
      <p className="text-xs text-amber-500 mt-2 ml-1">
        Save the response for future reference
      </p>
    </div>
  );
}
