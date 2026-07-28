#!/usr/bin/env python3
"""生成完整的sitemap.xml"""

import os, re
from datetime import datetime

BASE_URL = "https://www.tokenfind.cn"
TODAY = datetime.now().strftime("%Y-%m-%d")

# 获取脚本所在目录的父目录（网站根目录）
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
SITE_ROOT = os.path.dirname(SCRIPT_DIR)
BLOG_DIR = os.path.join(SITE_ROOT, 'blog')
PLATFORM_DIR = os.path.join(SITE_ROOT, 'platform')

# 自动检测博客文章列表（排除index.html和guides.html）
blog_articles = []
if os.path.exists(BLOG_DIR):
    for f in sorted(os.listdir(BLOG_DIR)):
        if f.endswith('.html') and f not in ['index.html', 'guides.html']:
            blog_articles.append(f)

# 获取平台页面列表
platform_pages = []
if os.path.exists(PLATFORM_DIR):
    for f in sorted(os.listdir(PLATFORM_DIR)):
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
xml_lines.append(f'        <loc>{BASE_URL}/blog/guides</loc>')
xml_lines.append(f'        <lastmod>{TODAY}</lastmod>')
xml_lines.append('        <changefreq>daily</changefreq>')
xml_lines.append('        <priority>0.9</priority>')
xml_lines.append('    </url>')

# 分类页面
xml_lines.append('')
xml_lines.append('    <!-- 分类页面 -->')
for page in ['official', 'aggregator', 'china']:
    xml_lines.append('    <url>')
    xml_lines.append(f'        <loc>{BASE_URL}/{page}</loc>')
    xml_lines.append(f'        <lastmod>{TODAY}</lastmod>')
    xml_lines.append('        <changefreq>weekly</changefreq>')
    xml_lines.append('        <priority>0.9</priority>')
    xml_lines.append('    </url>')

# 信息页面
xml_lines.append('')
xml_lines.append('    <!-- 信息页面 -->')
for page in ['about', 'contact', 'business', 'submit', 'privacy', 'terms', 'disclaimer', 'editorial-process']:
    xml_lines.append('    <url>')
    xml_lines.append(f'        <loc>{BASE_URL}/{page}</loc>')
    xml_lines.append(f'        <lastmod>{TODAY}</lastmod>')
    xml_lines.append('        <changefreq>monthly</changefreq>')
    xml_lines.append('        <priority>0.6</priority>')
    xml_lines.append('    </url>')

# 作者页面
AUTHORS_DIR = os.path.join(SITE_ROOT, 'authors')
if os.path.exists(AUTHORS_DIR):
    xml_lines.append('')
    xml_lines.append('    <!-- 作者页面 -->')
    xml_lines.append('    <url>')
    xml_lines.append(f'        <loc>{BASE_URL}/authors/</loc>')
    xml_lines.append(f'        <lastmod>{TODAY}</lastmod>')
    xml_lines.append('        <changefreq>monthly</changefreq>')
    xml_lines.append('        <priority>0.7</priority>')
    xml_lines.append('    </url>')
    for af in sorted(os.listdir(AUTHORS_DIR)):
        if af.endswith('.html') and af != 'index.html':
            xml_lines.append('    <url>')
            xml_lines.append(f'        <loc>{BASE_URL}/authors/{af.replace(".html", "")}</loc>')
            xml_lines.append(f'        <lastmod>{TODAY}</lastmod>')
            xml_lines.append('        <changefreq>monthly</changefreq>')
            xml_lines.append('        <priority>0.6</priority>')
            xml_lines.append('    </url>')

