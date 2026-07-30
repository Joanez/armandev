const modules = import.meta.glob("../contents/posts/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

function filenameToSlug(path) {
  const file = path.split("/").pop() || "";
  return file.replace(/\.md$/, "");
}

function cleanValue(value) {
  return value.trim().replace(/^["']|["']$/g, "");
}

function parseFrontMatter(raw) {
  if (!raw || typeof raw !== "string") {
    return {
      data: {},
      content: "",
    };
  }

  const normalized = raw.replace(/^\uFEFF/, "");

  if (!normalized.startsWith("---")) {
    return {
      data: {},
      content: normalized,
    };
  }

  const endIndex = normalized.indexOf("\n---", 3);

  if (endIndex === -1) {
    return {
      data: {},
      content: normalized,
    };
  }

  const frontMatter = normalized.slice(3, endIndex).trim();
  const content = normalized.slice(endIndex + 4).trim();

  const data = {};
  const lines = frontMatter.split(/\r?\n/);

  let currentKey = null;

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) continue;

    if (trimmed.startsWith("- ") && currentKey) {
      if (!Array.isArray(data[currentKey])) {
        data[currentKey] = [];
      }

      data[currentKey].push(cleanValue(trimmed.slice(2)));
      continue;
    }

    const separatorIndex = trimmed.indexOf(":");

    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();

    currentKey = key;

    if (rawValue === "") {
      data[key] = [];
      continue;
    }

    data[key] = cleanValue(rawValue);
  }

  return {
    data,
    content,
  };
}

function getFallbackSummary(content) {
  return content
    .replace(/^# .+$/gm, "")
    .replace(/^## .+$/gm, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/\*\*/g, "")
    .trim()
    .split(/\s+/)
    .slice(0, 32)
    .join(" ");
}

export function getAllPosts() {
  const posts = Object.entries(modules).map(([path, raw]) => {
    const { data, content } = parseFrontMatter(raw);
    const slug = data.slug || filenameToSlug(path);

    return {
      slug,
      content,
      title: data.title || slug,
      date: data.date || "",
      type: data.type || "Documentation",
      summary: data.summary || data.description || getFallbackSummary(content),
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