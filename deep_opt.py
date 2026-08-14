#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
TokenNexus 深度优化脚本 (幂等, 纯标准库)
P0-3: 重建干净 JSON-LD (修复 93 篇历史损坏) + 注入 FAQPage (H2 派生, 不编造)
P0-4: 修 2025 旧价文死链 -> 2026 版; 每篇相关文章区追加「主题枢纽」链接
P1-5: HIGH 时效风险文章加「数据截至」标注 + 同步 dateModified
P1-6: 按 slug 关键词归类 (供枢纽页使用)

用法: python3 deep_opt.py --root <repo根> [--test <slug>] [--no-write]
"""
import os, re, sys, json, argparse

SITE = "https://www.tokenfind.cn"
REVIEW_DATE = "2026-08-14"
S = re.S

TOPICS = [
    ("multimodal", "多模态与生成式API", ["multimodal","多模态","图像","image","视觉","vision","语音","voice","tts","音频","audio","视频","video","ocr"]),
    ("compliance", "合规·安全·隐私", ["合规","安全","security","隐私","privacy","版权","copyright","法律","legal","风险","risk","数据","data","加密","encrypt","auth","认证","权限","gdpr"]),
    ("enterprise", "企业落地与采购", ["enterprise","企业","团队","team","部署","deploy","私有","private","集成","integration","saas","采购","procurement","合同","contract","落地"]),
    ("routing",    "路由·缓存·稳定性", ["routing","路由","cache","缓存","stream","流式","sse","async","异步","queue","队列","batch","批量","retry","重试","timeout","超时","429","rate-limit","限流","failover","容灾","downtime"]),
    ("cost",       "成本优化与价格", ["cost","pric","price","定价","报价","省钱","预算","budget","quota","额度","optimization","优化","降本","比价","对比","benchmark","性价比"]),
    ("model",      "模型指南与选型", ["model","模型","selection","选型","gpt","claude","gemini","deepseek","qwen","文心","ernie","llama","mistral","glm","release","发布","评测"]),
]
TOPIC_NAME = {k: n for k, n, _ in TOPICS}

PRICE_KW = re.compile(r"price|pric|报价|价格|定价|成本|cost|便宜|免费|quota|额度|优惠|折扣|降价|崩|crash|路由|routing|比价|对比|选型|benchmark|性价比|省钱", re.I)
MODEL_KW = re.compile(r"gpt|claude|gemini|deepseek|qwen|通义|文心|ernie|llama|mistral|glm|o1|o3|o4|grok|模型|model|release|发布|更新|新版|avalanche", re.I)
YEAR_KW  = re.compile(r"202[4-6]")
SKIP_H2  = re.compile(r"写在最后|核心要点|延伸阅读|参考来源|关于我们|免责|总结|结语|目录|前言|后记|附录|更新日志|相关文章|推荐阅读", re.I)

def classify(slug):
    s = slug.lower()
    for key, _, kws in TOPICS:
        if any(k.lower() in s for k in kws):
            return key
    return "model"

def is_high(slug):
    return bool(PRICE_KW.search(slug)) and (bool(MODEL_KW.search(slug)) or bool(YEAR_KW.search(slug)))

def strip_tags(html):
    return re.sub(r"<[^>]+>", "", html)

def build_faq(html):
    h2s = list(re.finditer(r"<h2[^>]*>(.*?)</h2>", html, S))
    if len(h2s) < 3:
        return None
    qa = []
    for i, m in enumerate(h2s):
        raw = strip_tags(m.group(1)).strip()
        if not raw or SKIP_H2.search(raw):
            continue
        core = re.sub(r"^[一二三四五六七八九十]+、", "", raw)
        core = re.sub(r"^核心策略[一二三四五六七八九十]+[:：]", "", core)
        core = re.sub(r"^辅助策略[:：]", "", core)
        if "：" in core:
            core = core.split("：", 1)[1]
        core = re.sub(r"[（(][^）)]*[）)]", "", core)
        core = core.strip("（）() ").strip()
        if len(core) < 4:
            core = raw.strip()
        start = m.end()
        end = h2s[i+1].start() if i+1 < len(h2s) else len(html)
        seg = re.sub(r"\s+", " ", strip_tags(html[start:end])).strip()
        ans = "".join(re.split(r"(?<=[。！？])", seg)[:2]).strip()
        if len(ans) < 25:
            ans = seg[:160].strip()
        if len(ans) < 25:
            continue
        q = f"关于「{core}」有哪些实操要点？"
        if len(q) > 80:
            q = core + "？"
        qa.append({"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": ans}})
        if len(qa) >= 6:
            break
    if len(qa) < 3:
        return None
    return {"@type": "FAQPage", "mainEntity": qa}

def extract_ld(txt):
    """从 JSON-LD 文本(可能损坏)用正则提取字段, 返回 (blogposting字段dict, breadcrumb列表)。"""
    def g(key):
        mm = re.search(r'"'+key+r'"\s*:\s*"([^"]*)"', txt)
        return mm.group(1) if mm else ""
    headline = g("headline") or g("name")
    desc = g("description")
    image = g("image")
    url = g("url")
    author = re.search(r'"author"\s*:\s*\{\s*"@type"\s*:\s*"Person",\s*"name"\s*:\s*"([^"]*)"', txt)
    author = author.group(1) if author else "TokenNexus"
    dp = g("datePublished") or "2026-01-01"
    dm = g("dateModified") or dp
    section = g("articleSection")
    kw = re.search(r'"keywords"\s*:\s*\[(.*?)\]', txt, S)
    keywords = re.findall(r'"([^"]+)"', kw.group(1)) if kw else []
    bc = re.findall(r'"position"\s*:\s*(\d+),\s*"name"\s*:\s*"([^"]*)",\s*"item"\s*:\s*"([^"]*)"', txt)
    if not bc:  # 退路: 仅取 name/item 对
        bc = [(str(i+1), n, i) for i,(n,i) in enumerate(re.findall(r'"name"\s*:\s*"([^"]*)",\s*"item"\s*:\s*"([^"]*)"', txt))]
    return {"headline":headline,"description":desc,"image":image,"url":url,"author":author,
            "datePublished":dp,"dateModified":dm,"articleSection":section,"keywords":keywords}, bc

def process_article(path, write=True):
    html = open(path, encoding="utf-8", errors="ignore").read()
    orig = html
    base = os.path.basename(path)
    slug = base[:-5]
    changes = []

    # --- P0-3: 重建 JSON-LD + FAQ ---
    m = re.search(r'<script type="application/ld\+json">(.*?)</script>', html, S)
    if m:
        fields, bc = extract_ld(m.group(1))
        f = fields
        bp = {
            "@type": "BlogPosting",
            "headline": f["headline"],
            "description": f["description"],
            "image": f["image"],
            "url": f["url"],
            "mainEntityOfPage": {"@type": "WebPage", "@id": f["url"]},
            "author": {"@type": "Person", "name": f["author"]},
            "publisher": {"@type": "Organization", "name": "TokenNexus",
                          "url": "https://www.tokenfind.cn/",
                          "logo": {"@type": "ImageObject", "url": "https://www.tokenfind.cn/images/logo.png"}},
            "datePublished": f["datePublished"],
            "dateModified": f["dateModified"],
            "articleSection": f["articleSection"] or "AI API",
            "keywords": f["keywords"],
            "inLanguage": "zh-CN",
        }
        graph = [bp, {"@type": "BreadcrumbList",
                      "itemListElement": [{"@type": "ListItem", "position": int(p), "name": n, "item": i} for p, n, i in bc]}]
        faq = build_faq(html)
        if faq:
            graph.append(faq)
            changes.append(f"FAQ({len(faq['mainEntity'])}项)")
        new_json = json.dumps({"@context": "https://schema.org", "@graph": graph},
                              ensure_ascii=False, indent=4)
        html = html[:m.start(1)] + "\n" + new_json + "\n    " + html[m.end(1):]

    # --- P0-4: 修 2025 旧价文死链 ---
    old, new = "ai-api-pricing-comparison-guide-2025", "ai-api-pricing-comparison-2026-guide"
    if old in html:
        html = html.replace(old, new)
        changes.append("修2025死链")

    # --- P0-4: 追加主题枢纽链接 ---
    topic = classify(slug)
    hub_href = f"/blog/topics/{topic}.html"
    hub_name = TOPIC_NAME[topic]
    if hub_href not in html:
        card = (f'\n                <a href="{hub_href}" style="text-decoration:none;padding:16px;background:var(--card-bg);'
                f'border:1px solid var(--card-border);border-radius:8px;transition:all .3s;color:var(--text-secondary)">\n'
                f'                    <div style="font-weight:600;color:var(--text-primary);margin-bottom:6px">📚 {hub_name}</div>\n'
                f'                    <div style="font-size:.85rem">同主题攻略合集，系统提升 API 实战能力</div>\n'
                f'                </a>')
        injected = False
        for anchor in ('class="related-posts-grid"', 'class="related-grid"'):
            rg = html.find(anchor)
            if rg != -1:
                close = html.find("</div>", rg)
                if close != -1:
                    html = html[:close] + card + html[close:]
                    changes.append(f"枢纽链({topic})")
                    injected = True
                    break
        if not injected:
            # 兜底: 在 </article> 前插入独立枢纽卡片
            art = html.rfind("</article>")
            if art != -1:
                block = (f'\n        <section class="related-posts" style="margin-top:40px;padding-top:24px;border-top:1px solid var(--card-border)">\n'
                         f'            <h3 style="color:var(--neon-cyan);font-size:1.1rem;margin-bottom:16px">📚 {hub_name}</h3>\n'
                         f'            {card}\n        </section>\n')
                html = html[:art] + block + html[art:]
                changes.append(f"枢纽链兜底({topic})")

    # --- P1-5: HIGH 文章数据截至标注 + dateModified ---
    if is_high(slug):
        html = re.sub(r'("dateModified"\s*:\s*")[^"]*(")', rf'\g<1>{REVIEW_DATE}\g<2>', html, count=1)
        if "数据截至" not in html:
            note = (f'\n            <p style="font-size:0.82rem;color:#ffb454;background:rgba(255,180,84,.08);'
                    f'padding:10px 14px;border-left:3px solid #ffb454;border-radius:4px;margin:24px 0 0;">'
                    f'📌 数据截至 {REVIEW_DATE}，AI API 价格与模型迭代极快，文中具体数字请以各平台官方信息为准。</p>\n')
            ins = html.find('<section class="references"')
            if ins == -1:
                ins = html.find('class="references"')
            if ins != -1:
                html = html[:ins] + note + html[ins:]
                changes.append("数据截至标注")

    if html != orig and write:
        open(path, "w", encoding="utf-8").write(html)
    return changes

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", required=True)
    ap.add_argument("--test", default=None)
    ap.add_argument("--no-write", action="store_true")
    a = ap.parse_args()
    import glob
    blog = os.path.join(a.root, "blog")
    files = sorted(glob.glob(os.path.join(blog, "*.html")))
    files = [f for f in files if os.path.basename(f) not in ("index.html", "guides.html")]
    if a.test:
        files = [os.path.join(blog, a.test + ".html")]
    total = 0
    for f in files:
        ch = process_article(f, write=not a.no_write)
        if ch:
            total += 1
            if a.test or total <= 6:
                print(f"  {os.path.basename(f)}: {ch}")
    print(f"\n处理完成: {total}/{len(files)} 篇有改动")

if __name__ == "__main__":
    main()
