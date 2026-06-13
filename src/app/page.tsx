import Image from "next/image";
import { portfolio, type Project } from "@/lib/portfolio";
import { site } from "@/lib/site";
import { getSiteUrl } from "@/lib/site-url";

function StructuredData() {
  const siteUrl = getSiteUrl().toString();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.handle,
    alternateName: portfolio.identity.handle,
    url: siteUrl,
    sameAs: [site.profileUrl],
    description: site.description,
    knowsAbout: ["AI systems", "agent workflows", "product engineering", "source code analysis"],
    workExample: portfolio.projects.map((project) => ({
      "@type": "CreativeWork",
      name: project.name,
      description: project.summary,
      url: project.links[0]?.href,
      keywords: project.stack.join(", "),
    })),
    subjectOf: {
      "@type": "CreativeWork",
      name: "personalweb",
      url: site.repositoryUrl,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}

function AIFocusVisual() {
  return (
    <div className="project-visual asset-visual">
      <Image
        src="/projects/aifocus-signal.png"
        alt="AIFocus 从 AI 信源到日报和 Agent Skill 的处理链路图"
        width={1280}
        height={760}
        sizes="(min-width: 1024px) 42vw, 92vw"
        priority
      />
    </div>
  );
}

function CodePathVisual() {
  return (
    <div className="project-visual asset-visual screenshot-visual">
      <Image
        src="/projects/codepath-browser.png"
        alt="CodePath 在 GitHub 页面侧边栏中分析源码的截图"
        width={1434}
        height={1308}
        sizes="(min-width: 1024px) 42vw, 92vw"
        priority
      />
    </div>
  );
}

function ProjectArticle({ project }: { project: Project }) {
  const isAIFocus = project.name === "AIFocus";

  return (
    <article className="project-card">
      {isAIFocus ? <AIFocusVisual /> : <CodePathVisual />}
      <div className="project-copy">
        <p className="section-kicker">{project.role}</p>
        <h3>{project.name}</h3>
        <p>{project.summary}</p>
        <ul>
          {project.evidence.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className="stack-list" aria-label={`${project.name} 技术栈`}>
          {project.stack.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        {project.links.map((link) => (
          <a className="text-link" href={link.href} key={link.href}>
            {link.label}
          </a>
        ))}
      </div>
    </article>
  );
}

export default function Home() {
  return (
    <main>
      <StructuredData />
      <section className="hero-section">
        <div className="hero-media" aria-hidden="true">
          <Image
            src="/projects/hero-workbench.png"
            alt=""
            fill
            priority
            sizes="100vw"
          />
        </div>
        <nav className="top-nav" aria-label="主导航">
          <a href="#projects">Projects</a>
          <a href="#method">Method</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="hero-content">
          <p className="eyebrow">Personal site / AI systems / Product craft</p>
          <h1>{portfolio.identity.handle}</h1>
          <p className="hero-summary">{portfolio.identity.description}</p>
          <div className="proof-row" aria-label="关键证据">
            {portfolio.heroProofPoints.map((point) => (
              <span key={point}>{point}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="projects-section" id="projects">
        <div className="section-shell">
          <div className="section-heading">
            <p className="section-kicker">Selected systems</p>
            <h2>不是作品列表，是两个已经长出工作流的系统。</h2>
          </div>
          <div className="project-grid">
            {portfolio.projects.map((project) => (
              <ProjectArticle project={project} key={project.name} />
            ))}
          </div>
        </div>
      </section>

      <section className="evidence-section" aria-labelledby="evidence-heading">
        <div className="section-shell evidence-layout">
          <div>
            <p className="section-kicker">Evidence chain</p>
            <h2 id="evidence-heading">每个项目都要能说清楚输入、处理和输出。</h2>
          </div>
          <ul className="evidence-list">
            {portfolio.evidenceChains.map((chain) => (
              <li key={chain.label}>
                <span>{chain.label}</span>
                <div>
                  <h3>{chain.title}</h3>
                  <p>{chain.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="method-section" id="method">
        <div className="section-shell method-layout">
          <div>
            <p className="section-kicker">Operating style</p>
            <h2>{portfolio.identity.tagline}</h2>
          </div>
          <ol className="method-list">
            {portfolio.workingStyle.map((item, index) => (
              <li key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{item}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="section-shell contact-layout">
          <p className="section-kicker">Next build</p>
          <h2>接下来会把这个站点继续打磨到能经受截图、代码和多角色评审。</h2>
          <div className="contact-actions">
            <a href={site.profileUrl}>GitHub</a>
            <a href={site.repositoryUrl}>personalweb repo</a>
          </div>
        </div>
      </section>
    </main>
  );
}
