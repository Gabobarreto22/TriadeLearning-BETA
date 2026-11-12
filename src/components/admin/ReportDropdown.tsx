import { useState, useRef, useEffect } from 'react';
import { FileText, ChevronDown } from 'lucide-react';

type ReportOption = {
  value: string;
  label: string;
};

export function ReportDropdown({
  label,
  options,
  onSelect,
}: {
  label: string;
  options: ReportOption[];
  onSelect: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div className="report-dropdown" ref={ref}>
      <button
        className="outline-button report-trigger"
        style={{ minHeight: 36, padding: '8px 12px', fontSize: 12, gap: 6 }}
        onClick={() => setOpen((v) => !v)}
      >
        <FileText size={16} />
        {label}
        <ChevronDown size={14} />
      </button>
      {open && (
        <div className="report-dropdown-menu">
          {options.map((opt) => (
            <button
              key={opt.value}
              className="report-dropdown-item"
              onClick={() => {
                onSelect(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
