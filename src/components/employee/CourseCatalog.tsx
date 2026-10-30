import { ArrowRight, Clock3, Play, Search } from 'lucide-react';
import { PaginatedList } from '@/components/PaginatedList';
import { copy } from '@/lib/copy';
import { getIcon } from '@/lib/icons';
import type { CourseWithRelations } from '@/lib/supabase';

export function Catalog({ t, filter, setFilter, query, setQuery, courses, getCourseState, onSelect, jobRole }: { t: typeof copy.ES; filter: string; setFilter: (v: string) => void; query: string; setQuery: (v: string) => void; courses: CourseWithRelations[]; getCourseState: (id: string) => { completedModules: boolean[]; directFailed: boolean; directPassed: boolean; courseExamPassed: boolean }; onSelect: (c: CourseWithRelations) => void; jobRole: string }) {
  const filters = [t.all, t.inProgress, t.notStarted, t.completed];
  const visible = courses.filter((c) => {
    const state = getCourseState(c.id);
    const isCompleted = state.courseExamPassed;
    const isInProgress = state.completedModules.some(Boolean) && !isCompleted;
    const isNotStarted = !state.completedModules.some(Boolean) && !isCompleted;
    const matchesFilter = filter === t.all || (filter === t.completed && isCompleted) || (filter === t.inProgress && isInProgress) || (filter === t.notStarted && isNotStarted);
    return matchesFilter && c.title.toLowerCase().includes(query.toLowerCase());
  });

  return <div className="page animate-in">
    <div className="page-heading"><div><p className="eyebrow">FORMACIÓN POR CARGO</p><h1>{t.catalog}</h1><p className="muted">{t.catalogIntro} · <strong className="role-tag">{jobRole}</strong></p></div></div>
    <div className="catalog-toolbar"><div className="search-box"><Search size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.search} /></div><div className="filter-tabs">{filters.map((f) => <button key={f} className={filter === f ? 'active' : ''} onClick={() => setFilter(f)}>{f}</button>)}</div></div>
    {visible.length === 0 ? <div className="empty-state"><Search size={30} /><h3>{courses.length === 0 ? t.noCourses : t.empty}</h3></div> :
    <PaginatedList key={`${filter}-${query}`} items={visible}>{(pageCourses) => <div className="catalog-grid">{pageCourses.map((c) => <CourseCard key={c.id} course={c} t={t} getCourseState={getCourseState} onSelect={onSelect} />)}</div>}</PaginatedList>}
  </div>;
}

function CourseCard({ course, t, getCourseState, onSelect }: { course: CourseWithRelations; t: typeof copy.ES; getCourseState: (id: string) => { completedModules: boolean[]; courseExamPassed: boolean }; onSelect: (c: CourseWithRelations) => void }) {
  const Icon = getIcon(course.icon_name);
  const state = getCourseState(course.id);
  const completedCount = state.completedModules.filter(Boolean).length;
  const progress = course.modules.length > 0 ? Math.round((completedCount / course.modules.length) * 100) : 0;
  const status = state.courseExamPassed ? t.completed : progress > 0 ? t.inProgress : t.notStarted;
  const statusClass = state.courseExamPassed ? 'status-completado' : progress > 0 ? 'status-en-progreso' : 'status-no-iniciado';
  return <article className="course-card">
    <div className={`course-cover ${course.accent}`} style={{ backgroundImage: `url(${course.image_url})` }}>
      <div className="cover-overlay" /><div className="cover-icon"><Icon size={22} /></div><span className="cover-category">{course.category}</span>
      <button className="cover-play" onClick={() => onSelect(course)}><Play size={18} fill="currentColor" /></button>
    </div>
    <div className="course-card-body">
      <div className="course-meta"><span><Clock3 size={14} />{course.duration}</span><span className={`status ${statusClass}`}>{status}</span></div>
      <h3>{course.title}</h3><p>{course.description}</p>
      <div className="course-card-footer"><div className="card-progress"><div className="progress-label"><span>{progress > 0 ? `${progress}% completado` : t.notStarted}</span><strong>{progress}%</strong></div><div className="progress-track"><span style={{ width: `${progress}%` }} /></div></div><button className="card-arrow" onClick={() => onSelect(course)}><ArrowRight size={18} /></button></div>
    </div>
  </article>;
}

