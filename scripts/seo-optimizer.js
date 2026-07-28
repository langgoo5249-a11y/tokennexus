/**
 * 全站SEO优化脚本
 * 功能：
 * 1. 生成平台sitemap
 * 2. 添加Open Graph和Twitter Card标签
 * 3. 添加JSON-LD结构化数据
 * 4. 添加canonical URL
 * 5. 优化meta标签
 */

const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://www.tokenfind.cn';
const SITE_NAME = 'TokenNexus';
const SITE_DESCRIPTION = '全球最全的AI Token导航平台，收录280+国内外AI API服务商，提供平台对比、用户评价和实时价格信息';
const TODAY = '2026-05-12';

// 语言列表（用于hreflang）
const LANGUAGES = ['zh-CN', 'en', 'ja', 'ko', 'es', 'fr', 'de', 'ru', 'ar', 'vi', 'th', 'id', 'ms', 'fil'];

// Open Graph图片
const OG_IMAGE = `${SITE_URL}/images/og-image.png`;

// 平台数据
const platforms = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/platforms.json'), 'utf-8'));

// 生成平台sitemap
function generatePlatformSitemap() {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

    platforms.forEach(p => {
        const url = `${SITE_URL}/platform/${p.slug}`;
        const priority = ['openai', 'anthropic', 'google', 'deepseek', 'aliyun'].includes(p.slug) ? '0.9' : '0.7';
        
        xml += `
    <url>
        <loc>${url}</loc>
        <lastmod>${TODAY}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>${priority}</priority>
        <image:image>
            <image:loc>${p.logo || `${SITE_URL}/images/default-platform.png`}</image:loc>
            <image:title>${escapeXml(p.name)}</image:title>
        </image:image>
    </url>`;
    });

    xml += '\n</urlset>';
    
    fs.writeFileSync(path.join(__dirname, '..', 'platform-sitemap.xml'), xml, 'utf-8');
    console.log(`✓ 生成平台sitemap: ${platforms.length} 个平台`);
}

// 转义XML特殊字符
function escapeXml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

// 生成Open Graph meta标签
function generateOgTags(page, type = 'website') {
    const title = page.title || `${SITE_NAME} | AI Token导航`;
    const description = page.description || SITE_DESCRIPTION;
    const url = page.url || SITE_URL;
    const image = page.image || OG_IMAGE;

    return `
    <!-- Open Graph -->
    <meta property="og:type" content="${type}">
    <meta property="og:site_name" content="${SITE_NAME}">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:url" content="${url}">
    <meta property="og:image" content="${image}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:locale" content="zh_CN">
    <meta property="og:locale:alternate" content="en_US">
    <meta property="og:locale:alternate" content="ja_JP">
    <meta property="og:locale:alternate" content="ko_KR">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@tokennexus">
    <meta name="twitter:title" content="${escapeHtml(title)}">
    <meta name="twitter:description" content="${escapeHtml(description)}">
    <meta name="twitter:image" content="${image}">
    <meta name="twitter:url" content="${url}">`;
}

// 生成JSON-LD结构化数据
function generateJsonLd(page, type = 'WebSite') {
    const schemas = {
        WebSite: {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: SITE_NAME,
            url: SITE_URL,
            description: SITE_DESCRIPTION,
            potentialAction: {
                '@type': 'SearchAction',
                target: {
                    '@type': 'EntryPoint',
                    urlTemplate: `${SITE_URL}/?q={search_term_string}`
                },
                'query-input': 'required name=search_term_string'
            }
        },
        Organization: {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: SITE_NAME,
            url: SITE_URL,
            logo: `${SITE_URL}/images/logo.png`,
            description: SITE_DESCRIPTION,
            sameAs: [
                'https://github.com/jm6-lang/tokennexus'
            ]
        },
        WebPage: {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: page.title || SITE_NAME,
            url: page.url || SITE_URL,
            description: page.description || SITE_DESCRIPTION,
            isPartOf: {
                '@type': 'WebSite',
                name: SITE_NAME,
                url: SITE_URL
            }
        }
    };

    return `\n    <!-- JSON-LD Structured Data -->
    <script type="application/ld+json">${JSON.stringify(schemas[type], null, 2)}</script>`;
}

// 生成hreflang标签
function generateHreflangTags(currentPath) {
    let tags = '\n    <!-- hreflang for international SEO -->';
    
    LANGUAGES.forEach(lang => {
        const href = lang === 'zh-CN' 
            ? `${SITE_URL}${currentPath}` 
            : `${SITE_URL}/${lang}${currentPath}`;
        tags += `\n    <link rel="alternate" hreflang="${lang}" href="${href}">`;
    });
    
    tags += `\n    <link rel="alternate" hreflang="x-default" href="${SITE_URL}${currentPath}">`;
    return tags;
}

// 转义HTML特殊字符
function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// 主函数
function main() {
    console.log('🚀 开始全站SEO优化...\n');
    
    // 1. 生成平台sitemap
    generatePlatformSitemap();
    
    console.log('\n✅ 全站SEO优化完成！');
    console.log('\n生成的文件:');
    console.log('  - platform-sitemap.xml (平台sitemap)');
    console.log('\n请确保在index.html和其他页面中添加:');
    console.log('  1. Open Graph标签');
    console.log('  2. JSON-LD结构化数据');
    console.log('  3. hreflang标签');
    console.log('  4. canonical URL');
}

if (require.main === module) {
    main();
}

module.exports = {
    generateOgTags,
    generateJsonLd,
    generateHreflangTags,
    escapeXml,
    escapeHtml
};
