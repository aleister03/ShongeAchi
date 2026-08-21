"use client";
import { useState, useRef, useEffect } from "react";

// A controlled text input that shows a filtered dropdown of `options` as the
// user types (prefix match), plus a pinned "Other" row that switches the
// field into free manual-entry mode. Used for the medical-condition search
// bar and the relationship picker on the Register Elder form.
export default function SearchableCombobox({
  value,
  onChange,
  onSelect,
  options,
  placeholder,
  className,
  otherPlaceholder = "Type it in manually...",
  onKeyDown,
}) {
  const [open, setOpen] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const query = value || "";
  const filtered = query.trim()
    ? options.filter((o) => o.toLowerCase().startsWith(query.trim().toLowerCase()))
    : options;

  function selectOption(opt) {
    if (opt === "__other__") {
      setManualMode(true);
      onChange("");
      setOpen(false);
      return;
    }
    setManualMode(false);
    onSelect(opt);
    setOpen(false);
  }

  return (
    <div className="relative" ref={containerRef}>
      <input
        className={className}
        placeholder={manualMode ? otherPlaceholder : placeholder}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          if (!manualMode) setOpen(true);
        }}
        onFocus={() => !manualMode && setOpen(true)}
        onKeyDown={onKeyDown}
      />
      {manualMode && (
        <button
          type="button"
          onClick={() => { setManualMode(false); onChange(""); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-[#2a7a5a]"
        >
          back to list
        </button>
      )}
      {open && !manualMode && (
        <div className="absolute z-20 mt-1 w-full max-h-56 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
          {filtered.slice(0, 8).map((opt) => (
            <button
              key={opt}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => selectOption(opt)}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#e6f2dd] transition"
            >
              {opt}
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="px-4 py-2 text-sm text-gray-400">No matches</div>
          )}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => selectOption("__other__")}
            className="w-full text-left px-4 py-2 text-sm text-[#2a7a5a] font-medium border-t border-gray-100 hover:bg-[#e6f2dd] transition"
          >
            Other (enter manually)
          </button>
        </div>
      )}
    </div>
  );
}