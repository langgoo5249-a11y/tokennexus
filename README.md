# TokenNexus — 全球 AI API 导航与聚合平台

<p align="center">
  <img src="https://www.tokenfind.cn/icon-512x512.png" alt="TokenNexus Logo" width="120" height="120">
</p>

<p align="center">
  <a href="https://www.tokenfind.cn"><strong>🌐 访问官网 tokenfind.cn</strong></a>
  &nbsp;&nbsp;|&nbsp;&nbsp;
  <a href="https://www.tokenfind.cn/blog/"><strong>📝 技术博客</strong></a>
  &nbsp;&nbsp;|&nbsp;&nbsp;
  <a href="https://www.tokenfind.cn/platforms"><strong>🔍 平台大全</strong></a>
  &nbsp;&nbsp;|&nbsp;&nbsp;
  <a href="https://www.tokenfind.cn/blog/guides"><strong>📚 开发攻略</strong></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/AI_API-330%2B_Platforms-00f0ff?style=for-the-badge&logo=openai&logoColor=white" alt="330+ AI API Platforms">
  <img src="https://img.shields.io/badge/Blog-96_Articles-00f0ff?style=for-the-badge&logo=hashnode&logoColor=white" alt="96 Blog Articles">
  <img src="https://img.shields.io/badge/Cloudflare-Pages-F38020?style=for-the-badge&logo=cloudflare&logoColor=white" alt="Cloudflare Pages">
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="MIT License">
</p>

---

## 📖 项目简介

