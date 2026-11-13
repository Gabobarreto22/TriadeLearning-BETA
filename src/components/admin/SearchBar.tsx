import { Search, X } from 'lucide-react';

export function SearchBar({ value, onChange, placeholder, style }: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className="selection-search" style={{ marginBottom: 16, ...style }}>
      <Search size={16} />
      <input className="auth-input" placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
      {value && (
        <button type="button" className="icon-button" onClick={() => onChange('')} title="Limpiar" style={{ width: 22, height: 22 }}>
          <X size={14} />
        </button>
      )}
    </div>
  );
}

export function filterByText<T>(items: T[], query: string, fields: (item: T) => (string | null | undefined)[]): T[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return items;
  return items.filter((item) => fields(item).some((f) => (f ?? '').toLowerCase().includes(normalized)));
}
