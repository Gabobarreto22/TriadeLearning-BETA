import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle, ArrowLeft, BookOpen, FileText, Image as ImageIcon, Plus, Settings, Trash2, Users, Video, X, Download, Check, GripVertical, Star, Upload, Loader2, Pencil } from 'lucide-react';
import { supabase, type CourseWithRelations, type Profile, type JobRole, type Department, type Module, type ExamQuestion, type ModuleType } from '@/lib/supabase';
import { createCourse, deleteCourse, createModule, updateModule, deleteModule, createExamQuestion, updateExamQuestion, deleteExamQuestion, reorderModules, assignCourseToRole, removeAssignment, addPrerequisite, removePrerequisite } from '@/lib/data';
import { getIcon, availableIcons, availableAccents } from '@/lib/icons';
import { useToast } from '@/lib/toast';
import { uploadToImageKit, deleteFromImageKit, detectResourceType, type ResourceType } from '@/lib/imagekit';
import type { AdminStrings } from './types';

type CourseTab = 'info' | 'modules' | 'exams' | 'assignments' | 'prerequisites';

export function CoursesModule({ t, courses, jobRoles, departments, profile, onRefresh }: {
  t: AdminStrings;
  courses: CourseWithRelations[];
  jobRoles: JobRole[];
  departments: Department[];
  profile: Profile;
  onRefresh: () => void;
}) {
  const [editingCourse, setEditingCourse] = useState<CourseWithRelations | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  if (editingCourse) {
    return <CourseEditor t={t} course={editingCourse} jobRoles={jobRoles} departments={departments} allCourses={courses} profile={profile} onBack={() => setEditingCourse(null)} onSaved={() => { setEditingCourse(null); onRefresh(); }} />;
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
                <div className="course-row-info"><strong>{c.title}</strong><small>{c.category} · {c.modules.length} {t.modulesLabel} · {c.assignments.length} {t.assignedRole}s</small></div>
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
        <button className="primary-button exit-confirm" disabled={deleting} onClick={async () => { setDeleting(true); await deleteCourse(deleteConfirm); setDeleting(false); setDeleteConfirm(null); toast('Curso eliminado', 'success'); onRefresh(); }}>{deleting ? t.loading : t.delete}</button></div>
      </div></div>, document.body)}
    </div>
  );
}

