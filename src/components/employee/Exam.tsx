import { useState } from 'react';
import { AlertCircle, ArrowLeft, ArrowRight, Award, BookOpen, Check, ChevronLeft, ChevronRight, RotateCcw, ShieldCheck, X } from 'lucide-react';
import type { ExamType } from '@/components/employee/employeeTypes';
import { copy } from '@/lib/copy';
import { getIcon } from '@/lib/icons';
import type { CourseWithRelations } from '@/lib/supabase';

export function Exam({ t, course, examType, moduleId, courseState, onBack, onBackToCourse, onResult, onPass, onNextModule }: { t: typeof copy.ES; course: CourseWithRelations; examType: ExamType; moduleId?: string; courseState: { completedModules: boolean[]; directFailed: boolean; directPassed: boolean; courseExamPassed: boolean }; onBack: () => void; onBackToCourse: () => void; onResult: (courseId: string, type: ExamType, score: number, passed: boolean, directFailed: boolean, totalQuestions: number, correctAnswers: number, answers: number[], moduleId?: string) => void; onPass?: () => void; onNextModule?: (course: CourseWithRelations, moduleId?: string) => void }) {
  const moduleQuestions = moduleId ? course.exam_questions.filter((q) => q.module_id === moduleId) : [];
  const questions = examType === 'module' ? moduleQuestions : course.exam_questions.filter((q) => !q.module_id);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(-1));
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{ score: number; correct: number; total: number; passed: boolean } | null>(null);
  const [reviewed, setReviewed] = useState<Record<number, boolean>>({});
  if (questions.length === 0) return <div className="page animate-in"><p className="muted" style={{ padding: 40 }}>{t.noCourses}</p></div>;
  const q = questions[currentQ];
  const answered = answers[currentQ] !== -1;
  const allAnswered = answers.every((a) => a !== -1);
  const progress = ((currentQ + 1) / questions.length) * 100;
  const examTitle = examType === 'direct' ? t.directExam : examType === 'module' ? `Examen del módulo` : t.courseExam;
  const examDesc = examType === 'direct' ? t.directExamDesc : examType === 'module' ? 'Aprobación requerida para continuar con este módulo.' : t.courseExamDesc;
  const Icon = getIcon(course.icon_name);
  const currentReviewed = !!reviewed[currentQ];

  const handleSubmit = () => {
    const correct = answers.reduce((acc, ans, i) => ans === questions[i].correct_index ? acc + 1 : acc, 0);
    const score = Math.round((correct / questions.length) * 100);
    const passed = score >= 90;
    const directFailed = examType === 'direct' && !passed;
    setResult({ score, correct, total: questions.length, passed });
    setSubmitted(true);
    onResult(course.id, examType, score, passed, directFailed, questions.length, correct, answers, moduleId);
    if (passed && examType === 'course' && onPass) onPass();
  };

  const handleNext = () => {
    if (!answered) return;
    if (!reviewed[currentQ]) {
      setReviewed((prev) => ({ ...prev, [currentQ]: true }));
      return;
    }
    if (currentQ < questions.length - 1) setCurrentQ((prev) => prev + 1);
  };

  const handleFinish = () => {
    if (!allAnswered) return;
    if (!reviewed[currentQ]) {
      setReviewed((prev) => ({ ...prev, [currentQ]: true }));
      return;
    }
    handleSubmit();
  };

  if (submitted && result) {
    const isDirectFailed = examType === 'direct' && !result.passed;
    return <div className="page animate-in"><div className="exam-result">
      <div className={`exam-result-icon ${result.passed ? 'passed' : 'failed'}`}>{result.passed ? <Award size={48} /> : <AlertCircle size={48} />}</div>
      <h1>{result.passed ? t.passed : isDirectFailed ? t.directFailed : t.failed}</h1>
      <p className="muted">{result.passed ? t.certificate : isDirectFailed ? t.directFailedDesc : t.retry}</p>
      <div className="exam-score-display"><div className="score-circle"><strong>{result.score}%</strong></div><div className="score-details"><div><span>{t.correctAnswers}</span><strong>{result.correct} / {result.total}</strong></div><div><span>{t.passThreshold}</span><strong>90%</strong></div></div></div>
      <div className="exam-breakdown">
        <h3>{t.questionBreakdown}</h3>
        {questions.map((question, i) => {
          const selectedIndex = answers[i];
          const isCorrect = selectedIndex === question.correct_index;
          return <div key={i} className={`exam-breakdown-item ${isCorrect ? 'correct' : 'incorrect'}`}>
            <div className="breakdown-head"><span className="breakdown-index">{i + 1}</span><span className={`breakdown-status ${isCorrect ? 'correct' : 'incorrect'}`}>{isCorrect ? t.correctQuestion : t.incorrectQuestion}</span></div>
            <p className="breakdown-question">{question.question}</p>
            <small>{selectedIndex === -1 ? t.noAnswer : `${t.selectedAnswer}: ${question.options[selectedIndex]}`}</small>
          </div>;
        })}
      </div>
      <div className="exam-result-actions">
        {result.passed && examType === 'module' && moduleId && onNextModule ? (
          <>
            <button className="primary-button" onClick={() => onNextModule(course, moduleId)}><ArrowRight size={17} />Siguiente módulo</button>
            <button className="outline-button" onClick={onBackToCourse}><BookOpen size={17} />Volver al curso</button>
          </>
        ) : result.passed ? (
          <button className="primary-button" onClick={onBack}><Award size={17} />{t.backToCatalog}</button>
        ) : isDirectFailed ? (
          <button className="primary-button" onClick={onBackToCourse}><BookOpen size={17} />{t.goToCourse}</button>
        ) : (
          <button className="primary-button" onClick={() => { setAnswers(Array(questions.length).fill(-1)); setCurrentQ(0); setReviewed({}); setSubmitted(false); setResult(null); }}><RotateCcw size={17} />{t.retry}</button>
        )}
        {!result.passed && <button className="outline-button" onClick={onBack}>{t.backToCatalog}</button>}
      </div>
    </div></div>;
  }

  return <div className="page animate-in exam-page">
    <div className="player-header"><button className="back-button" onClick={onBack}><ArrowLeft size={18} />{t.exitCourse}</button><div className="player-course-info"><span className={`course-icon-sm ${course.accent}`}><Icon size={18} /></span><div><strong>{course.title}</strong><small>{examTitle}</small></div></div></div>
    <div className="exam-layout">
      <div className="exam-main">
        <div className="exam-type-banner"><div className={`exam-type-icon ${examType}`}>{examType === 'direct' ? <ShieldCheck size={18} /> : <Award size={18} />}</div><div><strong>{examTitle}</strong><small>{examDesc}</small></div></div>
        <div className="exam-progress-bar"><div className="exam-progress-info"><span>{t.question} {currentQ + 1} {t.of} {questions.length}</span><span>{Math.round(progress)}%</span></div><div className="progress-track"><span style={{ width: `${progress}%` }} /></div></div>
        <div className="exam-question-card"><h2>{q.question}</h2><div className="exam-options">{q.options.map((opt, i) => {
          const isSelected = answers[currentQ] === i;
          const isCorrect = q.correct_index === i;
          const revealAnswer = currentReviewed;
          const optionClassName = [
            'exam-option',
            isSelected ? 'selected' : '',
            revealAnswer && isCorrect && isSelected ? 'correct' : '',
            revealAnswer && isSelected && !isCorrect ? 'incorrect' : '',
          ].filter(Boolean).join(' ');
          return <button key={i} className={optionClassName} onClick={() => { if (currentReviewed) return; const n = [...answers]; n[currentQ] = i; setAnswers(n); }}><span className="option-letter">{String.fromCharCode(65 + i)}</span><span>{opt}</span>{revealAnswer && isCorrect && isSelected && <Check size={18} />}{revealAnswer && isSelected && !isCorrect && <X size={18} />}</button>;
        })}</div></div>
        <div className="exam-nav">{currentQ > 0 && <button className="outline-button" onClick={() => setCurrentQ(currentQ - 1)}><ChevronLeft size={16} />{t.prevQ}</button>}{currentQ < questions.length - 1 ? <button className="primary-button" disabled={!answered} onClick={handleNext}>{t.nextQ}<ChevronRight size={16} /></button> : <button className="primary-button" disabled={!allAnswered} onClick={handleFinish}>{t.finishExam}<Check size={16} /></button>}</div>
      </div>
      <aside className="exam-sidebar"><div className="section-title"><div><h2>{t.question}s</h2><p className="muted">{answers.filter((a) => a !== -1).length} / {questions.length}</p></div></div><div className="exam-questions-grid">{questions.map((_, i) => {
        const status = reviewed[i] ? (answers[i] === questions[i].correct_index ? 'correct' : 'incorrect') : (answers[i] !== -1 ? 'answered' : '');
        return <button key={i} className={['exam-q-dot', i === currentQ ? 'current' : '', status].filter(Boolean).join(' ')} onClick={() => setCurrentQ(i)}>{i + 1}</button>;
      })}</div><div className="exam-pass-info"><AlertCircle size={15} /><span>{t.passThreshold}</span></div></aside>
    </div>
  </div>;
}

