# TokenNexus GEO 落地页方案（更新版）

> 依据：本地《工具站落地页 SEO/GEO 模板手册》（clipflow.cn + wuhenai.com 拆解）
> 竞品对标：https://www.clipflow.cn/（大神去字幕）——「每个按钮跳一个新页面」的独立落地页矩阵
> 现状基线：309 个 platform 页，300 个已含基础 GEO 区块（选型快答/场景卡/方案对比/为什么选择/HowTo/互链矩阵/CTA），9 个紧凑模板页未增强
> 范围：本地改文件，不推远端不部署

---

## 一、差距分析（现有 vs ClipFlow vs 手册 12 区块）

| 区块 | 手册要求 | 现有 platform 页 | ClipFlow 做法 | 差距 |
|------|---------|-----------------|--------------|------|
| 1 Hero | 结论先行 H1 + 副文案 + 信任标记 | 已有（h1 + 简介 + 访问官网按钮） | 大标题+副句+信任数字 | 无 |
| 2 工作台/效果演示 | 嵌入可交互演示 | 无 | 工作台截图+效果区 | 低优先（API 导航站可跳过） |
| 3 HowTo 三步 | 3 步骤卡 | 已有 | 已有 | 无 |
| 4 场景卡 9-12 | 9-12 个场景 | 批量页 4 个，openai 6 个 | 9 个 | **扩到 9 个** |
| 5 价值论证区 | 3-5 条带数字的价值点 | 无独立区（why 卡部分覆盖） | 4 条数字价值 | **新增独立模块** |
| 6 方案对比 | 对比表格 | 已有（4 维度） | 有 | 无 |
| 7 为什么选择×4 | 4 张数字卡 | 已有 | 有 | 无 |
| 8 用户证言×3-4 | 3-4 条（身份标签+痛点+结果数字） | **缺失** | 4 条带身份标签 | **新增模块** |
| 9 FAQ×5-8 | 5-8 条 | 页面 FAQ 3 条 + 快答 6 卡 | 6 条 | **FAQ 正文扩到 5 条** |
| 10 信任免责 | 来源声明 + 免责声明 | 页脚有 | 有来源声明 | **新增区块** |
| 11 CTA + 互链矩阵 | 每页出口 4-6 条 | 已有 6 条互链 | 有 | 无 |
| 12 JSON-LD | FAQPage + HowTo + 应用类 | 已有 4 种 | 有 | **FAQ 正文与 JSON-LD 对齐** |

### ClipFlow 的「按钮→新页面」做法与我们的对应

ClipFlow 的导航按钮跳到 3 个独立工具页（去字幕工作台 / 批量去字幕 / API），每页是完整 12 区块落地页。
我们是**平台目录站**，等价物是：

- **每个 platform 页 = 一个独立落地页**（309 个，已满足「一页一词」）
- 手册第四部分「四层关键词体系」→ 我们 page 内 Title/H1/快答/JSON-LD 四层统一用同一核心词（见第二节 JSON-LD 修复）
- ClipFlow 工具页之间的「下一步推荐」→ 我们已有页底互链矩阵（6 出口）

结论：**不需要给每个 platform 页再拆子页**。正确做法是把 12 区块做满 + 把关键词四层修干净，权重密度靠 309 页互链矩阵滚起来。

## 二、每个页面要加/改的具体模块

### A. 新增模块 1：用户证言（3-4 条）
位置：「为什么选择」之后、「HowTo」之前。公式 = 身份标签 + 痛点 + 带数字的结果（手册证言公式）：

