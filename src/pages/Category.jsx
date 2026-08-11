import { Link, useParams } from "react-router-dom";
import { getCategoryBySlug, getPostsByCategorySlug } from "../lib/posts";

export default function Category() {
  const { slug } = useParams();
  const category = getCategoryBySlug(slug);
  const posts = getPostsByCategorySlug(slug);

  if (!category) {
    return (
      <main className="min-h-screen bg-[#071112] text-white px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <Link to="/" className="text-cyan-300 hover:text-cyan-200">
            ← Back home
          </Link>

          <section className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-8">
            <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">
              Category
            </p>

            <h1 className="mt-3 text-4xl font-bold">
              Category not found
            </h1>

            <p className="mt-4 text-white/65">
              The category you are looking for does not exist or the URL does
              not match one of the configured documentation areas.
            </p>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#071112] text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <nav className="flex items-center justify-between gap-4">
          <Link to="/" className="text-2xl font-black tracking-tight">
            Arman<span className="text-cyan-400">Dev</span>
          </Link>

          <div className="flex items-center gap-4 text-sm">
            <Link to="/" className="text-white/70 hover:text-white">
              Home
            </Link>

            <Link to="/posts" className="text-white/70 hover:text-white">
              All Posts
            </Link>
          </div>
        </nav>

        <section className="mt-12 rounded-3xl border border-white/10 bg-white/[0.03] p-8">
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">
            {category.group}
          </p>

          <h1 className="mt-3 text-4xl md:text-6xl font-black">
            {category.name}
          </h1>

          <p className="mt-5 max-w-3xl text-white/65 text-lg leading-relaxed">
            {category.description}
          </p>

          <div className="mt-6 text-sm text-white/50">
            {posts.length} article{posts.length === 1 ? "" : "s"} found
          </div>
        </section>

        {posts.length > 0 && (
          <section className="mt-10 grid md:grid-cols-2 gap-5">
            {posts.map((post) => (
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
                </div>

                <div className="mt-6 text-cyan-300 text-sm font-semibold">
                  Read →
                </div>
              </Link>
            ))}
          </section>
        )}

        {posts.length === 0 && (
          <section className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-8">
            <h2 className="text-2xl font-bold">No articles yet</h2>

            <p className="mt-3 text-white/60">
              This category is ready for future documentation. Add a Markdown
              post with this category, product, or tag to make it appear here.
            </p>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-5">
              <p className="text-sm text-white/50">
                Example front matter:
              </p>

              <pre className="mt-3 overflow-x-auto rounded-xl bg-black/50 p-4 text-sm text-cyan-100">
{`---
title: Example documentation title
date: 2026-08-11
type: Documentation
category: ${category.name}
summary: Short description of the article.
tags:
  - PowerShell
  - Troubleshooting
products:
  - ${category.name}
---`}
              </pre>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}