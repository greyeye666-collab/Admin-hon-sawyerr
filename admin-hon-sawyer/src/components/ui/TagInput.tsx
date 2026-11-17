import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface TagInputProps {
  label?: string;
  tags: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}

export const TagInput: React.FC<TagInputProps> = ({
  label = 'Topic Tags',
  tags,
  onChange,
  placeholder = 'Add tag and press Enter…',
}) => {
  const [draft, setDraft] = useState('');

  const addTag = () => {
    const cleaned = draft.trim().replace(/^#/, '');
    if (!cleaned) return;
    if (!tags.some((t) => t.toLowerCase() === cleaned.toLowerCase())) {
      onChange([...tags, cleaned]);
    }
    setDraft('');
  };

  const removeTag = (target: string) => {
    onChange(tags.filter((t) => t !== target));
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold uppercase tracking-wider text-[#2A312D] block">
        {label}
      </label>

      <div className="flex flex-wrap gap-1.5 min-h-[28px]">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-white border border-[rgba(17,20,18,0.12)] text-[#111412]"
          >
            <span>#{tag}</span>
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-[#636C67] hover:text-[#D61F33] cursor-pointer"
              aria-label={`Remove ${tag}`}
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        {tags.length === 0 && (
          <span className="text-xs text-[#636C67] italic">No topic tags added yet.</span>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addTag();
            }
          }}
          placeholder={placeholder}
          className="editorial-input text-xs flex-1"
        />
        <button
          type="button"
          onClick={addTag}
          className="btn-editorial-secondary text-xs px-3"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </div>
    </div>
  );
};
