import { useState } from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle, ArrowLeft, BookOpen, FileText, Image as ImageIcon, Plus, Settings, Trash2, Users, Video, X, Download, Check, GripVertical, Star } from 'lucide-react';
import { supabase, type CourseWithRelations, type Profile, type JobRole, type Module, type ExamQuestion, type Resource, type ModuleType } from '@/lib/supabase';
import { createCourse, deleteCourse, createModule, updateModule, deleteModule, createResource, deleteResource, createExamQuestion, deleteExamQuestion, reorderModules, assignCourseToRole, removeAssignment, addPrerequisite, removePrerequisite } from '@/lib/data';
import { getIcon, availableIcons, availableAccents } from '@/lib/icons';
import type { AdminStrings } from './types';

type CourseTab = 'info' | 'modules' | 'resources' | 'exams' | 'assignments' | 'prerequisites';

export function CoursesModule({ t, courses, jobRoles, profile, onRefresh }: {
  t: AdminStrings;
  courses: CourseWithRelations[];
  jobRoles: JobRole[];
  profile: Profile;
  onRefresh: () => void;
}) {
  const [editingCourse, setEditingCourse] = useState<CourseWithRelations | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  if (editingCourse) {
    return <CourseEditor t={t} course={editingCourse} jobRoles={jobRoles} allCourses={courses} profile={profile} onBack={() => setEditingCourse(null)} onSaved={() => { setEditingCourse(null); onRefresh(); }} />;
  }

  return (
    <div className="page animate-in">
      <div className="page-heading">
        <div><p className="eyebrow">GESTIÓN DE CURSOS</p><h1>{t.courses}</h1><p className="muted">{courses.length} {t.totalCourses.toLowerCase()}</p></div>
        <button className="primary-button" onClick={() => setEditingCourse({} as CourseWithRelations)}><Plus size={18} />{t.newCourse}</button>
      </div>
      <div className="section-card">
        {courses.length === 0 ? <div className="empty-state"><BookOpen size={30} /><h3>{t.noCourses}</h3>
          <button className="primary-button" onClick={() => setEditingCourse({} as CourseWithRelations)} style={{ marginTop: 16 }}><Plus size={18} />{t.newCourse}</button></div> :
          <div className="admin-list-stack">{courses.map((c) => {
            const Icon = getIcon(c.icon_name);
            return (
              <div key={c.id} className="admin-course-row">
                <div className={`course-icon ${c.accent}`}><Icon size={20} /></div>
                <div className="course-row-info"><strong>{c.title}</strong><small>{c.category} · {c.modules.length} {t.modulesLabel} · {c.resources?.length ?? 0} {t.resources.toLowerCase()} · {c.assignments.length} {t.assignedRole}s</small></div>
                <div className="admin-course-actions">
                  <button className="icon-button" onClick={() => setEditingCourse(c)}><Settings size={16} /></button>
                  <button className="icon-button" onClick={() => setDeleteConfirm(c.id)}><Trash2 size={16} /></button>
                </div>
              </div>
            );
          })}</div>}
      </div>
      {deleteConfirm && createPortal(<div className="modal-backdrop" onClick={() => setDeleteConfirm(null)}><div className="exit-warning-modal" onClick={(e) => e.stopPropagation()}>
        <div className="exit-warning-icon"><Trash2 size={40} /></div>
        <h2>{t.deleteConfirm}</h2>
        <div className="exit-warning-actions"><button className="outline-button" onClick={() => setDeleteConfirm(null)}>{t.cancel}</button>
        <button className="primary-button exit-confirm" onClick={async () => { await deleteCourse(deleteConfirm); setDeleteConfirm(null); onRefresh(); }}>{t.delete}</button></div>
      </div></div>, document.body)}
    </div>
  );
}

