/**
 * 全站SEO优化脚本 - 为所有页面添加SEO标签
 */

const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://www.tokenfind.cn';
const SITE_NAME = 'TokenNexus';

// 语言列表
const LANGUAGES = ['zh-CN', 'en', 'ja', 'ko', 'es', 'fr', 'de', 'ru', 'ar', 'vi', 'th', 'id', 'ms', 'fil'];

// SEO配置
const seoConfig = {
    'about.html': {
        title: '关于我们 - TokenNexus | AI Token导航平台',
        description: '了解TokenNexus团队，我们致力于打造最全面的全球AI Token导航平台',
        priority: '0.7'
    },
    'contact.html': {
        title: '联系我们 - TokenNexus | AI Token导航平台',
        description: '联系我们获取更多信息，TokenNexus团队随时为您服务',
        priority: '0.6'
    },
    'business.html': {
        title: '商务合作 - TokenNexus | AI Token导航平台',
        description: '与TokenNexus开展商务合作，包括广告投放、API对接、战略合作等',
        priority: '0.6'
    },
    'submit.html': {
        title: '提交收录 - TokenNexus | AI Token导航平台',
        description: '提交您的AI Token平台到TokenNexus，让更多用户发现您的服务',
        priority: '0.6'
    },
    'privacy.html': {
        title: '隐私政策 - TokenNexus | AI Token导航平台',
        description: 'TokenNexus隐私政策，保护您的个人信息安全',
        priority: '0.3'
    },
    'terms.html': {
        title: '服务条款 - TokenNexus | AI Token导航平台',
        description: 'TokenNexus服务条款，使用本平台即表示同意以下条款',
        priority: '0.3'
    },
    'disclaimer.html': {
        title: '免责声明 - TokenNexus | AI Token导航平台',
        description: 'TokenNexus免责声明，网站内容仅供参考',
        priority: '0.3'
    },
    'official.html': {
        title: '海外官方平台 - TokenNexus | AI Token导航平台',
        description: '海外官方AI API平台汇总，OpenAI、Anthropic、Google等官方API直连服务',
        priority: '0.9'
    },
    'aggregator.html': {
        title: '聚合中转平台 - TokenNexus | AI Token导航平台',
        description: 'AI API聚合中转平台汇总，一站式访问多模型，价格更优更便捷',
        priority: '0.9'
    },
    'china.html': {
        title: '国内平台 - TokenNexus | AI Token导航平台',
        description: '国内AI API平台汇总，国产大模型与国内中转服务，支付便捷',
        priority: '0.9'
    }
};

// 生成hreflang标签
function generateHreflangTags(page) {
    const basePath = '/' + page.replace('.html', '');
    let tags = '';
    
    LANGUAGES.forEach(lang => {
        const href = lang === 'zh-CN' 
            ? `${SITE_URL}${basePath}` 
            : `${SITE_URL}/${lang}${basePath}`;
        tags += `\n    <link rel="alternate" hreflang="${lang}" href="${escapeAttr(href)}">`;
    });
    
    tags += `\n    <link rel="alternate" hreflang="x-default" href="${SITE_URL}${basePath}">`;
    return tags;
}

// 转义HTML属性
function escapeAttr(str) {
    return str.replace(/"/g, '&quot;');
}

// 添加SEO标签到页面
function addSeoTags(filePath, config) {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // 检查是否已有hreflang
    if (content.includes('rel="alternate" hreflang')) {
        console.log(`  ⏭️  ${path.basename(filePath)} 已有hreflang，跳过`);
        return;
    }
    
    // 添加hreflang标签（在canonical之后）
    const hreflangTags = generateHreflangTags(path.basename(filePath));
    content = content.replace(
        /(<link rel="canonical"[^>]*>)/i,
        `$1${hreflangTags}`
    );
    
    // 更新title（如果需要）
    if (config.title && !content.includes(config.title)) {
        content = content.replace(
            /<title>[^<]*<\/title>/i,
            `<title>${config.title}</title>`
        );
    }
    
    // 更新description（如果需要）
    if (config.description) {
        const currentDesc = content.match(/<meta name="description"[^>]*>/i);
        if (currentDesc) {
            content = content.replace(
                currentDesc[0],
                `<meta name="description" content="${escapeAttr(config.description)}">`
            );
        }
    }
    
    // 添加Open Graph标签（如果没有）
    if (!content.includes('og:title')) {
        const ogTags = `
    
    <!-- Open Graph -->
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="${SITE_NAME}">
    <meta property="og:title" content="${escapeAttr(config.title || SITE_NAME)}">
    <meta property="og:description" content="${escapeAttr(config.description || '')}">
    <meta property="og:url" content="${SITE_URL}/${path.basename(filePath).replace('.html', '')}">
    <meta property="og:locale" content="zh_CN">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="${escapeAttr(config.title || SITE_NAME)}">
    <meta name="twitter:description" content="${escapeAttr(config.description || '')}">`;
        
        // 在</head>之前添加
        content = content.replace(
            /(<link rel="canonical"[^>]*>[^]*?)(<\/head>)/i,
            `$1${ogTags}\n$2`
        );
    }
    
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`  ✅ ${path.basename(filePath)} SEO标签已添加`);
}

// 主函数
function main() {
    console.log('🚀 开始全站SEO优化...\n');
    
    const pagesDir = __dirname + '/..';
    const pages = Object.keys(seoConfig);
    
    pages.forEach(page => {
        const filePath = path.join(pagesDir, page);
        if (fs.existsSync(filePath)) {
            console.log(`\n处理: ${page}`);
            addSeoTags(filePath, seoConfig[page]);
        } else {
            console.log(`\n⚠️  文件不存在: ${page}`);
        }
    });
    
    console.log('\n✅ 全站SEO优化完成！');
}

main();
