#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
remove_ttzz.py — 从 tokennexus 博客文章中移除第三方 ttzz 追踪脚本

背景:
  每篇 blog/*.html 的 <head> 内嵌了字节跳动(bytegoofy CDN)的 ttzz 追踪 SDK:
    <script>
      var el = document.createElement("script");
      el.src = "https://lf1-cdn-tos.bytegoofy.com/goofy/ttzz/push.js?...";
      el.id = "ttzz";
      var s = document.getElementsByTagName("script")[0];
      s.parentNode.insertBefore(el, s);
    </script>
  该脚本与本站(AI API 导航)功能无关, 属于第三方追踪, 带来隐私/性能/信任成本,
  建议移除。

用法(在仓库根目录, 与 blog/ 同级运行):
  python3 remove_ttzz.py

特性:
  - 仅移除包含 "ttzz" 或 "bytegoofy" 的 <script> 块, 不动其它脚本(JSON-LD 等带 type 属性的不受影响)
  - 幂等: 已移除的文件再次运行 = 0 改动
  - 纯标准库, 无外部依赖
  - 运行后打印统计并生成 remove_ttzz_changes.json
"""
import os, re, glob, json

BLOG = "blog"
SKIP = {"index.html", "guides.html"}
SITE = "https://www.tokenfind.cn"


def main():
    files = sorted(glob.glob(os.path.join(BLOG, "*.html")))
    files = [f for f in files if os.path.basename(f) not in SKIP]

    pat = re.compile(r"<script>.*?</script>", re.S)
    changes = {}

    for f in files:
        h = open(f, encoding="utf-8", errors="ignore").read()
        orig = h

        def strip(m):
            blk = m.group(0)
            # 只移除引用 ttzz / bytegoofy 的裸 <script> 块
            if "ttzz" in blk or "bytegoofy" in blk:
                return ""
            return blk

        h2 = pat.sub(strip, h)
        # 清理因删除产生的连续空行(最多 2 个换行)
        h2 = re.sub(r"\n{3,}", "\n\n", h2)

        if h2 != orig:
            open(f, "w", encoding="utf-8").write(h2)
            changes[os.path.basename(f)] = True

    # 复检: 确认无残留
    residual = 0
    for f in files:
        t = open(f, encoding="utf-8", errors="ignore").read()
        if "ttzz" in t or "bytegoofy" in t:
            residual += 1

    print(f"扫描文章数: {len(files)}")
    print(f"移除 ttzz 脚本的文件数: {len(changes)}")
    print(f"复检残留(应=0): {residual}")
    if changes:
        json.dump(
            {"removed_from": sorted(changes.keys()), "count": len(changes)},
            open("remove_ttzz_changes.json", "w", encoding="utf-8"),
            ensure_ascii=False, indent=2,
        )
        print("已生成 remove_ttzz_changes.json")
    else:
        print("✅ 无 ttzz 脚本需要移除(已全部清理或原本无)")


if __name__ == "__main__":
    main()
