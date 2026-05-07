import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { getPostBySlug } from "../lib/posts";

export default function Post() {
  const { slug } = useParams();
  const post = getPostBySlug(slug);

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-white/70">Post not found.</p>
        <Link className="text-cyan-300" to="/posts">
          Back to posts
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <Link className="text-cyan-300 text-sm" to="/posts">
        ← Back
      </Link>

      <div className="mt-6 border border-white/10 bg-white/5 rounded-2xl p-6">
        <div className="flex items-center justify-between text-xs text-white/50">
          <span className="uppercase tracking-wide">{post.type}</span>
          <span>{post.date}</span>
        </div>

        <h1 className="text-3xl font-bold mt-3">{post.title}</h1>
        <p className="text-white/60 mt-3">{post.summary}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {(post.tags || []).map((t) => (
            <span
              key={t}
              className="text-xs text-white/70 border border-white/10 bg-white/5 px-2.5 py-1 rounded-full"
            >
              {t}
            </span>
          ))}
          {(post.errorCodes || []).map((e) => (
            <span
              key={e}
              className="text-xs text-cyan-200 border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1 rounded-full"
            >
              {e}
            </span>
          ))}
        </div>
      </div>

      <article className="prose prose-invert max-w-none mt-10">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
        >
          {post.content}
        </ReactMarkdown>
      </article>
    </div>
  );
}
