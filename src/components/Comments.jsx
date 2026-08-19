import { useEffect, useRef } from "react";

export default function Comments(slug) {
  const commentsRef = useRef(null);

  useEffect(() => {
    if (!commentsRef.current) return;

    commentsRef.current.innerHTML = "";

    const script = document.createElement("script");

    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";

    script.setAttribute("data-repo", "joanez/armandev");
    script.setAttribute("data-repo-id", "R_kgDOSQJAxA");
    script.setAttribute("data-category", "General");
    script.setAttribute("data-category-id", "DIC_kwDOSQJAxM4DDuOI");
    script.setAttribute("data-mapping", "specific");
    script.setAttribute("data-term", slug.slug);
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "bottom");
    script.setAttribute("data-theme", "dark");
    script.setAttribute("data-lang", "en");

    commentsRef.current.appendChild(script);
  }, []);

  return (
    <section className="mt-16 border-t border-white/10 pt-10">
      <h2 className="mb-4 text-2xl font-bold text-white">Comments</h2>

      <p className="mb-6 text-white/60">
        Have a question or suggestion? Leave a comment below.
      </p>

      <div ref={commentsRef}></div>
    </section>
  );
}