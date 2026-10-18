import { useState, useEffect } from 'react';
import { BookOpen, ChevronRight, FileText, Search } from 'lucide-react';
import { docSections, type DocSection } from '@/lib/docs';
import type { AdminStrings } from './types';

export function DocumentationModule({ t: _t }: { t: AdminStrings }) {
  const [activeId, setActiveId] = useState<string>(docSections[0]?.id ?? '');
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handler = (e: Event) => {
      const docId = (e as CustomEvent<string>).detail;
      if (docId && docSections.some((s) => s.id === docId)) {
        setActiveId(docId);
      }
    };
    window.addEventListener('docs:navigate', handler);
    return () => window.removeEventListener('docs:navigate', handler);
  }, []);

  const filtered = docSections.filter((s) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      s.title.toLowerCase().includes(q) ||
      s.summary.toLowerCase().includes(q) ||
      s.sections.some((sec) => sec.heading.toLowerCase().includes(q) || sec.body.toLowerCase().includes(q))
    );
  });

  const active: DocSection | undefined = docSections.find((s) => s.id === activeId) ?? docSections[0];

  return (
    <div className="page animate-in">
      <div className="page-heading">
        <div>
          <p className="eyebrow">CENTRO DE AYUDA</p>
          <h1>Documentación</h1>
          <p className="muted">Guía detallada de cada módulo y proceso del sistema.</p>
        </div>
      </div>

      <div className="docs-layout">
        <aside className="docs-sidebar">
          <div className="docs-search">
            <Search size={16} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar en documentación..."
            />
          </div>
          <nav className="docs-nav">
            {filtered.map((s) => (
              <button
                key={s.id}
                className={activeId === s.id ? 'docs-nav-item active' : 'docs-nav-item'}
                onClick={() => setActiveId(s.id)}
              >
                <FileText size={15} />
                <span>{s.title}</span>
                {activeId === s.id && <ChevronRight size={14} />}
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="muted" style={{ padding: '16px 8px', fontSize: 12 }}>
                No se encontraron resultados.
              </p>
            )}
          </nav>
        </aside>

        <div className="docs-content">
          {active && (
            <>
              <div className="docs-header">
                <div className="docs-header-icon">
                  <BookOpen size={22} />
                </div>
                <div>
                  <h2>{active.title}</h2>
                  <p className="muted">{active.summary}</p>
                </div>
              </div>
              <div className="docs-sections">
                {active.sections.map((sec, i) => (
                  <article key={i} className="docs-article">
                    <h3>{sec.heading}</h3>
                    <p>{sec.body}</p>
                    {sec.example && (
                      <div className="docs-example">
                        <strong>Ejemplo:</strong>
                        <p>{sec.example}</p>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