// ===================== COURSE EDITOR =====================
function CourseEditor({ t, course, jobRoles, allCourses, profile, onBack, onSaved }: {
  t: AdminStrings;
  course: CourseWithRelations;
  jobRoles: JobRole[];
  allCourses: CourseWithRelations[];
  profile: Profile;
  onBack: () => void;
  onSaved: () => void;
}) {
  const isNew = !course.id;
  const [tab, setTab] = useState<CourseTab>('info');
  const [title, setTitle] = useState(course.title ?? '');
  const [description, setDescription] = useState(course.description ?? '');
  const [category, setCategory] = useState(course.category ?? '');
  const [duration, setDuration] = useState(course.duration ?? '');
  const [imageUrl, setImageUrl] = useState(course.image_url ?? '');
  const [iconName, setIconName] = useState(course.icon_name ?? 'BookOpen');
  const [accent, setAccent] = useState(course.accent ?? 'gray-1');
  const [estimatedHours, setEstimatedHours] = useState(String(course.estimated_hours ?? 0));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [courseId, setCourseId] = useState(course.id ?? '');

  const tabs: { key: CourseTab; label: string; icon: typeof BookOpen }[] = [
    { key: 'info', label: t.tabs.info, icon: Settings },
    { key: 'modules', label: t.tabs.modules, icon: BookOpen },
    { key: 'resources', label: t.tabs.resources, icon: Download },
    { key: 'exams', label: t.tabs.exams, icon: FileText },
    { key: 'assignments', label: t.tabs.assignments, icon: Users },
    { key: 'prerequisites', label: t.tabs.prerequisites, icon: Check },
  ];

  const handleSaveInfo = async () => {
    setSaving(true); setError(null);
    const courseData = { title, description, category, duration, image_url: imageUrl, accent, icon_name: iconName, estimated_hours: parseInt(estimatedHours) || 0 };
    if (courseId) {
      const { error: uErr } = await supabase.from('courses').update(courseData).eq('id', courseId);
      if (uErr) { setError(uErr.message); setSaving(false); return; }
    } else {
      const { data, error: cErr } = await supabase.from('courses').insert({ ...courseData, created_by: profile.id }).select().single();
      if (cErr || !data) { setError(cErr?.message ?? 'Error'); setSaving(false); return; }
      setCourseId(data.id);
    }
    setSaving(false);
    onSaved();
  };

  return (
    <div className="page animate-in">
      <div className="page-heading">
        <div><p className="eyebrow">{isNew ? t.newCourse : t.editCourse}</p><h1>{t.courseEditor}</h1></div>
        <button className="outline-button" onClick={onBack}><ArrowLeft size={18} />{t.backToAdmin}</button>
      </div>
      {error && <div className="auth-error" style={{ marginBottom: 16 }}><AlertCircle size={16} />{error}</div>}
      <div className="admin-tabs">
        {tabs.map((tabItem) => {
          const Icon = tabItem.icon;
          return <button key={tabItem.key} className={tab === tabItem.key ? 'admin-tab active' : 'admin-tab'} onClick={() => setTab(tabItem.key)} disabled={isNew && tabItem.key !== 'info'}><Icon size={16} /> {tabItem.label}</button>;
        })}
      </div>
      <div className="admin-tab-content">
        {tab === 'info' && (
          <div className="editor-section">
            <div className="editor-grid">
              <div className="editor-input-block"><label>{t.courseTitle}</label><input className="auth-input" value={title} onChange={(e) => setTitle(e.target.value)} /></div>
              <div className="editor-input-block"><label>{t.courseDescription}</label><input className="auth-input" value={description} onChange={(e) => setDescription(e.target.value)} /></div>
              <div className="editor-input-block"><label>{t.courseCategory}</label><input className="auth-input" value={category} onChange={(e) => setCategory(e.target.value)} /></div>
              <div className="editor-input-block"><label>{t.courseDuration}</label><input className="auth-input" value={duration} onChange={(e) => setDuration(e.target.value)} /></div>
              <div className="editor-input-block"><label>{t.courseImage}</label><input className="auth-input" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} /></div>
              <div className="editor-input-block"><label>Horas estimadas</label><input className="auth-input" type="number" value={estimatedHours} onChange={(e) => setEstimatedHours(e.target.value)} /></div>
              <div className="editor-input-block"><label>{t.courseIcon}</label><select className="auth-input" value={iconName} onChange={(e) => setIconName(e.target.value)}>{availableIcons.map((i) => <option key={i} value={i}>{i}</option>)}</select></div>
              <div className="editor-input-block"><label>{t.courseAccent}</label><select className="auth-input" value={accent} onChange={(e) => setAccent(e.target.value)}>{availableAccents.map((a) => <option key={a} value={a}>{a}</option>)}</select></div>
            </div>
            <div className="form-actions-row"><button className="primary-button" onClick={handleSaveInfo} disabled={saving}>{saving ? t.loading : t.saveCourse}</button></div>
          </div>
        )}
        {tab === 'modules' && courseId && <ModulesTab t={t} courseId={courseId} modules={course.modules ?? []} onRefresh={onSaved} />}
        {tab === 'resources' && courseId && <ResourcesTab t={t} courseId={courseId} resources={course.resources ?? []} onRefresh={onSaved} />}
        {tab === 'exams' && courseId && <ExamsTab t={t} courseId={courseId} questions={course.exam_questions ?? []} onRefresh={onSaved} />}
        {tab === 'assignments' && courseId && <AssignmentsTab t={t} courseId={courseId} assignments={course.assignments ?? []} jobRoles={jobRoles} onRefresh={onSaved} />}
        {tab === 'prerequisites' && courseId && <PrerequisitesTab t={t} courseId={courseId} prerequisites={course.prerequisites ?? []} allCourses={allCourses} onRefresh={onSaved} />}
      </div>
    </div>
  );
}

