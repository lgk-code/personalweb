import Link from "next/link";
import { site } from "@/lib/site";

export default function NotFound() {
  return (
    <main className="not-found-page">
      <section className="not-found-content">
        <p className="section-kicker">404 / Unmapped route</p>
        <h1>这条路径还没被构建出来。</h1>
        <p>
          先回到首页看 AIFocus、CodePath 和当前个人网站的构建证据；错误链接可以从仓库继续追踪。
        </p>
        <div className="not-found-actions">
          <Link href="/">Back home</Link>
          <a href={site.repositoryUrl}>Repository</a>
        </div>
      </section>
    </main>
  );
}
