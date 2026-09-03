import { useEffect, useState } from 'react';
import {
  Award, Bell, BellOff, BookOpen, CalendarDays, Check, Clock3, Download,
  FileText, History, Lock, Mail, Star, TrendingUp, Trophy, Zap,
} from 'lucide-react';
import { supabase, type Profile, type Notification, type Badge, type UserBadge, type Certificate, type RoleCertification, type UserCourseRequirement, type Course, type JobRole, type UserJobRoleHistory } from '@/lib/supabase';
import {
  fetchNotificationsForUser, markNotificationAsRead, markAllNotificationsAsRead,
  fetchUserBadgesForUser, fetchCertificatesForUser, fetchRoleCertificationsForUser,
  fetchUserJobRoleHistory, fetchUserCourseRequirementsForUser, updateProfile,
} from '@/lib/data';
import { getIcon } from '@/lib/icons';

export type EmployeeStrings = {
  notifications: string;
  noNotifications: string;
  markAllRead: string;
  gamification: string;
  myProfile: string;
  certifications: string;
  roleCertification: string;
  noCertificates: string;
  noRoleCerts: string;
  noBadges: string;
  pointsAccumulated: string;
  badgesEarned: string;
  nextBadges: string;
  personalInfo: string;
  jobHistory: string;
  editProfile: string;
  saveProfile: string;
  fullName: string;
  email: string;
  jobRole: string;
  hireDate: string;
  currentRoleSince: string;
  changePassword: string;
  newPassword: string;
  confirmPassword: string;
  updatePassword: string;
  passwordChanged: string;
  passwordMismatch: string;
  passwordTooShort: string;
  stats: string;
  coursesCompleted: string;
  coursesInProgress: string;
  totalPoints: string;
  certifiedRole: string;
  certifiedOn: string;
  expiresOn: string;
  valid: string;
  expired: string;
  noJobHistory: string;
  startDate: string;
  endDate: string;
  reason: string;
  currentRole: string;
  downloadCert: string;
  verifyCert: string;
  certNumber: string;
  issuedOn: string;
  courseLabel: string;
  viewBadge: string;
  locked: string;
  recentActivity: string;
  viewAll: string;
  unread: string;
  loading: string;
  profileUpdated: string;
  errorUpdating: string;
  allBadges: string;
  earnedBadges: string;
  availableBadges: string;
  badgePoints: string;
  badgeCategory: string;
  earnedOn: string;
  awardedTo: string;
};

type CertWithCourse = Certificate & { user_course_requirement?: UserCourseRequirement & { course?: Course } };
type RoleCertWithRole = RoleCertification & { job_role?: JobRole };
type BadgeWithBadge = UserBadge & { badge?: Badge };

