"use client";

import { useEffect } from "react";
import Link from "next/link";
import { inspirationItems } from "@/lib/inspiration-data";
import { cn } from "@/lib/utils";

const tickerItems = ["品牌设计", "全栈开发", "内容策划", "产品摄影", "UI / UX 设计", "短视频剪辑", "小程序开发", "品牌文案", "数据分析", "插画设计"];

const talents = [
  {
    initial: "周",
    avatar: "av-a",
    name: "周晓雯",
    role: "品牌视觉设计师 · 5 年经验",
    cover: "cover-1",
    coverLabel: "Brand Design",
    tags: ["品牌设计", "Logo", "VI"],
    price: "¥ 3,000 起",
    orders: "已完成 86 单",
    rating: "4.9"
  },
  {
    initial: "李",
    avatar: "av-b",
    name: "李彦博",
    role: "全栈开发者 · 7 年经验",
    cover: "cover-2",
    coverLabel: "Full Stack Dev",
    tags: ["React", "Node.js", "小程序"],
    price: "¥ 800 / 天",
    orders: "已完成 124 单",
    rating: "5.0"
  },
  {
    initial: "陈",
    avatar: "av-c",
    name: "陈思远",
    role: "品牌文案 · 4 年经验",
    cover: "cover-3",
    coverLabel: "Copywriting",
    tags: ["品牌文案", "内容策划", "小红书"],
    price: "¥ 1,500 起",
    orders: "已完成 57 单",
    rating: "4.8"
  }
];

const demands = [
  {
    title: "为独立茶饮品牌设计整套品牌视觉系统",
    category: "品牌设计",
    deadline: "截止 2 周后",
    count: "8 人已投递",
    budget: "¥ 8,000-15,000"
  },
  {
    title: "开发一个内部 CRM 系统，支持微信登录和数据看板",
    category: "软件开发",
    deadline: "截止 1 个月后",
    count: "14 人已投递",
    budget: "¥ 30,000-50,000"
  },
  {
    title: "撰写美妆品牌小红书年度内容策划方案",
    category: "内容策划",
    deadline: "截止 10 天后",
    count: "5 人已投递",
    budget: "¥ 3,000-5,000"
  },
  {
    title: "长期合作：电商产品摄影及后期修图",
    category: "摄影 / 修图",
    deadline: "长期合作",
    count: "11 人已投递",
    budget: "¥ 500 / 天"
  }
];

const securityItems = [
  {
    num: "01",
    title: "认证后开放核心权限",
    desc: "需求方提交营业执照或身份证，乙方提交实名资料和作品证明，平台审核后再开放发布、投递和沟通。"
  },
  {
    num: "02",
    title: "先托管，后交付",
    desc: "MVP 阶段只接一个支付渠道，把下单、托管、验收、放款这条交易闭环先跑顺。"
  },
  {
    num: "03",
    title: "问题订单人工介入",
    desc: "复杂仲裁系统先不做，保留客服入口和订单记录，让平台可以根据证据介入处理。"
  }
];

const mvpItems = [
  "账号注册与登录",
  "实名认证审核",
  "发布图文需求",
  "作品集与乙方主页",
  "投递与报价",
  "订单内文字沟通",
  "单一支付渠道托管",
  "验收放款与双向评价"
];

