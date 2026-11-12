import { useState } from 'react';
import { Star, X } from 'lucide-react';
import type { AdminStrings, AdminData } from './types';
import { FilterSelect } from './FilterSelect';

type FeedbackItem = AdminData['feedback'][number];
type CourseGroup = { id: string; title: string; all: FeedbackItem[] };

const STAR_LEVELS = [5, 4, 3, 2, 1];

export function FeedbackModule({ t, data }: { t: AdminStrings; data: AdminData }) {
  const { feedback } = data;
  const [workerId, setWorkerId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [rating, setRating] = useState('');
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(new Set());


  const workerOptions = Array.from(new Map(
    feedback.flatMap((f) => f.user_course_requirement?.user ? [[f.user_course_requirement.user.id, f.user_course_requirement.user.full_name] as const] : [])
  )).map(([value, label]) => ({ value, label }));

  const courseOptions = Array.from(new Map(
    feedback.flatMap((f) => f.user_course_requirement?.course ? [[f.user_course_requirement.course.id, f.user_course_requirement.course.title] as const] : [])
  )).map(([value, label]) => ({ value, label }));

  const ratingOptions = [5, 4, 3, 2, 1].map((n) => ({ value: String(n), label: `${'★'.repeat(n)} ${n} ${n === 1 ? 'estrella' : 'estrellas'}` }));

  const filteredFeedback = feedback.filter((f) =>
    (!workerId || f.user_course_requirement?.user?.id === workerId) &&
    (!courseId || f.user_course_requirement?.course?.id === courseId) &&
    (!rating || String(f.rating) === rating)
  );
  const avgRating = filteredFeedback.length > 0 ? (filteredFeedback.reduce((acc, f) => acc + f.rating, 0) / filteredFeedback.length).toFixed(1) : '0';

  const courseGroups = Array.from(
    feedback.reduce((groups, f) => {
      const course = f.user_course_requirement?.course;
      if (!course || (courseId && course.id !== courseId)) return groups;
      const group = groups.get(course.id) ?? { id: course.id, title: course.title, all: [] as FeedbackItem[] };
      group.all.push(f);
      groups.set(course.id, group);
      return groups;
    }, new Map<string, CourseGroup>()).values()
  );

  const hasDetailFilter = Boolean(workerId || rating);
  const visibleGroups = courseGroups
    .map((group) => ({
      ...group,
      matches: group.all.filter((f) =>
        (!workerId || f.user_course_requirement?.user?.id === workerId) &&
        (!rating || String(f.rating) === rating)
      ),
    }))
    .filter((group) => !hasDetailFilter || group.matches.length > 0);

  const hasFilters = Boolean(workerId || courseId || rating);
  const clearFilters = () => { setWorkerId(''); setCourseId(''); setRating(''); };

  const toggleCourse = (id: string) => {
    setExpandedCourses((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="page animate-in">
      <div className="page-heading"><div><p className="eyebrow">FEEDBACK</p><h1>{t.feedback}</h1><p className="muted">{t.feedbackDesc}</p></div>
        <div className="stat-card" style={{ minWidth: 120 }}><div className="stat-icon g3"><Star size={18} /></div><div><strong>{avgRating}</strong><span>{t.rating}</span></div></div>
      </div>
      <div className="section-card">
        <div className="section-title">
          <div><h2>{t.feedback}</h2><p className="muted">{visibleGroups.length} cursos con calificaciones</p></div>
          {hasFilters && <button className="outline-button" style={{ minHeight: 36, padding: '8px 12px', fontSize: 11 }} onClick={clearFilters}><X size={16} />Limpiar filtros</button>}
        </div>
        <div className="feedback-filter-row">
          <FilterSelect label="Trabajador" value={workerId} onChange={setWorkerId} placeholder="Todos los trabajadores" options={workerOptions} />
          <FilterSelect label="Curso" value={courseId} onChange={setCourseId} placeholder="Todos los cursos" options={courseOptions} />
          <FilterSelect label="Calificación" value={rating} onChange={setRating} placeholder="Todas las calificaciones" options={ratingOptions} />
        </div>
        {visibleGroups.length === 0 ? <div className="empty-state"><Star size={30} /><h3>{t.noFeedback}</h3></div> :
         <div className="feedback-course-grid">{visibleGroups.map((group) => {
           const isOpen = hasDetailFilter || expandedCourses.has(group.id);
           return (
             <article key={group.id} className="docs-article">
               <div className="docs-header" style={{ marginBottom: 16 }}>
                 <div className="docs-header-icon"><Star size={20} /></div>
                 <div style={{ flex: 1, minWidth: 0 }}><h3>{group.title}</h3><p className="muted">{group.all.length} {t.feedback.toLowerCase()}</p></div>
               </div>
               <p className="eyebrow">Desglose de calificaciones</p>
               <RatingBreakdown t={t} items={group.all} />
               {!hasDetailFilter && (
                 <button className="outline-button" style={{ minHeight: 36, padding: '8px 12px', fontSize: 11 }} onClick={() => toggleCourse(group.id)}>
                   {isOpen ? 'Ocultar calificaciones' : `Ver calificaciones (${group.matches.length})`}
                 </button>
               )}
               {isOpen && <div className="admin-list-stack" style={{ marginTop: 16 }}>{group.matches.map((f) => (
                 <FeedbackEntry key={f.id} t={t} feedback={f} />
               ))}</div>}
             </article>
           );
         })}</div>}
      </div>
    </div>
  );
}

function RatingBreakdown({ t, items }: { t: AdminStrings; items: FeedbackItem[] }) {
  const total = items.length;
  const average = total > 0 ? (items.reduce((acc, f) => acc + f.rating, 0) / total).toFixed(1) : '0';
  return (
    <div className="rating-breakdown">
      {STAR_LEVELS.map((star) => {
        const count = items.filter((f) => f.rating === star).length;
        const percent = total > 0 ? (count / total) * 100 : 0;
        return (
          <div key={star} className="rating-breakdown-row">
            <span>{star}★</span>
            <div className="rating-breakdown-track"><div className={`rating-breakdown-fill star-${star}`} style={{ width: `${percent}%` }} /></div>
            <span>{count}</span>
          </div>
        );
      })}
      <div className="rating-breakdown-average"><Star size={16} /><strong>{average}</strong><span>{t.rating}</span></div>
    </div>
  );
}

function FeedbackEntry({ t, feedback: f }: { t: AdminStrings; feedback: FeedbackItem }) {
  return (
    <div className="feedback-card">
      <div className="feedback-header">
        <div className="feedback-user-info">
          <div className="avatar avatar-small">{f.user_course_requirement?.user?.full_name?.slice(0, 2).toUpperCase() ?? '??'}</div>
          <div className="feedback-user-copy">
            <strong>{f.user_course_requirement?.user?.full_name ?? '—'}</strong>
            <small>{f.user_course_requirement?.course?.title ?? '—'}</small>
          </div>
        </div>
        <span className="rating-badge">{'★'.repeat(f.rating)}</span>
      </div>
      <div className="feedback-meta">
        {f.difficulty_level && <span className="meta-tag">{t.difficulty}: {f.difficulty_level}</span>}
        {f.would_recommend !== null && <span className="meta-tag">{f.would_recommend ? `✓ ${t.wouldRecommend}` : `✗ ${t.wouldRecommend}`}</span>}
        {f.time_commitment_adequate !== null && <span className="meta-tag">{f.time_commitment_adequate ? `✓ ${t.timeAdequate}` : `✗ ${t.timeAdequate}`}</span>}
      </div>
      {f.feedback_text && <p className="feedback-text">{f.feedback_text}</p>}
    </div>
  );
}

// ===================== GAMIFICATION =====================