// ===================== NOTIFICATIONS MODULE =====================
export function EmployeeNotifications({ userId, t }: { userId: string; t: EmployeeStrings }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await fetchNotificationsForUser(userId);
      setNotifications(data);
      setLoading(false);
    })();
  }, [userId]);

  const handleMarkRead = async (id: string) => {
    await markNotificationAsRead(id);
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, is_read: true } : n));
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsAsRead(userId);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const iconForType = (type: Notification['type']) => {
    switch (type) {
      case 'warning': return <BellOff size={18} />;
      case 'success': return <Check size={18} />;
      case 'error': return <BellOff size={18} />;
      case 'reminder': return <Clock3 size={18} />;
      default: return <Bell size={18} />;
    }
  };

  if (loading) return <div className="page animate-in"><p className="muted">{t.loading}</p></div>;

  return <div className="page animate-in">
    <div className="page-heading">
      <div>
        <p className="eyebrow">BANDEJA DE ENTRADA</p>
        <h1>{t.notifications}</h1>
        <p className="muted">{unreadCount} {t.unread}</p>
      </div>
      {unreadCount > 0 && <button className="outline-button" onClick={handleMarkAllRead}><Check size={16} />{t.markAllRead}</button>}
    </div>
    {notifications.length === 0 ? (
      <div className="empty-state"><Bell size={30} /><h3>{t.noNotifications}</h3></div>
    ) : (
      <div className="section-card">
        <div className="notif-list">
          {notifications.map((n) => (
            <div key={n.id} className={`notif-row ${n.is_read ? 'read' : 'unread'}`}>
              <div className={`notif-icon ${n.type}`}>{iconForType(n.type)}</div>
              <div className="notif-content" onClick={() => !n.is_read && handleMarkRead(n.id)}>
                <div className="notif-header">
                  <strong>{n.title}</strong>
                  {!n.is_read && <span className="notif-dot" />}
                </div>
                <p>{n.message}</p>
                <small>{new Date(n.sent_at).toLocaleDateString()} · {new Date(n.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>;
}

// ===================== GAMIFICATION MODULE =====================
export function EmployeeGamification({ userId, t, completedCount, inProgressCount }: { userId: string; t: EmployeeStrings; completedCount: number; inProgressCount: number }) {
  const [userBadges, setUserBadges] = useState<BadgeWithBadge[]>([]);
  const [allBadges, setAllBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [earned, all] = await Promise.all([
        fetchUserBadgesForUser(userId),
        supabase.from('badges').select('*').order('points', { ascending: true }),
      ]);
      setUserBadges(earned);
      setAllBadges((all.data ?? []) as Badge[]);
      setLoading(false);
    })();
  }, [userId]);

  const totalPoints = userBadges.reduce((sum, ub) => sum + (ub.badge?.points ?? 0), 0);
  const earnedBadgeIds = new Set(userBadges.map((ub) => ub.badge_id));
  const lockedBadges = allBadges.filter((b) => !earnedBadgeIds.has(b.id));

  if (loading) return <div className="page animate-in"><p className="muted">{t.loading}</p></div>;

  return <div className="page animate-in">
    <div className="page-heading">
      <div>
        <p className="eyebrow">LOGROS Y PUNTOS</p>
        <h1>{t.gamification}</h1>
        <p className="muted">{t.badgesEarned}: {userBadges.length} · {t.pointsAccumulated}: {totalPoints}</p>
      </div>
    </div>

    <section className="stats-grid">
      <div className="stat-card"><div className="stat-icon g1"><Trophy size={18} /></div><div><strong>{userBadges.length}</strong><span>{t.badgesEarned}</span></div><span className="stat-trend">↗</span></div>
      <div className="stat-card"><div className="stat-icon g2"><Zap size={18} /></div><div><strong>{totalPoints}</strong><span>{t.totalPoints}</span></div><span className="stat-trend">↗</span></div>
      <div className="stat-card"><div className="stat-icon g3"><BookOpen size={18} /></div><div><strong>{completedCount}</strong><span>{t.coursesCompleted}</span></div><span className="stat-trend">↗</span></div>
      <div className="stat-card"><div className="stat-icon g4"><TrendingUp size={18} /></div><div><strong>{inProgressCount}</strong><span>{t.coursesInProgress}</span></div><span className="stat-trend">↗</span></div>
    </section>

    <div className="content-grid">
      <section className="section-card">
        <div className="section-title"><div><h2>{t.earnedBadges}</h2><p className="muted">{userBadges.length} {t.badgesEarned.toLowerCase()}</p></div></div>
        {userBadges.length === 0 ? (
          <div className="empty-state"><Trophy size={28} /><h3>{t.noBadges}</h3></div>
        ) : (
          <div className="badges-grid">
            {userBadges.map((ub) => {
              const Icon = getIcon(ub.badge?.icon_url ?? 'award');
              return <div key={ub.id} className="badge-card earned">
                <div className="badge-icon"><Icon size={24} /></div>
                <strong>{ub.badge?.name}</strong>
                <span className="badge-points">{ub.badge?.points} pts</span>
                <small className="muted">{t.earnedOn}: {new Date(ub.earned_at).toLocaleDateString()}</small>
              </div>;
            })}
          </div>
        )}
      </section>

      <section className="section-card">
        <div className="section-title"><div><h2>{t.nextBadges}</h2><p className="muted">{lockedBadges.length} {t.availableBadges.toLowerCase()}</p></div></div>
        {lockedBadges.length === 0 ? (
          <div className="empty-state"><Trophy size={28} /><h3>¡Has desbloqueado todas las insignias!</h3></div>
        ) : (
          <div className="badges-grid">
            {lockedBadges.slice(0, 6).map((b) => {
              const Icon = getIcon(b.icon_url || 'award');
              return <div key={b.id} className="badge-card locked">
                <div className="badge-icon"><Icon size={24} /></div>
                <strong>{b.name}</strong>
                <span className="badge-points">{b.points} pts</span>
                <div className="badge-locked-overlay"><Lock size={20} /></div>
              </div>;
            })}
          </div>
        )}
      </section>
    </div>
  </div>;
}

// ===================== CERTIFICATIONS MODULE =====================
export function EmployeeCertifications({ userId, t }: { userId: string; t: EmployeeStrings }) {
  const [certificates, setCertificates] = useState<CertWithCourse[]>([]);
  const [roleCerts, setRoleCerts] = useState<RoleCertWithRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [certs, rc] = await Promise.all([
        fetchCertificatesForUser(userId),
        fetchRoleCertificationsForUser(userId),
      ]);
      setCertificates(certs);
      setRoleCerts(rc);
      setLoading(false);
    })();
  }, [userId]);

  if (loading) return <div className="page animate-in"><p className="muted">{t.loading}</p></div>;

  return <div className="page animate-in">
    <div className="page-heading">
      <div>
        <p className="eyebrow">LOGROS ACADÉMICOS</p>
        <h1>{t.certifications}</h1>
        <p className="muted">{certificates.length} {t.certifications.toLowerCase()} · {roleCerts.length} {t.roleCertification.toLowerCase()}</p>
      </div>
    </div>

    <div className="content-grid">
      <section className="section-card">
        <div className="section-title"><div><h2>{t.certifications}</h2><p className="muted">{certificates.length} certificados</p></div><Award size={18} className="section-icon" /></div>
        {certificates.length === 0 ? (
          <div className="empty-state"><Award size={28} /><h3>{t.noCertificates}</h3></div>
        ) : (
          <div className="certificate-grid">
            {certificates.map((c, i) => <article className="certificate-card" key={c.id}>
              <div className="certificate-art">
                <div className="certificate-mark"><Award size={26} /></div>
                <span>TRIADE</span>
                <small>{t.certifications}</small>
                <strong>{c.user_course_requirement?.course?.title ?? 'Curso'}</strong>
                <em>{t.awardedTo}</em>
                <div className="certificate-art-footer">
                  <span>TRD-{new Date().getFullYear()}-{String(i + 1).padStart(5, '0')}</span>
                  <span>{new Date(c.issue_date).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="certificate-actions">
                <button><FileText size={16} />{t.verifyCert}</button>
                <button><Download size={16} />{t.downloadCert}</button>
              </div>
            </article>)}
          </div>
        )}
      </section>

      <section className="section-card">
        <div className="section-title"><div><h2>{t.roleCertification}</h2><p className="muted">{roleCerts.length} certificaciones de cargo</p></div><Trophy size={18} className="section-icon" /></div>
        {roleCerts.length === 0 ? (
          <div className="empty-state"><Trophy size={28} /><h3>{t.noRoleCerts}</h3></div>
        ) : (
          <div className="role-cert-list">
            {roleCerts.map((rc) => <div key={rc.id} className="role-cert-card">
              <div className="role-cert-icon"><Award size={22} /></div>
              <div className="role-cert-info">
                <strong>{rc.job_role?.name ?? 'Cargo'}</strong>
                <span>{t.certifiedOn}: {new Date(rc.certified_at).toLocaleDateString()}</span>
                {rc.expires_at && <span>{t.expiresOn}: {new Date(rc.expires_at).toLocaleDateString()}</span>}
              </div>
              <span className={`status-badge ${rc.is_valid ? 'completed' : 'cancelled'}`}>{rc.is_valid ? t.valid : t.expired}</span>
            </div>)}
          </div>
        )}
      </section>
    </div>
  </div>;
}

