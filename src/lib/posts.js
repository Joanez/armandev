// Pull all markdown files at build time as raw text.
// Important: ?raw must be in the glob path so Vite does not parse .md as JS.
const modules = import.meta.glob("../contents/posts/*.md?raw", {
  import: "default",
  eager: true,
});

function filenameToSlug(path) {
  const file = path.split("/").pop() || "";
  return file.replace(/\.md\?raw$/, "").replace(/\.md$/, "");
}

function parseFrontMatter(raw) {
  if (!raw || typeof raw !== "string") {
    return {
      data: {},
      content: "",
    };
  }

  if (!raw.startsWith("---")) {
    return {
      data: {},
      content: raw,
    };
  }

  const endIndex = raw.indexOf("\n---", 3);

  if (endIndex === -1) {
    return {
      data: {},
      content: raw,
    };
  }

  const frontMatter = raw.slice(3, endIndex).trim();
  const content = raw.slice(endIndex + 4).trim();

  const data = {};
  const lines = frontMatter.split("\n");

  let currentKey = null;

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) continue;

    // Handles arrays like:
    // tags:
    //   - MDE
    if (trimmed.startsWith("- ") && currentKey) {
      if (!Array.isArray(data[currentKey])) {
        data[currentKey] = [];
      }

      data[currentKey].push(
        trimmed.slice(2).trim().replace(/^["']|["']$/g, "")
      );

      continue;
    }

    const separatorIndex = trimmed.indexOf(":");

    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    currentKey = key;

    if (value === "") {
      data[key] = [];
      continue;
    }

    value = value.replace(/^["']|["']$/g, "");

    data[key] = value;
  }

  return {
    data,
    content,
  };
}

export function getAllPosts() {
  const posts = Object.entries(modules).map(([path, raw]) => {
    const { data, content } = parseFrontMatter(raw);
    const slug = data.slug || filenameToSlug(path);

    return {
      slug,
      content,
      title: data.title || "Untitled",
      date: data.date || "",
      type: data.type || "Documentation",
      summary: data.summary || "",
      tags: Array.isArray(data.tags) ? data.tags : [],
      products: Array.isArray(data.products) ? data.products : [],
      errorCodes: Array.isArray(data.errorCodes) ? data.errorCodes : [],
    };
  });

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug) {
  return getAllPosts().find((p) => p.slug === slug);
}