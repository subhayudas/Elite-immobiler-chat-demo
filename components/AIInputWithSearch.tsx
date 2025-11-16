/* "use client" */
"use client";

import { Globe, Paperclip, Send } from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAutoResizeTextarea } from "@/components/hooks/use-auto-resize-textarea";

interface AIInputWithSearchProps {
  id?: string;
  placeholder?: string;
  minHeight?: number;
  maxHeight?: number;
  onSubmit?: (value: string, withSearch: boolean) => void;
  onFileSelect?: (file: File) => void;
  className?: string;
}

export function AIInputWithSearch({
  id = "ai-input-with-search",
  placeholder = "Type your question...",
  minHeight = 48,
  maxHeight = 164,
  onSubmit,
  onFileSelect,
  className
}: AIInputWithSearchProps) {
  const [value, setValue] = useState("");
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight,
    maxHeight,
  });
  const [showSearch, setShowSearch] = useState(true);

  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit?.(value, showSearch);
      setValue("");
      adjustHeight(true);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect?.(file);
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="max-w-3xl w-full mx-auto">
        <div className="rounded-2xl border border-brand-deep/10 bg-white">
          <div className="px-3 py-2 flex items-end gap-2">
            <label className="cursor-pointer rounded-lg p-2 hover:bg-neutral-100 transition-colors">
              <input type="file" className="hidden" onChange={handleFileChange} />
              <Paperclip className="w-4 h-4 text-brand-deep/60" />
            </label>
            <div className="flex-1 min-w-0">
              <Textarea
                id={id}
                value={value}
                placeholder={placeholder}
                className="w-full resize-none bg-transparent border-0 focus-visible:ring-0 placeholder:text-brand-deep/50 text-brand-deep leading-[1.25]"
                ref={textareaRef}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                onChange={(e) => {
                  setValue(e.target.value);
                  adjustHeight();
                }}
                style={{ maxHeight: `${maxHeight}px` }}
              />
            </div>
            <button
              type="button"
              onClick={() => setShowSearch(!showSearch)}
              className={cn(
                "rounded-lg p-2 border transition-colors",
                showSearch
                  ? "bg-brand-accent/10 border-brand-accent/30 text-brand-accent"
                  : "bg-white border-neutral-200 text-brand-deep/60 hover:bg-neutral-100"
              )}
              title="Toggle Search"
            >
              <motion.div
                animate={{ rotate: showSearch ? 180 : 0, scale: showSearch ? 1.05 : 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <Globe className="w-4 h-4" />
              </motion.div>
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!value.trim()}
              className={cn(
                "rounded-lg p-2 transition-colors",
                value.trim()
                  ? "bg-brand-accent/15 text-brand-accent"
                  : "bg-neutral-100 text-brand-deep/40 cursor-not-allowed"
              )}
              title="Send"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="px-4 pb-3">
            <AnimatePresence>
              {showSearch && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-xs text-brand-deep/60"
                >
                  Web search is enabled for this query.
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className="px-1 mt-2 text-center text-[11px] text-brand-deep/50">
          Press Enter to send • Shift+Enter for new line
        </div>
      </div>
    </div>
  );
}

