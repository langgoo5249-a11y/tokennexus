# TokenNexus 博客内容时效性报告与刷新计划

> 生成日期: 2026-08-14 ｜ 扫描对象: `blog/` 下 100 篇文章
> 配套脚本: `content_freshness_scan.py`（在你的仓库根目录运行，输出精确命中数）

## 一、为什么时效性重要

本站是 AI API 聚合导航站，文章大量涉及**具体报价、模型版本、配额、路由策略**。这类信息迭代极快：

- 模型价格战（如 2026 年 7 月的「价格崩盘」）可在数周内改写结论；
- 新模型（GPT-5、Claude 4、Gemini 2.5 等）发布会让旧对比文瞬间过时；
- 一旦 Google 或 AI 答案引擎把**过期价格**索引为权威结论，会直接损害站点可信度与转化。

因此，含硬数据的文章需要**周期性刷新**，而非「写完即终态」。

## 二、风险分级（基于 slug 关键词初判，共 100 篇）

| 等级 | 数量 | 判定 | 典型主题 |
|------|------|------|----------|
| 🔴 高 (HIGH) | 12 | 同时命中「价格」+「模型/年份」 | 价格对比、成本优化、配额管理、价格崩盘路由、模型路由 |
| 🟡 中 (MID) | 10 | 仅命中「价格」或「模型」 | 单模型指南（Claude/DeepSeek/Gemini）、模型对比、发布潮综述 |
| 🟢 低 (LOW) | 78 | 概念/方法/流程类 | 架构、安全、缓存、测试、合规、Prompt 工程等 |

### 🔴 高优先级 12 篇（建议 1–2 个月复核一次）
```
ai-api-bill-explosion-hidden-costs-2026.html
ai-api-budget-quota-management-2026.html
ai-api-cost-attribution-tracking-2026.html
ai-api-cost-optimization-2026.html
ai-api-hidden-cost-traps-2026.html
ai-api-peak-pricing-migration-guide-2026.html
ai-api-price-crash-july-2026-multi-model-routing-guide.html
ai-api-pricing-comparison-2026-guide.html
ai-api-pricing-comparison-guide-2025.html   ← 2025 旧版，仍在线，最紧急
ai-api-pricing-guide-2026.html
ai-api-token-pricing-cost-calculation-guide-2026.html
ai-model-routing-guide-2026.html
```

### 🟡 中优先级 10 篇（建议每季度复核）
```
ai-api-ab-testing-model-selection-2026.html
ai-api-multimodal-gpt4o-gemini-complete-guide-2026.html
ai-api-quality-degradation-model-drift-2026.html
ai-model-release-avalanche-july-2026-developer-guide.html
claude-api-guide-2026.html
deepseek-api-complete-guide.html
gemini-api-complete-guide.html
gpt4o-vs-claude35-sonnet-comparison.html
mcp-model-context-protocol-practical-guide-2026.html
openai-vs-deepseek-2026.html
```

## 三、紧急项

- **`ai-api-pricing-comparison-guide-2025.html`**：2025 年旧版价格对比文仍在线（2026 年 8 月），内容大概率已严重过时。**建议**：刷新为 2026 版并 301 重定向旧 URL，或直接下线。
- 所有 `-2026` 中带具体月份（如 `july-2026`）的文章，到对应月份之后即进入「需复核」状态。

## 四、刷新节奏建议

| 等级 | 复核周期 | 动作 |
|------|----------|------|
| 🔴 HIGH | 每 1–2 个月 | 核对最新报价/配额/模型，更新正文 + JSON-LD `dateModified` |
| 🟡 MID | 每季度 | 核对模型版本与能力边界，补注「数据截至 YYYY-MM」 |
| 🟢 LOW | 每 6–12 个月或重大变更时 | 通读一遍，修正失效链接/API 名称 |

## 五、可执行流程（落地建议）

1. **本地跑扫描**：在仓库根目录执行 `python3 content_freshness_scan.py`，得到每篇的精确 price/model/date 命中数（比 slug 初判更准）。
2. **建刷新看板**：以 `content_freshness_scan_report.csv` 为基线，给 HIGH/MID 文章标注「上次核实日期」「下次复核日期」「负责人」。
3. **刷新时必做**：
   - 更新正文硬数据；
   - 同步 JSON-LD 的 `dateModified`（向搜索引擎发时效信号）；
   - 在文中加一句「数据截至 2026-MM」降低误导风险。
4. **旧版处理**：如 `...-2025` 类旧文，刷新后 301 到新版本，避免重复内容抢排名。
5. **自动化（可选进阶）**：接入价格监控数据源，当监测到主流 API 调价时自动开 Issue 提醒复核。

## 六、与本次其它修复的关系

- 本计划独立于已上线的 **SEO meta 规范化**（commit `4a06f51`）；
- 与 **GEO 文档统一**（`GEO-OPTIMIZATION.fixed.md`）共用同一维护节奏——GEO 维护清单已包含「定期复核含报价文章」一条。
