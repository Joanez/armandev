import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getAllPosts, getFeaturedCategories } from "../lib/posts";

export default function Posts() {
  const posts = getAllPosts();
  const categories = getFeaturedCategories();

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");

  const allFilters = useMemo(() => {
    const filters = new Set();

    posts.forEach((post) => {
      if (post.category) filters.add(post.category);

      (post.products || []).forEach((product) => {
        filters.add(product);
      });

      (post.tags || []).forEach((tag) => {
        filters.add(tag);
      });
    });

    return ["All", ...Array.from(filters).sort()];
  }, [posts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return posts
      .filter((post) => {
        if (filter === "All") return true;

        return (
          post.category === filter ||
          (post.products || []).includes(filter) ||
          (post.tags || []).includes(filter)
        );
      })
      .filter((post) => {
        if (!q) return true;

        return (
          (post.title || "").toLowerCase().includes(q) ||
          (post.summary || "").toLowerCase().includes(q) ||
          (post.type || "").toLowerCase().includes(q) ||
          (post.category || "").toLowerCase().includes(q) ||
          (post.tags || []).join(" ").toLowerCase().includes(q) ||
          (post.errorCodes || []).join(" ").toLowerCase().includes(q) ||
          (post.products || []).join(" ").toLowerCase().includes(q)
        );
      });
  }, [posts, query, filter]);

  return (
    <main className="min-h-screen bg-[#071112] text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <nav className="flex items-center justify-between gap-4">
          <Link to="/" className="text-2xl font-black tracking-tight">
            Arman<span className="text-cyan-400">Dev</span>
          </Link>

          <Link to="/" className="text-sm text-white/70 hover:text-white">
            Home
          </Link>
        </nav>

        <section className="mt-12">
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">
            Documentation Library
          </p>

          <h1 className="mt-3 text-5xl font-black">
            All Posts
          </h1>

          <p className="mt-4 text-white/60 max-w-3xl">
            Troubleshooting notes, scripts, reports, and project documentation
            organized by Microsoft 365 solution, automation area, product, and
            tag.
          </p>
        </section>

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="text-lg font-bold">
            Browse by area
          </h2>

          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((category) => (
              <Link
                key={category.slug}
                to={`/category/${category.slug}`}
                className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm text-white/70 hover:border-cyan-400/40 hover:text-cyan-200 transition"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-8 flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search: product, tag, error code, keyword..."
            className="w-full lg:w-96 bg-black/40 border border-white/10 focus:border-cyan-400/40 outline-none rounded-xl px-4 py-3 text-sm"
          />

          <div className="flex flex-wrap gap-2">
            {allFilters.map((item) => {
              const active = item === filter;

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  className={[
                    "text-sm px-3 py-2 rounded-xl border transition",
                    active
                      ? "border-cyan-400/50 bg-cyan-500/10 text-cyan-200"
                      : "border-white/10 bg-black/20 text-white/70 hover:border-white/25",
                  ].join(" ")}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-8 grid md:grid-cols-2 gap-5">
          {filtered.map((post) => (
            <Link
              key={post.slug}
              to={`/post/${post.slug}`}
              className="group rounded-3xl border border-white/10 bg-zinc-950/50 p-6 hover:border-cyan-400/40 transition"
            >
              <div className="flex items-center justify-between gap-4 text-xs text-white/45">
                <span>{post.type || "Documentation"}</span>
                <span>{post.date || ""}</span>
              </div>

              <h2 className="mt-4 text-2xl font-bold group-hover:text-cyan-300 transition">
                {post.title}
              </h2>

              <p className="mt-3 text-white/60 leading-relaxed">
                {post.summary}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {post.category && (
                  <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-200">
                    {post.category}
                  </span>
                )}

                {(post.products || []).map((product) => (
                  <span
                    key={product}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/60"
                  >
                    {product}
                  </span>
                ))}

                {(post.tags || []).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/60"
                  >
                    {tag}
                  </span>
                ))}

                {(post.errorCodes || []).map((errorCode) => (
                  <span
                    key={errorCode}
                    className="rounded-full border border-amber-400/25 bg-amber-500/10 px-3 py-1 text-xs text-amber-200"
                  >
                    {errorCode}
                  </span>
                ))}
              </div>

              <div className="mt-6 text-cyan-300 text-sm font-semibold">
                Read →
              </div>
            </Link>
          ))}
        </section>

        {filtered.length === 0 && (
          <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-white/60">
            No results.
          </div>
        )}
      </div>
    </main>
  );
}