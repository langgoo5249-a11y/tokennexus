// Generate static platform detail pages
// Usage: node generate-platform-pages.js

const fs = require('fs');
const path = require('path');

// Read platforms data from index.html
const indexPath = path.join(__dirname, '..', 'index.html');
const indexContent = fs.readFileSync(indexPath, 'utf-8');

// Extract platforms array
const platformsMatch = indexContent.match(/const platforms = (\[.*?\]);/s);
if (!platformsMatch) {
    console.error('Could not find platforms data in index.html');
    process.exit(1);
}

const platforms = eval(platformsMatch[1]);
console.log(`Found ${platforms.length} platforms`);

// Read template
const templatePath = path.join(__dirname, '..', 'platform-detail.html');
let template = fs.readFileSync(templatePath, 'utf-8');

// Create platform directory
const platformDir = path.join(__dirname, '..', 'platform');
if (!fs.existsSync(platformDir)) {
    fs.mkdirSync(platformDir, { recursive: true });
}

// Helper function to generate stars
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    return '★'.repeat(fullStars) + '☆'.repeat(emptyStars);
}

// Helper function to slugify
function slugify(name) {
    return name.toLowerCase()
        .replace(/[^a-z0-9\u4e00-\u9fa5]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

// Generate page for each platform
platforms.forEach((platform, index) => {
    const slug = platform.slug || slugify(platform.name);
    
    // Default data for static generation
    const pageData = {
        name: platform.name,
        slug: slug,
        category: platform.category,
        categoryName: platform.category === 'official' ? '官方平台' : 
                     platform.category === 'china' ? '国内中转' : '聚合平台',
        url: platform.url,
        logoFile: platform.logo ? platform.logo.replace('/logos/', '') : `${slug}.png`,
        verified: platform.verified,
        shortDescription: platform.description,
        longDescription: `<h3>平台介绍</h3><p>${platform.description}</p><h3>核心优势</h3><ul><li>支持${platform.tags.join('、')}</li><li>价格透明：${platform.pricing}</li><li>用户评分：${platform.rating}/5</li></ul><h3>适用场景</h3><p>适合需要${platform.tags[0]}的用户。</p>`,
        rating: platform.rating,
        reviewCount: platform.reviews,
        rank: index + 1,
        stars: generateStars(platform.rating),
        // Default monitoring data
        models: platform.tags.filter(t => ['GPT-4', 'Claude', 'Gemini', 'DeepSeek', 'Llama'].some(m => t.includes(m))),
        priceMultiplier: 'x1.0',
        isOriginalPrice: platform.category === 'official',
        hasMonthly: false,
        paymentMethods: platform.category === 'china' ? ['支付宝', '微信', 'USDT'] : ['信用卡', 'PayPal'],
        uptime30d: 99,
        avgLatency: 150,
        lastCheck: new Date().toLocaleString('zh-CN'),
        checkCount: 8640,
        features: {
            functionCalling: true,
            streaming: true,
            image: platform.tags.includes('多模态'),
            embedding: true
        }
    };

    // Replace template variables
    let page = template;
    
    // Simple template replacement (Handlebars-like)
    page = page.replace(/\{\{platform\.name\}\}/g, pageData.name);
    page = page.replace(/\{\{platform\.slug\}\}/g, pageData.slug);
    page = page.replace(/\{\{platform\.category\}\}/g, pageData.category);
    page = page.replace(/\{\{platform\.categoryName\}\}/g, pageData.categoryName);
    page = page.replace(/\{\{platform\.url\}\}/g, pageData.url);
    page = page.replace(/\{\{platform\.logoFile\}\}/g, pageData.logoFile);
    page = page.replace(/\{\{platform\.shortDescription\}\}/g, pageData.shortDescription);
    page = page.replace(/\{\{platform\.longDescription\}\}/g, pageData.longDescription);
    page = page.replace(/\{\{platform\.rating\}\}/g, pageData.rating);
    page = page.replace(/\{\{platform\.reviewCount\}\}/g, pageData.reviewCount);
    page = page.replace(/\{\{platform\.rank\}\}/g, pageData.rank);
    page = page.replace(/\{\{platform\.stars\}\}/g, pageData.stars);
    page = page.replace(/\{\{platform\.priceMultiplier\}\}/g, pageData.priceMultiplier);
    page = page.replace(/\{\{platform\.uptime30d\}\}/g, pageData.uptime30d);
    page = page.replace(/\{\{platform\.avgLatency\}\}/g, pageData.avgLatency);
    page = page.replace(/\{\{platform\.lastCheck\}\}/g, pageData.lastCheck);
    page = page.replace(/\{\{platform\.checkCount\}\}/g, pageData.checkCount);
    
    // Handle conditionals
    if (pageData.verified) {
        page = page.replace(/\{\{#if platform\.verified\}\}(.*?)\{\{\/if\}\}/s, '$1');
    } else {
        page = page.replace(/\{\{#if platform\.verified\}\}.*?\{\{\/if\}\}/s, '');
    }
    
    if (pageData.isOriginalPrice) {
        page = page.replace(/\{\{#if platform\.isOriginalPrice\}\}highlight\{\{\/if\}\}/g, 'highlight');
        page = page.replace(/\{\{#if platform\.isOriginalPrice\}\}原价\{\{else\}\}加价\{\{\/if\}\}/g, '原价');
    } else {
        page = page.replace(/\{\{#if platform\.isOriginalPrice\}\}highlight\{\{\/if\}\}/g, '');
        page = page.replace(/\{\{#if platform\.isOriginalPrice\}\}原价\{\{else\}\}加价\{\{\/if\}\}/g, '加价');
    }
    
    if (pageData.hasMonthly) {
        page = page.replace(/\{\{#if platform\.hasMonthly\}\}✓ 支持\{\{else\}\}✗ 不支持\{\{\/if\}\}/g, '✓ 支持');
    } else {
        page = page.replace(/\{\{#if platform\.hasMonthly\}\}✓ 支持\{\{else\}\}✗ 不支持\{\{\/if\}\}/g, '✗ 不支持');
    }
    
    // Handle loops (simplified)
    const modelTagsMatch = page.match(/\{\{#each platform\.models\}\}(.*?)\{\{\/each\}\}/s);
    if (modelTagsMatch) {
        const modelTemplate = modelTagsMatch[1];
        const modelsHtml = pageData.models.map(m => 
            modelTemplate.replace(/\{\{this\}\}/g, m)
        ).join('');
        page = page.replace(/\{\{#each platform\.models\}\}.*?\{\{\/each\}\}/s, modelsHtml);
    }
    
    const paymentMatch = page.match(/\{\{#each platform\.paymentMethods\}\}(.*?)\{\{\/each\}\}/s);
    if (paymentMatch) {
        const paymentTemplate = paymentMatch[1];
        const paymentsHtml = pageData.paymentMethods.map(p => 
            paymentTemplate.replace(/\{\{this\}\}/g, p)
        ).join('');
        page = page.replace(/\{\{#each platform\.paymentMethods\}\}.*?\{\{\/each\}\}/s, paymentsHtml);
    }
    
    // Handle features
    Object.keys(pageData.features).forEach(feature => {
        const supported = pageData.features[feature];
        const regex = new RegExp(`\\{\\{#if platform\\.features\\.${feature}\\}\\}✓\\{\\{else\\}\\}✗\\{\\{/if\\}\\}`, 'g');
        page = page.replace(regex, supported ? '✓' : '✗');
        
        const classRegex = new RegExp(`\\{\\{#if platform\\.features\\.${feature}\\}\\}supported\\{\\{else\\}\\}unsupported\\{\\{/if\\}\\}`, 'g');
        page = page.replace(classRegex, supported ? 'supported' : 'unsupported');
        
        const statusRegex = new RegExp(`\\{\\{#if platform\\.features\\.${feature}\\}\\}支持\\{\\{else\\}\\}不支持\\{\\{/if\\}\\}`, 'g');
        page = page.replace(statusRegex, supported ? '支持' : '不支持');
    });
    
    // Handle uptime/latency status classes
    const uptimeClass = pageData.uptime30d >= 95 ? 'good' : pageData.uptime30d >= 90 ? 'warning' : 'bad';
    page = page.replace(/\{\{#if \(gte platform\.uptime30d 95\)\}\}good\{\{else if \(gte platform\.uptime30d 90\)\}\}warning\{\{else\}\}bad\{\{\/if\}\}/g, uptimeClass);
    
    const latencyClass = pageData.avgLatency <= 100 ? 'good' : pageData.avgLatency <= 200 ? 'warning' : 'bad';
    page = page.replace(/\{\{#if \(lte platform\.avgLatency 100\)\}\}good\{\{else if \(lte platform\.avgLatency 200\)\}\}warning\{\{else\}\}bad\{\{\/if\}\}/g, latencyClass);
    
    // Remove any remaining template tags
    page = page.replace(/\{\{.*?\}\}/g, '');
    
    // Write file
    const outputPath = path.join(platformDir, `${slug}.html`);
    fs.writeFileSync(outputPath, page);
    console.log(`✓ Generated: platform/${slug}.html`);
});

console.log(`\nGenerated ${platforms.length} platform detail pages`);
console.log(`Location: ${platformDir}/`);
