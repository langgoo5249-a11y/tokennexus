#!/usr/bin/env node
/**
 * TokenNexus AI 新闻抓取器
 *
 * 从多个中英文 RSS 源抓取 AI 相关新闻，做去重、事件聚类、热度打分，
 * 输出 data/ai-news.json，供首页三栏渲染：
 *   - 中栏「AI 新闻采集公告区」：按时间倒序的最新动态
 *   - 右栏「AI 新闻排行榜」：按热度分数排序
 *   - 左栏「免费 token 攻略」：免费额度关键词命中的条目自动补位
 *
 * 运行：node scripts/fetch-ai-news.mjs
 * 容错原则：单个源失败不影响整体；全部源失败时保留旧数据、不覆盖。
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const OUT_DIR = path.resolve('data');
const OUT_FILE = path.join(OUT_DIR, 'ai-news.json');
const HISTORY_DAYS = 5;      // 历史条目保留天数（抓取失败时兜底）
const MAX_NEWS = 40;         // 公告区最多条数
const MAX_RANKING = 20;      // 排行榜最多条数
const MAX_FREE = 8;          // 免费攻略补位最多条数
const FETCH_TIMEOUT = 18000; // 单源超时
const MAX_PER_SOURCE = 25;   // 单源最多取多少条

/** 新闻源清单：weight 影响热度，aiOnly 表示频道本身即 AI 垂直频道 */
const SOURCES = [
  { id: 'openai',      name: 'OpenAI',           url: 'https://openai.com/news/rss.xml',                                        lang: 'en', weight: 1.4, aiOnly: true  },
  { id: 'techcrunch',  name: 'TechCrunch',       url: 'https://techcrunch.com/category/artificial-intelligence/feed/',          lang: 'en', weight: 1.3, aiOnly: true  },
  { id: 'verge',       name: 'The Verge',        url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml',      lang: 'en', weight: 1.3, aiOnly: true  },
  { id: 'mit',         name: 'MIT Tech Review',  url: 'https://www.technologyreview.com/topic/artificial-intelligence/feed',    lang: 'en', weight: 1.2, aiOnly: true  },
  { id: 'venturebeat', name: 'VentureBeat',      url: 'https://venturebeat.com/category/ai/feed/',                              lang: 'en', weight: 1.2, aiOnly: true  },
  { id: 'ars',         name: 'Ars Technica',     url: 'https://feeds.arstechnica.com/arstechnica/technology-lab',               lang: 'en', weight: 1.1, aiOnly: false },
  { id: 'hn',          name: 'Hacker News',      url: 'https://hnrss.org/newest?q=AI+OR+LLM+OR+GPT+OR+OpenAI+OR+Anthropic&points=50', lang: 'en', weight: 1.1, aiOnly: true },
  { id: 'qbitai',      name: '量子位',            url: 'https://www.qbitai.com/feed',                                            lang: 'zh', weight: 1.2, aiOnly: true  },
  { id: 'ifanr',       name: '爱范儿',            url: 'https://www.ifanr.com/feed',                                             lang: 'zh', weight: 1.1, aiOnly: false },
  { id: 'leiphone',    name: '雷锋网',            url: 'https://www.leiphone.com/feed',                                          lang: 'zh', weight: 1.1, aiOnly: false },
  { id: 'tmtpost',     name: '钛媒体',            url: 'https://www.tmtpost.com/rss',                                            lang: 'zh', weight: 1.0, aiOnly: false },
  { id: 'ithome',      name: 'IT之家',            url: 'https://www.ithome.com/rss/',                                            lang: 'zh', weight: 1.0, aiOnly: false },
];

/** AI 相关性判定 */
const AI_TERMS = /(openai|anthropic|claude|chatgpt|\bgpt|gemini|deepseek|qwen|通义|llama|mistral|\bgrok|sora|kimi|豆包|文心|智谱|月之暗面|商汤|人工智能|大模型|大语言模型|生成式|机器学习|深度学习|多模态|智能体|\bagent|多智能体|\bllm\b|\bai\b|aigc|推理模型|算力|英伟达|nvidia|hugging ?face|transformer|扩散模型|具身智能|自动驾驶)/i;

/** 免费 / 省钱相关判定：命中后进入左栏「免费攻略」补位
 *  中文直接匹配「免费」（AI 语境下基本等同于免费额度/免费开放）；
 *  英文只认精确短语，避免 "AI-free schools" / "if you pay" 这类误判 */
const FREE_TERMS = /(免费|白嫖|赠送|赠金|限免|试用额度|free tier|free credits?|free trial|free api|free plan|free usage|free access|free quota|no cost|complimentary)/i;

/** 开源可自部署：零 API 成本的另一条免费路线（如开源权重本地推理） */
const OPEN_SOURCE_TERMS = /(开源|open.?source|self.?host|本地部署|本地运行|权重开放)/i;

/** 热度加成词：重要性信号 */
const HOT_TERMS = /(发布|推出|上线|开源|融资|收购|裁员|突破|刷新|超越|免费|降价|涨价|停服|监管|禁令|专利|芯片|launch|release|unveil|raise[sd]?|acquire|layoff|breakthrough|free|price|cut|ban|lawsuit)/i;

/** 标签提取表：命中即生成前端彩色标签 */
const TAGS = [
  ['GPT',      /\bgpt[-\s]?[\d.]*|chatgpt|openai/i],
  ['Claude',   /claude|anthropic/i],
  ['Gemini',   /gemini|google (ai|deepmind)|deepmind/i],
  ['DeepSeek', /deepseek/i],
  ['Qwen',     /qwen|通义/i],
  ['Llama',    /llama|meta ai/i],
  ['开源',      /开源|open.?source/i],
  ['免费',      /免费|free tier|\bfree\b/i],
  ['融资',      /融资|raise[sd]? \$|funding|valuation|估值/i],
  ['发布',      /发布|推出|上线|launch|release|unveil/i],
  ['AI 视频',   /视频生成|sora|veo|可灵|runway|video (model|generat)/i],
  ['AI 编程',   /代码|编程|coding|copilot|cursor|codex/i],
  ['芯片',      /芯片|英伟达|nvidia|gpu|算力|chip/i],
  ['监管',      /监管|禁令|诉讼|lawsuit|regulat|\bban\b|\bgdpr\b/i],
];

const now = Date.now();

/* ───────────────────────── 工具函数 ───────────────────────── */

function decodeEntities(input) {
  if (!input) return '';
  return input
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');
}

function stripHtml(input) {
  // 注意顺序：必须先解包 CDATA，再剥离 HTML 标签。
  // 若先剥标签，`<[^>]+>` 会把整段 `<![CDATA[...]]>` 当作标签吃掉，
  // 导致大量源的标题解析为空（The Verge / OpenAI / 36氪 等均用 CDATA 包裹）。
  const unwrapped = String(input || '').replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1');
  return decodeEntities(
    unwrapped
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
  )
    .replace(/\s+/g, ' ')
    .trim();
}

function truncate(text, max) {
  if (!text) return '';
  return text.length <= max ? text : text.slice(0, max) + '…';
}

/** 从 XML 片段中按标签名取值 */
function pickTag(block, names) {
  for (const name of names) {
    const re = new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, 'i');
    const m = block.match(re);
    if (m && m[1]) return m[1];
  }
  return '';
}