// ===================== MY PROFILE MODULE =====================
export function EmployeeProfile({ profile, t }: { profile: Profile; t: EmployeeStrings }) {
  const [fullName, setFullName] = useState(profile.full_name);
  const [email, setEmail] = useState(profile.email ?? '');
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url ?? '');
  const [jobHistory, setJobHistory] = useState<(UserJobRoleHistory & { job_role?: JobRole })[]>([]);
  const [courseReqs, setCourseReqs] = useState<(UserCourseRequirement & { course?: Course; job_role?: JobRole })[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwMessage, setPwMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    (async () => {
      const [history, reqs] = await Promise.all([
        fetchUserJobRoleHistory(profile.id),
        fetchUserCourseRequirementsForUser(profile.id),
      ]);
      setJobHistory(history);
      setCourseReqs(reqs);
      setLoading(false);
    })();
  }, [profile.id]);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    const { error } = await updateProfile(profile.id, { full_name: fullName, email, avatar_url: avatarUrl });
    if (error) {
      setMessage({ type: 'error', text: t.errorUpdating });
    } else {
      setMessage({ type: 'success', text: t.profileUpdated });
    }
    setSaving(false);
  };

  const handleChangePassword = async () => {
    setPwMessage(null);
    if (newPassword.length < 6) {
      setPwMessage({ type: 'error', text: t.passwordTooShort });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwMessage({ type: 'error', text: t.passwordMismatch });
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setPwMessage({ type: 'error', text: error.message });
    } else {
      setPwMessage({ type: 'success', text: t.passwordChanged });
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const completedCourses = courseReqs.filter((r) => r.status === 'completed').length;
  const inProgressCourses = courseReqs.filter((r) => r.status === 'in_progress').length;

  if (loading) return <div className="page animate-in"><p className="muted">{t.loading}</p></div>;

  return <div className="page animate-in">
    <div className="page-heading">
      <div>
        <p className="eyebrow">CUENTA PERSONAL</p>
        <h1>{t.myProfile}</h1>
        <p className="muted">{profile.full_name}</p>
      </div>
    </div>

    <div className="content-grid">
      <section className="section-card">
        <div className="section-title"><div><h2>{t.personalInfo}</h2><p className="muted">{t.editProfile}</p></div></div>
        <div className="profile-form">
          <label className="form-label">{t.fullName}<input className="form-input" value={fullName} onChange={(e) => setFullName(e.target.value)} /></label>
          <label className="form-label">{t.email}<input className="form-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
          <label className="form-label">Avatar URL<input className="form-input" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="https://..." /></label>
          <div className="form-readonly">
            <div><span>{t.jobRole}</span><strong>{profile.job_role}</strong></div>
            <div><span>{t.hireDate}</span><strong>{profile.hire_date ? new Date(profile.hire_date).toLocaleDateString() : '—'}</strong></div>
            <div><span>{t.currentRoleSince}</span><strong>{profile.current_role_since ? new Date(profile.current_role_since).toLocaleDateString() : '—'}</strong></div>
          </div>
          {message && <div className={`form-msg ${message.type}`}>{message.text}</div>}
          <button className="primary-button" onClick={handleSave} disabled={saving}>{t.saveProfile}</button>
        </div>
      </section>

      <section className="section-card">
        <div className="section-title"><div><h2>{t.changePassword}</h2><p className="muted">{t.newPassword}</p></div></div>
        <div className="profile-form">
          <label className="form-label">{t.newPassword}<input className="form-input" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" /></label>
          <label className="form-label">{t.confirmPassword}<input className="form-input" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" /></label>
          {pwMessage && <div className={`form-msg ${pwMessage.type}`}>{pwMessage.text}</div>}
          <button className="primary-button" onClick={handleChangePassword}>{t.updatePassword}</button>
        </div>
      </section>
    </div>

    <section className="section-card" style={{ marginTop: 20 }}>
      <div className="section-title"><div><h2>{t.stats}</h2></div></div>
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-icon g1"><BookOpen size={18} /></div><div><strong>{completedCourses}</strong><span>{t.coursesCompleted}</span></div></div>
        <div className="stat-card"><div className="stat-icon g2"><TrendingUp size={18} /></div><div><strong>{inProgressCourses}</strong><span>{t.coursesInProgress}</span></div></div>
        <div className="stat-card"><div className="stat-icon g3"><History size={18} /></div><div><strong>{jobHistory.length}</strong><span>{t.jobHistory}</span></div></div>
      </div>
    </section>

    <section className="section-card" style={{ marginTop: 20 }}>
      <div className="section-title"><div><h2>{t.jobHistory}</h2><p className="muted">{jobHistory.length} registros</p></div></div>
      {jobHistory.length === 0 ? (
        <div className="empty-state"><History size={28} /><h3>{t.noJobHistory}</h3></div>
      ) : (
        <div className="timeline">
          {jobHistory.map((h) => <div key={h.id} className={`timeline-item ${h.is_current ? 'done' : ''}`}>
            <div className="timeline-content">
              <strong>{h.job_role?.name ?? 'Cargo'}</strong>
              <span>{t.startDate}: {new Date(h.start_date).toLocaleDateString()}</span>
              {h.end_date && <span>{t.endDate}: {new Date(h.end_date).toLocaleDateString()}</span>}
              {h.is_current && <small>{t.currentRole}</small>}
              {h.reason && <small>{t.reason}: {h.reason}</small>}
            </div>
          </div>)}
        </div>
      )}
    </section>
  </div>;
}

// ===================== COURSE FEEDBACK MODAL =====================
export function CourseFeedbackModal({ courseTitle, onSave, onClose, t }: {
  courseTitle: string;
  onSave: (rating: number, text: string, wouldRecommend: boolean | null, difficulty: string | null) => void;
  onClose: () => void;
  t: EmployeeStrings;
}) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null);
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (rating === 0) return;
    onSave(rating, feedback, wouldRecommend, difficulty);
    setSubmitted(true);
  };

  if (submitted) {
    return <div className="modal-backdrop" onClick={onClose}>
      <div className="exit-warning-modal" onClick={(e) => e.stopPropagation()}>
        <div className="exit-warning-icon" style={{ color: '#059669' }}><Check size={40} /></div>
        <h2>¡Gracias por tu feedback!</h2>
        <p>Tu calificación ha sido registrada.</p>
        <button className="primary-button" onClick={onClose}>Cerrar</button>
      </div>
    </div>;
  }

  return <div className="modal-backdrop" onClick={onClose}>
    <div className="feedback-modal" onClick={(e) => e.stopPropagation()}>
      <button className="modal-close" onClick={onClose}>✕</button>
      <div className="feedback-modal-header">
        <Star size={28} />
        <h2>Calificar curso</h2>
        <p className="muted">{courseTitle}</p>
      </div>
      <div className="feedback-stars">
        {[1, 2, 3, 4, 5].map((s) => (
          <button key={s} className="feedback-star-btn" onMouseEnter={() => setHoverRating(s)} onMouseLeave={() => setHoverRating(0)} onClick={() => setRating(s)}>
            <Star size={32} fill={(hoverRating || rating) >= s ? 'currentColor' : 'none'} className={(hoverRating || rating) >= s ? 'filled' : ''} />
          </button>
        ))}
      </div>
      <div className="feedback-form-group">
        <label>¿Recomendarías este curso?</label>
        <div className="feedback-bool-buttons">
          <button className={wouldRecommend === true ? 'active' : ''} onClick={() => setWouldRecommend(true)}>Sí</button>
          <button className={wouldRecommend === false ? 'active' : ''} onClick={() => setWouldRecommend(false)}>No</button>
        </div>
      </div>
      <div className="feedback-form-group">
        <label>Nivel de dificultad</label>
        <select className="form-input" value={difficulty ?? ''} onChange={(e) => setDifficulty(e.target.value || null)}>
          <option value="">Seleccionar...</option>
          <option value="very_easy">Muy fácil</option>
          <option value="easy">Fácil</option>
          <option value="medium">Medio</option>
          <option value="hard">Difícil</option>
          <option value="very_hard">Muy difícil</option>
        </select>
      </div>
      <div className="feedback-form-group">
        <label>Comentarios (opcional)</label>
        <textarea className="form-input feedback-textarea" value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Cuéntanos tu experiencia..." rows={4} />
      </div>
      <button className="primary-button" onClick={handleSubmit} disabled={rating === 0}>Enviar calificación</button>
    </div>
  </div>;
}
