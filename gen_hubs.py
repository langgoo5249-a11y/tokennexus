#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""生成 6 个主题枢纽页到 blog/topics/ (幂等)。供 P1-6 主题集群使用。"""
import os, re, json, glob

ROOT = "."
SITE = "https://www.tokenfind.cn"
S = re.S

TOPICS = [
    ("multimodal", "多模态与生成式API"),
    ("compliance", "合规·安全·隐私"),
    ("enterprise", "企业落地与采购"),
    ("routing",    "路由·缓存·稳定性"),
    ("cost",       "成本优化与价格"),
    ("model",      "模型指南与选型"),
]
TOPIC_SLUG = [t[0] for t in TOPICS]
TOPIC_NAME = {t[0]: t[1] for t in TOPICS}

# 与文章相同的分类逻辑
def classify(slug):
    s = slug.lower()
    rules = {
        "multimodal": ["multimodal","多模态","图像","image","视觉","vision","语音","voice","tts","音频","audio","视频","video","ocr"],
        "compliance": ["合规","安全","security","隐私","privacy","版权","copyright","法律","legal","风险","risk","数据","data","加密","encrypt","auth","认证","权限","gdpr"],
        "enterprise": ["enterprise","企业","团队","team","部署","deploy","私有","private","集成","integration","saas","采购","procurement","合同","contract","落地"],
        "routing":    ["routing","路由","cache","缓存","stream","流式","sse","async","异步","queue","队列","batch","批量","retry","重试","timeout","超时","429","rate-limit","限流","failover","容灾","downtime"],
        "cost":       ["cost","pric","price","定价","报价","省钱","预算","budget","quota","额度","optimization","优化","降本","比价","对比","benchmark","性价比"],
        "model":      ["model","模型","selection","选型","gpt","claude","gemini","deepseek","qwen","文心","ernie","llama","mistral","glm","release","发布","评测"],
    }
    for k, kws in rules.items():
        if any(kw.lower() in s for kw in kws):
            return k
    return "model"

def get_title(html):
    m = re.search(r'<meta property="og:title" content="([^"]*)"', html)
    if m: return m.group(1)
    m = re.search(r'<title>([^<]*)</title>', html)
    return m.group(1) if m else ""

CSS = """:root { --neon-cyan: #00f0ff; --neon-purple: #b829dd; --dark-bg: #050508; --card-bg: rgba(10, 10, 18, 0.9); --card-border: rgba(0, 240, 255, 0.15); --text-primary: #ffffff; --text-secondary: #8b92a8; }
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Noto Sans SC', sans-serif; background: var(--dark-bg); color: var(--text-primary); min-height: 100vh; line-height: 1.8; }
.navbar { position: fixed; top: 0; left: 0; right: 0; height: 80px; background: rgba(5, 5, 8, 0.95); backdrop-filter: blur(20px); border-bottom: 1px solid var(--card-border); display: flex; align-items: center; justify-content: space-between; padding: 0 60px; z-index: 1000; }
.logo { display: flex; align-items: center; gap: 16px; }
.logo-icon { width: 40px; height: 40px; }
.logo-text { font-family: 'Orbitron', sans-serif; font-size: 1.5rem; font-weight: 700; color: var(--neon-cyan); }
.nav-links { display: flex; gap: 32px; }
.nav-links a { color: var(--text-secondary); text-decoration: none; font-size: 0.95rem; transition: color 0.3s; }
.nav-links a:hover, .nav-links a.active { color: var(--neon-cyan); }
.container { max-width: 1100px; margin: 0 auto; padding: 120px 40px 60px; }
.cat-badge { display: inline-block; background: linear-gradient(135deg, var(--neon-cyan), var(--neon-purple)); color: #fff; padding: 6px 16px; border-radius: 20px; font-size: 0.85rem; font-weight: 500; margin-bottom: 16px; }
.hub-title { font-size: 2.2rem; font-weight: 700; line-height: 1.4; margin-bottom: 16px; background: linear-gradient(135deg, var(--text-primary), var(--neon-cyan)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.hub-desc { color: var(--text-secondary); font-size: 1.05rem; margin-bottom: 40px; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }
.card { background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 12px; padding: 22px; transition: all .3s; text-decoration: none; display: block; }
.card:hover { border-color: var(--neon-cyan); transform: translateY(-3px); }
.card h3 { color: var(--text-primary); font-size: 1.1rem; margin-bottom: 10px; line-height: 1.4; }
.card p { color: var(--text-secondary); font-size: 0.88rem; }
.section-h { color: var(--neon-cyan); font-size: 1.3rem; font-weight: 600; margin: 50px 0 20px; padding-bottom: 10px; border-bottom: 2px solid var(--card-border); }
.topic-nav { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 50px; padding-top: 30px; border-top: 1px solid var(--card-border); }
.topic-nav a { color: var(--text-secondary); text-decoration: none; padding: 8px 16px; border: 1px solid var(--card-border); border-radius: 20px; font-size: 0.88rem; transition: all .3s; }
.topic-nav a:hover, .topic-nav a.active { color: var(--neon-cyan); border-color: var(--neon-cyan); }
.footer { background: rgba(5, 5, 8, 0.95); border-top: 1px solid var(--card-border); padding: 40px 60px; margin-top: 60px; text-align: center; }
.footer-text { color: var(--text-secondary); font-size: 0.9rem; }
@media (max-width: 768px) { .navbar { padding: 0 20px; } .nav-links { display: none; } .container { padding: 100px 20px 40px; } .hub-title { font-size: 1.6rem; } }"""

