#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
content_freshness_scan.py — tokennexus 博客内容时效性扫描

用途:
  扫描 blog/*.html, 识别含"硬编码报价 / 模型版本 / 具体日期"的文章,
  按时效风险分级, 输出可执行的刷新清单(CSV + 控制台表格)。

为什么需要:
  AI API 的价格 / 模型 / 配额迭代极快, 含具体报价的文章可能很快过时,
  一旦被 Google 或 AI 答案引擎索引为"过期价格", 会损害站点可信度与转化。

用法(在仓库根目录, 与 blog/ 同级运行):
  python3 content_freshness_scan.py            # 控制台表格 + 写 CSV
  python3 content_freshness_scan.py --csv out.csv

分级逻辑:
  高(HIGH)   : 同时命中"价格信号"且(命中"模型信号"或"日期信号")
  中(MID)    : 仅命中"价格信号"或"模型信号"
  低(LOW)    : 概念/方法/流程类, 时效慢
"""
import os, re, glob, csv, sys, json

BLOG = "blog"
SKIP = {"index.html", "guides.html"}

PRICE = re.compile(
    r"(¥|\$|USD|人民币|美元|元/千|元/百万|每千|每百万|千tokens|/1M|per\s*1M|per\s*million|"
    r"价格|报价|定价|免费额度|收费|费用|cents|单价|计费|折扣|优惠|降价|崩盘|crash)",
    re.I,
)
MODEL = re.compile(
    r"(GPT-4o|GPT-4|GPT-5|Claude\s*3|Claude\s*3\.5|Claude\s*3\.7|Claude\s*4|"
    r"Gemini\s*1\.5|Gemini\s*2\.0|Gemini\s*2\.5|DeepSeek-?V3|DeepSeek-?R1|DeepSeek-?V2|"
    r"Qwen2\.5|Qwen3|文心4|ERNIE|Llama\s*3|Llama\s*4|Mistral|GLM-?4|o1|o3|o4|Grok|"
    r"模型版本|新模型|旗舰模型)",
    re.I,
)
DATE = re.compile(r"(2024|2025|2026)[-年./]?\d{1,2}|截至|目前|今年|上个月|季度)", re.I)


def strip_tags(html):
    body = re.sub(r"<script.*?</script>", "", html, flags=re.S)
    body = re.sub(r"<style.*?</style>", "", body, flags=re.S)
    text = re.sub(r"<[^>]+>", " ", body)
    return text


def scan():
    files = sorted(glob.glob(os.path.join(BLOG, "*.html")))
    files = [f for f in files if os.path.basename(f) not in SKIP]
    rows = []
    for f in files:
        html = open(f, encoding="utf-8", errors="ignore").read()
        text = strip_tags(html)
        p = len(PRICE.findall(text))
        m = len(MODEL.findall(text))
        d = len(DATE.findall(text))
        if p and (m or d):
            tier = "HIGH"
        elif p or m:
            tier = "MID"
        else:
            tier = "LOW"
        rows.append({
            "file": os.path.basename(f),
            "tier": tier,
            "price_hits": p,
            "model_hits": m,
            "date_hits": d,
        })
    order = {"HIGH": 0, "MID": 1, "LOW": 2}
    rows.sort(key=lambda r: (order[r["tier"]], -r["price_hits"], -r["model_hits"]))
    return rows


def main():
    rows = scan()
    # 控制台表格
    print(f"{'TIER':<5} {'PRICE':>6} {'MODEL':>6} {'DATE':>5}  FILE")
    print("-" * 70)
    for r in rows:
        print(f"{r['tier']:<5} {r['price_hits']:>6} {r['model_hits']:>6} {r['date_hits']:>5}  {r['file']}")

    # 统计
    from collections import Counter
    c = Counter(r["tier"] for r in rows)
    print("-" * 70)
    print(f"总计 {len(rows)} 篇 | HIGH={c['HIGH']} MID={c['MID']} LOW={c['LOW']}")

    # CSV
    out = "content_freshness_scan_report.csv"
    with open(out, "w", newline="", encoding="utf-8-sig") as fp:
        w = csv.DictWriter(fp, fieldnames=["file", "tier", "price_hits", "model_hits", "date_hits"])
        w.writeheader()
        w.writerows(rows)
    print(f"已写入 {out}")

    # HIGH 清单(便于直接派活)
    high = [r["file"] for r in rows if r["tier"] == "HIGH"]
    if high:
        json.dump(high, open("content_freshness_HIGH.json", "w", encoding="utf-8"),
                  ensure_ascii=False, indent=2)
        print(f"高优先级清单已写入 content_freshness_HIGH.json ({len(high)} 篇)")


if __name__ == "__main__":
    main()
