import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { PreferenceControls } from '@/components/layout/AppFrame';
import { useAuth } from '@/lib/auth';
import { usePreferences } from '@/lib/preferences';

export function AuthPage() {
  const { signIn } = useAuth();
  const { t, dark } = usePreferences();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setSubmitting(true);
    const { error: err } = await signIn(email, password);
    if (err) setError(err);
    setSubmitting(false);
  };

  return <div className={dark ? 'app-shell dark' : 'app-shell'} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
    <div className="auth-card">
      <div className="auth-top-bar">
        <img src={dark ? '/LOGOTIPO_NEGATIVO.png' : '/LOGOTIPO_POSITIVO.png'} alt="TRIADE" className="auth-logo" />
        <div className="auth-top-actions"><PreferenceControls /></div>
      </div>
      <h1 className="auth-title">{t.signIn}</h1>
      <p className="auth-subtitle">TRIADE LEARNING</p>
      <div className="auth-form">
        <input className="auth-input" type="email" placeholder={t.email} value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="auth-input" type="password" placeholder={t.password} value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <div className="auth-error"><AlertCircle size={16} />{error}</div>}
        <button className="primary-button auth-submit" onClick={handleSubmit} disabled={submitting}>{t.signIn}</button>
      </div>
    </div>
  </div>;
}
