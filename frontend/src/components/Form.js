import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import { USER_CREATE, USER_LOGIN } from '../services/api';
import Background from '../assets/signup-image.jpg';

import style from './styles/Form.module.css';

export default function Form({ type }) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      if (type === 'Registrar') {
        setError(null);
        setLoading(true);

        const { url, options } = USER_CREATE({ username, password });
        const res = await fetch(url, options);
        const json = await res.json();
        if (!res.ok) throw new Error(json.error);

        window.localStorage.setItem('token', json.token);

        navigate('/to-do');
      } else {
        setError(null);
        setLoading(true);

        const { url, options } = USER_LOGIN({ username, password });
        const res = await fetch(url, options);
        const json = await res.json();

        if (!res.ok) throw new Error(json.error);

        window.localStorage.setItem('token', json.token);

        navigate('/to-do');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    return () => {
      setLoading(false);
      setError(null);
    };
  }, []);

  return (
    <div
      style={
        type === 'Registrar'
          ? {
              background: 'none',
              backgroundImage: `url(${Background})`,
              backgroundRepeat: 'no-repeat',
              backgroundColor: '#fff',
              backgroundPosition: '85% center',
            }
          : null
      }
      className={style.wrapper}
    >
      <h1>{type}</h1>
      <form onSubmit={handleSubmit} autoComplete="off">
        <div>
          <label className={style.label} htmlFor="username">
            Usuário:
          </label>
          <input
            type="text"
            name="username"
            id="username"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>

        <div>
          <label className={style.label} htmlFor="password">
            Senha:
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>

        <div>
          {!loading ? (
            <input type="submit" value={type} />
          ) : (
            <input
              style={{
                fontSize: '16px',
                opacity: '0.5',
                cursor: 'not-allowed',
              }}
              readOnly
              type="submit"
              value="Carregando..."
            />
          )}
          {error && (
            <span style={{ marginLeft: '15px', fontSize: '14px' }}>
              {error}
            </span>
          )}
        </div>

        {type === 'Entrar' ? (
          <NavLink to="/register">Não possui uma conta?</NavLink>
        ) : (
          <NavLink to="/login">Já possui uma conta?</NavLink>
        )}
      </form>
    </div>
  );
}
