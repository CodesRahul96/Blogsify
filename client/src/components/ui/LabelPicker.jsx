import { useState, useEffect } from "react";
import axios from "axios";
import { FiTag, FiPlus, FiX, FiCheck } from "react-icons/fi";

const DEFAULT_LABELS = [
  "Technology",
  "Artificial Intelligence",
  "Cybersecurity",
  "Design",
  "Startups",
  "Engineering",
  "Culture",
  "Generative Art",
  "Productivity",
  "Ethical Hacking",
  "Bug Bounty",
  "System Tools",
  "Gaming",
  "Cloud Security",
  "Mobile",
];

export default function LabelPicker({
  selectedLabels = [],
  onChange,
  maxLabels = 8,
}) {
  const [availableLabels, setAvailableLabels] = useState(DEFAULT_LABELS);
  const [customInput, setCustomInput] = useState("");
  const [isInputActive, setIsInputActive] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchLabels = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/posts/labels`
        );
        if (isMounted && res.data?.labels?.length) {
          // Merge unique labels
          const combined = Array.from(
            new Set([...DEFAULT_LABELS, ...res.data.labels])
          );
          setAvailableLabels(combined);
        }
      } catch {
        // Use default curated set
      }
    };
    fetchLabels();
    return () => {
      isMounted = false;
    };
  }, []);

  const toggleLabel = (label) => {
    const trimmed = label.trim();
    if (!trimmed) return;

    if (selectedLabels.some((l) => l.toLowerCase() === trimmed.toLowerCase())) {
      onChange(selectedLabels.filter((l) => l.toLowerCase() !== trimmed.toLowerCase()));
    } else {
      if (selectedLabels.length >= maxLabels) return;
      onChange([...selectedLabels, trimmed]);
    }
  };

  const handleAddCustom = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const trimmed = customInput.trim().replace(/^#/, "");
      if (trimmed && !selectedLabels.some((l) => l.toLowerCase() === trimmed.toLowerCase())) {
        if (selectedLabels.length < maxLabels) {
          onChange([...selectedLabels, trimmed]);
          if (!availableLabels.some((l) => l.toLowerCase() === trimmed.toLowerCase())) {
            setAvailableLabels((prev) => [trimmed, ...prev]);
          }
        }
      }
      setCustomInput("");
    }
  };

  const removeLabel = (labelToRemove) => {
    onChange(selectedLabels.filter((l) => l !== labelToRemove));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs">
        <label className="flex items-center gap-1.5 font-semibold text-zinc-700 dark:text-zinc-300">
          <FiTag className="text-blue-600 dark:text-blue-400" size={13} />
          <span>Labels & Topics</span>
          <span className="text-zinc-500 font-normal">
            ({selectedLabels.length}/{maxLabels})
          </span>
        </label>
        {selectedLabels.length > 0 && (
          <button
            type="button"
            onClick={() => onChange([])}
            className="text-[11px] text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Selected Chips */}
      {selectedLabels.length > 0 && (
        <div className="flex flex-wrap gap-1.5 p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800/80">
          {selectedLabels.map((lbl) => (
            <span
              key={lbl}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 dark:bg-blue-500/15 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-300 group shadow-xs"
            >
              <span>#{lbl}</span>
              <button
                type="button"
                onClick={() => removeLabel(lbl)}
                className="hover:text-blue-950 dark:hover:text-white p-0.5 rounded transition-colors"
                aria-label={`Remove label ${lbl}`}
              >
                <FiX size={12} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Custom Tag Input */}
      <div className="relative">
        <input
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={handleAddCustom}
          onFocus={() => setIsInputActive(true)}
          placeholder="Add custom label (type name and press Enter or comma)..."
          className="w-full pl-3.5 pr-20 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors shadow-xs"
        />
        {customInput.trim() && (
          <button
            type="button"
            onClick={() => {
              const trimmed = customInput.trim().replace(/^#/, "");
              if (trimmed && !selectedLabels.includes(trimmed)) {
                if (selectedLabels.length < maxLabels) {
                  onChange([...selectedLabels, trimmed]);
                  if (!availableLabels.includes(trimmed)) {
                    setAvailableLabels((prev) => [trimmed, ...prev]);
                  }
                }
              }
              setCustomInput("");
            }}
            className="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-lg bg-zinc-950 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-[11px] font-bold transition-colors flex items-center gap-1 shadow-xs"
          >
            <FiPlus size={12} /> Add
          </button>
        )}
      </div>

      {/* Pre-added Clickable Labels Shelf */}
      <div>
        <div className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1.5 flex items-center justify-between">
          <span>Click to add pre-added labels:</span>
        </div>
        <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1 scrollbar-thin">
          {availableLabels.map((lbl) => {
            const isSelected = selectedLabels.some(
              (l) => l.toLowerCase() === lbl.toLowerCase()
            );
            return (
              <button
                type="button"
                key={lbl}
                onClick={() => toggleLabel(lbl)}
                className={`px-2.5 py-1 rounded-lg text-xs transition-all flex items-center gap-1 ${
                  isSelected
                    ? "bg-blue-600 text-white font-semibold shadow-xs"
                    : "bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-200 border border-zinc-200 dark:border-zinc-800/80"
                }`}
              >
                {isSelected ? <FiCheck size={11} /> : <FiPlus size={11} className="opacity-50" />}
                <span>{lbl}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