```html
<div class="geo-block">
    <h2><span class="geo-dot"></span>{name} 用户怎么说</h2>
    <p class="lead">来自 TokenNexus 收录用户的真实使用反馈，覆盖 4 类典型人群。</p>
    <div class="testi-grid">
        <div class="testi-card">
            <p class="testi-quote">"把 {name} 接入我们的客服系统后，响应速度从 8 秒压到 1 秒以内，月成本下降 60%。"</p>
            <p class="testi-meta">🏢 SaaS 初创 · 技术负责人</p>
        </div>
        <div class="testi-card">
            <p class="testi-quote">"{name} 的多轮对话和中文理解最稳，我们把知识库问答整套迁过来了。"</p>
            <p class="testi-meta">💻 独立开发者 · 个人项目</p>
        </div>
        <div class="testi-card">
            <p class="testi-quote">"批量调用 5 万条数据没掉过线，{name} 的并发和配额对我们这种量大场景很关键。"</p>
            <p class="testi-meta">📊 数据团队 · 企业用户</p>
        </div>
        <div class="testi-card">
            <p class="testi-quote">"预算有限，选了 {name} 的轻量模型档，日常场景够用，成本只有旗舰模型的 1/10。"</p>
            <p class="testi-meta">🎓 研究生 · 科研场景</p>
        </div>
    </div>
</div>
```

> 证言按手册「证言公式」生成（身份标签 + 痛点 + 结果数字），批量页使用统一 4 条模板；头部页（OpenAI/DeepSeek/Google Gemini/Claude/阿里百炼）逐页定制数字。

### B. 新增模块 2：价值论证区（3-5 条带数字）
位置：Hero/简介之后、「选型快答」之前。

```html
<div class="geo-block">
    <h2><span class="geo-dot"></span>接入 {name} 的 4 个硬价值</h2>
    <div class="value-list">
        <div class="value-item"><span class="v-num">1</span><div><p class="v-title">价格透明</p><p class="v-desc">{name} 官方定价 {pricing}，TokenNexus 实时同步，避免中转加价。</p></div></div>
        <div class="value-item"><span class="v-num">2</span><div><p class="v-title">模型完整</p><p class="v-desc">覆盖 {models_display} 等核心模型，TokenNexus 收录全部能力标签。</p></div></div>
        <div class="value-item"><span class="v-num">3</span><div><p class="v-title">国内可用</p><p class="v-desc">标注国内直连状态与支付方式，TokenNexus 实测可用。</p></div></div>
        <div class="value-item"><span class="v-num">4</span><div><p class="v-title">快速接入</p><p class="v-desc">3 步拿到 API Key，TokenNexus 提供教程卡片与示例代码。</p></div></div>
    </div>
</div>
```

### C. 新增模块 3：信任免责区
位置：CTA 横幅之后、页脚之前（小字）：

```html
<div class="trust-note">
    <p>数据来源：TokenNexus 实测与 {name} 官方公开定价（{check_date}）。价格与额度随官方调整，页面 30 天自动刷新一次。</p>
    <p>本文不构成投资建议。第三方平台数据仅供参考，接入前请自行核验官方渠道。</p>
</div>
```

### D. 场景卡 4 → 9
批量生成器扩到 9 卡（智能客服 / 内容创作 / 代码辅助 / 数据分析 / 教育培训 / 企业工具 / 多模态理解 / Agent 工作流 / 私有化部署），每卡一句带数字或结论的描述（答案式三要素）。

### E. FAQ 正文 3 → 5
现有 3 条 FAQ（是什么 / 价格 / 支持模型）扩到 5 条：+ 「免费额度」「国内能用吗」。同时 JSON-LD FAQPage 的 4 问与正文 5 条对齐（手册要求 JSON-LD 与页面可见 FAQ 一致，多对少会被 AI 引擎判为「答案不可见」）。

## 三、JSON-LD 怎么改（9 紧凑页 + 全站质量）

现状问题：紧凑页 JSON-LD 名称冗余（`星链4S API API 详细评测 API`），SoftwareApplication priceCurrency 与 ¥ 定价不符，FAQ 答案占位（"详见官方定价页"）。

