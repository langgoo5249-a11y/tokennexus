# TokenNexus GEO（生成式引擎优化）指南

## 什么是 GEO？

GEO（**G**enerative **E**ngine **O**ptimization，**生成式引擎优化 / AI 搜索引擎优化**）是指针对 **AI 搜索引擎与答案引擎**（ChatGPT、Claude、Perplexity、Google Gemini、DeepSeek、豆包、Kimi、通义、文心、元宝、秘塔等）进行优化，使其能**发现、理解并引用**本站内容，从而在用户向 AI 提问时获得推荐与引用。

> **定义统一说明（重要）**
> 本仓库此前的 `GEO-OPTIMIZATION.md` 将 GEO 写作「Geographic Optimization（地理位置优化）」，使用 `geo.region` / `geo.placename` / `geo.position`、百度 `location`、Yandex 经纬度、Google Business Profile 等内容。这与 README 中「**AI 搜索引擎（GEO）**」以及 `robots.txt` 中 67+ **AI 爬虫白名单**的口径直接冲突。
> 现**统一为 Generative Engine Optimization（生成式引擎优化）**。理由：本站是面向全球 AI 开发者的 AI API 聚合导航站，核心流量来自 AI 答案引擎而非本地/地理搜索；且文章实际并未部署 `geo.region` 等地理标签，落地的是 AI 爬虫放行与结构化数据。
> 如后续确有地域定向需求，请单独以「本地 SEO / 地理定向（Geographic SEO）」名义实施，**不要再使用 GEO 这一缩写**，避免再次混淆。

## 本站已落地的 GEO 措施

### 1. AI 爬虫白名单（robots.txt）
已对 67+ AI 爬虫开放索引，包括：`GPTBot`、`ClaudeBot`、`PerplexityBot`、`Google-Extended`、`DeepSeekBot`、`Doubaobot`、`Kimibot`、`QwenBot`、`ERNIEBot`、`YuanbaoBot`、`MetaTagSpider` 等。

### 2. 页面级 AI 爬虫放行（ai-crawlers meta）
每篇文章/页面通过以下标签显式允许指定 AI 爬虫抓取与引用：

```html
<meta name="ai-crawlers" content="allow GPTBot, ClaudeBot, OAI-SearchBot, Claude-SearchBot, ChatGPT-User, Claude-User, Doubaobot, ERNIEBot, QwenBot, Kimibot, ChatGLM-Spider, DeepSeekBot, PerplexityBot, Google-Extended, Applebot-Extended, CCBot, Meta-ExternalAgent, Amazonbot">
```

### 3. AI 可读内容索引（llms.txt / llms-full.txt）
提供 `llms.txt` 与 `llms-full.txt`，以 AI 友好的纯文本格式暴露站点核心内容与文章清单，便于答案引擎直接摄取与引用。

### 4. 结构化数据（JSON-LD）
全站输出 Schema.org 结构化数据：`Organization`、`WebSite`、`BlogPosting`、`BreadcrumbList`，提升机器可读性与被引用概率。

### 5. 内容可引用性
- 使用语义化 HTML（清晰的标题层级、列表、表格），便于 AI 抽取要点。
- 内容注重**事实准确、来源可查、结论明确**，契合答案引擎对「权威、可引用」内容的偏好。
- 文章更新时同步维护 JSON-LD 的 `dateModified`，向搜索引擎传递时效信号。

## GEO 维护清单（建议）

- [ ] 跟随主流 AI 爬虫 UA 变更，及时更新 `robots.txt` 与 `ai-crawlers` meta
- [ ] 新增文章默认携带 `ai-crawlers` meta 与 JSON-LD
- [ ] 定期用内容时效性扫描脚本复核含**报价 / 模型版本**的文章，避免 AI 引擎引用过期价格（参见 `content_freshness_scan.py` 与 `CONTENT_FRESHNESS_REPORT.md`）
- [ ] 不在文档中将「地理位置优化」称为 GEO，防止口径回退
