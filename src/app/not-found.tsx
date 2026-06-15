import Link from "next/link";
import { site } from "@/lib/site";

export default function NotFound() {
  return (
    <main className="not-found-page">
      <section className="not-found-content">
        <p className="section-kicker">404 / Unmapped route</p>
        <h1>这条路径还没被构建出来。</h1>
        <p>
          先回到首页看 AIFocus、CodePath 和当前个人网站的构建证据；公开项目可以从 GitHub 继续追踪。
        </p>
        <dl className="route-motif" aria-label="路径状态">
          <div>
            <dt>Route</dt>
            <dd>unmapped</dd>
          </div>
          <div>
            <dt>Fallback</dt>
            <dd>system records</dd>
          </div>
          <div>
            <dt>Public trail</dt>
            <dd>GitHub / release</dd>
          </div>
        </dl>
        <div className="not-found-actions">
          <Link href="/">返回首页</Link>
          <a href={site.profileUrl}>GitHub</a>
        </div>
      </section>
    </main>
  );
}
