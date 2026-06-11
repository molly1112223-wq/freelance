"use client";

import { ArrowRight, Bot, Bookmark, Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { inspirationCategories, inspirationItems } from "@/lib/inspiration-data";

export function InspirationFeed() {
  const [activeCategory, setActiveCategory] = useState("精选");
  const [query, setQuery] = useState("");

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return inspirationItems.filter((item) => {
      const matchesCategory = activeCategory === "精选" || item.category === activeCategory;
      const matchesQuery =
        !normalized ||
        [item.title, item.subtitle, item.category, item.author, item.role, ...item.tags]
          .join(" ")
          .toLowerCase()
          .includes(normalized);
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  const featured = filteredItems[0] ?? inspirationItems[0];
  const restItems = filteredItems.slice(1);

  return (
    <div className="inspiration-page">
      <section className="inspiration-hero">
        <div className="inspiration-hero-copy">
          <span className="inspiration-kicker">
            <Sparkles size={16} />
            灵感广场
          </span>
          <h1>像刷作品一样，找到下一个可执行的项目想法。</h1>
          <p>
            这里不是单纯的需求列表，而是把案例、人才、预算和执行建议放在一起。你可以先找灵感，再一键整理成可发布的 brief。
          </p>
          <div className="inspiration-search">
            <Search size={18} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索品牌、UI、AI 工作流或小程序" />
          </div>
        </div>
        <Link href="/projects#publish" className="inspiration-ai-panel">
          <div className="ai-panel-icon">
            <Bot size={24} />
          </div>
          <div>
            <span>AI Brief Assistant</span>
            <h2>把一句想法整理成需求草稿</h2>
            <p>{featured.briefPrompt}</p>
          </div>
          <ArrowRight size={20} />
        </Link>
      </section>

      <div className="inspiration-tabs" aria-label="灵感分类">
        {inspirationCategories.map((category) => (
          <button className={activeCategory === category ? "active" : ""} key={category} onClick={() => setActiveCategory(category)} type="button">
            {category}
          </button>
        ))}
      </div>

      <section className="inspiration-layout">
        <Link href={`/projects?q=${encodeURIComponent(featured.category)}`} className="featured-inspiration">
          <div className="featured-image" style={{ backgroundImage: `url("${featured.image}")` }} />
          <div className="featured-copy">
            <span>{featured.category}</span>
            <h2>{featured.title}</h2>
            <p>{featured.subtitle}</p>
            <div className="featured-meta">
              <strong>{featured.author}</strong>
              <span>{featured.role}</span>
              <span>{featured.stats}</span>
            </div>
          </div>
        </Link>

        <div className="inspiration-grid">
          {(restItems.length ? restItems : inspirationItems.slice(1)).map((item) => (
            <article className="inspiration-card" key={item.id}>
              <div className="inspiration-card-image" style={{ backgroundImage: `url("${item.image}")` }} />
              <div className="inspiration-card-body">
                <div className="card-topline">
                  <span>{item.category}</span>
                  <button aria-label="收藏灵感" type="button">
                    <Bookmark size={16} />
                  </button>
                </div>
                <h3>{item.title}</h3>
                <p>{item.subtitle}</p>
                <div className="inspiration-tags">
                  {item.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <div className="inspiration-author">
                  <span>{item.author}</span>
                  <Link href={`/projects?q=${encodeURIComponent(item.category)}`}>看相关需求</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
