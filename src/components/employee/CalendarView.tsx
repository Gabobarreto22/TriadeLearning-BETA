import { useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { DAYS_EN, DAYS_ES, MONTHS_EN, MONTHS_ES, copy, type Language } from '@/lib/copy';
import { getIcon } from '@/lib/icons';
import type { CourseWithRelations } from '@/lib/supabase';

export function CalendarView({ t, language, courses, onSelect }: { t: typeof copy.ES; language: Language; courses: CourseWithRelations[]; onSelect: (c: CourseWithRelations) => void }) {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const months = language === 'ES' ? MONTHS_ES : MONTHS_EN;
  const days = language === 'ES' ? DAYS_ES : DAYS_EN;
  const year = new Date().getFullYear();
  const firstDay = new Date(year, currentMonth, 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(year, currentMonth + 1, 0).getDate();
  const eventsByDay: Record<number, CourseWithRelations[]> = {};
  courses.forEach((c) => {
    const hasDeadline = c.assignments.some((a) => a.completion_deadline_days);
    if (!hasDeadline) return;
    const a = c.assignments.find((a) => a.completion_deadline_days);
    if (!a?.completion_deadline_days) return;
    const d = new Date(Date.now() + a.completion_deadline_days * 86400000);
    if (d.getMonth() === currentMonth && d.getFullYear() === year) {
      const day = d.getDate();
      if (!eventsByDay[day]) eventsByDay[day] = [];
      if (!eventsByDay[day].some((existing) => existing.id === c.id)) eventsByDay[day].push(c);
    }
  });
  const cells: (number | null)[] = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return <div className="page animate-in"><div className="page-heading"><div><p className="eyebrow">AGENDA DE APRENDIZAJE</p><h1>{t.calendar}</h1><p className="muted">{t.calendarIntro}</p></div></div>
    <div className="calendar-layout">
      <div className="section-card calendar-card">
        <div className="calendar-header"><button className="cal-nav" onClick={() => setCurrentMonth((currentMonth + 11) % 12)}><ChevronLeft size={18} /></button><strong>{months[currentMonth]} {year}</strong><button className="cal-nav" onClick={() => setCurrentMonth((currentMonth + 1) % 12)}><ChevronRight size={18} /></button></div>
        <div className="calendar-grid">{days.map((d) => <div key={d} className="cal-day-header">{d}</div>)}{cells.map((day, i) => <div key={i} className={day ? 'cal-day' : 'cal-day empty'}>{day && <><span className="cal-day-num">{day}</span>{eventsByDay[day]?.map((c) => { const Icon = getIcon(c.icon_name); return <button key={c.id} className={`cal-event ${c.accent}`} onClick={() => onSelect(c)}><span><Icon size={10} /><i />{c.title}</span></button>; })}</>}</div>)}</div>
      </div>
      <div className="section-card calendar-sidebar"><div className="section-title"><div><h2>{t.upcomingCourses}</h2><p className="muted">{t.activeCourses}</p></div></div>
        {courses.filter((c) => c.assignments.some((a) => a.completion_deadline_days)).sort((a, b) => (a.assignments[0]?.completion_deadline_days ?? 0) - (b.assignments[0]?.completion_deadline_days ?? 0)).slice(0, 5).map((c) => { const Icon = getIcon(c.icon_name); const dl = c.assignments.find((a) => a.completion_deadline_days) ? new Date(Date.now() + (c.assignments.find((a) => a.completion_deadline_days)?.completion_deadline_days ?? 0) * 86400000).toLocaleDateString() : ''; return <button key={c.id} className="upcoming-item" onClick={() => onSelect(c)}><div className={`course-icon ${c.accent}`}><Icon size={24} /></div><div><strong>{c.title}</strong><span><CalendarDays size={13} />{dl}</span></div><ChevronRight size={16} /></button>; })}
      </div>
    </div>
  </div>;
}