// ===================== MODULES TAB =====================
function ModulesTab({ t, courseId, modules, onRefresh }: {
  t: AdminStrings;
  courseId: string;
  modules: Module[];
  onRefresh: () => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ModuleType>('text');
  const [duration, setDuration] = useState('');
  const [body, setBody] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const resetForm = () => { setTitle(''); setType('text'); setDuration(''); setBody(''); setImageUrl(''); setVideoUrl(''); setError(null); setShowForm(false); };

  const handleCreate = async () => {
    if (!title) { setError(t.moduleTitle); return; }
    setSaving(true);
    const { error: err } = await createModule({
      course_id: courseId,
      title,
      type,
      duration,
      body,
      image_url: type === 'image' ? imageUrl : null,
      video_url: type === 'video' ? videoUrl : null,
      order_index: modules.length,
    });
    if (err) { setError(err); setSaving(false); return; }
    setSaving(false); resetForm(); onRefresh();
  };

  const typeIcon = (tp: string) => tp === 'video' ? <Video size={14} /> : tp === 'image' ? <ImageIcon size={14} /> : tp === 'pdf' ? <FileText size={14} /> : <BookOpen size={14} />;

  return (
    <div className="editor-section">
      <div className="section-title"><div><h2>{t.modules}</h2><p className="muted">{modules.length} {t.modulesLabel}</p></div>
        <button className="outline-button" onClick={() => setShowForm(true)}><Plus size={16} />{t.addModule}</button>
      </div>
      {showForm && createPortal(<div className="modal-backdrop" onClick={resetForm}><div className="course-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={resetForm}><X size={19} /></button>
        <div className="modal-body">
          <h2>{t.addModule}</h2>
          {error && <div className="auth-error" style={{ marginBottom: 12 }}><AlertCircle size={16} />{error}</div>}
          <div className="modal-form-grid" style={{ marginTop: 10 }}>
            <div className="field-group field-group-full"><label>{t.moduleTitle}</label><input className="auth-input" value={title} onChange={(e) => setTitle(e.target.value)} /></div>
            <div className="field-group"><label>{t.moduleType}</label>
              <select className="auth-input" value={type} onChange={(e) => setType(e.target.value as ModuleType)}>
                <option value="text">Texto</option><option value="image">Imagen</option><option value="infographic">Infografía</option>
                <option value="video">Video</option><option value="pdf">PDF</option><option value="quiz">Quiz</option>
              </select>
            </div>
            <div className="field-group"><label>{t.moduleDuration}</label><input className="auth-input" value={duration} onChange={(e) => setDuration(e.target.value)} /></div>
            <div className="field-group field-group-full"><label>{t.moduleBody}</label><textarea className="auth-input" rows={3} value={body} onChange={(e) => setBody(e.target.value)} /></div>
            {type === 'image' && <div className="field-group field-group-full"><label>{t.moduleImage}</label><input className="auth-input" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} /></div>}
            {type === 'video' && <div className="field-group field-group-full"><label>{t.moduleVideo}</label><input className="auth-input" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} /></div>}
          </div>
          <div className="form-actions-row" style={{ marginTop: 4 }}>
            <button className="outline-button" onClick={resetForm}>{t.cancel}</button>
            <button className="primary-button" onClick={handleCreate} disabled={saving}>{saving ? t.loading : t.save}</button>
          </div>
        </div>
      </div></div>, document.body)}

      {deleteConfirm && createPortal(<div className="modal-backdrop" onClick={() => setDeleteConfirm(null)}><div className="exit-warning-modal" onClick={(e) => e.stopPropagation()}>
        <div className="exit-warning-icon"><Trash2 size={40} /></div>
        <h2>{t.deleteConfirm}</h2>
        <div className="exit-warning-actions"><button className="outline-button" onClick={() => setDeleteConfirm(null)}>{t.cancel}</button>
        <button className="primary-button exit-confirm" onClick={async () => { await deleteModule(deleteConfirm); setDeleteConfirm(null); onRefresh(); }}>{t.delete}</button></div>
      </div></div>, document.body)}

      {modules.length === 0 ? <p className="muted" style={{ padding: '20px 0' }}>{t.noData}</p> :
       <div className="admin-list-stack">{modules.map((m, i) => (
         <div key={m.id} className="admin-course-row">
           <div className="course-icon gray-2"><GripVertical size={16} /></div>
           <div className="course-row-info"><strong>{i + 1}. {m.title}</strong><small>{typeIcon(m.type)} {m.type} · {m.duration}</small></div>
           <div className="admin-course-actions"><button className="icon-button" onClick={() => setDeleteConfirm(m.id)}><Trash2 size={16} /></button></div>
         </div>
       ))}</div>}
    </div>
  );
}

