import { Link, useLocation } from "react-router-dom";
import "../styles/Navigation.css";

const Navigation = () => {
  const location = useLocation();
  const isActive =
    location.pathname === "/admin/posts" ||
    location.pathname.includes("/admin/posts/");
  
  // Hide home link on login page
  const shouldShowHome = location.pathname !== "/auth/login";
  
  return (
    <nav className="navigation">
      {shouldShowHome && (
        <div className="navigation_home">
          <Link to="posts" className={isActive ? "active" : ""}>
            Home
          </Link>
        </div>
      )}
      <div className="navigation_links">
        <a
          className="navigation_icon"
          href="https://github.com/frrst-ian"
          referrerPolicy="no-referrer"
          rel="noopener"
          target="_blank"
        >
          <img
            src="/icons/github-142-svgrepo-com.svg"
            alt="github icon"
            width="25"
            height="25"
          />
        </a>
      </div>
    </nav>
  );
};

export default Navigation;