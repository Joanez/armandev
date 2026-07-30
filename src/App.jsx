import { useMemo, useState } from "react";
import logo from "./assets/logo.png";
import { getAllPosts } from "./lib/posts";

export default function App() {
  const entries = getAllPosts()
    .filter((p) => p.title && p.summary && p.date)
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

    entries.forEach((entry) => {
      (entry.tags || []).forEach((tag) => t.add(tag));
    });

    return ["All", ...Array.from(t).sort()];
  }, [entries]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return entries
      .filter((entry) =>
        activeTag === "All" ? true : (entry.tags || []).includes(activeTag)
      )
      .filter((entry) => {
        if (!q) return true;

        return (
          (entry.title || "").toLowerCase().includes(q) ||
          (entry.summary || "").toLowerCase().includes(q) ||
          (entry.type || "").toLowerCase().includes(q) ||
          (entry.tags || []).join(" ").toLowerCase().includes(q) ||
          (entry.errorCodes || []).join(" ").toLowerCase().includes(q) ||
          (entry.products || []).join(" ").toLowerCase().includes(q)
        );
      })
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [entries, query, activeTag]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="fixed inset-0 bg-cyan-500/5 blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* Top Nav */}
        <header className="sticky top-0 z-50 backdrop-blur bg-black/60 border-b border-white/10">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold tracking-tight">
                Arman<span className="text-cyan-400">Dev</span>
              </span>
              <span className="ml-2 text-xs text-white/40 font-normal">
                M365 • Intune • Automation
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-6 text-sm text-white/70">
              <a href="#content" className="hover:text-white">
                Content
              </a>
              <a href="#resources" className="hover:text-white">
                Resources
              </a>
              <a href="#about" className="hover:text-white">
                About
              </a>
              <a href="#contact" className="hover:text-white">
                Contact
              </a>
            </nav>

            <div className="flex items-center gap-3">
              <a
                href="https://github.com/Joanez/armandev"
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex border border-white/15 hover:border-white/30 bg-white/5 px-3 py-2 rounded-xl text-sm"
              >
                GitHub
              </a>

              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex border border-white/15 hover:border-white/30 bg-white/5 px-3 py-2 rounded-xl text-sm"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="border-b border-white/10">
          <div className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-4 mb-8">
                <img src={logo} alt="ArmanDev logo" className="h-12 w-12" />

                <div>
                  <div className="text-2xl font-bold tracking-tight">
                    Arman<span className="text-cyan-400">Dev</span>
                  </div>

                  <div className="text-sm text-white/50">
                    Modern Workplace Engineering
                  </div>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 text-cyan-300 text-sm border border-cyan-500/25 bg-cyan-500/5 px-4 py-1 rounded-full mb-6">
                Modern Workplace • Cloud • Endpoint Engineering
              </div>

              <h1 className="text-5xl sm:text-6xl font-bold leading-tight">
                Documentation built for{" "}
                <span className="text-cyan-400">enterprise reality</span>
              </h1>

              <p className="text-white/70 mt-6 text-lg leading-relaxed">
                I document real-world Microsoft 365 issues and the fixes that
                work at scale: Intune, Autopilot, Entra ID, Graph automation,
                MDE, Power BI reporting, and operational runbooks.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#content"
                  className="inline-flex items-center justify-center rounded-xl bg-cyan-500 px-5 py-3 text-sm font-medium text-black transition hover:bg-cyan-400"
                >
                  Browse Documentation
                </a>

                <a
                  href="#resources"
                  className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white transition hover:border-white/30"
                >
                  View Resources
                </a>
              </div>

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
                ].map((item) => (
                  <div
                    key={item}
                    className="p-4 bg-zinc-900/70 backdrop-blur-sm rounded-xl border border-white/10"
                  >
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-2xl border border-cyan-500/20 bg-cyan-500/5">
                <div className="text-sm text-cyan-200 font-medium">
                  Tip for readers
                </div>
                <div className="mt-1 text-sm text-white/70">
                  Each entry includes: symptoms, root cause, fix, validation,
                  and rollback guidance where applicable.
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
            {resourceTiles.map((tile) => (
              <a
                key={tile.title}
                href={tile.href}
                className="group block rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-cyan-400/40"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold">{tile.title}</h3>
                    <p className="text-white/60 mt-2 leading-relaxed">
                      {tile.desc}
                    </p>
                  </div>

                  <div className="text-xs text-white/50 border border-white/10 bg-black/30 px-3 py-1 rounded-full">
                    {tile.meta}
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
                  Search and filter across troubleshooting notes, scripts,
                  reports, and project playbooks.
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
              {allTags.map((tag) => {
                const active = tag === activeTag;

                return (
                  <button
                    key={tag}
                    onClick={() => setActiveTag(tag)}
                    className={[
                      "text-sm px-3 py-2 rounded-xl border transition",
                      active
                        ? "border-cyan-400/50 bg-cyan-500/10 text-cyan-200"
                        : "border-white/10 bg-zinc-900/70 backdrop-blur-sm text-white/70 hover:border-white/25",
                    ].join(" ")}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>

            {/* Entry cards */}
            <div className="grid md:grid-cols-2 gap-6">
              {filtered.map((entry) => (
                <a
                  key={entry.slug || entry.title}
                  href={`/posts/${entry.slug}`}
                  className="block rounded-3xl border border-white/10 bg-zinc-950/70 p-6 transition hover:border-cyan-400/40"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-xs text-white/50 uppercase tracking-wide">
                      {entry.type || "Documentation"}
                    </div>

                    <div className="text-xs text-white/40">
                      {entry.date || ""}
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold mt-3">
                    {entry.title || "Untitled"}
                  </h3>

                  <p className="text-white/60 mt-2 leading-relaxed">
                    {entry.summary || ""}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {(entry.tags || []).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs text-white/70 border border-white/10 bg-white/5 px-2.5 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}

                    {(entry.errorCodes || []).map((errorCode) => (
                      <span
                        key={errorCode}
                        className="text-xs text-cyan-200 border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1 rounded-full"
                      >
                        {errorCode}
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
              environments: repeatable automation, deployment patterns,
              reporting pipelines, and troubleshooting guides that save time and
              reduce risk.
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
                href="mailto:apacheco@armandev.tech"
              >
                apacheco@armandev.tech
              </a>

              <a
                href="https://github.com/Joanez/armandev"
                target="_blank"
                rel="noreferrer noopener"
                className="border border-white/15 hover:border-white/30 bg-black/30 px-5 py-3 rounded-xl text-sm"
              >
                GitHub
              </a>

              <a
                className="border border-white/15 hover:border-white/30 bg-black/30 px-5 py-3 rounded-xl text-sm"
                href="https://www.linkedin.com"
                target="_blank"
                rel="noreferrer noopener"
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
    </div>
  );
}