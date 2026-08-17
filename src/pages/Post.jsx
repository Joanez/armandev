import { Link, useParams } from "react-router-dom";
import { getPostBySlug } from "../lib/posts";
import Navbar from "../components/Navbar";

function renderInlineMarkdown(text) {
  return renderInlineElements(text);
}

function renderInlineElements(text) {
  if (!text) return "";

  const base = import.meta.env.BASE_URL || "/";

  // Find image markdown tokens and split the text accordingly
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = imageRegex.exec(text)) !== null) {
    const idx = match.index;
    if (idx > lastIndex) {
      parts.push(text.slice(lastIndex, idx));
    }

    const alt = match[1] || "";
    let src = match[2] || "";
    if (src.startsWith("/")) {
      src = (base.replace(/\/$/, "") || "") + src;
    }

    parts.push({ type: "img", alt, src });
    lastIndex = idx + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  // Convert parts to React nodes, handling bold **text**
  const nodes = [];
  parts.forEach((part, i) => {
    if (typeof part === "string") {
      const boldParts = part.split(/(\*\*.*?\*\*)/g);
      boldParts.forEach((bp, j) => {
        if (bp.startsWith("**") && bp.endsWith("**")) {
          nodes.push(<strong key={`b-${i}-${j}`}>{bp.slice(2, -2)}</strong>);
        } else {
          nodes.push(bp);
        }
      });
    } else if (part.type === "img") {
      nodes.push(
        <img
          key={`img-${i}`}
          src={part.src}
          alt={part.alt}
          className="my-6 w-full rounded-lg border border-white/10"
        />
      );
    }
  });

  return nodes;
}

function MarkdownRenderer({ content }) {
  if (!content) {
    return null;
  }

  const lines = content.split(/\r?\n/);
  const elements = [];

  let listItems = [];
  let codeLines = [];
  let inCodeBlock = false;

  function flushList() {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="list-disc pl-6 my-4 space-y-2">
          {listItems.map((item, index) => (
            <li key={index}>{renderInlineMarkdown(item)}</li>
          ))}
        </ul>
      );

      listItems = [];
    }
  }

  function flushCodeBlock() {
    if (codeLines.length > 0) {
      elements.push(
        <pre
          key={`code-${elements.length}`}
          className="my-6 overflow-x-auto rounded-2xl border border-white/10 bg-black/50 p-4 text-sm text-cyan-100"
        >
          <code>{codeLines.join("\n")}</code>
        </pre>
      );

      codeLines = [];
    }
  }

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      if (inCodeBlock) {
        inCodeBlock = false;
        flushCodeBlock();
      } else {
        flushList();
        inCodeBlock = true;
      }

      return;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      return;
    }

    if (!trimmed) {
      flushList();
      return;
    }

    if (trimmed === "---") {
      flushList();

      elements.push(
        <hr key={`hr-${index}`} className="my-8 border-white/10" />
      );

      return;
    }

    if (trimmed.startsWith("# ")) {
      flushList();

      elements.push(
        <h1
          key={index}
          className="mt-10 mb-5 text-4xl font-bold leading-tight text-white"
        >
          {renderInlineMarkdown(trimmed.replace(/^# /, ""))}
        </h1>
      );

      return;
    }

    if (trimmed.startsWith("## ")) {
      flushList();

      elements.push(
        <h2
          key={index}
          className="mt-10 mb-4 text-2xl font-bold text-white"
        >
          {renderInlineMarkdown(trimmed.replace(/^## /, ""))}
        </h2>
      );

      return;
    }

    if (trimmed.startsWith("### ")) {
      flushList();

      elements.push(
        <h3
          key={index}
          className="mt-8 mb-3 text-xl font-semibold text-cyan-200"
        >
          {renderInlineMarkdown(trimmed.replace(/^### /, ""))}
        </h3>
      );

      return;
    }

    if (trimmed.startsWith("- ")) {
      listItems.push(trimmed.replace(/^- /, ""));
      return;
    }

    flushList();

    elements.push(
      <p key={index} className="my-4 leading-8 text-white/75">
        {renderInlineMarkdown(trimmed)}
      </p>
    );
  });

  flushList();
  flushCodeBlock();

  return <>{elements}</>;
}

export default function Post() {
  const { slug } = useParams();
  const post = getPostBySlug(slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white">
        <main className="max-w-3xl mx-auto px-6 py-16">
          <Link to={`/category/${post.categorySlug}`} className="text-cyan-300 hover:text-cyan-200">
            ← Back to {post.category}
          </Link>

          <h1 className="mt-10 text-4xl font-bold">Post not found</h1>

          <p className="mt-4 text-white/60">
            The article you are looking for does not exist or the slug does not
            match the Markdown file.
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="fixed inset-0 bg-cyan-500/5 blur-3xl pointer-events-none" />
<Navbar />
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-16">
        <Link to="/" className="text-cyan-300 hover:text-cyan-200">
          ← Back
        </Link>

        <article className="mt-14">
          <div className="text-sm text-white/40">
            {post.type || "Documentation"} • {post.date || "No date"}
          </div>

          <h1 className="mt-4 text-4xl sm:text-5xl font-bold leading-tight text-white">
            {post.title}
          </h1>

          {post.summary && (
            <p className="mt-6 text-lg leading-8 text-white/60">
              {post.summary}
            </p>
          )}

          <div className="mt-8 flex flex-wrap gap-2">
            {(post.tags || []).map((tag) => (
              <span
                key={tag}
                className="text-xs text-white/70 border border-white/10 bg-white/5 px-2.5 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}

            {(post.errorCodes || []).map((errorCode) => (
              <span
                key={errorCode}
                className="text-xs text-cyan-200 border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1 rounded-full"
              >
                {errorCode}
              </span>
            ))}
          </div>

          <div className="mt-12 border-t border-white/10 pt-10">
            <MarkdownRenderer content={post.content} />
          </div>
        </article>
      </main>
    </div>
  );
}