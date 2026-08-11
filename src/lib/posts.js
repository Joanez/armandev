const modules = import.meta.glob("../contents/posts/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

export const NAV_GROUPS = [
  {
    title: "Solutions",
    items: [
      {
        name: "Intune",
        slug: "intune",
        description:
          "Endpoint management, compliance, Autopilot, remediation, and device operations.",
      },
      {
        name: "Entra ID",
        slug: "entra-id",
        description:
          "Identity, access, authentication, groups, Conditional Access, and Graph operations.",
      },
      {
        name: "Microsoft Teams",
        slug: "microsoft-teams",
        description:
          "Teams administration, collaboration settings, policies, and troubleshooting.",
      },
      {
        name: "Exchange Online",
        slug: "exchange-online",
        description:
          "Mail flow, mailbox administration, transport, and Exchange Online operations.",
      },
      {
        name: "Purview",
        slug: "purview",
        description:
          "Compliance, data governance, retention, auditing, and information protection.",
      },
      {
        name: "SharePoint",
        slug: "sharepoint",
        description:
          "SharePoint Online, document libraries, permissions, and automation patterns.",
      },
      {
        name: "Defender XDR",
        slug: "defender-xdr",
        description:
          "Security operations, incidents, hunting, XDR workflows, and investigation patterns.",
      },
      {
        name: "Microsoft Defender for Endpoint",
        slug: "mde",
        description:
          "Endpoint security, vulnerability management, device risk, and MDE operations.",
      },
    ],
  },
  {
    title: "Automation",
    items: [
      {
        name: "PowerShell",
        slug: "powershell",
        description:
          "Scripts, remediation logic, reporting automation, and admin tooling.",
      },
      {
        name: "Graph API",
        slug: "graph-api",
        description:
          "Microsoft Graph exports, app permissions, automation, and reporting pipelines.",
      },
      {
        name: "Azure Automation",
        slug: "azure-automation",
        description:
          "Runbooks, managed identities, scheduled jobs, and cloud automation.",
      },
      {
        name: "Power BI",
        slug: "power-bi",
        description:
          "Dashboards, Power Query, DAX, compliance reporting, and operational analytics.",
      },
    ],
  },
];

export const ALL_CATEGORIES = NAV_GROUPS.flatMap((group) =>
  group.items.map((item) => ({
    ...item,
    group: group.title,
  }))
);

function filenameToSlug(path) {
  const file = path.split("/").pop() || "";
  return file.replace(/\.md$/, "");
}

function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\+/g, "plus")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function cleanValue(value) {
  return String(value || "")
    .trim()
    .replace(/^["']|["']$/g, "");
}

function parseInlineArray(value) {
  const cleaned = cleanValue(value);

  if (!cleaned.startsWith("[") || !cleaned.endsWith("]")) {
    return null;
  }

  return cleaned
    .slice(1, -1)
    .split(",")
    .map((item) => cleanValue(item))
    .filter(Boolean);
}

function ensureArray(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  return [value];
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

    const inlineArray = parseInlineArray(rawValue);

    data[key] = inlineArray || cleanValue(rawValue);
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

function buildPost(path, raw) {
  const { data, content } = parseFrontMatter(raw);
  const slug = data.slug || filenameToSlug(path);

  const category = data.category || "";
  const tags = ensureArray(data.tags);
  const products = ensureArray(data.products);

  return {
    slug,
    content,
    title: data.title || slug,
    date: data.date || "",
    type: data.type || "Documentation",
    category,
    categorySlug: slugify(category),
    summary: data.summary || data.description || getFallbackSummary(content),
    tags,
    tagSlugs: tags.map(slugify),
    products,
    productSlugs: products.map(slugify),
    errorCodes: ensureArray(data.errorCodes),
  };
}

export function getAllPosts() {
  const posts = Object.entries(modules).map(([path, raw]) =>
    buildPost(path, raw)
  );

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug) {
  return getAllPosts().find((post) => post.slug === slug);
}

export function getCategoryBySlug(slug) {
  return ALL_CATEGORIES.find((category) => category.slug === slug);
}

export function getPostsByCategorySlug(slug) {
  return getAllPosts().filter((post) => {
    return (
      post.categorySlug === slug ||
      post.productSlugs.includes(slug) ||
      post.tagSlugs.includes(slug)
    );
  });
}

export function getFeaturedCategories() {
  return ALL_CATEGORIES;
}