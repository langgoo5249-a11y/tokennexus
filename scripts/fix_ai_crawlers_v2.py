#!/usr/bin/env python3
"""AI 爬虫全面开放修复 v2 — 2026-07-14"""

import os
from datetime import datetime

SITE_ROOT = "/workspace/tokennexus"
TODAY = "2026-07-14"

NEW_ROBOTS_TXT = """# TokenNexus 机器人访问协议
# robots.txt for tokenfind.cn
# 更新日期: 2026-07-14 (AI爬虫全面白名单 v2 — 67+ 爬虫)
# 策略: 绝对不阻止任何AI爬虫 — 全部开放
# ============================================================

# ============================================
# 一、传统搜索引擎爬虫
# ============================================

# Google 搜索
User-agent: Googlebot
Allow: /
Crawl-delay: 0

User-agent: Googlebot-Image
Allow: /

User-agent: Googlebot-News
Allow: /

User-agent: Googlebot-Video
Allow: /

# Google R&D 爬虫
User-agent: GoogleOther
Allow: /

User-agent: GoogleOther-Image
Allow: /

User-agent: GoogleOther-Video
Allow: /

# Google AI (Gemini) 训练控制 Token
User-agent: Google-Extended
Allow: /

# Bing 搜索
User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: BingPreview
Allow: /

# ============================================
# 二、百度爬虫组
# ============================================

User-agent: Baiduspider
Allow: /
Crawl-delay: 2

User-agent: Baiduspider-image
Allow: /

User-agent: Baiduspider-video
Allow: /

User-agent: Baiduspider-news
Allow: /

# 百度文心一言 AI 爬虫
User-agent: ERNIEBot
Allow: /

User-agent: ERNIE-Bot
Allow: /

User-agent: YiyanBot
Allow: /

User-agent: Baidu-YunGuanCe
Allow: /

# ============================================
# 三、字节跳动/豆包 AI 爬虫组
# ============================================

# 豆包 AI 专用爬虫
User-agent: Doubaobot
Allow: /

# 字节跳动通用爬虫
User-agent: Bytespider
Allow: /

# TikTok/抖音视频生态爬虫
User-agent: TikTokSpider
Allow: /

# ============================================
# 四、阿里/通义千问 AI 爬虫组
# ============================================

User-agent: QwenBot
Allow: /

User-agent: TongyiBot
Allow: /

User-agent: TongyiSpider
Allow: /

User-agent: AliyunBot
Allow: /

# ============================================
# 五、腾讯 AI 爬虫组
# ============================================

User-agent: YuanbaoBot
Allow: /

User-agent: TencentBot
Allow: /

# 搜狗搜索爬虫（腾讯旗下）
User-agent: Sogou web spider
Allow: /
Crawl-delay: 2

User-agent: Sogouspider
Allow: /

# ============================================
# 六、月之暗面 / Kimi AI 爬虫组
# ============================================

User-agent: Kimibot
Allow: /

User-agent: MoonshotBot
Allow: /

User-agent: KimiCrawler
Allow: /

# ============================================
# 七、智谱 / ChatGLM AI 爬虫组
# ============================================

User-agent: ChatGLM-Spider
Allow: /

User-agent: ChatGLMBot
Allow: /

User-agent: ZhipuAI-DataBot
Allow: /

# ============================================
# 八、DeepSeek AI 爬虫
# ============================================

User-agent: DeepSeekBot
Allow: /

# ============================================
# 九、360 AI 爬虫组
# ============================================

User-agent: 360Spider
Allow: /
Crawl-delay: 2

User-agent: 360Spider-Image
Allow: /

User-agent: 360Spider-Video
Allow: /

# ============================================
# 十、其他中国 AI 爬虫
# ============================================

User-agent: TiangongBot
Allow: /

User-agent: MitaBot
Allow: /

User-agent: SparkBot
Allow: /

User-agent: BaichuanBot
Allow: /

User-agent: BaichuanSpider
Allow: /

User-agent: MiniMaxBot
Allow: /

User-agent: YiBot
Allow: /

User-agent: StepBot
Allow: /

User-agent: CloudflareBrowserRenderingCrawler
Allow: /

# ============================================
# 十一、OpenAI AI 爬虫组
# ============================================

User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

# ============================================
# 十二、Anthropic / Claude AI 爬虫组
# ⚠️ Claude-Web 和 anthropic-ai 已于 2025年9月正式弃用
# ============================================

User-agent: ClaudeBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: Claude-User
Allow: /

# ============================================
# 十三、Perplexity AI 爬虫组
# ============================================

User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-User
Allow: /

# ============================================
# 十四、Meta AI 爬虫组
# ============================================

User-agent: Meta-ExternalAgent
Allow: /

User-agent: Meta-ExternalFetcher
Allow: /

# ============================================
# 十五、Apple AI 爬虫组
# ============================================

User-agent: Applebot
Allow: /

User-agent: Applebot-Extended
Allow: /

# ============================================
# 十六、其他国际 AI 爬虫
# ============================================

User-agent: cohere-ai
Allow: /

User-agent: CCBot
Allow: /

User-agent: DuckDuckBot
Allow: /

User-agent: DuckAssistBot
Allow: /

User-agent: Bravebot
Allow: /

User-agent: KagiBot
Allow: /

User-agent: YouBot
Allow: /

# ============================================
# 通用规则
# ============================================
User-agent: *
Allow: /
Crawl-delay: 1

# ============================================
# 禁止访问的路径
# ============================================
Disallow: /admin/
Disallow: /_next/
Disallow: /api/admin/
Disallow: /private/
Disallow: /temp/
Disallow: /test/
Disallow: /functions/

# ============================================
# Sitemap 位置
# ============================================
Sitemap: https://www.tokenfind.cn/sitemap.xml
Sitemap: https://www.tokenfind.cn/image-sitemap.xml
"""


