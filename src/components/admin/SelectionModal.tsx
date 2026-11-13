import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, Search, X } from 'lucide-react';

export type SelectionOption = { value: string; label: string; hint?: string; icon?: React.ReactNode };

export function SelectionModal({ eyebrow, title, options, selectedValue, searchPlaceholder, onSelect, onClose }: {
  eyebrow: string;
  title: string;
  options: SelectionOption[];
  selectedValue: string;
  searchPlaceholder: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  const normalized = query.trim().toLowerCase();
  const visible = normalized ? options.filter((o) => o.label.toLowerCase().includes(normalized)) : options;

  return createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div className="course-modal selection-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><X size={19} /></button>
        <div className="modal-body">
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
          <div className="selection-search">
            <Search size={16} />
            <input className="auth-input" placeholder={searchPlaceholder} value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div className="selection-list">
            {visible.length === 0 && <p className="muted">Sin resultados</p>}
            {visible.map((option) => (
              <button key={option.value} type="button" className={`selection-option ${option.value === selectedValue ? 'active' : ''}`} onClick={() => onSelect(option.value)}>
                {option.icon}
                <span className="selection-option-copy">
                  <strong>{option.label}</strong>
                  {option.hint && <small>{option.hint}</small>}
                </span>
                {option.value === selectedValue && <Check size={16} />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