def get_article_date(article_filename):
    """从文章HTML中提取发布日期"""
    article_path = os.path.join(BLOG_DIR, article_filename)
    if not os.path.exists(article_path):
        return TODAY
    try:
        with open(article_path, 'r', encoding='utf-8') as f:
            content = f.read(8000)
        # 尝试多种方式提取日期
        # 1. article:published_time
        date_match = re.search(r'article:published_time"\s+content="([^"]+)"', content)
        if date_match:
            return date_match.group(1)[:10]
        # 2. datePublished in JSON-LD
        date_match = re.search(r'"datePublished"\s*:\s*"(\d{4}-\d{2}-\d{2})"', content)
        if date_match:
            return date_match.group(1)
        # 3. datetime attribute
        date_match = re.search(r'datetime="(\d{4}-\d{2}-\d{2})"', content)
        if date_match:
            return date_match.group(1)
    except:
        pass
    return TODAY

# AI 模型发现文件 (llms.txt)
xml_lines.append('')
xml_lines.append('    <!-- AI 模型发现文件 -->')
for txt_file in ['llms.txt', 'llms-full.txt']:
    xml_lines.append('    <url>')
    xml_lines.append(f'        <loc>{BASE_URL}/{txt_file}</loc>')
    xml_lines.append(f'        <lastmod>{TODAY}</lastmod>')
    xml_lines.append('        <changefreq>weekly</changefreq>')
    xml_lines.append('        <priority>0.8</priority>')
    xml_lines.append('    </url>')

# Image Sitemap
xml_lines.append('')
xml_lines.append('    <!-- Image Sitemap -->')
xml_lines.append('    <url>')
xml_lines.append(f'        <loc>{BASE_URL}/image-sitemap.xml</loc>')
xml_lines.append(f'        <lastmod>{TODAY}</lastmod>')
xml_lines.append('        <changefreq>weekly</changefreq>')
xml_lines.append('        <priority>0.7</priority>')
xml_lines.append('    </url>')

# 攻略文章
xml_lines.append('')
xml_lines.append(f'    <!-- 攻略文章 ({len(blog_articles)}篇) -->')
for article in blog_articles:
    pub_date = get_article_date(article)
    xml_lines.append('    <url>')
    xml_lines.append(f'        <loc>{BASE_URL}/blog/{article.replace(".html", "")}</loc>')
    xml_lines.append(f'        <lastmod>{pub_date}</lastmod>')
    xml_lines.append('        <changefreq>weekly</changefreq>')
    xml_lines.append('        <priority>0.8</priority>')
    xml_lines.append('    </url>')

# 平台详情页
xml_lines.append('')
xml_lines.append(f'    <!-- 平台详情页 ({len(platform_pages)}个) -->')
for platform in platform_pages:
    xml_lines.append('    <url>')
    xml_lines.append(f'        <loc>{BASE_URL}/platform/{platform.replace(".html", "")}</loc>')
    xml_lines.append(f'        <lastmod>{TODAY}</lastmod>')
    xml_lines.append('        <changefreq>weekly</changefreq>')
    xml_lines.append('        <priority>0.7</priority>')
    xml_lines.append('    </url>')

xml_lines.append('</urlset>')

# 写入文件
output_path = os.path.join(SITE_ROOT, "sitemap.xml")
with open(output_path, 'w', encoding='utf-8') as f:
    f.write('\n'.join(xml_lines))

print(f"Sitemap generated: {output_path}")
print(f"- Homepage: 1")
print(f"- Blog listing: 1")
print(f"- Category pages: 3")
print(f"- Info pages: 8")
print(f"- Author pages: {1 + len([f for f in os.listdir(AUTHORS_DIR) if f.endswith('.html') and f != 'index.html']) if os.path.exists(AUTHORS_DIR) else 0}")
print(f"- Blog articles: {len(blog_articles)}")
print(f"- Platform pages: {len(platform_pages)}")
print(f"- Total URLs: {1 + 1 + 3 + 8 + len(blog_articles) + len(platform_pages) + (1 + len([f for f in os.listdir(AUTHORS_DIR) if f.endswith('.html') and f != 'index.html']) if os.path.exists(AUTHORS_DIR) else 0)}")
