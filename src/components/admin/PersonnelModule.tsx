import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, Briefcase, Building2, ChevronRight, Clock3, History, Plus, Settings, ShieldCheck, Trash2, Users, X, AlertCircle, BookOpen, Check } from 'lucide-react';
import { supabase, type Profile, type JobRole, type Department, type CourseWithRelations, type UserJobRoleHistory } from '@/lib/supabase';
import {
  fetchDepartments, createDepartment, updateDepartment, deleteDepartment,
  createJobRole, updateJobRole, deleteJobRole,
  updateProfile, deleteProfile,
  fetchUserJobRoleHistory, changeUserRole,
  assignCourseToRole, removeAssignment,
} from '@/lib/data';
import type { AdminStrings } from './types';

type PersonnelTab = 'employees' | 'departments' | 'roles' | 'history' | 'requirements';

export function PersonnelModule({ t, team, jobRoles, departments, courses, onRefresh }: {
  t: AdminStrings;
  team: Profile[];
  jobRoles: JobRole[];
  departments: Department[];
  courses: CourseWithRelations[];
  onRefresh: () => void;
}) {
  const [tab, setTab] = useState<PersonnelTab>('employees');

  const tabs: { key: PersonnelTab; label: string; icon: typeof Users }[] = [
    { key: 'employees', label: t.personnelTabs.employees, icon: Users },
    { key: 'departments', label: t.personnelTabs.departments, icon: Building2 },
    { key: 'roles', label: t.personnelTabs.roles, icon: ShieldCheck },
    { key: 'history', label: t.personnelTabs.history, icon: History },
    { key: 'requirements', label: t.personnelTabs.requirements, icon: BookOpen },
  ];

  return (
    <div className="page animate-in">
      <div className="page-heading">
        <div>
          <p className="eyebrow">GESTIÓN DE PERSONAL</p>
          <h1>{t.personnel}</h1>
          <p className="muted">{team.length} {t.users} · {jobRoles.length} {t.jobRole.toLowerCase()}s · {departments.length} {t.department.toLowerCase()}s</p>
        </div>
      </div>
      <div className="admin-tabs">
        {tabs.map((tabItem) => {
          const Icon = tabItem.icon;
          return (
            <button key={tabItem.key} className={tab === tabItem.key ? 'admin-tab active' : 'admin-tab'} onClick={() => setTab(tabItem.key)}>
              <Icon size={16} /> {tabItem.label}
            </button>
          );
        })}
      </div>
      <div className="admin-tab-content">
        {tab === 'employees' && <EmployeesTab t={t} team={team} jobRoles={jobRoles} departments={departments} onRefresh={onRefresh} />}
        {tab === 'departments' && <DepartmentsTab t={t} departments={departments} onRefresh={onRefresh} />}
        {tab === 'roles' && <RolesTab t={t} jobRoles={jobRoles} departments={departments} courses={courses} onRefresh={onRefresh} />}
        {tab === 'history' && <HistoryTab t={t} team={team} jobRoles={jobRoles} />}
        {tab === 'requirements' && <RequirementsTab t={t} jobRoles={jobRoles} courses={courses} onRefresh={onRefresh} />}
      </div>
    </div>
  );
}

