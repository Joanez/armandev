import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { NAV_GROUPS } from "../lib/posts";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  function goToSection(sectionId) {
    if (location.pathname === "/") {
      const element = document.getElementById(sectionId);

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

      return;
    }

    navigate("/");

    setTimeout(() => {
      const element = document.getElementById(sectionId);

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-5">
        <Link to="/" className="flex items-center gap-3">
          {logo}

          <div>
            <div className="text-2xl font-black tracking-tight">
              Arman<span className="text-cyan-400">Dev</span>
            </div>

            <div className="hidden text-xs text-white/45 md:block">
              M365 • Intune • Automation
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-white/70 lg:flex">
          <Link to="/" className="transition hover:text-white">
            Home
          </Link>

          {NAV_GROUPS.map((group) => (
            <div key={group.title} className="group relative">
              <button type="button" className="transition hover:text-white">
                {group.title}
              </button>

              <div className="invisible absolute left-0 top-full z-50 pt-3 opacity-0 transition group-hover:visible group-hover:opacity-100">
                <div className="w-80 rounded-2xl border border-white/10 bg-zinc-950/95 p-3 shadow-2xl backdrop-blur-xl">
                  {group.items.map((item) => (
                    <Link
                      key={item.slug}
                      to={`/category/${item.slug}`}
                      className="block rounded-xl px-4 py-3 transition hover:bg-white/[0.06]"
                    >
                      <span className="block text-white">{item.name}</span>

                      <span className="mt-1 block text-xs leading-relaxed text-white/45">
                        {item.description}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <Link to="/posts" className="transition hover:text-white">
            All Posts
          </Link>

          <button
            type="button"
            onClick={() => goToSection("content")}
            className="transition hover:text-white"
          >
            Latest
          </button>

          <button
            type="button"
            onClick={() => goToSection("about")}
            className="transition hover:text-white"
          >
            About
          </button>

          <button
            type="button"
            onClick={() => goToSection("contact")}
            className="transition hover:text-white"
          >
            Contact
          </button>
        </nav>
      </div>
    </header>
  );
}