import type { ReactNode } from 'react';
import { ChevronRight, Menu, Moon, Sun, X } from 'lucide-react';
import { usePreferences } from '@/lib/preferences';

function BrandLogo() {
  const { dark } = usePreferences();
  return <img src={dark ? '/LOGOTIPO_NEGATIVO.png' : '/LOGOTIPO_POSITIVO.png'} alt="TRIADE" />;
}

export function PreferenceControls() {
  const { language, setLanguage, dark, setDark } = usePreferences();
  return <>
    <button className="language-toggle" onClick={() => setLanguage(language === 'ES' ? 'EN' : 'ES')}><span className={language === 'ES' ? 'selected' : ''}>ES</span><span>/</span><span className={language === 'EN' ? 'selected' : ''}>EN</span></button>
    <button className="icon-button" onClick={() => setDark(!dark)}>{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
  </>;
}

export function LoadingScreen() {
  const { t, dark } = usePreferences();
  return <div className={dark ? 'app-shell dark' : 'app-shell'} style={{ display: 'grid', placeItems: 'center', height: '100vh' }}><p style={{ color: '#6b7280' }}>{t.loading}</p></div>;
}

type AppFrameProps = {
  workspaceLabel: string;
  sidebarContent: ReactNode;
  breadcrumb: string;
  initials: string;
  topbarExtras?: ReactNode;
  fullscreen?: boolean;
  mobileOpen: boolean;
  onMobileOpenChange: (open: boolean) => void;
  children: ReactNode;
};

export function AppFrame({ workspaceLabel, sidebarContent, breadcrumb, initials, topbarExtras, fullscreen = false, mobileOpen, onMobileOpenChange, children }: AppFrameProps) {
  const { dark } = usePreferences();
  return <div className={dark ? 'app-shell dark' : 'app-shell'}>
    {!fullscreen && <aside className={mobileOpen ? 'sidebar open' : 'sidebar'}>
      <div className="brand"><BrandLogo /><button className="close-menu" onClick={() => onMobileOpenChange(false)}><X size={20} /></button></div>
      <div className="workspace-label">{workspaceLabel}</div>
      {sidebarContent}
    </aside>}
    <main className={fullscreen ? 'main-content fullscreen' : 'main-content'}>
      <header className="topbar">
        <button className="menu-button" onClick={() => onMobileOpenChange(true)}><Menu size={21} /></button>
        <div className="breadcrumb">TRIADE <ChevronRight size={14} /> <span>{breadcrumb}</span></div>
        <div className="top-actions">
          {topbarExtras}
          <PreferenceControls />
          <div className="avatar avatar-small">{initials}</div>
        </div>
      </header>
      {children}
    </main>
  </div>;
}