// ===================== COURSE EDITOR =====================
function CourseEditor({ t, course, jobRoles, departments, allCourses, profile, onBack, onSaved }: {
  t: AdminStrings;
  course: CourseWithRelations;
  jobRoles: JobRole[];
  departments: Department[];
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
  const { toast } = useToast();

  const tabs: { key: CourseTab; label: string; icon: typeof BookOpen }[] = [
    { key: 'info', label: t.tabs.info, icon: Settings },
    { key: 'modules', label: t.tabs.modules, icon: BookOpen },
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
    toast(courseId ? 'Curso actualizado' : 'Curso creado', 'success');
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
        {tab === 'exams' && courseId && <ExamsTab t={t} courseId={courseId} questions={course.exam_questions ?? []} onRefresh={onSaved} />}
        {tab === 'assignments' && courseId && <AssignmentsTab t={t} courseId={courseId} assignments={course.assignments ?? []} jobRoles={jobRoles} departments={departments} onRefresh={onSaved} />}
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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ModuleType>('text');
  const [duration, setDuration] = useState('');
  const [body, setBody] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [resourceUrl, setResourceUrl] = useState('');
  const [resourceType, setResourceType] = useState<ResourceType | null>(null);
  const [resourceFileId, setResourceFileId] = useState('');
  const [resourceName, setResourceName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const resetForm = () => { setEditingId(null); setTitle(''); setType('text'); setDuration(''); setBody(''); setImageUrl(''); setVideoUrl(''); setResourceUrl(''); setResourceType(null); setResourceFileId(''); setResourceName(''); setError(null); setShowForm(false); };

  const openEdit = (m: Module) => {
    setEditingId(m.id);
    setTitle(m.title);
    setType(m.type);
    setDuration(m.duration ?? '');
    setBody(m.body ?? '');
    setImageUrl(m.image_url ?? '');
    setVideoUrl(m.video_url ?? '');
    setResourceUrl(m.resource_url ?? '');
    setResourceType(m.resource_type as ResourceType | null);
    setResourceFileId(m.resource_file_id ?? '');
    setResourceName(m.resource_url ? m.resource_url.split('/').pop() ?? '' : '');
    setError(null);
    setShowForm(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setError(null);
    try {
      const result = await uploadToImageKit(file, `courses/${courseId}/modules`);
      setResourceUrl(result.url);
      setResourceFileId(result.fileId);
      setResourceName(result.name);
      setResourceType(detectResourceType(result.mimeType));
      toast('Archivo subido correctamente', 'success');
    } catch (err: any) {
      setError(err.message ?? 'Error al subir archivo');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveResource = async () => {
    if (resourceFileId) {
      try { await deleteFromImageKit(resourceFileId); } catch { /* ignore */ }
    }
    setResourceUrl(''); setResourceFileId(''); setResourceName(''); setResourceType(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = async () => {
    if (!title) { setError(t.moduleTitle); return; }
    setSaving(true);
    const payload = {
      title,
      type,
      duration,
      body,
      image_url: type === 'image' ? imageUrl : null,
      video_url: type === 'video' ? videoUrl : null,
      resource_url: resourceUrl || null,
      resource_type: resourceType,
      resource_file_id: resourceFileId || null,
    };
    if (editingId) {
      const { error: err } = await updateModule(editingId, payload);
      if (err) { setError(err); setSaving(false); return; }
      setSaving(false); resetForm(); toast('Módulo actualizado', 'success'); onRefresh();
    } else {
      const { error: err } = await createModule({ ...payload, course_id: courseId, order_index: modules.length });
      if (err) { setError(err); setSaving(false); return; }
      setSaving(false); resetForm(); toast('Módulo creado', 'success'); onRefresh();
    }
  };

  const typeIcon = (tp: string) => tp === 'video' ? <Video size={14} /> : tp === 'image' ? <ImageIcon size={14} /> : tp === 'pdf' ? <FileText size={14} /> : <BookOpen size={14} />;

  const resourceIcon = (rt: string | null) => {
    if (rt === 'video') return <Video size={14} />;
    if (rt === 'image') return <ImageIcon size={14} />;
    if (rt === 'pdf') return <FileText size={14} />;
    if (rt === 'powerpoint') return <FileText size={14} />;
    return <Download size={14} />;
  };

  return (
    <div className="editor-section">
      <div className="section-title"><div><h2>{t.modules}</h2><p className="muted">{modules.length} {t.modulesLabel}</p></div>
        <button className="outline-button" onClick={() => { resetForm(); setShowForm(true); }}><Plus size={16} />{t.addModule}</button>
      </div>
      {showForm && createPortal(<div className="modal-backdrop" onClick={resetForm}><div className="course-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={resetForm}><X size={19} /></button>
        <div className="modal-body">
          <h2>{editingId ? 'Editar módulo' : t.addModule}</h2>
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
            <div className="field-group field-group-full">
              <label>Recurso del módulo (Imagen, Video, PDF o PowerPoint)</label>
              {resourceUrl ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 8, background: 'var(--surface-2)' }}>
                  {resourceIcon(resourceType)}
                  <span style={{ flex: 1, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{resourceName}</span>
                  <button type="button" className="icon-button" onClick={handleRemoveResource} title="Quitar"><X size={16} /></button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <button type="button" className="outline-button" onClick={() => fileInputRef.current?.click()} disabled={uploading} style={{ flex: 1 }}>
                    {uploading ? <><Loader2 size={16} className="spin" /> Subiendo...</> : <><Upload size={16} /> Subir archivo</>}
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*,video/*,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation" onChange={handleFileUpload} style={{ display: 'none' }} />
                </div>
              )}
            </div>
          </div>
          <div className="form-actions-row" style={{ marginTop: 4 }}>
            <button className="outline-button" onClick={resetForm}>{t.cancel}</button>
            <button className="primary-button" onClick={handleSave} disabled={saving}>{saving ? t.loading : t.save}</button>
          </div>
        </div>
      </div></div>, document.body)}

      {deleteConfirm && createPortal(<div className="modal-backdrop" onClick={() => setDeleteConfirm(null)}><div className="exit-warning-modal" onClick={(e) => e.stopPropagation()}>
        <div className="exit-warning-icon"><Trash2 size={40} /></div>
        <h2>{t.deleteConfirm}</h2>
        <div className="exit-warning-actions"><button className="outline-button" onClick={() => setDeleteConfirm(null)}>{t.cancel}</button>
        <button className="primary-button exit-confirm" disabled={deleting} onClick={async () => { setDeleting(true); await deleteModule(deleteConfirm); setDeleting(false); setDeleteConfirm(null); toast('Módulo eliminado', 'success'); onRefresh(); }}>{deleting ? t.loading : t.delete}</button></div>
      </div></div>, document.body)}

      {modules.length === 0 ? <p className="muted" style={{ padding: '20px 0' }}>{t.noData}</p> :
       <div className="admin-list-stack">{modules.map((m, i) => (
         <div key={m.id} className="admin-course-row">
           <div className="course-icon gray-2"><GripVertical size={16} /></div>
           <div className="course-row-info">
             <strong>{i + 1}. {m.title}</strong>
             <small>{typeIcon(m.type)} {m.type} · {m.duration}{m.resource_url ? ` · ${resourceIcon(m.resource_type)} Recurso` : ''}</small>
           </div>
           <div className="admin-course-actions">
             <button className="icon-button" onClick={() => openEdit(m)} title="Editar"><Pencil size={16} /></button>
             <button className="icon-button" onClick={() => setDeleteConfirm(m.id)}><Trash2 size={16} /></button>
           </div>
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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [difficulty, setDifficulty] = useState('medium');
  const [points, setPoints] = useState('1');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const resetForm = () => { setEditingId(null); setQuestion(''); setOptions(['', '']); setCorrectIndex(0); setDifficulty('medium'); setPoints('1'); setError(null); setShowForm(false); };

  const openEdit = (q: ExamQuestion) => {
    setEditingId(q.id);
    setQuestion(q.question);
    setOptions(q.options.length > 0 ? [...q.options] : ['', '']);
    setCorrectIndex(q.correct_index);
    setDifficulty(q.difficulty);
    setPoints(String(q.points));
    setError(null);
    setShowForm(true);
  };

  const updateOption = (idx: number, value: string) => {
    setOptions(prev => prev.map((o, i) => i === idx ? value : o));
  };

  const addOption = () => {
    setOptions(prev => [...prev, '']);
  };

  const removeOption = (idx: number) => {
    setOptions(prev => {
      const next = prev.filter((_, i) => i !== idx);
      if (next.length < 2) return prev;
      if (correctIndex >= next.length) setCorrectIndex(next.length - 1);
      return next;
    });
  };

  const handleSave = async () => {
    const filledOptions = options.filter(o => o.trim());
    if (!question || filledOptions.length < 2) { setError(t.questionText + ' / ' + t.options); return; }
    if (correctIndex >= filledOptions.length) { setError('La respuesta correcta no coincide con las opciones'); return; }
    setSaving(true);
    const payload = {
      question,
      options: filledOptions,
      correct_index: correctIndex,
      difficulty: difficulty as 'easy' | 'medium' | 'hard',
      points: parseInt(points) || 1,
    };
    if (editingId) {
      const { error: err } = await updateExamQuestion(editingId, payload);
      if (err) { setError(err); setSaving(false); return; }
      setSaving(false); resetForm(); toast('Pregunta actualizada', 'success'); onRefresh();
    } else {
      const { error: err } = await createExamQuestion({ ...payload, course_id: courseId, order_index: questions.length } as any);
      if (err) { setError(err); setSaving(false); return; }
      setSaving(false); resetForm(); toast('Pregunta creada', 'success'); onRefresh();
    }
  };

  return (
    <div className="editor-section">
      <div className="section-title"><div><h2>{t.exams}</h2><p className="muted">{questions.length} {t.exams.toLowerCase()}</p></div>
        <button className="outline-button" onClick={() => { resetForm(); setShowForm(true); }}><Plus size={16} />{t.addQuestion}</button>
      </div>
      {showForm && createPortal(<div className="modal-backdrop" onClick={resetForm}><div className="course-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={resetForm}><X size={19} /></button>
        <div className="modal-body">
          <h2>{editingId ? 'Editar pregunta' : t.addQuestion}</h2>
          {error && <div className="auth-error" style={{ marginBottom: 12 }}><AlertCircle size={16} />{error}</div>}
          <div className="modal-form-grid" style={{ marginTop: 10 }}>
            <div className="field-group field-group-full"><label>{t.questionText}</label><input className="auth-input" value={question} onChange={(e) => setQuestion(e.target.value)} /></div>
            <div className="field-group field-group-full">
              <label>{t.options}</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {options.map((opt, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button type="button" onClick={() => setCorrectIndex(idx)} title="Marcar como correcta" style={{ flex: '0 0 auto', width: 28, height: 28, borderRadius: '50%', border: correctIndex === idx ? '2px solid var(--success)' : '2px solid var(--line-2)', background: correctIndex === idx ? 'var(--success)' : 'transparent', color: correctIndex === idx ? '#fff' : 'var(--muted)', display: 'grid', placeItems: 'center', cursor: 'pointer', fontSize: 11, fontWeight: 700 }}>{correctIndex === idx ? <Check size={14} /> : String.fromCharCode(65 + idx)}</button>
                    <input className="auth-input" value={opt} onChange={(e) => updateOption(idx, e.target.value)} placeholder={`Opción ${String.fromCharCode(65 + idx)}`} style={{ flex: 1 }} />
                    {options.length > 2 && <button type="button" className="icon-button" onClick={() => removeOption(idx)} title="Quitar"><X size={16} /></button>}
                  </div>
                ))}
                <button type="button" className="outline-button" onClick={addOption} style={{ width: 'fit-content', minHeight: 36, padding: '6px 12px' }}><Plus size={14} /> Agregar opción</button>
              </div>
            </div>
            <div className="field-group"><label>{t.difficultyLevel}</label>
              <select className="auth-input" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                <option value="easy">{t.easy}</option><option value="medium">{t.medium}</option><option value="hard">{t.hard}</option>
              </select>
            </div>
            <div className="field-group"><label>{t.pointsLabel}</label><input className="auth-input" type="number" value={points} onChange={(e) => setPoints(e.target.value)} /></div>
          </div>
          <div className="form-actions-row" style={{ marginTop: 4 }}>
            <button className="outline-button" onClick={resetForm}>{t.cancel}</button>
            <button className="primary-button" onClick={handleSave} disabled={saving}>{saving ? t.loading : t.save}</button>
          </div>
        </div>
      </div></div>, document.body)}

      {deleteConfirm && createPortal(<div className="modal-backdrop" onClick={() => setDeleteConfirm(null)}><div className="exit-warning-modal" onClick={(e) => e.stopPropagation()}>
        <div className="exit-warning-icon"><Trash2 size={40} /></div>
        <h2>{t.deleteConfirm}</h2>
        <div className="exit-warning-actions"><button className="outline-button" onClick={() => setDeleteConfirm(null)}>{t.cancel}</button>
        <button className="primary-button exit-confirm" disabled={deleting} onClick={async () => { setDeleting(true); await deleteExamQuestion(deleteConfirm); setDeleting(false); setDeleteConfirm(null); toast('Pregunta eliminada', 'success'); onRefresh(); }}>{deleting ? t.loading : t.delete}</button></div>
      </div></div>, document.body)}

      {questions.length === 0 ? <p className="muted" style={{ padding: '20px 0' }}>{t.noData}</p> :
       <div className="admin-list-stack">{questions.map((q, i) => (
         <div key={q.id} className="admin-course-row">
           <div className="course-icon gray-2"><Star size={16} /></div>
           <div className="course-row-info"><strong>{i + 1}. {q.question}</strong><small>{q.options.length} {t.options.toLowerCase()} · {q.difficulty} · {q.points} {t.pointsLabel.toLowerCase()}</small></div>
           <div className="admin-course-actions">
             <button className="icon-button" onClick={() => openEdit(q)} title="Editar"><Pencil size={16} /></button>
             <button className="icon-button" onClick={() => setDeleteConfirm(q.id)}><Trash2 size={16} /></button>
           </div>
         </div>
       ))}</div>}
    </div>
  );
}

// ===================== ASSIGNMENTS TAB =====================
function AssignmentsTab({ t, courseId, assignments, jobRoles, departments, onRefresh }: {
  t: AdminStrings;
  courseId: string;
  assignments: any[];
  jobRoles: JobRole[];
  departments: Department[];
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
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const assignedRoleIds = assignments.map((a) => a.job_role_id);
  const availableRoles = jobRoles.filter((r) => !assignedRoleIds.includes(r.id));

  const handleAssign = async () => {
    if (!roleId) { setError(t.selectRole); return; }
    setSaving(true);
    const { error: err } = await assignCourseToRole(courseId, roleId, isMandatory, priority, deadlineDays ? parseInt(deadlineDays) : null, 0);
    if (err) { setError(err); setSaving(false); return; }
    setSaving(false); setRoleId(''); setDeadlineDays(''); setError(null); setShowForm(false); toast('Curso asignado al cargo', 'success'); onRefresh();
  };

  const getRoleName = (id: string) => {
    const role = jobRoles.find((r) => r.id === id);
    if (!role) return '';
    const dept = departments.find((d) => d.id === role.department_id)?.name;
    return dept ? `${role.name} · ${dept}` : role.name;
  };

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
                {availableRoles.map((r) => {
                  const dept = departments.find((d) => d.id === r.department_id)?.name;
                  return <option key={r.id} value={r.id}>{dept ? `${r.name} · ${dept}` : r.name}</option>;
                })}
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
        <button className="primary-button exit-confirm" disabled={deleting} onClick={async () => { setDeleting(true); await removeAssignment(deleteConfirm); setDeleting(false); setDeleteConfirm(null); toast('Asignación eliminada', 'success'); onRefresh(); }}>{deleting ? t.loading : t.delete}</button></div>
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
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const availableCourses = allCourses.filter((c) => c.id !== courseId && !prerequisites.some((p) => p.prerequisite_course_id === c.id));

  const handleAdd = async () => {
    if (!prereqId) { setError(t.selectPrerequisite); return; }
    setSaving(true);
    const { error: err } = await addPrerequisite(courseId, prereqId, isMandatory);
    if (err) { setError(err); setSaving(false); return; }
    setSaving(false); setPrereqId(''); setError(null); setShowForm(false); toast('Prerequisito agregado', 'success'); onRefresh();
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
        <button className="primary-button exit-confirm" disabled={deleting} onClick={async () => { setDeleting(true); await removePrerequisite(deleteConfirm); setDeleting(false); setDeleteConfirm(null); toast('Prerequisito eliminado', 'success'); onRefresh(); }}>{deleting ? t.loading : t.delete}</button></div>
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