// ===================== RESOURCES TAB =====================
function ResourcesTab({ t, courseId, resources, onRefresh }: {
  t: AdminStrings;
  courseId: string;
  resources: Resource[];
  onRefresh: () => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [fileType, setFileType] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const resetForm = () => { setTitle(''); setFileUrl(''); setFileType(''); setDescription(''); setError(null); setShowForm(false); };

  const handleCreate = async () => {
    if (!title || !fileUrl) { setError(t.resourceTitle + ' / ' + t.resourceUrl); return; }
    setSaving(true);
    const { error: err } = await createResource({ course_id: courseId, title, file_url: fileUrl, file_type: fileType, description, order_index: resources.length, is_downloadable: true });
    if (err) { setError(err); setSaving(false); return; }
    setSaving(false); resetForm(); onRefresh();
  };

  return (
    <div className="editor-section">
      <div className="section-title"><div><h2>{t.resources}</h2><p className="muted">{resources.length} {t.resources.toLowerCase()}</p></div>
        <button className="outline-button" onClick={() => setShowForm(true)}><Plus size={16} />{t.addResource}</button>
      </div>
      {showForm && createPortal(<div className="modal-backdrop" onClick={resetForm}><div className="course-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={resetForm}><X size={19} /></button>
        <div className="modal-body">
          <h2>{t.addResource}</h2>
          {error && <div className="auth-error" style={{ marginBottom: 12 }}><AlertCircle size={16} />{error}</div>}
          <div className="modal-form-grid" style={{ marginTop: 10 }}>
            <div className="field-group field-group-full"><label>{t.resourceTitle}</label><input className="auth-input" value={title} onChange={(e) => setTitle(e.target.value)} /></div>
            <div className="field-group field-group-full"><label>{t.resourceUrl}</label><input className="auth-input" value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} /></div>
            <div className="field-group"><label>{t.resourceType}</label><input className="auth-input" value={fileType} onChange={(e) => setFileType(e.target.value)} placeholder="PDF, DOC, XLS..." /></div>
            <div className="field-group"><label>{t.description}</label><input className="auth-input" value={description} onChange={(e) => setDescription(e.target.value)} /></div>
          </div>
          <div className="form-actions-row" style={{ marginTop: 4 }}>
            <button className="outline-button" onClick={resetForm}>{t.cancel}</button>
            <button className="primary-button" onClick={handleCreate} disabled={saving}>{saving ? t.loading : t.save}</button>
          </div>
        </div>
      </div></div>, document.body)}

      {deleteConfirm && createPortal(<div className="modal-backdrop" onClick={() => setDeleteConfirm(null)}><div className="exit-warning-modal" onClick={(e) => e.stopPropagation()}>
        <div className="exit-warning-icon"><Trash2 size={40} /></div>
        <h2>{t.deleteConfirm}</h2>
        <div className="exit-warning-actions"><button className="outline-button" onClick={() => setDeleteConfirm(null)}>{t.cancel}</button>
        <button className="primary-button exit-confirm" onClick={async () => { await deleteResource(deleteConfirm); setDeleteConfirm(null); onRefresh(); }}>{t.delete}</button></div>
      </div></div>, document.body)}

      {resources.length === 0 ? <p className="muted" style={{ padding: '20px 0' }}>{t.noData}</p> :
       <div className="admin-list-stack">{resources.map((r) => (
         <div key={r.id} className="admin-course-row">
           <div className="course-icon gray-1"><Download size={18} /></div>
           <div className="course-row-info"><strong>{r.title}</strong><small>{r.file_type ?? 'Archivo'}{r.is_downloadable ? ' · Descargable' : ''}</small></div>
           <div className="admin-course-actions"><button className="icon-button" onClick={() => setDeleteConfirm(r.id)}><Trash2 size={16} /></button></div>
         </div>
       ))}</div>}
    </div>
  );
}