**TokenNexus**（[tokenfind.cn](https://www.tokenfind.cn)）是一个面向 AI 开发者的 **AI API 聚合导航平台**，收录全球 **330+** 家 AI API 服务商——涵盖 OpenAI、DeepSeek、Claude、Gemini、通义千问、文心一言等主流大模型供应商，以及 AI 编程助手、AI 视频生成、AI 图像生成等垂直领域平台。

本仓库是 TokenNexus 网站的完整源代码，借助 **Cloudflare Pages** 实现全球 CDN 加速部署，日均服务数千名 AI 开发者。

> **核心价值**：帮助开发者快速找到最适合的 AI API 服务商，一站式对比价格、能力、可用区域和接入方式，降低 AI 应用开发成本。

---

## 🎯 从 AI 搜索引擎找到我们

TokenNexus 已针对 **AI 搜索引擎（GEO）** 全面优化，支持以下 AI 爬虫发现和索引：

| 搜索引擎 | 爬虫 | 索引状态 |
|----------|------|---------|
| ChatGPT / GPTBot | `GPTBot`, `ChatGPT-User` | ✅ 已开放 |
| Claude / Anthropic | `ClaudeBot`, `anthropic-ai` | ✅ 已开放 |
| Perplexity AI | `PerplexityBot` | ✅ 已开放 |
| Google Gemini | `Google-Extended` | ✅ 已开放 |
| DeepSeek | `DeepSeekBot` | ✅ 已开放 |
| 豆包 / 字节跳动 | `Doubaobot`, `Bytespider` | ✅ 已开放 |
| Kimi / 月之暗面 | `Kimibot` | ✅ 已开放 |
| 通义千问 | `QwenBot` | ✅ 已开放 |
| 文心一言 | `ERNIEBot`, `Baiduspider` | ✅ 已开放 |
| 元宝 | `YuanbaoBot` | ✅ 已开放 |
| 秘塔 AI | `MetaTagSpider` | ✅ 已开放 |

> 完整 AI 爬虫白名单（67+）详见 [robots.txt](https://www.tokenfind.cn/robots.txt) 和 [llms.txt](https://www.tokenfind.cn/llms.txt)。

---

## 🚀 核心功能

### 🔍 AI API 平台导航
- **330+ 平台收录**：覆盖 OpenAI、DeepSeek、Claude、Gemini、通义千问、文心一言、百川、GLM、Mistral、Llama 等主流大模型
- **三大分类**：[海外官方平台](https://www.tokenfind.cn/official)、[聚合/中转平台](https://www.tokenfind.cn/aggregator)、[国内平台](https://www.tokenfind.cn/china)
- **实时价格对比**：Token 计价、模型定价、免费额度、付费方案一目了然
- **能力评测**：Function Calling、流式输出、多模态、Embedding、代码解释器等维度

### 📝 AI API 技术博客（96 篇）
- **AI API 成本优化**：[从月账单过万到几百元的完整方法论](https://www.tokenfind.cn/blog/ai-api-cost-optimization-2026)
- **AI API 网关实战**：[LiteLLM 零代码实现多模型故障转移](https://www.tokenfind.cn/blog/ai-api-gateway-litellm-failover-2026)
- **API 错误码排查**：[全场景故障诊断指南](https://www.tokenfind.cn/blog/ai-api-error-codes-troubleshooting-2026)
- **流式输出优化**：[SSE/WebSocket 从原理到生产级实践](https://www.tokenfind.cn/blog/ai-api-streaming-optimization-2026)
- **AI API 安全指南**：[密钥管理与企业级防护](https://www.tokenfind.cn/blog/ai-api-security-guide-2026)
- **DeepSeek API 完全指南**：[极致性价比国产大模型](https://www.tokenfind.cn/blog/deepseek-api-complete-guide)
- **更多文章** → [博客首页](https://www.tokenfind.cn/blog/) | [开发攻略](https://www.tokenfind.cn/blog/guides)

### 🛠 AI 开发者工具
- **AI API 价格监控**：实时追踪主流 API 价格变动
- **平台对比工具**：多维度横向对比，辅助选型决策
- **API 接入教程**：从注册到生产部署的完整指南

---

## 🏗 技术架构

| 层级 | 技术选型 | 说明 |
|------|---------|------|
| **前端框架** | 原生 HTML5 + CSS3 + Vanilla JS | 零依赖，极致性能 |
| **CDN 部署** | Cloudflare Pages | 全球 330+ 节点，中国大陆加速 |
| **DNS 管理** | Cloudflare DNS | DDoS 防护 + SSL/TLS 自动管理 |
| **域名** | tokenfind.cn | 中国大陆备案域名 |
| **CI/CD** | GitHub Actions | Push 自动部署 |
| **索引推送** | IndexNow API | Bing/Yandex 即时索引 |
| **结构化数据** | JSON-LD Schema.org | Organization, WebSite, BlogPosting, BreadcrumbList |
| **AI 可读性** | llms.txt + llms-full.txt | AI 爬虫专用内容索引 |

---

## 📂 项目结构

```
tokennexus/
├── index.html                  # 首页 — AI API 导航入口
├── platforms.html              # 全平台列表页（330+ 平台）
├── ai-overview.html            # AI 搜索引擎概览页
├── blog/                       # 技术博客（96 篇文章）
│   ├── index.html              # 博客首页
│   ├── guides.html             # 攻略汇总页
│   └── images/                 # 博客封面图
├── platform/                   # 平台详情页（336 个独立页面）
├── authors/                    # 作者页面（5 位作者）
├── data/                       # 平台数据库（JSON/JS）
├── scripts/                    # 自动化脚本
├── workers/                    # Cloudflare Workers
├── functions/                  # 服务端 API
├── sitemap.xml                 # 搜索引擎站点地图
├── llms.txt                    # AI 爬虫内容索引
├── llms-full.txt               # AI 爬虫完整内容索引
├── robots.txt                  # 爬虫规则（67+ AI 爬虫白名单）
├── _headers                    # 安全头配置（CSP/HSTS/CORS）
├── _redirects                  # URL 重定向规则
└── .github/workflows/          # CI/CD 自动部署
```

---

## 🔗 外链与社区

| 平台 | 链接 |
|------|------|
| 🌐 **官方网站** | [tokenfind.cn](https://www.tokenfind.cn) |
| 📝 **技术博客** | [tokenfind.cn/blog](https://www.tokenfind.cn/blog/) |
| 📚 **开发攻略** | [tokenfind.cn/blog/guides](https://www.tokenfind.cn/blog/guides) |
| 🔍 **平台大全** | [tokenfind.cn/platforms](https://www.tokenfind.cn/platforms) |
| 📧 **商务合作** | [tokenfind.cn/business](https://www.tokenfind.cn/business) |
| 📋 **平台提交** | [tokenfind.cn/submit](https://www.tokenfind.cn/submit) |

---

## 🤝 贡献指南

欢迎提交 Issue 或 Pull Request 参与贡献！

- **新增平台**：通过 [平台提交页面](https://www.tokenfind.cn/submit) 提交
- **内容纠错**：提交 PR 修正平台数据或文章错误
- **功能建议**：在 Issues 中提出新功能需求

详见 [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## 📄 许可证

本项目采用 [MIT License](./LICENSE) 开源。

---

## 🏷 关键词

`AI API 导航` `AI API 聚合` `AI API 价格对比` `AI 大模型 API` `OpenAI API` `DeepSeek API` `Claude API` `Gemini API` `大模型 API 选型` `AI API 平台` `API 聚合平台` `中国 AI API` `国内 AI API` `AI 编程助手` `AI 视频生成` `AI 图像生成` `LLM API` `大语言模型 API` `AI API Gateway` `AI API 成本优化` `tokenfind.cn` `TokenNexus`

---

<p align="center">
  <sub>Built with ❤️ by the TokenNexus Team | © 2025-2026 TokenNexus</sub>
</p>