export default function App() {
  const featuredPosts = [
    {
      title: "Microsoft Intune Automation",
      description:
        "Scripts, deployment strategies, and endpoint management workflows for modern enterprises.",
      tag: "Intune",
    },
    {
      title: "Autopilot & Endpoint Security",
      description:
        "Real-world configuration examples, compliance policies, and troubleshooting notes.",
      tag: "Security",
    },
    {
      title: "Cloud Administration Journey",
      description:
        "Projects, lessons learned, certifications, and career growth in Microsoft 365 and Azure.",
      tag: "Career",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* HERO */}
      <section className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
          <div className="flex items-center gap-3 mb-6">
  <img
    src="/logo.png"
    alt="ArmanDev Logo"
    className="w-10 h-10 rounded-xl border border-white/10"
  />
  <div className="text-left">
    <div className="text-white font-semibold">ArmanDev</div>
    <div className="text-cyan-300 text-xs">Cloud • Intune • M365</div>
  </div>
</div>
          <div>
            <div className="inline-block text-cyan-300 text-sm border border-cyan-500/30 px-4 py-1 rounded-full mb-6">
              Modern Workplace • Cloud • Endpoint Engineering
            </div>

            <h1 className="text-6xl font-bold">
              Arman<span className="text-cyan-400">Dev</span>
            </h1>

            <p className="text-white/70 mt-6 text-lg">
              Building secure, scalable Microsoft 365 environments and sharing real-world IT automation,
              Intune setups, and cloud engineering projects.
            </p>

            <div className="mt-8 flex gap-4">
              <a
                href="#content"
                className="bg-cyan-400 text-black px-6 py-3 rounded-xl font-medium"
              >
                Explore Content
              </a>

              <a
                href="https://www.linkedin.com"
                target="_blank"
                className="border border-white/20 px-6 py-3 rounded-xl"
              >
                LinkedIn
              </a>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
            <h2 className="text-xl font-semibold mb-4 text-cyan-300">
              Current Focus
            </h2>

            <div className="space-y-4 text-white/70">
              <div className="p-4 bg-black/40 rounded-xl border border-white/10">
                Intune & Endpoint Management
              </div>
              <div className="p-4 bg-black/40 rounded-xl border border-white/10">
                Autopilot Deployment Automation
              </div>
              <div className="p-4 bg-black/40 rounded-xl border border-white/10">
                Microsoft 365 Security & Compliance
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section id="content" className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-bold mb-10">Featured Topics</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {featuredPosts.map((post) => (
            <div
              key={post.title}
              className="border border-white/10 bg-white/5 p-6 rounded-2xl hover:border-cyan-400/40"
            >
              <div className="text-cyan-300 text-sm mb-3">{post.tag}</div>
              <h3 className="text-xl font-semibold mb-3">{post.title}</h3>
              <p className="text-white/60">{post.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section className="border-t border-white/10 bg-white/5">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl font-bold mb-6">About ArmanDev</h2>

          <p className="text-white/70 leading-relaxed">
            ArmanDev is a personal IT engineering platform focused on Microsoft 365, Intune,
            endpoint automation, and cloud infrastructure. This site documents real-world
            projects, scripts, and professional growth toward cloud architecture.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-10 text-white/40 text-sm">
        © 2026 ArmanDev — Built for cloud engineering growth
      </footer>
    </div>
  );
}