def fix_robots():
    robots_path = os.path.join(SITE_ROOT, "robots.txt")
    with open(robots_path, 'r') as f:
        old = f.read()
    backup = robots_path + ".bak." + TODAY
    with open(backup, 'w') as f:
        f.write(old)
    with open(robots_path, 'w') as f:
        f.write(NEW_ROBOTS_TXT)
    print(f"✅ robots.txt 已重写 ({len(NEW_ROBOTS_TXT)} 字符)")

    # Verify
    with open(robots_path, 'r') as f:
        content = f.read()
    key_crawlers = [
        "QwenBot", "Kimibot", "ChatGLM-Spider", "OAI-SearchBot",
        "ClaudeBot", "Claude-SearchBot", "Claude-User", "CCBot",
        "GoogleOther", "DuckAssistBot", "Perplexity-User", "Meta-ExternalFetcher"
    ]
    deprecated = ["Claude-Web", "anthropic-ai"]
    for c in key_crawlers:
        assert c in content, f"MISSING: {c}"
    for c in deprecated:
        assert f"User-agent: {c}" not in content, f"DEPRECATED STILL PRESENT: {c}"
    print("✅ 验证通过：所有关键爬虫已添加，弃用 UA 已移除")


def fix_llms():
    llms_path = os.path.join(SITE_ROOT, "llms.txt")
    with open(llms_path, 'r') as f:
        content = f.read()

    old_text = "已对 Googlebot、Bingbot、Baiduspider、Bytespider（字节/豆包）、ChatGPT-User、GPTBot、Claude-Web、PerplexityBot、Google-Extended（Gemini）、Meta-ExternalAgent 等开放全部访问权限。"
    new_text = "已对全球 67+ AI 爬虫和搜索引擎爬虫开放全部访问权限，包括：Doubaobot（豆包）、ERNIEBot（文心一言）、QwenBot（通义千问）、Kimibot（Kimi）、ChatGLM-Spider（智谱）、DeepSeekBot、YuanbaoBot（腾讯元宝）、GPTBot、OAI-SearchBot、ChatGPT-User、ClaudeBot、Claude-SearchBot、Claude-User、PerplexityBot、Google-Extended、Applebot-Extended、CCBot、Meta-ExternalAgent 等。详见 robots.txt。"

    if old_text in content:
        content = content.replace(old_text, new_text)
        with open(llms_path, 'w') as f:
            f.write(content)
        print("✅ llms.txt 已更新")
    else:
        print("⚠️ llms.txt 未找到需要更新的文本")


def add_ai_meta_to_html(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    if 'ai-training-permission' in content:
        return False
    ai_meta = '\n    <!-- AI 爬虫训练许可声明 -->\n    <meta name="ai-training-permission" content="allow-all">\n    <meta name="ai-crawlers" content="allow GPTBot, ClaudeBot, OAI-SearchBot, Claude-SearchBot, ChatGPT-User, Claude-User, Doubaobot, ERNIEBot, QwenBot, Kimibot, ChatGLM-Spider, DeepSeekBot, PerplexityBot, Google-Extended, Applebot-Extended, CCBot, Meta-ExternalAgent">\n'
    if '</head>' in content:
        content = content.replace('</head>', ai_meta + '</head>', 1)
        with open(filepath, 'w') as f:
            f.write(content)
        return True
    return False


def fix_html_meta():
    pages = [
        "index.html", "about.html", "blog/index.html", "blog/guides.html"
    ]
    for p in pages:
        path = os.path.join(SITE_ROOT, p)
        if os.path.exists(path):
            if add_ai_meta_to_html(path):
                print(f"✅ {p} 已添加 AI 训练许可 meta")
            else:
                print(f"⚠️ {p} 已存在 AI meta，跳过")


def main():
    print("=" * 60)
    print("AI 爬虫全面开放修复 v2")
    print(f"执行时间: {datetime.now().isoformat()}")
    print("=" * 60)

    fix_robots()
    fix_llms()
    fix_html_meta()

    print("\n" + "=" * 60)
    print("全部修复完成！")
    print("=" * 60)


if __name__ == "__main__":
    main()