"use client";

import React from "react";

interface HighlightedTextProps {
  text: string;
  phrases?: string[];
  tooltipText?: string;
}

export const HighlightedText: React.FC<HighlightedTextProps> = ({
  text,
  phrases = [],
  tooltipText = "Violates active organizational guardrail",
}) => {
  if (!phrases || phrases.length === 0) {
    return <span className="text-slate-200 font-mono text-sm leading-relaxed whitespace-pre-wrap">{text}</span>;
  }

  // Escape special regex characters in phrases
  const escapedPhrases = phrases.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const regex = new RegExp(`(${escapedPhrases.join("|")})`, "gi");

  const parts = text.split(regex);

  return (
    <div className="font-mono text-sm leading-relaxed whitespace-pre-wrap text-slate-200">
      {parts.map((part, index) => {
        const isHighlighted = phrases.some((p) => p.toLowerCase() === part.toLowerCase());

        if (isHighlighted) {
          return (
            <mark
              key={index}
              title={tooltipText}
              className="bg-rose-500/25 text-rose-300 border-b-2 border-rose-500 font-semibold px-1 rounded cursor-help transition-colors hover:bg-rose-500/40 relative group"
            >
              {part}
              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block bg-slate-950 text-rose-300 text-xs px-2.5 py-1 rounded border border-rose-500/40 whitespace-nowrap shadow-xl z-30">
                ⚠️ {tooltipText}
              </span>
            </mark>
          );
        }

        return <span key={index}>{part}</span>;
      })}
    </div>
  );
};