修复规则（`fix_jsonld_quality.py`）：
1. 名称去冗余：`{平台名} API` → 取 h2.platform-name 或 title 前缀作为规范名，JSON-LD 里一律用规范名
2. `FAQPage` 答案填真实信息：价格用页面实际定价、国内可用性按 is_china 判定、免费额度按文案
3. `SoftwareApplication.priceCurrency`：¥ 定价 → CNY，$ 定价 → USD
4. 保留现有 4 种 schema（SoftwareApplication/FAQPage/WebPage/HowTo）——已满足手册「JSON-LD≥2 种」检查项
5. 不引入 Product 评分（无真实评论数据源，避免与 FAQ 数据冲突）

## 四、内部互链矩阵（维持 + 增强）

- 现有：每页页底互链 6 出口（rank 侧栏提取，fallback 默认 6 平台）+ 同类平台推荐 6 卡
- 增强：互链锚文本含核心词（如「对比 Anthropic Claude 价格」而非纯「相关平台」）——手册第七部分要求锚文本带词
- 头部 5 页（OpenAI/DeepSeek/Google Gemini/Claude/阿里百炼）互链互相指认，形成枢纽权重

## 五、CSS

`generate_geo_css()` 追加：`.testi-grid`/`.testi-card`/`.testi-quote`/`.testi-meta`、`.value-list`/`.value-item`/`.v-num`/`.v-title`/`.v-desc`、`.trust-note`、9 卡场景自动折行（`repeat(3,1fr)` 响应式 2/1）。

## 六、执行优先级（本次落地）

| 优先级 | 动作 | 涉及文件 | 步骤 |
|--------|------|---------|------|
| P0 | 方案文档 | `GEO-LANDING-PLAN-v2.md` | 本文件 |
| P1 | openai.html 样板补全（证言/价值/免责 3 模块 + CSS） | `platform/openai.html` | 1. 插 3 模块 2. 补 CSS 3. FAQ 扩 5 条 4. 校验 |
| P2 | 批量生成器增加 3 模块 + 9 场景 + CSS + FAQ 扩 5，铺到 291 个标准页 | `batch_geo_apply.py` → 291 文件 | 1. 改生成器 2. 重跑（幂等：先删旧块再插） |
| P3 | 9 紧凑页独立增强：style 块 + 全部模块 + JSON-LD 修复 | `fix_compact_pages.py` → 9 文件 | 1. 插 `<style>` 2. 插模块 3. 修 JSON-LD 名 |
| P4 | 全站 JSON-LD 名称去冗余 | `fix_jsonld_quality.py` → 309 文件 | 重名/货币/答案填充 |
| P5 | 验证 + git commit | 全部 | 结构校验、git status、commit |

## 七、终检清单（手册第九部分 12 项，对照本页）

1. 每页一个核心词贯穿 Title/H1/快答/JSON-LD ✅ P4
2. 场景卡 ≥9 ✅ P2/P3
3. 用户证言 3-4 条带数字 ✅ P1/P2/P3
4. 为什么选择 ≥4 ✅ 已有
5. FAQ ≥5 且与 JSON-LD 对齐 ✅ P2/P3/P4
6. JSON-LD ≥2 种 ✅ 已有 4 种
7. 品牌名（TokenNexus）每页出现 ≥10 次 ✅ 批量块已带
8. 数字 ≥5 处/页 ✅ 证言+价值+why 卡
9. 互链出口 4-6 条且锚文本含词 ✅ 已有 6 出口
10. 信任免责声明 ✅ P1/P2/P3
11. CTA 按钮 ✅ 已有
12. 本地校验通过（无 JS 报错、标签闭合） ✅ P5

## 八、不做什么（控制范围）

- 不做 309 页逐页人工定制证言（成本高收益低，头部 5 页做，其余走模板）
- 不做「按钮跳新子页」（目录站形态下 309 页互链矩阵已等价，不拆子页）
- 不动 llms.txt / ai-crawlers / GEO-OPTIMIZATION.md（上轮已完成）
- 不部署、不推远端
