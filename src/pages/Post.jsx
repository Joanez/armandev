import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getAllPosts } from "../lib/posts";

export default function Posts() {
  const posts = getAllPosts();
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("All");

  const allTags = useMemo(() => {
    const s = new Set();
    posts.forEach((p) => (p.tags || []).forEach((t) => s.add(t)));
    return ["All", ...Array.from(s).sort()];
  }, [posts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts
      .filter((p) => (tag === "All" ? true : (p.tags || []).includes(tag)))
      .filter((p) => {
        if (!q) return true;
        return (
          (p.title || "").toLowerCase().includes(q) ||
          (p.summary || "").toLowerCase().includes(q) ||
          (p.type || "").toLowerCase().includes(q) ||
          (p.tags || []).join(" ").toLowerCase().includes(q) ||
          (p.errorCodes || []).join(" ").toLowerCase().includes(q) ||
          (p.products || []).join(" ").toLowerCase().includes(q)
        );
      });
  }, [posts, query, tag]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold">Posts</h1>
          <p className="text-white/60 mt-2">
            Troubleshooting, scripts, reports, and project notes.
          </p>
        </div>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search: error code, product, tag..."
          className="w-full lg:w-96 bg-black/40 border border-white/10 focus:border-cyan-400/40 outline-none rounded-xl px-4 py-3 text-sm"
        />
      </div>

      <div className="flex flex-wrap gap-2 mt-6">
        {allTags.map((t) => {
          const active = t === tag;
          return (
            <button
              key={t}
              onClick={() => setTag(t)}
              className={[
                "text-sm px-3 py-2 rounded-xl border transition",
                active
                  ? "border-cyan-400/50 bg-cyan-500/10 text-cyan-200"
                  : "border-white/10 bg-black/20 text-white/70 hover:border-white/25",
              ].join(" ")}
            >
              {t}
            </button>
          );
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-10">
        {filtered.map((p) => (
          <Link
            key={p.slug}
            to={`/posts/${p.slug}`}
            className="block border border-white/10 bg-white/5 p-6 rounded-2xl hover:border-cyan-400/40"
          >
            <div className="flex items-center justify-between text-xs text-white/50">
              <span className="uppercase tracking-wide">{p.type}</span>
              <span>{p.date}</span>
            </div>
            <h2 className="text-xl font-semibold mt-3">{p.title}</h2>
            <p className="text-white/60 mt-2 leading-relaxed">{p.summary}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {(p.tags || []).map((t) => (
                <span
                  key={t}
                  className="text-xs text-white/70 border border-white/10 bg-white/5 px-2.5 py-1 rounded-full"
                >
                  {t}
                </span>
              ))}
              {(p.errorCodes || []).map((e) => (
                <span
                  key={e}
                  className="text-xs text-cyan-200 border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1 rounded-full"
                >
                  {e}
                </span>
              ))}
            </div>

            <div className="mt-5 text-sm text-cyan-300">Read →</div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-10 text-white/60">No results.</div>
      )}
    </div>
  );
}
