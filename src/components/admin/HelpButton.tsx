import { useState, useRef, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';

type HelpButtonProps = {
  summary: string;
  docId: string;
  onNavigateDoc: (docId: string) => void;
};

export function HelpButton({ summary, docId, onNavigateDoc }: HelpButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const handleEnter = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setShowTooltip(true);
  };
  const handleLeave = () => {
    timerRef.current = setTimeout(() => setShowTooltip(false), 200);
  };

  return (
    <div className="help-btn-wrap" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <button
        className="help-btn"
        onClick={() => onNavigateDoc(docId)}
        aria-label="Ayuda"
        title=""
      >
        <HelpCircle size={16} />
      </button>
      {showTooltip && (
        <div className="help-tooltip" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
          <p>{summary}</p>
          <button className="help-tooltip-link" onClick={() => onNavigateDoc(docId)}>
            Ver documentación completa
          </button>
        </div>
      )}
    </div>
  );
}
