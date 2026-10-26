import { Link } from 'react-router';

export function NotFound() {
  return (
    <div className="page-narrow">
      <div className="empty">
        <h1 style={{ fontSize: '1.4rem' }}>Diese Seite gibt es nicht</h1>
        <p>Vielleicht ist der Link veraltet. Über die Seitenleiste oder die Suche findest du alle Lektionen.</p>
        <Link className="btn" to="/">
          Zur Startseite
        </Link>
      </div>
    </div>
  );
}
