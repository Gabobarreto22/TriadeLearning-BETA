import { Award, Download, FileText } from 'lucide-react';
import { PaginatedList } from '@/components/PaginatedList';
import { copy } from '@/lib/copy';
import type { CourseWithRelations } from '@/lib/supabase';

export function Certificates({ t, completedCourses, onPreview }: { t: typeof copy.ES; completedCourses: CourseWithRelations[]; onPreview: (c: { title: string; id: string; date: string }) => void }) {
  return <div className="page animate-in"><div className="page-heading"><div><p className="eyebrow">LOGROS ACADÉMICOS</p><h1>{t.certificates}</h1><p className="muted">Tus certificaciones están listas para compartir.</p></div></div>
    <div className="certificate-banner"><div className="banner-seal"><Award size={31} /></div><div><strong>{completedCourses.length} certificaciones obtenidas</strong><span>Has completado cursos de tu ruta anual.</span></div><div className="banner-line" /><div className="banner-stat"><strong>{completedCourses.length}</strong><span>cursos certificados</span></div></div>
    {completedCourses.length === 0 ? <div className="empty-state"><Award size={30} /><h3>{t.noCourses}</h3></div> :
    <PaginatedList items={completedCourses}>{(pageCourses, firstItemIndex) => <div className="certificate-grid">{pageCourses.map((c, i) => <article className="certificate-card" key={c.id}><div className="certificate-art"><div className="certificate-mark"><Award size={26} /></div><span>TRIADE</span><small>{t.certificate}</small><strong>{c.title}</strong><em>{t.awardedTo}</em><div className="certificate-art-footer"><span>TRD-{new Date().getFullYear()}-{String(firstItemIndex + i + 1).padStart(5, '0')}</span><span>{new Date().toLocaleDateString()}</span></div></div><div className="certificate-actions"><button onClick={() => onPreview({ title: c.title, id: `TRD-${new Date().getFullYear()}-${String(firstItemIndex + i + 1).padStart(5, '0')}`, date: new Date().toLocaleDateString() })}><FileText size={16} />{t.seeCertificate}</button><button><Download size={16} />{t.downloadCert}</button></div></article>)}</div>}</PaginatedList>}
  </div>;
}