/** Atom 的 <link href="..."/> */
function pickAtomLink(block) {
  const alt = block.match(/<link[^>]*rel=["']alternate["'][^>]*href=["']([^"']+)["']/i);
  if (alt) return alt[1];
  const any = block.match(/<link[^>]*href=["']([^"']+)["']/i);
  return any ? any[1] : '';
}

function extractBlocks(xml, tag) {
  const blocks = [];
  const openTag = `<${tag}`;
  const closeTag = `</${tag}>`;
  let cursor = 0;
  while (true) {
    const start = xml.indexOf(openTag, cursor);
    if (start === -1) break;
    const end = xml.indexOf(closeTag, start);
    if (end === -1) break;
    blocks.push(xml.slice(start, end + closeTag.length));
    cursor = end + closeTag.length;
  }
  return blocks;
}

/** URL 规范化：去掉追踪参数，避免同一文章重复 */
function normalizeUrl(raw) {
  if (!raw) return '';
  try {
    const u = new URL(raw);
    const drop = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'from', 'ref', 'spm', 'share_token'];
    drop.forEach((k) => u.searchParams.delete(k));
    u.hash = '';
    return u.toString();
  } catch {
    return raw;
  }
}

function normalizeTitle(title) {
  return String(title || '')
    .toLowerCase()
    .replace(/[\s\u3000]+/g, '')
    .replace(/[|｜\-—–·•:：,，。.!！?？'"“”‘’()（）\[\]【】]/g, '');
}

function hashId(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(36);
}

/** 标题分词：英文按单词，中文按 bigram，用于事件聚类 */
function titleTokens(title) {
  const cleaned = String(title || '').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  const set = new Set();
  for (const word of cleaned.split(/\s+/)) {
    if (!word) continue;
    if (/^[a-z0-9]+$/.test(word)) {
      if (word.length > 1) set.add(word);
    } else {
      for (let i = 0; i < word.length - 1; i += 1) set.add(word.slice(i, i + 2));
    }
  }
  return set;
}

function jaccard(a, b) {
  if (!a.size || !b.size) return 0;
  let inter = 0;
  for (const item of a) if (b.has(item)) inter += 1;
  return inter / (a.size + b.size - inter);
}

function toISO(raw) {
  if (!raw) return '';
  const t = Date.parse(stripHtml(raw));
  if (Number.isNaN(t)) return '';
  return new Date(t).toISOString();
}

function extractTags(text) {
  const out = [];
  for (const [label, re] of TAGS) {
    if (re.test(text)) out.push(label);
    if (out.length >= 3) break;
  }
  return out;
}

/* ───────────────────────── 抓取与解析 ───────────────────────── */

async function fetchText(url) {
  const res = await fetch(url, {
    redirect: 'follow',
    signal: AbortSignal.timeout(FETCH_TIMEOUT),
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; TokenNexusNewsBot/1.0; +https://www.tokenfind.cn)',
      Accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml;q=0.9, */*;q=0.8',
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = await res.arrayBuffer();
  const head = new TextDecoder('utf-8').decode(buf.slice(0, 300));
  const encMatch = head.match(/encoding=["']([^"']+)["']/i);
  let enc = (encMatch ? encMatch[1] : 'utf-8').toLowerCase();
  if (enc === 'gb2312' || enc === 'gbk') enc = 'gbk';
  try {
    return new TextDecoder(enc).decode(buf);
  } catch {
    return new TextDecoder('utf-8').decode(buf);
  }
}

function parseFeed(xml, source) {
  const isAtom = /<feed[\s>]/i.test(xml);
  const blocks = isAtom ? extractBlocks(xml, 'entry') : extractBlocks(xml, 'item');
  const items = [];

  for (const block of blocks.slice(0, MAX_PER_SOURCE)) {
    const title = stripHtml(pickTag(block, ['title']));
    if (!title) continue;

    const link = normalizeUrl(
      isAtom ? pickAtomLink(block) : stripHtml(pickTag(block, ['link']))
    );
    if (!link) continue;

    const publishedAt = toISO(
      pickTag(block, ['pubDate', 'published', 'updated', 'dc:date', 'date'])
    );

    const summary = truncate(
      stripHtml(pickTag(block, ['description', 'summary', 'content:encoded', 'content'])),
      180
    );

    const haystack = `${title} ${summary}`;
    if (!source.aiOnly && !AI_TERMS.test(haystack)) continue;

    items.push({
      id: hashId(link || title),
      title,
      url: link,
      summary,
      source: source.name,
      sourceId: source.id,
      lang: source.lang,
      weight: source.weight,
      publishedAt: publishedAt || new Date(now).toISOString(),
      free: FREE_TERMS.test(haystack),
      openSource: OPEN_SOURCE_TERMS.test(haystack),
      tags: extractTags(haystack),
    });
  }

  return items;
}

/* ───────────────────────── 去重 / 聚类 / 打分 ───────────────────────── */

function dedupe(items) {
  const seenUrl = new Set();
  const seenTitle = new Set();
  return items.filter((item) => {
    const key = normalizeTitle(item.title);
    if (seenUrl.has(item.url) || seenTitle.has(key)) return false;
    seenUrl.add(item.url);
    seenTitle.add(key);
    return true;
  });
}

function clusterEvents(items) {
  const clusters = [];
  const tokens = items.map((it) => titleTokens(it.title));

  items.forEach((item, index) => {
    let target = null;
    for (const cluster of clusters) {
      const sim = jaccard(tokens[index], cluster.tokens);
      if (sim >= 0.32) {
        target = cluster;
        break;
      }
    }
    if (target) {
      target.items.push(item);
      // 聚类 token 保持为首条的 token，避免漂移
    } else {
      clusters.push({ tokens: tokens[index], items: [item] });
    }
  });

  return clusters;
}

function scoreCluster(cluster) {
  const lead = cluster.items.slice().sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))[0];
  const weightSum = cluster.items.reduce((sum, it) => sum + it.weight, 0);
  const ageHours = Math.max(0, (now - Date.parse(lead.publishedAt)) / 3600000);

  let score = 12;
  score += Math.min(cluster.items.length, 5) * 9;
  score += ageHours <= 3 ? 10 : ageHours <= 12 ? 7 : ageHours <= 24 ? 4 : ageHours <= 48 ? 2 : 0;
  score += Math.round(weightSum * 2);
  score += (lead.title + ' ' + lead.summary).match(new RegExp(HOT_TERMS.source, 'gi'))?.length
    ? Math.min(8, (lead.title + ' ' + lead.summary).match(new RegExp(HOT_TERMS.source, 'gi')).length * 2)
    : 0;

  return {
    ...lead,
    id: `ev_${lead.id}`,
    score: Math.round(score),
    reportCount: cluster.items.length,
    sources: cluster.items.map((it) => ({ name: it.source, url: it.url })),
    free: cluster.items.some((it) => it.free),
    openSource: cluster.items.some((it) => it.openSource),
    tags: Array.from(new Set(cluster.items.flatMap((it) => it.tags))).slice(0, 3),
  };
}

function isFresh(iso) {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return false;
  return now - t <= HISTORY_DAYS * 86400000;
}

/* ───────────────────────── 主流程 ───────────────────────── */

async function loadPrevious() {
  if (!existsSync(OUT_FILE)) return null;
  try {
    return JSON.parse(await readFile(OUT_FILE, 'utf8'));
  } catch {
    return null;
  }
}

async function main() {
  const previous = await loadPrevious();
  const results = await Promise.allSettled(
    SOURCES.map(async (source) => {
      const xml = await fetchText(source.url);
      return parseFeed(xml, source);
    })
  );

  const fresh = [];
  const okSources = [];
  results.forEach((result, index) => {
    const source = SOURCES[index];
    if (result.status === 'fulfilled') {
      fresh.push(...result.value);
      okSources.push(source.name);
      console.log(`  ✓ ${source.name}: ${result.value.length} 条`);
    } else {
      console.warn(`  ✗ ${source.name}: ${result.reason?.message || result.reason}`);
    }
  });

  const previousItems = Array.isArray(previous?.news) ? previous.news : [];

  // 全部源失败：保留旧数据，避免首页被清空
  if (fresh.length === 0) {
    console.error('所有新闻源均抓取失败，保留现有数据不覆盖。');
    if (!previous) process.exitCode = 1;
    return;
  }

  // 合并历史：本次没抓到的旧条目保留（抓取抖动 / 源临时失效时页面不空）
  const currentIds = new Set(fresh.map((it) => normalizeTitle(it.title)));
  const carried = previousItems
    .filter((it) => isFresh(it.publishedAt) && !currentIds.has(normalizeTitle(it.title)))
    .map((it) => ({ ...it, carried: true }));

  const merged = dedupe([...fresh, ...carried]);
  const clusters = clusterEvents(merged);
  const events = clusters.map(scoreCluster);

  events.sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
  const news = events.slice(0, MAX_NEWS);

  // 上一次排行榜：按标题归一化建索引，用于计算名次升降（新上榜标记为 NEW）
  const prevRankMap = new Map();
  if (Array.isArray(previous?.ranking)) {
    previous.ranking.forEach((item) => {
      if (item && item.rank && item.title) prevRankMap.set(normalizeTitle(item.title), item.rank);
    });
  }

  const ranking = events
    .slice()
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_RANKING)
    .map((ev, i) => {
      const rank = i + 1;
      const prevRank = prevRankMap.get(normalizeTitle(ev.title));
      return {
        ...ev,
        rank,
        prevRank: prevRank || null,
        rankDelta: prevRank ? prevRank - rank : null, // 正数=上升，null=新上榜
      };
    });

  // 免费路线补位：免费额度/免费试用优先，其次是开源可自部署（零 API 成本）
  const freeTakes = events
    .filter((ev) => ev.free || ev.openSource)
    .sort((a, b) => {
      if (a.free !== b.free) return a.free ? -1 : 1;
      return b.score - a.score;
    })
    .slice(0, MAX_FREE)
    .map((ev) => ({ ...ev, freeKind: ev.free ? 'free' : 'opensource' }));

  const payload = {
    generatedAt: new Date().toISOString(),
    stats: {
      sourcesTotal: SOURCES.length,
      sourcesOk: okSources.length,
      rawItems: fresh.length + carried.length,
      events: events.length,
      languages: Array.from(new Set(news.map((n) => n.lang))),
    },
    news,
    ranking,
    freeTakes,
  };

  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(OUT_FILE, JSON.stringify(payload), 'utf8');
  console.log(
    `\n已写入 ${OUT_FILE}：源 ${okSources.length}/${SOURCES.length}，` +
      `原始 ${payload.stats.rawItems} 条 → ${events.length} 个事件，` +
      `公告 ${news.length} / 排行 ${ranking.length} / 免费 ${freeTakes.length}`
  );
}

main().catch((err) => {
  console.error('抓取流程异常：', err);
  process.exitCode = 1;
});