export function CraftHomepage({ className }: { className?: string }) {
  useEffect(() => {
    const glow = document.getElementById("cursorGlow");
    const nav = document.getElementById("craftNav");
    const revealEls = document.querySelectorAll<HTMLElement>(".craft-home .reveal");
    const counters = document.querySelectorAll<HTMLElement>(".craft-home .stat-num[data-target]");
    const magneticButtons = document.querySelectorAll<HTMLElement>(".craft-home .btn-primary, .craft-home .btn-inverse");

    const onMouseMove = (event: MouseEvent) => {
      if (!glow) return;
      glow.style.left = `${event.clientX}px`;
      glow.style.top = `${event.clientY}px`;
    };

    const onScroll = () => {
      nav?.classList.toggle("scrolled", window.scrollY > 20);
    };

    document.addEventListener("mousemove", onMouseMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => revealObserver.observe(el));

    const countObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const target = Number(el.dataset.target ?? 0);
          const suffix = el.dataset.suffix ?? "";
          const duration = 1400;
          const start = performance.now();
          const step = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = `${Math.round(eased * target).toLocaleString()}${suffix}`;
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          countObserver.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((el) => countObserver.observe(el));

    const cleanups: Array<() => void> = [];
    magneticButtons.forEach((button) => {
      const move = (event: MouseEvent) => {
        const rect = button.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        button.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
      };
      const leave = () => {
        button.style.transform = "";
      };
      button.addEventListener("mousemove", move);
      button.addEventListener("mouseleave", leave);
      cleanups.push(() => {
        button.removeEventListener("mousemove", move);
        button.removeEventListener("mouseleave", leave);
      });
    });

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
      revealObserver.disconnect();
      countObserver.disconnect();
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  return (
    <main className={cn("craft-home", className)}>
      <div className="cursor-glow" id="cursorGlow" />

      <nav id="craftNav" className="craft-nav">
        <Link href="/" className="nav-logo">Craft</Link>
        <ul className="nav-links">
          <li><Link href="/inspiration">灵感</Link></li>
          <li><Link href="/projects">需求广场</Link></li>
          <li><Link href="/freelancers">作品集</Link></li>
          <li><a href="#how">AI 助手</a></li>
        </ul>
        <div className="nav-actions">
          <Link href="/login" className="btn btn-ghost">登录</Link>
          <Link href="/register" className="btn btn-primary">免费注册</Link>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-left">
          <div className="hero-eyebrow">灵感 · 需求 · 人才匹配</div>
          <h1 className="hero-title">先找到灵感，<br />再找到合适的<em>人</em><br />把它做出来</h1>
          <p className="hero-desc">Craft 让设计师和需求方先从案例、趋势与作品里获得启发，再把想法整理成可执行的 brief，匹配合适的自由职业者完成交付。</p>
          <div className="hero-cta">
            <Link href="/inspiration" className="btn btn-primary btn-hero">刷灵感</Link>
            <Link href="/projects#publish" className="btn btn-outline btn-hero">整理需求</Link>
          </div>
          <p className="hero-note">注册免费 · 支持短信登录 · 认证后即可交易</p>
        </div>

        <div className="hero-right">
          <div className="stat-grid">
            <div className="stat-card"><div className="stat-num" data-target="3200">0</div><div className="stat-label">认证自由职业者</div></div>
            <div className="stat-card"><div className="stat-num" data-target="98" data-suffix="%">0%</div><div className="stat-label">需求完成率</div></div>
            <div className="stat-card"><div className="stat-num">¥ 0</div><div className="stat-label">发布需求费用</div></div>
            <div className="stat-card"><div className="stat-num" data-target="48" data-suffix="h">0h</div><div className="stat-label">平均首次响应</div></div>
          </div>

          <PreviewCard avatar="av-a" initial="周" name="周晓雯" sub="品牌设计师 · 上海" tags={["品牌视觉", "Logo 设计", "VI 系统"]} price="¥ 3,000 起" />
          <PreviewCard avatar="av-b" initial="李" name="李彦博" sub="全栈开发者 · 深圳" tags={["React", "Node.js", "微信小程序"]} price="¥ 800 / 天" />
        </div>
      </section>

      <div className="ticker-band">
        <div className="ticker-inner">
          {[...tickerItems, ...tickerItems].map((item, index) => (
            <span className="ticker-item" key={`${item}-${index}`}><span className="ticker-dot" />{item}</span>
          ))}
        </div>
      </div>

      <section className="home-inspiration">
        <div className="talent-header reveal">
          <div>
            <div className="section-label visible">发现灵感</div>
            <h2 className="talent-title">让用户愿意停留、浏览、收藏，再开始一个真实项目。</h2>
          </div>
          <Link href="/inspiration" className="btn btn-outline">进入灵感广场</Link>
        </div>
        <div className="home-inspiration-grid">
          {inspirationItems.slice(0, 3).map((item, index) => (
            <Link className={`home-inspiration-card reveal reveal-delay-${index + 1}`} href={`/projects?q=${encodeURIComponent(item.category)}`} key={item.id}>
              <div className="home-inspiration-art" style={{ backgroundImage: `url("${item.image}")` }} />
              <div className="home-inspiration-body">
                <span>{item.category}</span>
                <h3>{item.title}</h3>
                <p>{item.subtitle}</p>
                <div>
                  {item.tags.slice(0, 2).map((tag) => (
                    <em key={tag}>{tag}</em>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <hr className="section-divider" />

      <section id="how" className="how">
        <div className="section-label reveal">AI 辅助执行</div>
        <div className="steps">
          {[
            ["01", "从灵感生成 brief", "用户看到喜欢的案例后，可以把一句想法整理成项目标题、预算、技能和交付物，降低发布门槛。"],
            ["02", "辅助判断匹配度", "自由职业者打开需求时，系统可以提示适配技能、风险点和报价建议，帮助更快决定是否投递。"],
            ["03", "交易闭环继续保留", "认证、投递、合同、交付、验收和评价仍然完整存在，让灵感最终能变成真实交付。"]
          ].map(([num, title, desc], index) => (
            <div className={`step reveal reveal-delay-${index + 1}`} key={num}>
              <span className="step-num">{num}</span>
              <div className="step-title">{title}</div>
              <p className="step-desc">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="section-divider" />

      <section className="talent">
        <div className="talent-header reveal">
          <h2 className="talent-title">精选自由职业者</h2>
          <Link href="/freelancers" className="btn btn-outline">查看全部</Link>
        </div>
        <div className="talent-grid">
          {talents.map((talent, index) => (
            <TalentCard key={talent.name} talent={talent} delay={index + 1} />
          ))}
        </div>
      </section>

      <hr className="section-divider" />

      <section className="demands">
        <div className="demand-header reveal">
          <h2 className="talent-title">最新需求</h2>
          <Link href="/projects" className="btn btn-outline">查看全部</Link>
        </div>
        <div className="demand-list">
          {demands.map((demand, index) => (
            <div className={`demand-row reveal reveal-delay-${Math.min(index + 1, 4)}`} key={demand.title}>
              <div className="demand-left">
                <div className="demand-title">{demand.title}</div>
                <div className="demand-meta">
                  <span>{demand.category}</span>
                  <span>· {demand.deadline}</span>
                  <span className="live-count">{demand.count}</span>
                </div>
              </div>
              <div className="demand-right">
                <div className="demand-budget">{demand.budget}</div>
                <span className="demand-status">招募中</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="security">
        <div className="section-label reveal">交易安全</div>
        <div className="security-layout">
          <div className="security-copy reveal reveal-delay-1">
            <h2 className="talent-title">MVP 可以克制，但信任链路不能省。</h2>
            <p>支付、审核、沟通和验收不需要一开始做得很复杂，但每个关键节点都要给双方留下清楚的判断依据。</p>
          </div>
          <div className="security-list">
            {securityItems.map((item, index) => (
              <div className={`security-item reveal reveal-delay-${index + 1}`} key={item.num}>
                <span>{item.num}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      <section className="mvp-scope">
        <div className="mvp-panel reveal">
          <div>
            <div className="section-label visible">第一版范围</div>
            <h2 className="talent-title">先让一笔真实交易完整发生。</h2>
          </div>
          <div className="mvp-grid">
            {mvpItems.map((item, index) => (
              <div className="mvp-item" key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="cta-band reveal">
        <div>
          <div className="cta-title">准备好开始了吗？</div>
          <p className="cta-sub">注册免费。认证只需几分钟。<br />无论你是有需求等待完成，还是有技能等待被看见。</p>
        </div>
        <div className="cta-actions">
          <Link href="/register" className="btn btn-inverse">我是需求方</Link>
          <Link href="/register" className="btn btn-ghost-inv">我是乙方</Link>
        </div>
      </div>

      <footer className="craft-footer">
        <Link href="/" className="footer-logo">Craft</Link>
        <ul className="footer-links">
          <li><a href="#">关于我们</a></li>
          <li><a href="#">用户协议</a></li>
          <li><a href="#">隐私政策</a></li>
          <li><a href="#">帮助中心</a></li>
          <li><a href="#">联系我们</a></li>
        </ul>
        <span className="footer-copy">© 2026 Craft. 保留所有权利。</span>
      </footer>
    </main>
  );
}

function PreviewCard({ avatar, initial, name, sub, tags, price }: { avatar: string; initial: string; name: string; sub: string; tags: string[]; price: string }) {
  return (
    <div className="preview-card">
      <div className={`avatar ${avatar}`}>{initial}</div>
      <div className="preview-body">
        <div className="preview-name">{name}</div>
        <div className="preview-sub">{sub}</div>
        <div className="tag-row">
          {tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}
        </div>
        <div className="preview-meta">
          <span className="preview-price">{price}</span>
          <span className="preview-badge">接单中</span>
        </div>
      </div>
    </div>
  );
}

function TalentCard({ talent, delay }: { talent: (typeof talents)[number]; delay: number }) {
  return (
    <div className={`talent-card reveal reveal-delay-${delay}`}>
      <div className={`talent-cover ${talent.cover}`}>
        <div className="grid-lines" />
        <span className="cover-label">{talent.coverLabel}</span>
      </div>
      <div className="talent-info">
        <div className="talent-top">
          <div className={`avatar ${talent.avatar} talent-avatar`}>{talent.initial}</div>
          <div><div className="talent-name">{talent.name}</div></div>
          <div className="rating"><span className="star">★</span> {talent.rating}</div>
        </div>
        <div className="talent-role">{talent.role}</div>
        <div className="talent-tags">
          {talent.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}
        </div>
        <div className="talent-foot">
          <span className="talent-price">{talent.price}</span>
          <span className="talent-orders">{talent.orders}</span>
        </div>
      </div>
    </div>
  );
}
