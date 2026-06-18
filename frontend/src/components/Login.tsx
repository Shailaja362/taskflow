import { useState } from 'react';
import * as api from '../api/client';

export default function Login({ onAuthed }: { onAuthed: (token: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');

  async function submit() {
    setError('');
    try {
      const token = isRegister
        ? await api.register(email, password)
        : await api.login(email, password);
      onAuthed(token);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <div className="login">
      <h1>TaskFlow</h1>
      <h2>{isRegister ? 'Create account' : 'Log in'}</h2>
      <input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input
        placeholder="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={submit}>{isRegister ? 'Register' : 'Log in'}</button>
      {error && <p className="error">{error}</p>}
      <p className="toggle" onClick={() => setIsRegister(!isRegister)}>
        {isRegister ? 'Have an account? Log in' : 'No account? Register'}
      </p>
    </div>
  );
}