// ===================== EMPLOYEES TAB =====================
function EmployeesTab({ t, team, jobRoles, departments, onRefresh }: {
  t: AdminStrings;
  team: Profile[];
  jobRoles: JobRole[];
  departments: Department[];
  onRefresh: () => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [jobRoleId, setJobRoleId] = useState('');
  const [role, setRole] = useState<'employee' | 'admin'>('employee');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [changeRoleUser, setChangeRoleUser] = useState<Profile | null>(null);
  const [changeReason, setChangeReason] = useState('');
  const [newRoleId, setNewRoleId] = useState('');

  const resetForm = () => { setName(''); setEmail(''); setPassword(''); setJobRoleId(''); setRole('employee'); setError(null); setEditingUser(null); setShowForm(false); };

  const getJobRoleName = (id: string | null) => jobRoles.find((r) => r.id === id)?.name ?? '';
  const getDeptName = (roleId: string | null) => {
    const role = jobRoles.find((r) => r.id === roleId);
    if (!role?.department_id) return '';
    return departments.find((d) => d.id === role.department_id)?.name ?? '';
  };

  const handleSubmit = async () => {
    setError(null);
    if (!name || !email || !jobRoleId) { setError(t.name + ' / ' + t.email + ' / ' + t.jobRole); return; }
    setSaving(true);
    if (editingUser) {
      const { error: err } = await updateProfile(editingUser.id, { full_name: name, job_role_id: jobRoleId, role });
      if (err) { setError(err); setSaving(false); return; }
    } else {
      if (!password) { setError(t.personPassword); setSaving(false); return; }
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}` },
        body: JSON.stringify({ email, password, full_name: name, job_role_id: jobRoleId, role }),
      });
      const result = await response.json();
      if (!response.ok || result.error) { setError(result.error ?? 'Error'); setSaving(false); return; }
    }
    setSaving(false);
    resetForm();
    onRefresh();
  };

  const startEdit = (p: Profile) => {
    setEditingUser(p);
    setName(p.full_name);
    setEmail(p.email ?? '');
    setPassword('');
    setJobRoleId(p.job_role_id ?? '');
    setRole(p.role);
    setShowForm(true);
  };

  const handleChangeRole = async () => {
    if (!changeRoleUser || !newRoleId) return;
    const { error: err } = await changeUserRole(changeRoleUser.id, newRoleId, changeReason, changeRoleUser.id);
    if (err) { setError(err); return; }
    setChangeRoleUser(null);
    setChangeReason('');
    setNewRoleId('');
    onRefresh();
  };

  return (
    <div className="section-card">
      <div className="section-title">
        <div><h2>{t.personnelTabs.employees}</h2><p className="muted">{team.length} {t.teamMembers.toLowerCase()}</p></div>
        <button className="primary-button" style={{ minHeight: 40, padding: '10px 14px', fontSize: 11 }} onClick={() => { resetForm(); setShowForm(true); }}><Plus size={16} />{t.newUser}</button>
      </div>
      {showForm && createPortal(<div className="modal-backdrop" onClick={resetForm}><div className="course-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={resetForm}><X size={19} /></button>
        <div className="modal-body">
          <h2>{editingUser ? t.editUser : t.newUser}</h2>
          {error && <div className="auth-error" style={{ marginBottom: 12 }}><AlertCircle size={16} />{error}</div>}
          <div className="modal-form-grid" style={{ marginTop: 10 }}>
            <div className="field-group"><label>{t.personName}</label><input className="auth-input" value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div className="field-group"><label>{t.personEmail}</label><input className="auth-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={!!editingUser} /></div>
            {!editingUser && <div className="field-group"><label>{t.personPassword}</label><input className="auth-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>}
            <div className="field-group"><label>{t.jobRole}</label>
              <select className="auth-input" value={jobRoleId} onChange={(e) => setJobRoleId(e.target.value)}>
                <option value="">{t.selectRole}</option>
                {jobRoles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>
            <div className="field-group field-group-full"><label>{t.role}</label>
              <div className="auth-role-select">
                <button className={role === 'employee' ? 'active' : ''} onClick={() => setRole('employee')}><Users size={16} />{t.employee}</button>
                <button className={role === 'admin' ? 'active' : ''} onClick={() => setRole('admin')}><Settings size={16} />{t.admin}</button>
              </div>
            </div>
          </div>
          <div className="form-actions-row" style={{ marginTop: 4 }}>
            <button className="outline-button" onClick={resetForm}>{t.cancel}</button>
            <button className="primary-button" onClick={handleSubmit} disabled={saving}>{saving ? t.loading : t.saveUser}</button>
          </div>
        </div>
      </div></div>, document.body)}

      {changeRoleUser && createPortal(<div className="modal-backdrop" onClick={() => setChangeRoleUser(null)}><div className="course-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={() => setChangeRoleUser(null)}><X size={19} /></button>
        <div className="modal-body">
          <h2>{t.changeRole}</h2>
          <p className="muted">{changeRoleUser.full_name} → {getJobRoleName(changeRoleUser.job_role_id)}</p>
          <div className="modal-form-grid" style={{ marginTop: 10 }}>
            <div className="field-group field-group-full"><label>{t.jobRole}</label>
              <select className="auth-input" value={newRoleId} onChange={(e) => setNewRoleId(e.target.value)}>
                <option value="">{t.selectRole}</option>
                {jobRoles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>
            <div className="field-group field-group-full"><label>{t.changeRoleReason}</label>
              <input className="auth-input" value={changeReason} onChange={(e) => setChangeReason(e.target.value)} placeholder={t.reason} />
            </div>
          </div>
          <div className="form-actions-row" style={{ marginTop: 4 }}>
            <button className="outline-button" onClick={() => setChangeRoleUser(null)}>{t.cancel}</button>
            <button className="primary-button" onClick={handleChangeRole} disabled={!newRoleId}>{t.save}</button>
          </div>
        </div>
      </div></div>, document.body)}

      {deleteConfirm && createPortal(<div className="modal-backdrop" onClick={() => setDeleteConfirm(null)}><div className="exit-warning-modal" onClick={(e) => e.stopPropagation()}>
        <div className="exit-warning-icon"><Trash2 size={40} /></div>
        <h2>{t.deleteUserConfirm}</h2>
        <div className="exit-warning-actions"><button className="outline-button" onClick={() => setDeleteConfirm(null)}>{t.cancel}</button>
        <button className="primary-button exit-confirm" onClick={async () => { await deleteProfile(deleteConfirm); setDeleteConfirm(null); onRefresh(); }}>{t.delete}</button></div>
      </div></div>, document.body)}

      {team.length === 0 ? <div className="empty-state"><Users size={30} /><h3>{t.noTeam}</h3></div> :
      <div className="team-table">{team.map((m) => (
        <div key={m.id} className="admin-team-row">
          <div className="avatar avatar-small">{m.full_name.slice(0, 2).toUpperCase()}</div>
          <div>
            <strong>{m.full_name}</strong>
            <small>{getJobRoleName(m.job_role_id)}{getDeptName(m.job_role_id) ? ` · ${getDeptName(m.job_role_id)}` : ''}</small>
          </div>
          <span className={`team-role-badge ${m.role}`}>{m.role === 'admin' ? t.admin : t.employee}</span>
          <span className={`status-badge ${m.is_active ? 'active' : 'inactive'}`}>{m.is_active ? t.active : t.inactive}</span>
          <div className="admin-course-actions">
            <button className="icon-button" onClick={() => startEdit(m)} title={t.editUser}><Settings size={16} /></button>
            <button className="icon-button" onClick={() => setChangeRoleUser(m)} title={t.changeRole}><Briefcase size={16} /></button>
            <button className="icon-button" onClick={() => setDeleteConfirm(m.id)} title={t.delete}><Trash2 size={16} /></button>
          </div>
        </div>
      ))}</div>}
    </div>
  );
}

// ===================== DEPARTMENTS TAB =====================
function DepartmentsTab({ t, departments, onRefresh }: {
  t: AdminStrings;
  departments: Department[];
  onRefresh: () => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const resetForm = () => { setName(''); setCode(''); setDescription(''); setEditingId(null); setError(null); setShowForm(false); };

  const handleSubmit = async () => {
    if (!name || !code) { setError(t.name + ' / ' + t.code); return; }
    setSaving(true);
    if (editingId) {
      const { error: err } = await updateDepartment(editingId, { name, code, description });
      if (err) { setError(err); setSaving(false); return; }
    } else {
      const { error: err } = await createDepartment(name, code, description);
      if (err) { setError(err); setSaving(false); return; }
    }
    setSaving(false); resetForm(); onRefresh();
  };

  return (
    <div className="section-card">
      <div className="section-title">
        <div><h2>{t.personnelTabs.departments}</h2><p className="muted">{departments.length} {t.department.toLowerCase()}s</p></div>
        <button className="primary-button" style={{ minHeight: 40, padding: '10px 14px', fontSize: 11 }} onClick={() => { resetForm(); setShowForm(true); }}><Plus size={16} />{t.newDepartment}</button>
      </div>
      {showForm && createPortal(<div className="modal-backdrop" onClick={resetForm}><div className="course-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={resetForm}><X size={19} /></button>
        <div className="modal-body">
          <h2>{editingId ? t.editDepartment : t.newDepartment}</h2>
          {error && <div className="auth-error" style={{ marginBottom: 12 }}><AlertCircle size={16} />{error}</div>}
          <div className="modal-form-grid" style={{ marginTop: 10 }}>
            <div className="field-group"><label>{t.deptName}</label><input className="auth-input" value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div className="field-group"><label>{t.deptCode}</label><input className="auth-input" value={code} onChange={(e) => setCode(e.target.value)} /></div>
            <div className="field-group field-group-full"><label>{t.deptDescription}</label><input className="auth-input" value={description} onChange={(e) => setDescription(e.target.value)} /></div>
          </div>
          <div className="form-actions-row" style={{ marginTop: 4 }}>
            <button className="outline-button" onClick={resetForm}>{t.cancel}</button>
            <button className="primary-button" onClick={handleSubmit} disabled={saving}>{saving ? t.loading : t.saveDepartment}</button>
          </div>
        </div>
      </div></div>, document.body)}

      {deleteConfirm && createPortal(<div className="modal-backdrop" onClick={() => setDeleteConfirm(null)}><div className="exit-warning-modal" onClick={(e) => e.stopPropagation()}>
        <div className="exit-warning-icon"><Trash2 size={40} /></div>
        <h2>{t.deleteDeptConfirm}</h2>
        <div className="exit-warning-actions"><button className="outline-button" onClick={() => setDeleteConfirm(null)}>{t.cancel}</button>
        <button className="primary-button exit-confirm" onClick={async () => { await deleteDepartment(deleteConfirm); setDeleteConfirm(null); onRefresh(); }}>{t.delete}</button></div>
      </div></div>, document.body)}

      {departments.length === 0 ? <div className="empty-state"><Building2 size={30} /><h3>{t.noData}</h3></div> :
      <div className="team-table">{departments.map((d) => (
        <div key={d.id} className="admin-team-row">
          <div className="avatar avatar-small"><Building2 size={16} /></div>
          <div><strong>{d.name}</strong><small>{d.code}{d.description ? ` · ${d.description}` : ''}</small></div>
          <span className={`status-badge ${d.is_active ? 'active' : 'inactive'}`}>{d.is_active ? t.active : t.inactive}</span>
          <div className="admin-course-actions">
            <button className="icon-button" onClick={() => { setEditingId(d.id); setName(d.name); setCode(d.code); setDescription(d.description); setShowForm(true); }}><Settings size={16} /></button>
            <button className="icon-button" onClick={() => setDeleteConfirm(d.id)}><Trash2 size={16} /></button>
          </div>
        </div>
      ))}</div>}
    </div>
  );
}

// ===================== ROLES TAB =====================
function RolesTab({ t, jobRoles, departments, courses, onRefresh }: {
  t: AdminStrings;
  jobRoles: JobRole[];
  departments: Department[];
  courses: CourseWithRelations[];
  onRefresh: () => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [deptId, setDeptId] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const resetForm = () => { setName(''); setDescription(''); setDeptId(''); setEditingId(null); setError(null); setShowForm(false); };

  const handleSubmit = async () => {
    if (!name) { setError(t.roleName); return; }
    setSaving(true);
    if (editingId) {
      const { error: err } = await updateJobRole(editingId, name, description);
      if (err) { setError(err); setSaving(false); return; }
    } else {
      const { error: err } = await createJobRole(name, description, deptId || null);
      if (err) { setError(err); setSaving(false); return; }
    }
    setSaving(false); resetForm(); onRefresh();
  };

  const getDeptName = (id: string | null) => departments.find((d) => d.id === id)?.name ?? '';
  const getCourseCount = (roleId: string) => courses.reduce((acc, c) => acc + c.assignments.filter((a) => a.job_role_id === roleId).length, 0);

  return (
    <div className="section-card">
      <div className="section-title">
        <div><h2>{t.personnelTabs.roles}</h2><p className="muted">{jobRoles.length} {t.totalRolesLower}</p></div>
        <button className="primary-button" style={{ minHeight: 40, padding: '10px 14px', fontSize: 11 }} onClick={() => { resetForm(); setShowForm(true); }}><Plus size={16} />{t.newRole}</button>
      </div>
      {showForm && createPortal(<div className="modal-backdrop" onClick={resetForm}><div className="course-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={resetForm}><X size={19} /></button>
        <div className="modal-body">
          <h2>{editingId ? t.editRole : t.newRole}</h2>
          {error && <div className="auth-error" style={{ marginBottom: 12 }}><AlertCircle size={16} />{error}</div>}
          <div className="modal-form-grid" style={{ marginTop: 10 }}>
            <div className="field-group field-group-full"><label>{t.roleName}</label><input className="auth-input" value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div className="field-group field-group-full"><label>{t.roleDescription}</label><input className="auth-input" value={description} onChange={(e) => setDescription(e.target.value)} /></div>
            <div className="field-group field-group-full"><label>{t.department}</label>
              <select className="auth-input" value={deptId} onChange={(e) => setDeptId(e.target.value)}>
                <option value="">{t.selectDepartment}</option>
                {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
          </div>
          <div className="form-actions-row" style={{ marginTop: 4 }}>
            <button className="outline-button" onClick={resetForm}>{t.cancel}</button>
            <button className="primary-button" onClick={handleSubmit} disabled={saving}>{saving ? t.loading : t.saveRole}</button>
          </div>
        </div>
      </div></div>, document.body)}

      {deleteConfirm && createPortal(<div className="modal-backdrop" onClick={() => setDeleteConfirm(null)}><div className="exit-warning-modal" onClick={(e) => e.stopPropagation()}>
        <div className="exit-warning-icon"><Trash2 size={40} /></div>
        <h2>{t.deleteRoleConfirm}</h2>
        <div className="exit-warning-actions"><button className="outline-button" onClick={() => setDeleteConfirm(null)}>{t.cancel}</button>
        <button className="primary-button exit-confirm" onClick={async () => { await deleteJobRole(deleteConfirm); setDeleteConfirm(null); onRefresh(); }}>{t.delete}</button></div>
      </div></div>, document.body)}

      {jobRoles.length === 0 ? <div className="empty-state"><ShieldCheck size={30} /><h3>{t.noRoles}</h3></div> :
      <div className="team-table">{jobRoles.map((r) => (
        <div key={r.id} className="admin-team-row">
          <div className="avatar avatar-small"><ShieldCheck size={16} /></div>
          <div><strong>{r.name}</strong><small>{r.description || '—'}{getDeptName(r.department_id) ? ` · ${getDeptName(r.department_id)}` : ''}</small></div>
          <span className="team-role-badge">{getCourseCount(r.id)} {t.assignedCourses.toLowerCase()}</span>
          <span className={`status-badge ${r.is_active ? 'active' : 'inactive'}`}>{r.is_active ? t.active : t.inactive}</span>
          <div className="admin-course-actions">
            <button className="icon-button" onClick={() => { setEditingId(r.id); setName(r.name); setDescription(r.description); setDeptId(r.department_id ?? ''); setShowForm(true); }}><Settings size={16} /></button>
            <button className="icon-button" onClick={() => setDeleteConfirm(r.id)}><Trash2 size={16} /></button>
          </div>
        </div>
      ))}</div>}
    </div>
  );
}

// ===================== HISTORY TAB =====================
function HistoryTab({ t, team, jobRoles }: {
  t: AdminStrings;
  team: Profile[];
  jobRoles: JobRole[];
}) {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [history, setHistory] = useState<(UserJobRoleHistory & { job_role?: JobRole })[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedUserId) { setHistory([]); return; }
    setLoading(true);
    fetchUserJobRoleHistory(selectedUserId).then((data) => { setHistory(data); setLoading(false); });
  }, [selectedUserId]);

  const getRoleName = (id: string) => jobRoles.find((r) => r.id === id)?.name ?? '';

  return (
    <div className="section-card">
      <div className="section-title"><div><h2>{t.history}</h2><p className="muted">{t.personnelTabs.history}</p></div></div>
      <div className="editor-grid" style={{ marginBottom: 16 }}>
        <div className="field-group">
          <label>{t.user}</label>
          <select className="auth-input" value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)}>
            <option value="">{t.selectRole}</option>
            {team.map((m) => <option key={m.id} value={m.id}>{m.full_name}</option>)}
          </select>
        </div>
      </div>
      {loading ? <p className="muted">{t.loading}</p> :
       !selectedUserId ? <div className="empty-state"><History size={30} /><h3>{t.noHistory}</h3></div> :
       history.length === 0 ? <div className="empty-state"><History size={30} /><h3>{t.noHistory}</h3></div> :
       <div className="timeline">{history.map((h) => (
        <div key={h.id} className="timeline-item">
          <div className={`timeline-dot ${h.is_current ? 'current' : ''}`} />
          <div className="timeline-content">
            <strong>{getRoleName(h.job_role_id)}</strong>
            <small>{h.start_date} → {h.end_date ?? t.currentRole}</small>
            {h.reason && <p className="muted">{h.reason}</p>}
          </div>
        </div>
      ))}</div>}
    </div>
  );
}

// ===================== REQUIREMENTS TAB =====================
function RequirementsTab({ t, jobRoles, courses, onRefresh }: {
  t: AdminStrings;
  jobRoles: JobRole[];
  courses: CourseWithRelations[];
  onRefresh: () => void;
}) {
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [showAssign, setShowAssign] = useState(false);
  const [courseId, setCourseId] = useState('');
  const [isMandatory, setIsMandatory] = useState(true);
  const [priority, setPriority] = useState('medium');
  const [deadlineDays, setDeadlineDays] = useState('');
  const [orderIndex, setOrderIndex] = useState('0');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const selectedRole = jobRoles.find((r) => r.id === selectedRoleId);
  const assignedCourses = courses.filter((c) => c.assignments.some((a) => a.job_role_id === selectedRoleId));
  const unassignedCourses = courses.filter((c) => !c.assignments.some((a) => a.job_role_id === selectedRoleId));

  const handleAssign = async () => {
    if (!courseId || !selectedRoleId) { setError(t.selectCourse); return; }
    setSaving(true);
    const { error: err } = await assignCourseToRole(courseId, selectedRoleId, isMandatory, priority, deadlineDays ? parseInt(deadlineDays) : null, parseInt(orderIndex) || 0);
    if (err) { setError(err); setSaving(false); return; }
    setSaving(false); setCourseId(''); setDeadlineDays(''); setOrderIndex('0'); setError(null); setShowAssign(false);
    onRefresh();
  };

  return (
    <div className="section-card">
      <div className="section-title">
        <div><h2>{t.personnelTabs.requirements}</h2><p className="muted">{t.assignedCourses}</p></div>
        {selectedRoleId && <button className="primary-button" style={{ minHeight: 40, padding: '10px 14px', fontSize: 11 }} onClick={() => setShowAssign(true)}><Plus size={16} />{t.assignCourse}</button>}
      </div>
      <div className="editor-grid" style={{ marginBottom: 16 }}>
        <div className="field-group">
          <label>{t.jobRole}</label>
          <select className="auth-input" value={selectedRoleId} onChange={(e) => setSelectedRoleId(e.target.value)}>
            <option value="">{t.selectRole}</option>
            {jobRoles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>
      </div>

      {showAssign && createPortal(<div className="modal-backdrop" onClick={() => setShowAssign(false)}><div className="course-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={() => setShowAssign(false)}><X size={19} /></button>
        <div className="modal-body">
          <h2>{t.assignCourse}</h2>
          {error && <div className="auth-error" style={{ marginBottom: 12 }}><AlertCircle size={16} />{error}</div>}
          <div className="modal-form-grid" style={{ marginTop: 10 }}>
            <div className="field-group field-group-full"><label>{t.courseCol}</label>
              <select className="auth-input" value={courseId} onChange={(e) => setCourseId(e.target.value)}>
                <option value="">{t.selectCourse}</option>
                {unassignedCourses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
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
            <div className="field-group"><label>{t.order}</label><input className="auth-input" type="number" value={orderIndex} onChange={(e) => setOrderIndex(e.target.value)} /></div>
          </div>
          <div className="form-actions-row" style={{ marginTop: 4 }}>
            <button className="outline-button" onClick={() => setShowAssign(false)}>{t.cancel}</button>
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

      {!selectedRoleId ? <div className="empty-state"><ShieldCheck size={30} /><h3>{t.selectRole}</h3></div> :
       assignedCourses.length === 0 ? <div className="empty-state"><BookOpen size={30} /><h3>{t.noCourses}</h3></div> :
       <div className="admin-list-stack">{assignedCourses.map((c) => {
         const assignment = c.assignments.find((a) => a.job_role_id === selectedRoleId);
         return (
           <div key={c.id} className="admin-course-row">
             <div className="course-icon gray-2"><BookOpen size={20} /></div>
             <div><strong>{c.title}</strong><small>{c.modules.length} {t.modulesLabel} · {assignment?.is_mandatory ? t.mandatory : t.optional} · {assignment?.priority ?? t.medium}</small></div>
             <div className="admin-course-actions">
               <button className="icon-button" onClick={() => assignment && setDeleteConfirm(assignment.id)}><Trash2 size={16} /></button>
             </div>
           </div>
         );
       })}</div>}
    </div>
  );
}