// ===================== EXAMS TAB =====================
function ExamsTab({ t, courseId, questions, onRefresh }: {
  t: AdminStrings;
  courseId: string;
  questions: ExamQuestion[];
  onRefresh: () => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState('');
  const [correctIndex, setCorrectIndex] = useState('0');
  const [difficulty, setDifficulty] = useState('medium');
  const [points, setPoints] = useState('1');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const resetForm = () => { setQuestion(''); setOptions(''); setCorrectIndex('0'); setDifficulty('medium'); setPoints('1'); setError(null); setShowForm(false); };

  const handleCreate = async () => {
    if (!question || !options) { setError(t.questionText + ' / ' + t.options); return; }
    setSaving(true);
    const { error: err } = await createExamQuestion({
      course_id: courseId,
      question,
      options: options.split('\n').filter(Boolean),
      correct_index: parseInt(correctIndex) || 0,
      difficulty: difficulty as 'easy' | 'medium' | 'hard',
      points: parseInt(points) || 1,
      order_index: questions.length,
    });
    if (err) { setError(err); setSaving(false); return; }
    setSaving(false); resetForm(); onRefresh();
  };

  return (
    <div className="editor-section">
      <div className="section-title"><div><h2>{t.exams}</h2><p className="muted">{questions.length} {t.exams.toLowerCase()}</p></div>
        <button className="outline-button" onClick={() => setShowForm(true)}><Plus size={16} />{t.addQuestion}</button>
      </div>
      {showForm && createPortal(<div className="modal-backdrop" onClick={resetForm}><div className="course-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={resetForm}><X size={19} /></button>
        <div className="modal-body">
          <h2>{t.addQuestion}</h2>
          {error && <div className="auth-error" style={{ marginBottom: 12 }}><AlertCircle size={16} />{error}</div>}
          <div className="modal-form-grid" style={{ marginTop: 10 }}>
            <div className="field-group field-group-full"><label>{t.questionText}</label><input className="auth-input" value={question} onChange={(e) => setQuestion(e.target.value)} /></div>
            <div className="field-group field-group-full"><label>{t.options}</label><textarea className="auth-input" rows={4} value={options} onChange={(e) => setOptions(e.target.value)} /></div>
            <div className="field-group"><label>{t.correctOption}</label><input className="auth-input" type="number" min={0} value={correctIndex} onChange={(e) => setCorrectIndex(e.target.value)} /></div>
            <div className="field-group"><label>{t.difficultyLevel}</label>
              <select className="auth-input" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                <option value="easy">{t.easy}</option><option value="medium">{t.medium}</option><option value="hard">{t.hard}</option>
              </select>
            </div>
            <div className="field-group"><label>{t.pointsLabel}</label><input className="auth-input" type="number" value={points} onChange={(e) => setPoints(e.target.value)} /></div>
          </div>
          <div className="form-actions-row" style={{ marginTop: 4 }}>
            <button className="outline-button" onClick={resetForm}>{t.cancel}</button>
            <button className="primary-button" onClick={handleCreate} disabled={saving}>{saving ? t.loading : t.save}</button>
          </div>
        </div>
      </div></div>, document.body)}

      {deleteConfirm && createPortal(<div className="modal-backdrop" onClick={() => setDeleteConfirm(null)}><div className="exit-warning-modal" onClick={(e) => e.stopPropagation()}>
        <div className="exit-warning-icon"><Trash2 size={40} /></div>
        <h2>{t.deleteConfirm}</h2>
        <div className="exit-warning-actions"><button className="outline-button" onClick={() => setDeleteConfirm(null)}>{t.cancel}</button>
        <button className="primary-button exit-confirm" onClick={async () => { await deleteExamQuestion(deleteConfirm); setDeleteConfirm(null); onRefresh(); }}>{t.delete}</button></div>
      </div></div>, document.body)}

      {questions.length === 0 ? <p className="muted" style={{ padding: '20px 0' }}>{t.noData}</p> :
       <div className="admin-list-stack">{questions.map((q, i) => (
         <div key={q.id} className="admin-course-row">
           <div className="course-icon gray-2"><Star size={16} /></div>
           <div className="course-row-info"><strong>{i + 1}. {q.question}</strong><small>{q.options.length} {t.options.toLowerCase()} · {q.difficulty} · {q.points} {t.pointsLabel.toLowerCase()}</small></div>
           <div className="admin-course-actions"><button className="icon-button" onClick={() => setDeleteConfirm(q.id)}><Trash2 size={16} /></button></div>
         </div>
       ))}</div>}
    </div>
  );
}

// ===================== ASSIGNMENTS TAB =====================
function AssignmentsTab({ t, courseId, assignments, jobRoles, onRefresh }: {
  t: AdminStrings;
  courseId: string;
  assignments: any[];
  jobRoles: JobRole[];
  onRefresh: () => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [roleId, setRoleId] = useState('');
  const [isMandatory, setIsMandatory] = useState(true);
  const [priority, setPriority] = useState('medium');
  const [deadlineDays, setDeadlineDays] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const assignedRoleIds = assignments.map((a) => a.job_role_id);
  const availableRoles = jobRoles.filter((r) => !assignedRoleIds.includes(r.id));

  const handleAssign = async () => {
    if (!roleId) { setError(t.selectRole); return; }
    setSaving(true);
    const { error: err } = await assignCourseToRole(courseId, roleId, isMandatory, priority, deadlineDays ? parseInt(deadlineDays) : null, 0);
    if (err) { setError(err); setSaving(false); return; }
    setSaving(false); setRoleId(''); setDeadlineDays(''); setError(null); setShowForm(false); onRefresh();
  };

  const getRoleName = (id: string) => jobRoles.find((r) => r.id === id)?.name ?? '';

  return (
    <div className="editor-section">
      <div className="section-title"><div><h2>{t.manageAssignments}</h2><p className="muted">{assignments.length} {t.assignedRole}s</p></div>
        <button className="outline-button" onClick={() => setShowForm(true)}><Plus size={16} />{t.assignCourse}</button>
      </div>
      {showForm && createPortal(<div className="modal-backdrop" onClick={() => setShowForm(false)}><div className="course-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={() => setShowForm(false)}><X size={19} /></button>
        <div className="modal-body">
          <h2>{t.assignCourse}</h2>
          {error && <div className="auth-error" style={{ marginBottom: 12 }}><AlertCircle size={16} />{error}</div>}
          <div className="modal-form-grid" style={{ marginTop: 10 }}>
            <div className="field-group field-group-full"><label>{t.jobRole}</label>
              <select className="auth-input" value={roleId} onChange={(e) => setRoleId(e.target.value)}>
                <option value="">{t.selectRole}</option>
                {availableRoles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>
            <div className="field-group"><label>{t.mandatory}</label>
              <div className="auth-role-select">
                <button className={isMandatory ? 'active' : ''} onClick={() => setIsMandatory(true)}><Check size={16} />{t.mandatory}</button>
                <button className={!isMandatory ? 'active' : ''} onClick={() => setIsMandatory(false)}>{t.optional}</button>
              </div>
            </div>
            <div className="field-group"><label>{t.priority}</label>
              <select className="auth-input" value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="low">{t.low}</option><option value="medium">{t.medium}</option>
                <option value="high">{t.high}</option><option value="critical">{t.critical}</option>
              </select>
            </div>
            <div className="field-group"><label>{t.deadlineDays}</label><input className="auth-input" type="number" value={deadlineDays} onChange={(e) => setDeadlineDays(e.target.value)} /></div>
          </div>
          <div className="form-actions-row" style={{ marginTop: 4 }}>
            <button className="outline-button" onClick={() => setShowForm(false)}>{t.cancel}</button>
            <button className="primary-button" onClick={handleAssign} disabled={saving}>{saving ? t.loading : t.save}</button>
          </div>
        </div>
      </div></div>, document.body)}

      {deleteConfirm && createPortal(<div className="modal-backdrop" onClick={() => setDeleteConfirm(null)}><div className="exit-warning-modal" onClick={(e) => e.stopPropagation()}>
        <div className="exit-warning-icon"><Trash2 size={40} /></div>
        <h2>{t.deleteConfirm}</h2>
        <div className="exit-warning-actions"><button className="outline-button" onClick={() => setDeleteConfirm(null)}>{t.cancel}</button>
        <button className="primary-button exit-confirm" onClick={async () => { await removeAssignment(deleteConfirm); setDeleteConfirm(null); onRefresh(); }}>{t.delete}</button></div>
      </div></div>, document.body)}

      {assignments.length === 0 ? <p className="muted" style={{ padding: '20px 0' }}>{t.noData}</p> :
       <div className="admin-list-stack">{assignments.map((a) => (
         <div key={a.id} className="admin-course-row">
           <div className="course-icon gray-3"><BookOpen size={18} /></div>
           <div className="course-row-info"><strong>{getRoleName(a.job_role_id)}</strong><small>{a.is_mandatory ? t.mandatory : t.optional} · {a.priority ?? t.medium}</small></div>
           <div className="admin-course-actions"><button className="icon-button" onClick={() => setDeleteConfirm(a.id)}><Trash2 size={16} /></button></div>
         </div>
       ))}</div>}
    </div>
  );
}

// ===================== PREREQUISITES TAB =====================
function PrerequisitesTab({ t, courseId, prerequisites, allCourses, onRefresh }: {
  t: AdminStrings;
  courseId: string;
  prerequisites: any[];
  allCourses: CourseWithRelations[];
  onRefresh: () => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [prereqId, setPrereqId] = useState('');
  const [isMandatory, setIsMandatory] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const availableCourses = allCourses.filter((c) => c.id !== courseId && !prerequisites.some((p) => p.prerequisite_course_id === c.id));

  const handleAdd = async () => {
    if (!prereqId) { setError(t.selectPrerequisite); return; }
    setSaving(true);
    const { error: err } = await addPrerequisite(courseId, prereqId, isMandatory);
    if (err) { setError(err); setSaving(false); return; }
    setSaving(false); setPrereqId(''); setError(null); setShowForm(false); onRefresh();
  };

  const getCourseTitle = (id: string) => allCourses.find((c) => c.id === id)?.title ?? '';

  return (
    <div className="editor-section">
      <div className="section-title"><div><h2>{t.prerequisites}</h2><p className="muted">{prerequisites.length} {t.prerequisites.toLowerCase()}</p></div>
        <button className="outline-button" onClick={() => setShowForm(true)}><Plus size={16} />{t.addPrerequisite}</button>
      </div>
      {showForm && createPortal(<div className="modal-backdrop" onClick={() => setShowForm(false)}><div className="course-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={() => setShowForm(false)}><X size={19} /></button>
        <div className="modal-body">
          <h2>{t.addPrerequisite}</h2>
          {error && <div className="auth-error" style={{ marginBottom: 12 }}><AlertCircle size={16} />{error}</div>}
          <div className="modal-form-grid" style={{ marginTop: 10 }}>
            <div className="field-group field-group-full"><label>{t.selectPrerequisite}</label>
              <select className="auth-input" value={prereqId} onChange={(e) => setPrereqId(e.target.value)}>
                <option value="">{t.selectCourse}</option>
                {availableCourses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>
            <div className="field-group field-group-full"><label>{t.mandatory}</label>
              <div className="auth-role-select">
                <button className={isMandatory ? 'active' : ''} onClick={() => setIsMandatory(true)}><Check size={16} />{t.mandatory}</button>
                <button className={!isMandatory ? 'active' : ''} onClick={() => setIsMandatory(false)}>{t.optional}</button>
              </div>
            </div>
          </div>
          <div className="form-actions-row" style={{ marginTop: 4 }}>
            <button className="outline-button" onClick={() => setShowForm(false)}>{t.cancel}</button>
            <button className="primary-button" onClick={handleAdd} disabled={saving}>{saving ? t.loading : t.save}</button>
          </div>
        </div>
      </div></div>, document.body)}

      {deleteConfirm && createPortal(<div className="modal-backdrop" onClick={() => setDeleteConfirm(null)}><div className="exit-warning-modal" onClick={(e) => e.stopPropagation()}>
        <div className="exit-warning-icon"><Trash2 size={40} /></div>
        <h2>{t.deleteConfirm}</h2>
        <div className="exit-warning-actions"><button className="outline-button" onClick={() => setDeleteConfirm(null)}>{t.cancel}</button>
        <button className="primary-button exit-confirm" onClick={async () => { await removePrerequisite(deleteConfirm); setDeleteConfirm(null); onRefresh(); }}>{t.delete}</button></div>
      </div></div>, document.body)}

      {prerequisites.length === 0 ? <p className="muted" style={{ padding: '20px 0' }}>{t.noPrerequisites}</p> :
       <div className="admin-list-stack">{prerequisites.map((p) => (
         <div key={p.id} className="admin-course-row">
           <div className="course-icon gray-1"><Check size={18} /></div>
           <div className="course-row-info"><strong>{getCourseTitle(p.prerequisite_course_id)}</strong><small>{p.is_mandatory ? t.mandatory : t.optional}</small></div>
           <div className="admin-course-actions"><button className="icon-button" onClick={() => setDeleteConfirm(p.id)}><Trash2 size={16} /></button></div>
         </div>
       ))}</div>}
    </div>
  );
}
