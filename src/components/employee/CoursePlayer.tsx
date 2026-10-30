import { useEffect, useState } from 'react';
import { ArrowLeft, Award, Check, ChevronLeft, ChevronRight, FileText, Image as ImageIcon, LockKeyhole, Pause, Play, Video } from 'lucide-react';
import { PdfPlayer, PowerPointPlayer, UploadedVideoPlayer, VimeoCoursePlayer, YouTubeCoursePlayer } from '@/components/employee/CourseMediaPlayers';
import type { ExamType } from '@/components/employee/employeeTypes';
import { copy } from '@/lib/copy';
import { getIcon } from '@/lib/icons';
import type { CourseWithRelations } from '@/lib/supabase';

export function CoursePlayer({ t, course, initialModuleId, courseState, onBack, onExam, onMarkComplete }: { t: typeof copy.ES; course: CourseWithRelations; initialModuleId?: string; courseState: { completedModules: boolean[] }; onBack: () => void; onExam: (c: CourseWithRelations, type: ExamType, moduleId?: string) => void; onMarkComplete: (moduleId: string) => void }) {
  const firstIncompleteModuleIdx = courseState.completedModules.findIndex((completed) => !completed);
  const lastUnlockedModuleIdx = firstIncompleteModuleIdx < 0 ? course.modules.length - 1 : firstIncompleteModuleIdx;
  const [moduleIdx, setModuleIdx] = useState(() => {
    if (!initialModuleId) return 0;
    const idx = course.modules.findIndex((m) => m.id === initialModuleId);
    return idx >= 0 && idx <= lastUnlockedModuleIdx ? idx : 0;
  });
  const [playing, setPlaying] = useState(false);
  const [finishedMediaModules, setFinishedMediaModules] = useState<Set<string>>(() => new Set());
  useEffect(() => {
    if (!initialModuleId) return;
    const idx = course.modules.findIndex((m) => m.id === initialModuleId);
    if (idx >= 0 && idx <= lastUnlockedModuleIdx) setModuleIdx(idx);
  }, [course.id, initialModuleId, lastUnlockedModuleIdx]);
  const current = course.modules[moduleIdx];
  if (!current) return <div className="page animate-in player-page"><div className="player-header"><button className="back-button" onClick={onBack}><ArrowLeft size={18} />{t.exitCourse}</button></div><p className="muted" style={{ padding: 40 }}>{t.noCourses}</p></div>;
  const moduleQuestions = course.exam_questions.filter((q) => q.module_id === current.id);
  const moduleExamRequired = moduleQuestions.length > 0;
  const moduleExamPassed = moduleExamRequired && courseState.completedModules[moduleIdx];
  const isVideoModule = current.type === 'video' || current.resource_type === 'video' || /\.(mp4|mov|webm|m4v|avi|mkv|wmv|flv)(\?.*)?$/i.test(current.resource_url ?? '') || /youtube|youtu\.be|vimeo/i.test(current.resource_url ?? '');
  const isImageModule = current.type === 'image' || current.type === 'infographic' || current.resource_type === 'image';
  const imageSource = current.resource_url || current.image_url || '';
  const isPdfModule = (current.type === 'pdf' || current.resource_type === 'pdf' || current.resource_type === 'powerpoint') && !isVideoModule;
  const resourceUrl = current.resource_url ?? '';
  const isPowerPointModule = current.resource_type === 'powerpoint' || /\.pptx?($|\?)/i.test(resourceUrl);
  const requiresMediaCompletion = isVideoModule || isPdfModule;
  const moduleTypeIcon = isVideoModule ? <Video size={15} /> : isImageModule ? <ImageIcon size={15} /> : current.type === 'pdf' || current.resource_type === 'pdf' || current.resource_type === 'powerpoint' ? <FileText size={15} /> : <FileText size={15} />;
  const moduleTypeLabel = isVideoModule ? t.videoModule : isImageModule ? t.imageModule : current.type === 'pdf' || current.resource_type === 'pdf' || current.resource_type === 'powerpoint' ? 'PDF / Presentación' : t.textModule;
  const allModulesComplete = courseState.completedModules.length > 0 && courseState.completedModules.every(Boolean);
  const currentModuleComplete = courseState.completedModules[moduleIdx] ?? false;
  const currentMediaFinished = finishedMediaModules.has(current.id);
  const isModuleUnlocked = (index: number) => index <= lastUnlockedModuleIdx;
  const Icon = getIcon(course.icon_name);
  const videoSource = current.video_url || current.resource_url || '';
  const getYoutubeEmbedUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      const host = parsed.hostname.replace(/^www\./, '').toLowerCase();
      const path = parsed.pathname.replace(/^\//, '');
      const id = parsed.searchParams.get('v') || (host === 'youtu.be' ? path : '');
      if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'www.youtube.com') {
        if (id) return `https://www.youtube.com/embed/${id}`;
        if (/^(embed|shorts|live)/.test(path)) {
          const parts = path.split('/').filter(Boolean);
          const embedId = parts[1] || parts[0];
          if (embedId) return `https://www.youtube.com/embed/${embedId}`;
        }
      }
      if (host === 'youtu.be') {
        const shortId = path.split('/').filter(Boolean)[0];
        if (shortId) return `https://www.youtube.com/embed/${shortId}`;
      }
    } catch {
      // ignorar URLs inválidas
    }
    return '';
  };

  const getVimeoEmbedUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      const host = parsed.hostname.replace(/^www\./, '').toLowerCase();
      const path = parsed.pathname.replace(/^\//, '');
      const id = host.includes('vimeo.com') ? path.split('/').filter(Boolean)[0] : '';
      if (id) return `https://player.vimeo.com/video/${id}`;
    } catch {
      // ignorar URLs inválidas
    }
    return '';
  };

  const youtubeEmbedUrl = getYoutubeEmbedUrl(videoSource);
  const vimeoEmbedUrl = getVimeoEmbedUrl(videoSource);
  const externalVideoEmbedUrl = youtubeEmbedUrl || vimeoEmbedUrl;

  return <div className="page animate-in player-page">
    <div className="player-header"><button className="back-button" onClick={onBack}><ArrowLeft size={18} />{t.exitCourse}</button><div className="player-course-info"><span className={`course-icon-sm ${course.accent}`}><Icon size={18} /></span><div><strong>{course.title}</strong><small>{course.category} · {course.duration}</small></div></div></div>
    <div className="player-layout">
      <div className="player-main"><div className="player-content">
        {isVideoModule && (externalVideoEmbedUrl ? (
          youtubeEmbedUrl ? <YouTubeCoursePlayer key={current.id} embedUrl={youtubeEmbedUrl} title={current.title} onEnded={() => setFinishedMediaModules((modules) => new Set(modules).add(current.id))} /> : vimeoEmbedUrl ? <VimeoCoursePlayer key={current.id} embedUrl={vimeoEmbedUrl} title={current.title} onEnded={() => setFinishedMediaModules((modules) => new Set(modules).add(current.id))} /> : <div className="player-video player-video-external"><iframe className="player-video-el" src={externalVideoEmbedUrl} title={current.title} allow="encrypted-media" referrerPolicy="strict-origin-when-cross-origin" /></div>
        ) : videoSource ? (
          <UploadedVideoPlayer key={current.id} src={videoSource} title={current.title} onEnded={() => setFinishedMediaModules((modules) => new Set(modules).add(current.id))} />
        ) : (
          <div className="player-video player-video-poster"><div className="video-poster" style={{ backgroundImage: `url(${course.image_url})` }}><button className="video-play-btn" onClick={() => setPlaying(!playing)}>{playing ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" />}</button></div><div className="video-controls"><span className="video-time">0:00 / {current.duration}</span><div className="video-bar"><span style={{ width: playing ? '35%' : '0%' }} /></div></div></div>
        ))}
        {isVideoModule && (current.title || current.body) && <div className="player-text player-video-meta"><div className="player-module-tag">{moduleTypeIcon}{moduleTypeLabel} · {current.duration}</div><h2>{current.title}</h2>{current.body && <p>{current.body}</p>}</div>}
        {!isVideoModule && isImageModule && imageSource && <div className="player-image"><img src={imageSource} alt={current.title} /></div>}
        {!isVideoModule && isPowerPointModule && resourceUrl && <PowerPointPlayer key={current.id} src={resourceUrl} title={current.title} onEnded={() => setFinishedMediaModules((modules) => new Set(modules).add(current.id))} />}
        {!isVideoModule && isPdfModule && !isPowerPointModule && resourceUrl && <PdfPlayer key={current.id} src={resourceUrl} title={current.title} onEnded={() => setFinishedMediaModules((modules) => new Set(modules).add(current.id))} />}
        {!isVideoModule && current.type === 'text' && <div className="player-text-icon"><FileText size={48} /></div>}
        {!isVideoModule && <div className="player-text"><div className="player-module-tag">{moduleTypeIcon}{moduleTypeLabel} · {current.duration}</div><h2>{current.title}</h2><p>{current.body}</p></div>}
        {moduleExamRequired && <div className="module-complete-banner" style={{ marginBottom: 16 }}><Award size={16} />{moduleExamPassed ? 'Examen del módulo aprobado' : 'Debes aprobar el examen del módulo para avanzar'}</div>}
        <div className="player-nav-buttons">
          {moduleIdx > 0 && <button className="outline-button player-prev" onClick={() => setModuleIdx(moduleIdx - 1)}><ChevronLeft size={16} />{t.prevQ}</button>}
          {moduleIdx < course.modules.length - 1 ? <button className="primary-button player-next" disabled={requiresMediaCompletion && !currentMediaFinished} onClick={() => {
            if (requiresMediaCompletion && !currentMediaFinished) return;
            if (moduleExamRequired && !moduleExamPassed) {
              onExam(course, 'module', current.id);
              return;
            }
            if (!currentModuleComplete) onMarkComplete(current.id);
            setModuleIdx(moduleIdx + 1);
          }}>{moduleExamRequired && !moduleExamPassed ? 'Examen del módulo' : t.nextQ}<ChevronRight size={16} /></button> : <button className="primary-button player-next" disabled={requiresMediaCompletion && !currentMediaFinished} onClick={() => {
            if (requiresMediaCompletion && !currentMediaFinished) return;
            if (moduleExamRequired && !moduleExamPassed) {
              onExam(course, 'module', current.id);
              return;
            }
            if (!currentModuleComplete) onMarkComplete(current.id);
            onExam(course, 'course');
          }}><Award size={16} />{t.takeExam}</button>}
        </div>
        {currentModuleComplete && <div className="module-complete-banner"><Check size={16} />{t.moduleComplete}</div>}
      </div></div>
      <aside className="player-sidebar">
        <div className="section-title"><div><h2>{t.modules}</h2><p className="muted">{courseState.completedModules.filter(Boolean).length} / {course.modules.length} {t.moduleProgress.toLowerCase()}</p></div></div>
        <div className="player-module-list">{course.modules.map((m, i) => {
          const unlocked = isModuleUnlocked(i);
          const completed = courseState.completedModules[i] ?? false;
          return <button key={m.id} className={`player-module-item${i === moduleIdx ? ' active' : ''}${!unlocked ? ' locked' : ''}`} onClick={() => unlocked && setModuleIdx(i)} disabled={!unlocked} aria-current={i === moduleIdx ? 'step' : undefined}>
            <span className={completed ? 'module-check' : unlocked ? 'module-check current' : 'module-check locked'}>{completed ? <Check size={13} /> : unlocked ? <Play size={11} fill="currentColor" /> : <LockKeyhole size={12} />}</span>
            <span><strong>{m.title}</strong><small>{m.duration}</small></span>{i === moduleIdx && <span className="current-dot" />}
          </button>;
        })}</div>
        {allModulesComplete && <div className="exam-ready-banner"><Award size={16} /><span>{t.courseExamReadyDesc}</span><button className="primary-button" onClick={() => onExam(course, 'course')}>{t.goToExam}</button></div>}
      </aside>
    </div>
  </div>;
}
