import matter from "gray-matter";

// Pull all markdown files at build time
const modules = import.meta.glob("../contents/posts/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

function filenameToSlug(path) {
  const file = path.split("/").pop() || "";
  return file.replace(/\.md$/, "");
}

export function getAllPosts() {
  const posts = Object.entries(modules).map(([path, raw]) => {
    const { data, content } = matter(raw);
    const slug = data.slug || filenameToSlug(path);

    return {
      slug,
      content,
      ...data,
      tags: data.tags || [],
      products: data.products || [],
      errorCodes: data.errorCodes || [],
    };
  });

  // newest first
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug) {
  return getAllPosts().find((p) => p.slug === slug);
}
