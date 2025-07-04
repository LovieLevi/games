import { Outlet, Link } from "react-router-dom";
import "./Layout.scss";

export const Layout = () => {
  return (
    <>
      <nav>
        <ul>
          <li id="nav-title">Games</li>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>
      </nav>

      <div className="main-wrapper">
        <main>
          <Outlet />
        </main>
      </div>

      <footer>
        <h3>© 2024 LeviLovie (Lev Abashichev)</h3>
      </footer>
    </>
  );
};