def main():
    blog = os.path.join(ROOT, "blog")
    files = sorted(glob.glob(os.path.join(blog, "*.html")))
    files = [f for f in files if os.path.basename(f) not in ("index.html", "guides.html")]
    articles = {}  # topic -> list of (slug, title)
    for f in files:
        slug = os.path.basename(f)[:-5]
        html = open(f, encoding="utf-8", errors="ignore").read()
        title = get_title(html)
        if not title:
            continue
        t = classify(slug)
        articles.setdefault(t, []).append((slug, title))
    os.makedirs(os.path.join(blog, "topics"), exist_ok=True)
    for key, name in TOPICS:
        items = articles.get(key, [])
        cards = "\n".join(
            f'            <a class="card" href="/blog/{slug}"><h3>{title}</h3>'
            f'<p>阅读这篇《{title}》实战攻略 →</p></a>' for slug, title in items)
        topic_nav = "\n".join(
            f'            <a href="/blog/topics/{k}.html" class="{"active" if k==key else ""}">{n}</a>'
            for k, n in TOPICS)
        url = f"{SITE}/blog/topics/{key}.html"
        ld = json.dumps({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": f"TokenNexus · {name}攻略合集",
            "description": f"TokenNexus {name}主题下 {len(items)} 篇 AI API 实战攻略合集。",
            "url": url,
            "isPartOf": {"@type": "WebSite", "name": "TokenNexus", "url": SITE + "/"},
            "hasPart": [{"@type": "WebPage", "name": t, "url": f"{SITE}/blog/{s}"} for s, t in items],
        }, ensure_ascii=False, indent=4)
        html = f'''<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="index, follow">
    <title>TokenNexus · {name}攻略合集 | AI API 实战指南</title>
    <meta name="description" content="TokenNexus {name}主题下 {len(items)} 篇 AI API 实战攻略合集，系统讲解核心方法论与落地经验。">
    <link rel="canonical" href="{url}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="TokenNexus">
    <meta property="og:title" content="TokenNexus · {name}攻略合集">
    <meta property="og:description" content="TokenNexus {name}主题下 {len(items)} 篇 AI API 实战攻略合集。">
    <meta property="og:url" content="{url}">
    <meta property="og:image" content="{SITE}/og-image.png">
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Rajdhani:wght@300;400;500;600;700&family=Noto+Sans+SC:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>{CSS}</style>
    <script type="application/ld+json">
    {ld}
    </script>
</head>
<body>
    <nav class="navbar">
        <a href="/" class="logo"><span class="logo-text">TokenNexus</span></a>
        <div class="nav-links">
            <a href="/">首页</a>
            <a href="/platforms">平台大全</a>
            <a href="/official">官方平台</a>
            <a href="/aggregator">聚合平台</a>
            <a href="/china">国内平台</a>
            <a href="/blog/guides" class="active">攻略</a>
            <a href="/ai-overview">AI Overview</a>
        </div>
    </nav>
    <main class="container">
        <span class="cat-badge">{name}</span>
        <h1 class="hub-title">{name} · AI API 实战攻略合集</h1>
        <p class="hub-desc">本合集汇总 TokenNexus 在「{name}」主题下的 {len(items)} 篇深度攻略，帮你体系化掌握相关能力。</p>
        <div class="grid">
{cards}
        </div>
        <div class="topic-nav">
            <span style="color:var(--text-secondary);align-self:center;margin-right:8px">其他主题：</span>
{topic_nav}
        </div>
    </main>
    <footer class="footer">
        <div class="footer-text">TokenNexus · AI API 一站式导航与实战平台</div>
    </footer>
</body>
</html>
'''
        out = os.path.join(blog, "topics", f"{key}.html")
        open(out, "w", encoding="utf-8").write(html)
        print(f"  生成 {key}.html : {len(items)} 篇")

if __name__ == "__main__":
    main()
