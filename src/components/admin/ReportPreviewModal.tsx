import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Printer, Save, X } from 'lucide-react';
import { usePreferences } from '@/lib/preferences';
import { adminStringsByLanguage } from '@/components/admin/strings';

const PREVIEW_EVENT = 'report:preview';

export function openReportPreviewModal(html: string) {
  window.dispatchEvent(new CustomEvent(PREVIEW_EVENT, { detail: html }));
}

export function ReportPreviewModal() {
  const { language } = usePreferences();
  const at = adminStringsByLanguage[language];
  const [html, setHtml] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handler = (e: Event) => setHtml((e as CustomEvent<string>).detail);
    window.addEventListener(PREVIEW_EVENT, handler);
    return () => window.removeEventListener(PREVIEW_EVENT, handler);
  }, []);

  useEffect(() => {
    if (!html) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setHtml(null); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [html]);

  if (!html) return null;

  const printReport = () => {
    const frame = iframeRef.current;
    if (!frame?.contentWindow) return;
    frame.contentWindow.focus();
    frame.contentWindow.print();
  };

  const saveReport = () => {
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const titleMatch = html.match(/<title>([^<]*)<\/title>/);
    a.download = `${titleMatch?.[1] ?? 'reporte'}.html`;
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
  };

  return createPortal(
    <div className="modal-backdrop report-preview-backdrop" onClick={() => setHtml(null)}>
      <div className="report-preview-modal" onClick={(e) => e.stopPropagation()}>
        <div className="report-preview-toolbar">
          <p className="eyebrow">{at.reports}</p>
          <div className="report-preview-actions">
            <button type="button" className="outline-button" onClick={saveReport}>
              <Save size={15} /> Guardar
            </button>
            <button type="button" className="primary-button" onClick={printReport}>
              <Printer size={15} /> Imprimir / PDF
            </button>
            <button type="button" className="modal-close report-preview-close" onClick={() => setHtml(null)}><X size={19} /></button>
          </div>
        </div>
        <iframe ref={iframeRef} title="Vista previa del reporte" className="report-preview-frame" srcDoc={html} />
      </div>
    </div>,
    document.body,
  );
}
