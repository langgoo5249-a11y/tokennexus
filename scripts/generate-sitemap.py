#!/usr/bin/env python3
"""生成完整的sitemap.xml"""

import os
from datetime import datetime

BASE_URL = "https://www.tokenfind.cn"
TODAY = datetime.now().strftime("%Y-%m-%d")

# 博客文章列表（排除index.html和guides.html本身）
blog_articles = [
    "ai-api-async-batch-processing.html",
    "ai-api-caching-optimization-2026.html",
    "ai-api-caching-strategy.html",
    "ai-api-embedding-vector-search-guide.html",
    "ai-api-error-codes-troubleshooting.html",
    "ai-api-fine-tuning-guide.html",
    "ai-api-function-calling-guide.html",
    "ai-api-long-context-optimization.html",
    "ai-api-monitoring-alerting.html",
    "ai-api-performance-testing.html",
    "ai-api-pricing-comparison-guide-2025.html",
    "ai-api-pricing-guide-2026.html",
    "ai-api-proxy-relay-guide.html",
    "ai-api-rate-limit-strategies.html",
    "ai-api-security-guide-2026.html",
    "ai-api-streaming-sse-guide.html",
    "ai-api-token-billing-guide.html",
    "ai-model-routing-guide-2026.html",
    "ai-prompt-engineering-guide.html",
    "api-integration-best-practices.html",
    "api-key-security-guide.html",
    "china-ai-api-guide.html",
    "china-api-transit-platform-guide.html",
    "china-llm-ecosystem-2026.html",
    "claude-api-guide-2026.html",
    "deepseek-api-complete-guide.html",
    "enterprise-ai-api-selection-guide.html",
    "free-ai-api-guide-2026.html",
    "free-ai-api-recommendations-2026.html",
    "gemini-api-complete-guide.html",
    "gpt4o-vs-claude35-sonnet-comparison.html",
    "how-to-get-openai-api-key.html",
    "multimodal-ai-api-development.html",
    "openai-vs-deepseek-2026.html",
    "openrouter-complete-guide.html",
    "rag-ai-api-knowledge-base.html",
    "top-10-ai-apis-2026.html",
]

# 获取平台页面列表
platform_dir = "/workspace/token-nav/platform"
platform_pages = []
if os.path.exists(platform_dir):
    for f in os.listdir(platform_dir):
        if f.endswith('.html') and not f.startswith('index'):
            platform_pages.append(f)

platform_pages.sort()

# 生成sitemap XML
xml_lines = []
xml_lines.append('<?xml version="1.0" encoding="UTF-8"?>')
xml_lines.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')
xml_lines.append('        xmlns:xhtml="http://www.w3.org/1999/xhtml"')
xml_lines.append('        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">')

# 首页
xml_lines.append('    <!-- 首页 -->')
xml_lines.append('    <url>')
xml_lines.append(f'        <loc>{BASE_URL}/</loc>')
xml_lines.append(f'        <lastmod>{TODAY}</lastmod>')
xml_lines.append('        <changefreq>daily</changefreq>')
xml_lines.append('        <priority>1.0</priority>')
xml_lines.append('    </url>')

# 攻略列表页
xml_lines.append('')
xml_lines.append('    <!-- 攻略列表 -->')
xml_lines.append('    <url>')
xml_lines.append(f'        <loc>{BASE_URL}/blog/guides.html</loc>')
xml_lines.append(f'        <lastmod>{TODAY}</lastmod>')
xml_lines.append('        <changefreq>daily</changefreq>')
xml_lines.append('        <priority>0.9</priority>')
xml_lines.append('    </url>')

# 分类页面
xml_lines.append('')
xml_lines.append('    <!-- 分类页面 -->')
for page in ['official.html', 'aggregator.html', 'china.html']:
    xml_lines.append('    <url>')
    xml_lines.append(f'        <loc>{BASE_URL}/{page}</loc>')
    xml_lines.append(f'        <lastmod>{TODAY}</lastmod>')
    xml_lines.append('        <changefreq>weekly</changefreq>')
    xml_lines.append('        <priority>0.9</priority>')
    xml_lines.append('    </url>')

# 信息页面
xml_lines.append('')
xml_lines.append('    <!-- 信息页面 -->')
for page in ['about.html', 'contact.html', 'business.html', 'submit.html', 'privacy.html', 'terms.html', 'disclaimer.html']:
    xml_lines.append('    <url>')
    xml_lines.append(f'        <loc>{BASE_URL}/{page}</loc>')
    xml_lines.append(f'        <lastmod>{TODAY}</lastmod>')
    xml_lines.append('        <changefreq>monthly</changefreq>')
    xml_lines.append('        <priority>0.6</priority>')
    xml_lines.append('    </url>')

# 攻略文章
xml_lines.append('')
xml_lines.append(f'    <!-- 攻略文章 ({len(blog_articles)}篇) -->')
for article in blog_articles:
    xml_lines.append('    <url>')
    xml_lines.append(f'        <loc>{BASE_URL}/blog/{article}</loc>')
    xml_lines.append(f'        <lastmod>{TODAY}</lastmod>')
    xml_lines.append('        <changefreq>weekly</changefreq>')
    xml_lines.append('        <priority>0.8</priority>')
    xml_lines.append('    </url>')

# 平台详情页
xml_lines.append('')
xml_lines.append(f'    <!-- 平台详情页 ({len(platform_pages)}个) -->')
for platform in platform_pages:
    xml_lines.append('    <url>')
    xml_lines.append(f'        <loc>{BASE_URL}/platform/{platform}</loc>')
    xml_lines.append(f'        <lastmod>{TODAY}</lastmod>')
    xml_lines.append('        <changefreq>weekly</changefreq>')
    xml_lines.append('        <priority>0.7</priority>')
    xml_lines.append('    </url>')

xml_lines.append('</urlset>')

# 写入文件
output_path = "/workspace/token-nav/sitemap.xml"
with open(output_path, 'w', encoding='utf-8') as f:
    f.write('\n'.join(xml_lines))

print(f"Sitemap generated: {output_path}")
print(f"- Homepage: 1")
print(f"- Blog listing: 1")
print(f"- Category pages: 3")
print(f"- Info pages: 7")
print(f"- Blog articles: {len(blog_articles)}")
print(f"- Platform pages: {len(platform_pages)}")
print(f"- Total URLs: {1 + 1 + 3 + 7 + len(blog_articles) + len(platform_pages)}")
