import { useMemo, useState } from "react";
import logo from "./assets/logo.png";
import { Link } from "react-router-dom";
import { getAllPosts, NAV_GROUPS, getFeaturedCategories } from "./lib/posts";

export default function App() {
  const entries = getAllPosts()
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 6);

  const featuredCategories = getFeaturedCategories();

  const resourceTiles = [
    {
      title: "Troubleshooting Docs",
      desc: "Root cause → fix → validation. Built for real enterprise incidents.",
      meta: "Errors • Logs • Fixes",
      target: "content",
    },
    {
      title: "Graph & PowerShell Scripts",
      desc: "Reusable automation patterns for Intune, Entra ID, SharePoint, MDE.",
      meta: "Copy-first • Production notes",
      target: "content",
    },
    {
      title: "Power BI Reports",
      desc: "Models, measures, schema tips, and operational dashboards.",
      meta: "Compliance • Updates • Inventory",
      target: "content",
    },
    {
      title: "Projects & Architecture",
      desc: "Rollouts, design decisions, diagrams, and what worked at scale.",
      meta: "Runbooks • Monitoring • CAB-ready",
      target: "content",
    },
  ];

  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const allFilters = useMemo(() => {
    const filters = new Set();

    entries.forEach((entry) => {
      if (entry.category) {
        filters.add(entry.category);
      }

      (entry.products || []).forEach((product) => {
        filters.add(product);
      });

      (entry.tags || []).forEach((tag) => {
        filters.add(tag);
      });
    });

    return ["All", ...Array.from(filters).sort()];
  }, [entries]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return entries
      .filter((entry) => {
        if (activeFilter === "All") return true;

        return (
          entry.category === activeFilter ||
          (entry.products || []).includes(activeFilter) ||
          (entry.tags || []).includes(activeFilter)
        );
      })
      .filter((entry) => {
        if (!q) return true;

        return (
          (entry.title || "").toLowerCase().includes(q) ||
          (entry.summary || "").toLowerCase().includes(q) ||
          (entry.type || "").toLowerCase().includes(q) ||
          (entry.category || "").toLowerCase().includes(q) ||
          (entry.tags || []).join(" ").toLowerCase().includes(q) ||
          (entry.products || []).join(" ").toLowerCase().includes(q) ||
          (entry.errorCodes || []).join(" ").toLowerCase().includes(q)
        );
      })
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [entries, query, activeFilter]);

  function scrollToSection(id) {
    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }

  return (
    <main className="min-h-screen bg-[#071112] text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-5">
          <Link to="/" className="flex items-center gap-3">
            <span className="text-2xl font-black tracking-tight">
              Arman<span className="text-cyan-400">Dev</span>
            </span>

            <span className="hidden md:inline text-white/35">
              M365 • Intune • Automation
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-white/70">
            <Link to="/" className="hover:text-white transition">
              Home
            </Link>

            {NAV_GROUPS.map((group) => (
              <div key={group.title} className="relative group">
                <button
                  type="button"
                  className="hover:text-white transition"
                >
                  {group.title}
                </button>

                <div className="invisible absolute left-0 top-7 w-80 rounded-2xl border border-white/10 bg-zinc-950/95 p-3 opacity-0 shadow-2xl transition group-hover:visible group-hover:opacity-100">
                  {group.items.map((item) => (
                    <Link
                      key={item.slug}
                      to={`/category/${item.slug}`}
                      className="block rounded-xl px-4 py-3 hover:bg-white/[0.06] transition"
                    >
                      <span className="block text-white">
                        {item.name}
                      </span>

                      <span className="mt-1 block text-xs leading-relaxed text-white/45">
                        {item.description}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            <Link to="/posts" className="hover:text-white transition">
              All Posts
            </Link>

            <button
              type="button"
              onClick={() => scrollToSection("resources")}
              className="hover:text-white transition"
            >
              Resources
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("about")}
              className="hover:text-white transition"
            >
              About
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("contact")}
              className="hover:text-white transition"
            >
              Contact
            </button>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://github.com/Joanez/armandev"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
            >
              GitHub
            </a>

            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
        <div>
          <div className="flex items-center gap-5">
            <img src={logo} alt="ArmanDev logo" className="h-12 w-auto" />

            <div>
              <div className="text-3xl font-black">
                Arman<span className="text-cyan-400">Dev</span>
              </div>

              <div className="text-white/50">
                Modern Workplace Engineering
              </div>
            </div>
          </div>

          <div className="mt-10 inline-flex rounded-full border border-cyan-400/30 bg-cyan-500/10 px-5 py-2 text-cyan-200">
            Modern Workplace • Cloud • Endpoint Engineering
          </div>

          <h1 className="mt-10 max-w-4xl text-6xl font-black leading-tight md:text-7xl">
            Documentation built for{" "}
            <span className="text-cyan-400">enterprise reality</span>
          </h1>

          <p className="mt-8 max-w-3xl text-xl leading-relaxed text-white/65">
            I document real-world Microsoft 365 issues and the fixes that work
            at scale: Intune, Autopilot, Entra ID, Graph automation, MDE, Power
            BI reporting, and operational runbooks.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <button
              type="button"
              onClick={() => scrollToSection("content")}
              className="rounded-2xl bg-cyan-400 px-7 py-4 font-bold text-black hover:bg-cyan-300 transition"
            >
              Browse Documentation
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("resources")}
              className="rounded-2xl border border-white/15 px-7 py-4 font-bold hover:border-cyan-400/40 transition"
            >
              View Resources
            </button>
          </div>

          <div className="mt-14 grid max-w-3xl gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <div className="text-white/40">Focus</div>
              <div className="mt-2 font-bold">M365 Platform</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <div className="text-white/40">Outputs</div>
              <div className="mt-2 font-bold">Docs + Scripts</div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <div className="text-white/40">Style</div>
              <div className="mt-2 font-bold">Problem → Fix</div>
            </div>
          </div>
        </div>

        <aside className="rounded-3xl border border-white/10 bg-white/[0.06] p-8">
          <h2 className="text-3xl font-black text-cyan-300">
            Current Focus
          </h2>

          <div className="mt-7 space-y-4">
            {[
              "Intune remediation at scale",
              "Firmware and BIOS update automation",
              "Secure Boot certificate rollout reporting",
              "Graph exports to SharePoint and Power BI",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-black/25 p-5 text-white/70"
              >
                {item}
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-cyan-400/30 bg-cyan-500/10 p-6">
            <div className="font-bold text-cyan-200">
              Tip for readers
            </div>

            <p className="mt-3 text-white/70">
              Each entry includes symptoms, root cause, fix, validation, and
              rollback guidance where applicable.
            </p>
          </div>
        </aside>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-4xl font-black">
              Browse by Solution
            </h2>

            <p className="mt-3 max-w-3xl text-white/60">
              Start from the Microsoft 365 area you care about, then drill into
              related documentation, scripts, runbooks, and reporting notes.
            </p>
          </div>

          <Link
            to="/posts"
            className="inline-flex w-fit rounded-2xl border border-white/15 px-5 py-3 text-sm font-semibold hover:border-cyan-400/40 transition"
          >
            View all posts
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featuredCategories.map((category) => (
            <Link
              key={category.slug}
              to={`/category/${category.slug}`}
              className="group rounded-3xl border border-white/10 bg-white/[0.035] p-6 hover:border-cyan-400/40 hover:bg-cyan-500/[0.06] transition"
            >
              <div className="text-xs uppercase tracking-[0.2em] text-white/35">
                {category.group}
              </div>

              <h3 className="mt-4 text-2xl font-black group-hover:text-cyan-300 transition">
                {category.name}
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-white/55">
                {category.description}
              </p>

              <div className="mt-5 text-sm font-semibold text-cyan-300">
                Browse →
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="resources" className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="text-4xl font-black">
          Resources
        </h2>

        <p className="mt-3 max-w-3xl text-white/60">
          Organized for fast lookup: documentation, scripts, reports, and
          project playbooks.
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {resourceTiles.map((tile) => (
            <button
              key={tile.title}
              type="button"
              onClick={() => scrollToSection(tile.target)}
              className="text-left rounded-3xl border border-white/10 bg-zinc-950/50 p-6 hover:border-cyan-400/40 transition"
            >
              <h3 className="text-xl font-bold">
                {tile.title}
              </h3>

              <p className="mt-3 text-white/60">
                {tile.desc}
              </p>

              <div className="mt-5 text-sm text-cyan-300">
                {tile.meta}
              </div>
            </button>
          ))}
        </div>
      </section>

      <section id="content" className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-4xl font-black">
              Latest Articles
            </h2>

            <p className="mt-3 max-w-3xl text-white/60">
              Search and filter across the latest troubleshooting notes,
              scripts, reports, and project playbooks.
            </p>
          </div>

          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search: product, tag, vendor..."
            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-cyan-400/40 sm:w-96"
          />
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {allFilters.map((filter) => {
            const active = filter === activeFilter;

            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={[
                  "rounded-xl border px-3 py-2 text-sm transition",
                  active
                    ? "border-cyan-400/50 bg-cyan-500/10 text-cyan-200"
                    : "border-white/10 bg-zinc-900/70 text-white/70 hover:border-white/25",
                ].join(" ")}
              >
                {filter}
              </button>
            );
          })}
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((entry) => (
            <Link
              key={entry.slug}
              to={`/post/${entry.slug}`}
              className="group rounded-3xl border border-white/10 bg-zinc-950/50 p-6 hover:border-cyan-400/40 transition"
            >
              <div className="flex items-center justify-between gap-4 text-xs text-white/45">
                <span>{entry.type || "Documentation"}</span>
                <span>{entry.date || ""}</span>
              </div>

              <h3 className="mt-4 text-2xl font-bold group-hover:text-cyan-300 transition">
                {entry.title || "Untitled"}
              </h3>

              <p className="mt-3 text-white/60">
                {entry.summary || ""}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {entry.category && (
                  <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-200">
                    {entry.category}
                  </span>
                )}

                {(entry.products || []).map((product) => (
                  <span
                    key={product}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/60"
                  >
                    {product}
                  </span>
                ))}

                {(entry.tags || []).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-6 text-sm font-semibold text-cyan-300">
                Read →
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-white/60">
            No results. Try a different keyword or filter.
          </div>
        )}
      </section>

      <section id="about" className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="text-4xl font-black">
          About ArmanDev
        </h2>

        <p className="mt-5 max-w-4xl text-lg leading-relaxed text-white/65">
          ArmanDev is my engineering notebook for Microsoft 365 and endpoint
          operations. I publish solutions that stand up in enterprise
          environments: repeatable automation, deployment patterns, reporting
          pipelines, and troubleshooting guides that save time and reduce risk.
        </p>
      </section>

      <section id="contact" className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="text-4xl font-black">
          Contact
        </h2>

        <p className="mt-3 text-white/60">
          Want to collaborate or suggest a topic? Reach out.
        </p>

        <div className="mt-6 flex flex-wrap gap-4">
          <a
            href="mailto:apacheco@armandev.tech"
            className="rounded-2xl border border-white/10 px-4 py-2 hover:bg-white/5 transition"
          >
            apacheco@armandev.tech
          </a>

          <a
            href="https://github.com/Joanez/armandev"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl border border-white/10 px-4 py-2 hover:bg-white/5 transition"
          >
            GitHub
          </a>

          <a
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl border border-white/10 px-4 py-2 hover:bg-white/5 transition"
          >
            LinkedIn
          </a>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-white/40">
        © 2026 ArmanDev, built for operational clarity and scalable automation.
      </footer>
    </main>
  );
}