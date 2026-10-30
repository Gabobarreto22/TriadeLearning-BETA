import type { ReactNode } from 'react';
import { ArrowRight, Award, BarChart3, BookOpen, ChevronRight, Clock3 } from 'lucide-react';
import { MONTHS_ES, copy } from '@/lib/copy';
import { getIcon } from '@/lib/icons';
import { employeePaths } from '@/lib/routes';
import type { CourseWithRelations, Profile } from '@/lib/supabase';

function StatCard({ icon, value, label, tone }: { icon: ReactNode; value: string; label: string; tone: string }) {
  return <div className="stat-card"><div className={`stat-icon ${tone}`}>{icon}</div><div><strong>{value}</strong><span>{label}</span></div><span className="stat-trend">↗</span></div>;
}
export function Dashboard({ t, navigate, courses, getCourseState, onSelect, profile }: { t: typeof copy.ES; navigate: (path: string) => void; courses: CourseWithRelations[]; getCourseState: (id: string) => { completedModules: boolean[]; directFailed: boolean; directPassed: boolean; courseExamPassed: boolean }; onSelect: (c: CourseWithRelations) => void; profile: Profile }) {
  const inProgress = courses.filter((c) => { const s = getCourseState(c.id); return s.completedModules.some(Boolean) && !s.courseExamPassed; });
  const completed = courses.filter((c) => getCourseState(c.id).courseExamPassed);
  const overallProgress = courses.length > 0 ? Math.round((completed.length / courses.length) * 100) : 0;

  return <div className="page animate-in">
    <div className="page-heading"><div><p className="eyebrow">MI ESPACIO DE APRENDIZAJE</p><h1>{t.welcome}, {profile.full_name.split(' ')[0]}</h1><p className="muted">{t.subtitle}</p></div><button className="primary-button" onClick={() => navigate(employeePaths.catalog)}><BookOpen size={18} />{t.catalog}<ArrowRight size={17} /></button></div>
    <section className="stats-grid">
      <StatCard icon={<BookOpen />} value={String(courses.length)} label={t.assigned} tone="g1" />
      <StatCard icon={<BarChart3 />} value={`${overallProgress}%`} label={t.progress} tone="g2" />
      <StatCard icon={<Award />} value={String(completed.length)} label={t.certificatesStat} tone="g3" />
      <StatCard icon={<Clock3 />} value="4.5h" label={t.hours} tone="g4" />
    </section>
    {courses.length === 0 ? <div className="empty-state"><BookOpen size={30} /><h3>{t.noCourses}</h3></div> : <>
    <div className="content-grid">
      <section className="section-card learning-card">
        <div className="section-title"><div><h2>{t.continue}</h2><p className="muted">Retoma donde lo dejaste.</p></div><button className="text-button" onClick={() => navigate(employeePaths.catalog)}>{t.viewAll}<ArrowRight size={15} /></button></div>
        {inProgress.length > 0 ? inProgress.slice(0, 3).map((c) => <CourseRow key={c.id} course={c} t={t} getCourseState={getCourseState} onSelect={onSelect} />) : <p className="muted" style={{ padding: '20px 0' }}>{t.selectCourse}</p>}
      </section>
      <section className="section-card deadline-card"><div className="section-title"><div><h2>{t.deadline}</h2><p className="muted">Mantente al día.</p></div><Clock3 size={18} className="section-icon" /></div>
        {courses.filter((c) => c.assignments.some((a) => a.completion_deadline_days)).slice(0, 3).map((c) => { const a = c.assignments.find((a) => a.completion_deadline_days); const dl = a ? new Date(Date.now() + (a.completion_deadline_days ?? 0) * 86400000).toISOString() : ''; const d = new Date(dl); return <div key={c.id} className="deadline-item"><div className="date-badge"><strong>{isNaN(d.getDate()) ? '--' : d.getDate()}</strong><span>{isNaN(d.getMonth()) ? '---' : (copy as any).es_months?.[d.getMonth()] ?? MONTHS_ES[d.getMonth()].slice(0, 3).toUpperCase()}</span></div><div><strong>{c.title}</strong><p>{c.category}</p></div><ChevronRight size={17} /></div>; })}
        <button className="outline-button" onClick={() => navigate(employeePaths.calendar)}>{t.calendar}</button>
      </section>
    </div>
    </>}
  </div>;
}

function CourseRow({ course, t, getCourseState, onSelect }: { course: CourseWithRelations; t: typeof copy.ES; getCourseState: (id: string) => { completedModules: boolean[] }; onSelect: (c: CourseWithRelations) => void }) {
  const Icon = getIcon(course.icon_name);
  const state = getCourseState(course.id);
  const completedCount = state.completedModules.filter(Boolean).length;
  const progress = course.modules.length > 0 ? Math.round((completedCount / course.modules.length) * 100) : 0;
  return <button className="course-row" onClick={() => onSelect(course)}><div className={`course-icon ${course.accent}`}><Icon size={24} /></div><div className="course-row-info"><strong>{course.title}</strong><span><Clock3 size={14} />{course.duration}<i />{course.category}</span><div className="mini-progress"><span style={{ width: `${progress}%` }} /></div></div><div className="course-percent">{progress}%<ChevronRight size={17} /></div></button>;
}

