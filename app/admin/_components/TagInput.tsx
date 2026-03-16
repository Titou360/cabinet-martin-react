"use client";

import { useState } from "react";
import { IoClose } from "react-icons/io5";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  existingTags?: string[];
}

export default function TagInput({ tags, onChange, existingTags = [] }: TagInputProps) {
  const [input, setInput] = useState("");

  function addTag(tag: string) {
    const clean = tag.trim().toLowerCase();
    if (clean && !tags.includes(clean)) {
      onChange([...tags, clean]);
    }
    setInput("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "," || e.key === "Enter") {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && !input && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  }

  function removeTag(tag: string) {
    onChange(tags.filter((t) => t !== tag));
  }

  const suggestions = existingTags.filter((t) => !tags.includes(t));

  return (
    <div className="space-y-2">
      {/* Current tags + input */}
      <div className="flex flex-wrap gap-1.5 min-h-[42px] w-full px-3 py-2 rounded-lg border border-[#1b2a47]/15 bg-white focus-within:ring-2 focus-within:ring-[#ae894a]/40 focus-within:border-[#ae894a] transition">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold"
            style={{ background: "rgba(174,137,74,0.12)", color: "#ae894a" }}
          >
            {tag}
            <button type="button" onClick={() => removeTag(tag)} className="hover:opacity-70">
              <IoClose className="text-xs" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => { if (input.trim()) addTag(input); }}
          placeholder={tags.length === 0 ? "Ajouter des tags (séparés par virgule)…" : ""}
          className="flex-1 min-w-[120px] text-sm text-[#1b2a47] outline-none placeholder:text-[#1b2a47]/30 bg-transparent"
        />
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {suggestions.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => addTag(tag)}
              className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border border-[#1b2a47]/15 text-[#1b2a47]/50 hover:border-[#ae894a] hover:text-[#ae894a] transition-all duration-150"
            >
              + {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
