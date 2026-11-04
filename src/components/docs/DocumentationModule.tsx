import { useState, useEffect } from 'react';
import { BookOpen, ChevronRight, FileText, Search, Award, BarChart3, Bell, Users, Settings, Star, Check } from 'lucide-react';
import type { DocSection, DocVisual, DocsLabels } from '@/lib/docs';

function VisualExample({ kind }: { kind: DocVisual }) {
  switch (kind) {
    case 'stat-cards':
      return (
        <div className="docs-visual">
          <div className="docs-visual-label">Vista previa de las tarjetas</div>
          <div className="docs-mock-stats">
            <div className="docs-mock-stat"><div className="docs-mock-icon g1"><BookOpen size={16} /></div><div><strong>12</strong><span>Cursos totales</span></div></div>
            <div className="docs-mock-stat"><div className="docs-mock-icon g2"><Users size={16} /></div><div><strong>48</strong><span>Usuarios totales</span></div></div>
            <div className="docs-mock-stat"><div className="docs-mock-icon g4"><Check size={16} /></div><div><strong>6</strong><span>Cargos totales</span></div></div>
            <div className="docs-mock-stat"><div className="docs-mock-icon g3"><Award size={16} /></div><div><strong>23</strong><span>Certificados totales</span></div></div>
          </div>
        </div>
      );
    case 'quick-links':
      return (
        <div className="docs-visual">
          <div className="docs-visual-label">Vista previa de accesos rápidos</div>
          <div className="docs-mock-links">
            <div className="docs-mock-link"><BookOpen size={20} /><strong>Cursos</strong><span>Ver todos</span></div>
            <div className="docs-mock-link"><Users size={20} /><strong>Personal</strong><span>Ver todos</span></div>
            <div className="docs-mock-link"><Award size={20} /><strong>Certificaciones</strong><span>Ver todos</span></div>
            <div className="docs-mock-link"><BarChart3 size={20} /><strong>Reportes</strong><span>Ver todos</span></div>
          </div>
        </div>
      );
    case 'course-list':
      return (
        <div className="docs-visual">
          <div className="docs-visual-label">Vista previa de lista de cursos</div>
          <div className="docs-mock-list">
            <div className="docs-mock-row"><div className="docs-mock-course-icon blue"><BookOpen size={16} /></div><div><strong>Seguridad Industrial Básica</strong><small>5 módulos · 3 cargos asignados</small></div></div>
            <div className="docs-mock-row"><div className="docs-mock-course-icon green"><BookOpen size={16} /></div><div><strong>Mantenimiento Preventivo</strong><small>4 módulos · 2 cargos asignados</small></div></div>
            <div className="docs-mock-row"><div className="docs-mock-course-icon orange"><BookOpen size={16} /></div><div><strong>Emergencias y Contingencias</strong><small>3 módulos · 4 cargos asignados</small></div></div>
          </div>
        </div>
      );
    case 'feedback-list':
      return (
        <div className="docs-visual">
          <div className="docs-visual-label">Vista previa de feedback reciente</div>
          <div className="docs-mock-list">
            <div className="docs-mock-row"><div className="docs-mock-avatar">JP</div><div><strong>Juan Pérez</strong><small>Mantenimiento Preventivo</small></div><span className="docs-mock-stars">★★★★</span></div>
            <div className="docs-mock-row"><div className="docs-mock-avatar">MG</div><div><strong>María Gómez</strong><small>Seguridad Industrial Básica</small></div><span className="docs-mock-stars">★★★★★</span></div>
          </div>
        </div>
      );
    case 'pass-rate':
      return (
        <div className="docs-visual">
          <div className="docs-visual-label">Cálculo de la tasa de aprobación</div>
          <div className="docs-mock-formula">
            <div className="docs-mock-formula-box">
              <strong>8</strong>
              <span>Exámenes aprobados</span>
            </div>
            <div className="docs-mock-formula-op">÷</div>
            <div className="docs-mock-formula-box">
              <strong>10</strong>
              <span>Total de intentos</span>
            </div>
            <div className="docs-mock-formula-op">=</div>
            <div className="docs-mock-formula-result">
              <strong>80%</strong>
              <span>Tasa de aprobación</span>
            </div>
          </div>
        </div>
      );
    case 'completion-bar':
      return (
        <div className="docs-visual">
          <div className="docs-visual-label">Vista previa del porcentaje de completación</div>
          <div className="docs-mock-completion">
            <div className="docs-mock-completion-header"><span>Completación promedio</span><strong>65%</strong></div>
            <div className="docs-mock-bar-track"><div className="docs-mock-bar-fill" style={{ width: '65%' }} /></div>
            <div className="docs-mock-completion-detail">
              <div className="docs-mock-completion-item"><Check size={14} /><span>Módulos completados: 130</span></div>
              <div className="docs-mock-completion-item"><BookOpen size={14} /><span>Total de módulos: 200</span></div>
            </div>
          </div>
        </div>
      );
    default:
      return null;
  }
}

export function DocumentationModule({ sections, labels }: { sections: DocSection[]; labels: DocsLabels }) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? '');
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handler = (e: Event) => {
      const docId = (e as CustomEvent<string>).detail;
      if (docId && sections.some((s) => s.id === docId)) {
        setActiveId(docId);
      }
    };
    window.addEventListener('docs:navigate', handler);
    return () => window.removeEventListener('docs:navigate', handler);
  }, [sections]);

  const filtered = sections.filter((s) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      s.title.toLowerCase().includes(q) ||
      s.summary.toLowerCase().includes(q) ||
      s.sections.some((sec) => sec.heading.toLowerCase().includes(q) || sec.body.toLowerCase().includes(q))
    );
  });

  const active: DocSection | undefined = sections.find((s) => s.id === activeId) ?? sections[0];

  return (
    <div className="page animate-in">
      <div className="page-heading">
        <div>
          <p className="eyebrow">{labels.eyebrow}</p>
          <h1>{labels.title}</h1>
          <p className="muted">{labels.subtitle}</p>
        </div>
      </div>

      <div className="docs-layout">
        <aside className="docs-sidebar">
          <div className="docs-search">
            <Search size={16} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={labels.searchPlaceholder}
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
                {labels.noResults}
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
                    {sec.visual && <VisualExample kind={sec.visual} />}
                    {sec.example && (
                      <div className="docs-example">
                        <strong>{labels.example}</strong>
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
