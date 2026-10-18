import { NavLink } from 'react-router-dom';

export default function AdminNav() {
  const cls = ({ isActive }) => `nav-link ${isActive ? 'active' : ''}`;
  return (
    <ul className="nav nav-pills mb-4">
      <li className="nav-item"><NavLink end to="/admin" className={cls}>Overview</NavLink></li>
      <li className="nav-item"><NavLink to="/admin/movies" className={cls}>Movies</NavLink></li>
      <li className="nav-item"><NavLink to="/admin/theatres" className={cls}>Theatres</NavLink></li>
      <li className="nav-item"><NavLink to="/admin/shows" className={cls}>Shows</NavLink></li>
    </ul>
  );
}
