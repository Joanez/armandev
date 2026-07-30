import { useMemo, useState } from "react";
import logo from "./assets/logo.png";
import { getAllPosts } from "./lib/posts";

export default function App() {
  // You’ll eventually load this from markdown/MDX or a JSON index.
const entries = getAllPosts()
  .sort((a, b) => (a.date < b.date ? 1 : -1))
  .slice(0, 6);

  const resourceTiles = [
    {
      title: "Troubleshooting Docs",
      desc: "Root cause → fix → validation. Built for real enterprise incidents.",
      meta: "Errors • Logs • Fixes",
      href: "#content",
    },
    {
      title: "Graph & PowerShell Scripts",
      desc: "Reusable automation patterns for Intune, Entra ID, SharePoint, MDE.",
      meta: "Copy-first • Production notes",
      href: "#content",
    },
    {
      title: "Power BI Reports",
      desc: "Models, measures, schema tips, and operational dashboards.",
      meta: "Compliance • Updates • Inventory",
      href: "#content",
    },
    {
      title: "Projects & Architecture",
      desc: "Rollouts, design decisions, diagrams, and what worked at scale.",
      meta: "Runbooks • Monitoring • CAB-ready",
      href: "#content",
    },
  ];

  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState("All");

  const allTags = useMemo(() => {
    const t = new Set();
    entries.forEach((e) => e.tags.forEach((x) => t.add(x)));
    return ["All", ...Array.from(t).sort()];
  }, [entries]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries
      .filter((e) => (activeTag === "All" ? true : e.tags.includes(activeTag)))
      .filter((e) => {
        if (!q) return true;
        return (
          e.title.toLowerCase().includes(q) ||
          e.summary.toLowerCase().includes(q) ||
          e.tags.join(" ").toLowerCase().includes(q) ||
          e.type.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [entries, query, activeTag]);

  return (
   <div className="absolute inset-0 bg-cyan-500/5 blur-3xl pointer-events-none">
      {/* Top Nav */}
      <header className="sticky top-0 z-50 backdrop-blur bg-black/60 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#" className="font-semibold tracking-tight">
            Arman<span className="text-cyan-400">Dev</span>
            <span className="ml-2 text-xs text-white/40 font-normal">
              M365 • Intune • Automation
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-6 text-sm text-white/70">
            <a className="hover:text-white" href="#content">
              Content
            </a>
            <a className="hover:text-white" href="#resources">
              Resources
            </a>
            <a className="hover:text-white" href="#about">
              About
            </a>
            <a className="hover:text-white" href="#contact">
              Contact
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex border border-white/15 hover:border-white/30 bg-white/5 px-3 py-2 rounded-xl text-sm"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex border border-white/15 hover:border-white/30 bg-white/5 px-3 py-2 rounded-xl text-sm"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="flex items-center gap-4 mb-8">
  <img
    src={logo}
    alt="ArmanDev Logo"
    className="w-16 h-16 rounded-2xl border border-white/10 bg-white/5 p-1"
  />

  <div>
    <div className="text-2xl font-bold tracking-tight">
      Arman<span className="text-cyan-400">Dev</span>
    </div>

    <div className="text-sm text-white/50">
      Modern Workplace Engineering
    </div>
  </div>
</div>
      <section className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
          
          <div>
            <div className="inline-flex items-center gap-2 text-cyan-300 text-sm border border-cyan-500/25 bg-cyan-500/5 px-4 py-1 rounded-full mb-6">
              Modern Workplace • Cloud • Endpoint Engineering
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold leading-tight">
              Documentation built for{" "}
              <span className="text-cyan-400">enterprise reality</span>
            </h1>

            <p className="text-white/70 mt-6 text-lg leading-relaxed">
              I document real-world Microsoft 365 issues and the fixes that work
              at scale: Intune, Autopilot, Entra ID, Graph automation, MDE,
              Power BI reporting, and operational runbooks.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#content"
                className="bg-cyan-400 hover:bg-cyan-300 text-black px-6 py-3 rounded-xl font-medium"
              >
                Browse Documentation
              </a>
              <a
                href="#resources"
                className="border border-white/20 hover:border-white/35 bg-white/5 px-6 py-3 rounded-xl"
              >
                View Resources
              </a>
            </div>

            {/* Quick stats */}
            <div className="mt-10 grid grid-cols-3 gap-4 text-sm">
              <div className="p-4 rounded-2xl border border-white/10 bg-white/5">
                <div className="text-white/40">Focus</div>
                <div className="mt-1 font-medium">Intune & Automation</div>
              </div>
              <div className="p-4 rounded-2xl border border-white/10 bg-white/5">
                <div className="text-white/40">Outputs</div>
                <div className="mt-1 font-medium">Scripts + Runbooks</div>
              </div>
              <div className="p-4 rounded-2xl border border-white/10 bg-white/5">
                <div className="text-white/40">Style</div>
                <div className="mt-1 font-medium">Problem → Fix</div>
              </div>
            </div>
          </div>

          {/* Right rail */}
          <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
            <h2 className="text-xl font-semibold mb-4 text-cyan-300">
              Current Focus
            </h2>

            <div className="space-y-3 text-white/70">
              {[
                "Intune remediation at scale (health + compliance)",
                "Firmware + BIOS update automation (Lenovo/HP patterns)",
                "Secure Boot certificate rollout monitoring & reporting",
                "Graph exports to SharePoint + Power BI ingestion pipelines",
              ].map((x) => (
                <div
                  key={x}
                  className="p-4 bg-zinc-900/70 backdrop-blur-sm rounded-xl border border-white/10"
                >
                  {x}
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-2xl border border-cyan-500/20 bg-cyan-500/5">
              <div className="text-sm text-cyan-200 font-medium">
                Tip for readers
              </div>
              <div className="mt-1 text-sm text-white/70">
                Each entry includes: symptoms, root cause, fix, validation, and
                rollback guidance where applicable.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resources */}
      <section id="resources" className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between gap-6 mb-8">
          <div>
            <h2 className="text-3xl font-bold">Resources</h2>
            <p className="text-white/60 mt-2">
              Organized for fast lookup: documentation, scripts, reports, and
              project playbooks.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {resourceTiles.map((t) => (
            <a
              key={t.title}
              href={t.href}
              className="group border border-white/10 bg-white/5 p-6 rounded-2xl hover:border-cyan-400/40 transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold">{t.title}</h3>
                  <p className="text-white/60 mt-2 leading-relaxed">{t.desc}</p>
                </div>
                <div className="text-xs text-white/50 border border-white/10 bg-black/30 px-3 py-1 rounded-full">
                  {t.meta}
                </div>
              </div>
              <div className="mt-4 text-sm text-cyan-300 group-hover:text-cyan-200">
                Explore →
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Content Section */}
      <section id="content" className="border-t border-white/10 bg-white/5">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
            <div>
              <h2 className="text-3xl font-bold">Latest Documentation</h2>
              <p className="text-white/60 mt-2">
                Search and filter across troubleshooting notes, scripts, reports,
                and project playbooks.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search: error code, product, tag, vendor..."
                className="w-full sm:w-96 bg-black/40 border border-white/10 focus:border-cyan-400/40 outline-none rounded-xl px-4 py-3 text-sm"
              />
            </div>
          </div>

          {/* Tag filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            {allTags.map((t) => {
              const active = t === activeTag;
              return (
                <button
                  key={t}
                  onClick={() => setActiveTag(t)}
                  className={[
                    "text-sm px-3 py-2 rounded-xl border transition",
                    active
                      ? "border-cyan-400/50 bg-cyan-500/10 text-cyan-200"
                      : "border-white/10 bg-zinc-900/70 backdrop-blur-sm text-white/70 hover:border-white/25",
                  ].join(" ")}
                >
                  {t}
                </button>
              );
            })}
          </div>

          {/* Entry cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {filtered.map((e) => (
              <a
                key={e.title}
                href={e.href}
                className="border border-white/10 bg-black/20 p-6 rounded-2xl hover:border-cyan-400/40 transition"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="text-xs text-white/50 uppercase tracking-wide">
                    {e.type}
                  </div>
                  <div className="text-xs text-white/40">{e.date}</div>
                </div>

                <h3 className="text-xl font-semibold mt-3">{e.title}</h3>
                <p className="text-white/60 mt-2 leading-relaxed">{e.summary}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {e.tags.map((t) => (
                    <span
                      key={t}
                      className="text-xs text-white/70 border border-white/10 bg-white/5 px-2.5 py-1 rounded-full"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-5 text-sm text-cyan-300">Read →</div>
              </a>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="mt-10 text-white/60">
              No results. Try a different keyword or tag.
            </div>
          )}
        </div>
      </section>

      {/* About */}
      <section id="about" className="border-t border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl font-bold mb-6">About ArmanDev</h2>
          <p className="text-white/70 leading-relaxed">
            ArmanDev is my engineering notebook for Microsoft 365 and endpoint
            operations. I publish solutions that stand up in enterprise
            environments: repeatable automation, deployment patterns, reporting
            pipelines, and troubleshooting guides that save time and reduce risk.
          </p>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="border-t border-white/10 bg-white/5">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h2 className="text-2xl font-bold">Contact</h2>
          <p className="text-white/60 mt-2">
            Want to collaborate or suggest a topic? Reach out.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              className="border border-white/15 hover:border-white/30 bg-black/30 px-5 py-3 rounded-xl text-sm"
              href="mailto:you@domain.com"
            >
              apacheco@armandev.tech
            </a>
            <a
              className="border border-white/15 hover:border-white/30 bg-black/30 px-5 py-3 rounded-xl text-sm"
              href="https://github.com/"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
            <a
              className="border border-white/15 hover:border-white/30 bg-black/30 px-5 py-3 rounded-xl text-sm"
              href="https://www.linkedin.com"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-10 text-white/40 text-sm border-t border-white/10">
        © 2026 ArmanDev — Built for operational clarity and scalable automation
      </footer>
    </div>
  );
}
