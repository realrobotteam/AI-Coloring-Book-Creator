import React, { useState } from 'react';

interface ColoringBookFormProps {
  onGenerate: (theme: string, childName: string) => void;
  isLoading: boolean;
  initialTheme: string;
  initialName: string;
}

const ColoringBookForm: React.FC<ColoringBookFormProps> = ({ onGenerate, isLoading, initialTheme, initialName }) => {
  const [theme, setTheme] = useState(initialTheme);
  const [childName, setChildName] = useState(initialName);
  const { Lucide } = (window as any);
  const Sparkles = Lucide?.Sparkles;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (theme.trim() && childName.trim()) {
      onGenerate(theme, childName);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-1">
          Coloring Book Theme
        </label>
        <input
          type="text"
          id="theme"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          placeholder="e.g., Space Dinosaurs, Magical Unicorns"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500 transition"
          required
        />
      </div>
      <div>
        <label htmlFor="childName" className="block text-sm font-medium text-gray-700 mb-1">
          Child's Name
        </label>
        <input
          type="text"
          id="childName"
          value={childName}
          onChange={(e) => setChildName(e.target.value)}
          placeholder="e.g., Lily"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500 transition"
          required
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center bg-rose-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:bg-rose-300 disabled:cursor-not-allowed transition-all duration-300"
      >
        {isLoading ? (
          'Creating Magic...'
        ) : (
          <>
            {Sparkles && <Sparkles className="h-5 w-5 mr-2" />}
            Generate My Book
          </>
        )}
      </button>
    </form>
  );
};

export default ColoringBookForm;
