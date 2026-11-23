import { useState, type FormEvent } from 'react';
import { AlertCircle } from 'lucide-react';
import { PreferenceControls } from '@/components/layout/AppFrame';
import { useAuth } from '@/lib/auth';
import { usePreferences } from '@/lib/preferences';
import { useToast } from '@/lib/toast';

export function AuthPage() {
  const { signIn } = useAuth();
  const { t, dark } = usePreferences();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [attempted, setAttempted] = useState(false);

  const emailError = emailTouched || attempted
    ? !email.trim()
      ? 'Ingresa tu correo electrónico.'
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
        ? 'Ingresa un correo electrónico válido.'
        : null
    : null;
  const passwordError = passwordTouched || attempted
    ? password
      ? null
      : 'Ingresa tu contraseña.'
    : null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAttempted(true);
    setError(null);
    const invalidEmail = !email.trim()
      ? 'Ingresa tu correo electrónico.'
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
        ? 'Ingresa un correo electrónico válido.'
        : null;
    const invalidPassword = password ? null : 'Ingresa tu contraseña.';
    if (invalidEmail || invalidPassword) {
      toast(invalidEmail ?? invalidPassword!, 'error');
      return;
    }

    setSubmitting(true);
    try {
      const { error: err } = await signIn(email.trim(), password);
      if (err) {
        setError(err);
        toast(err, 'error');
      } else {
        toast('Inicio de sesión exitoso', 'success');
      }
    } catch {
      const message = 'No se pudo iniciar sesión. Inténtalo de nuevo.';
      setError(message);
      toast(message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return <div className={dark ? 'app-shell dark' : 'app-shell'} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
    <div className="auth-card">
      <div className="auth-top-bar">
        <img src={dark ? '/LOGOTIPO_NEGATIVO.png' : '/LOGOTIPO_POSITIVO.png'} alt="TRIADE" className="auth-logo" />
        <div className="auth-top-actions"><PreferenceControls /></div>
      </div>
      <h1 className="auth-title">{t.signIn}</h1>
      <p className="auth-subtitle">TRIADE LEARNING</p>
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="auth-field">
          <input
            id="login-email"
            className={`auth-input${emailError ? ' invalid' : ''}`}
            type="email"
            placeholder={t.email}
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(null); }}
            onBlur={() => setEmailTouched(true)}
            autoComplete="username"
            aria-invalid={Boolean(emailError)}
            aria-describedby={emailError ? 'login-email-error' : undefined}
          />
          {emailError && <small className="auth-field-error" id="login-email-error">{emailError}</small>}
        </div>
        <div className="auth-field">
          <input
            id="login-password"
            className={`auth-input${passwordError ? ' invalid' : ''}`}
            type="password"
            placeholder={t.password}
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(null); }}
            onBlur={() => setPasswordTouched(true)}
            autoComplete="current-password"
            aria-invalid={Boolean(passwordError)}
            aria-describedby={passwordError ? 'login-password-error' : undefined}
          />
          {passwordError && <small className="auth-field-error" id="login-password-error">{passwordError}</small>}
        </div>
        {error && <div className="auth-error"><AlertCircle size={16} />{error}</div>}
        <button className="primary-button auth-submit" type="submit" disabled={submitting}>{t.signIn}</button>
      </form>
    </div>
  </div>;
}
