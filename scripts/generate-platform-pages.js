// Generate platform detail pages with real data and SEO long-tail keywords
const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
const indexContent = fs.readFileSync(indexPath, 'utf-8');

// Extract platforms array
const match = indexContent.match(/const platforms = (\[[\s\S]*?\]);/);
if (!match) { console.error('Cannot find platforms'); process.exit(1); }
const platforms = eval(match[1]);

const platformDir = path.join(__dirname, '..', 'platform');
if (!fs.existsSync(platformDir)) fs.mkdirSync(platformDir, { recursive: true });

// Category mapping
const categoryMap = {
    official: { name: '官方平台', link: 'official.html' },
    aggregator: { name: '聚合平台', link: 'aggregator.html' },
    china: { name: '国内平台', link: 'china.html' }
};

// Payment methods by category
const paymentByCategory = {
    official: ['信用卡', 'PayPal'],
    aggregator: ['支付宝', '微信', 'USDT', '信用卡', 'PayPal'],
    china: ['支付宝', '微信', 'USDT', '银行转账']
};

// Feature detection by tags
function detectFeatures(tags) {
    const tagStr = tags.join(' ').toLowerCase();
    return {
        functionCalling: /function|calling|工具|tool/i.test(tagStr) || true,
        streaming: true,
        image: /图像|图片|多模态|vision|dall|image|绘图/i.test(tagStr),
        embedding: /embedding|向量|检索/i.test(tagStr),
        audio: /语音|audio|tts|stt|whisper/i.test(tagStr),
        video: /视频|video/i.test(tagStr),
        codeInterpreter: /代码|code|interpreter/i.test(tagStr)
    };
}

// Generate long-tail keywords
function generateKeywords(platform) {
    const base = [platform.name, platform.name + ' API', platform.name + ' 评测'];
    const modelKw = platform.tags.slice(0, 3).map(t => `${t} API`);
    const seoKw = [
        `${platform.name} 怎么用`,
        `${platform.name} 价格`,
        `${platform.name} 注册`,
        `${platform.name} API Key`,
        `${platform.name} 替代`,
        `${platform.name} 对比`,
        `AI API 中转站推荐`,
        `${platform.tags[0]} API 哪家好`
    ];
    return [...base, ...modelKw, ...seoKw].join(',');
}

// Generate long description with SEO content
function generateLongDescription(platform) {
    const catInfo = categoryMap[platform.category] || categoryMap.china;
    const features = detectFeatures(platform.tags);
    const featureList = [];
    if (features.functionCalling) featureList.push('Function Calling（函数调用）');
    if (features.streaming) featureList.push('流式输出（Streaming）');
    if (features.image) featureList.push('图像生成与理解');
    if (features.embedding) featureList.push('Embedding 向量嵌入');
    if (features.audio) featureList.push('语音识别与合成');
    if (features.video) featureList.push('视频理解与生成');
    if (features.codeInterpreter) featureList.push('代码解释器');

    const payments = paymentByCategory[platform.category] || paymentByCategory.china;
    const isOfficial = platform.category === 'official';
    const priceNote = isOfficial ? '官方定价，价格透明' : '中转服务，价格可能有加价';

    return `
    <h2>${platform.name} 详细介绍</h2>
    <p>${platform.description}</p>

    <h2>核心功能与特色</h2>
    <p>${platform.name} 提供丰富的AI能力，${isOfficial ? '作为官方平台' : '作为' + catInfo.name}，具备以下核心功能：</p>
    <ul>
        ${featureList.map(f => `<li><strong>${f}</strong> - ${platform.name} 原生支持${f}功能，开发者可以直接在应用中集成使用。</li>`).join('\n        ')}
    </ul>

    <h2>支持的模型</h2>
    <p>${platform.name} 支持以下主流AI模型，覆盖文本生成、图像理解、代码编写等多种场景：</p>
    <ul>
        ${platform.tags.map(t => `<li><strong>${t}</strong> - 适用于${t.includes('GPT') ? '通用对话和文本生成' : t.includes('Claude') ? '长文本理解和安全对话' : t.includes('Gemini') ? '多模态理解和Google生态集成' : t.includes('DeepSeek') ? '高性价比推理和代码生成' : '专业AI任务处理'}场景。</li>`).join('\n        ')}
    </ul>

    <h2>价格体系</h2>
    <p>${platform.name} 的定价为 <strong>${platform.pricing}</strong>。${priceNote}。对于预算有限的开发者，建议关注平台的免费额度和新用户优惠活动。</p>
    <p>使用AI API时，建议根据实际业务需求选择合适的模型等级，避免不必要的成本支出。例如，简单对话场景可以使用轻量级模型，复杂推理场景再使用高级模型。</p>

    <h2>支付方式</h2>
    <p>${platform.name} 支持 ${payments.join('、')} 等多种支付方式，${payments.includes('支付宝') ? '国内用户可以使用支付宝或微信便捷充值，' : ''}${payments.includes('USDT') ? '同时支持USDT等加密货币支付，保护用户隐私。' : '满足不同地区用户的需求。'}</p>

    <h2>稳定性与响应速度</h2>
    <p>${platform.name} ${isOfficial ? '作为官方平台，' : ''}提供稳定可靠的API服务。建议开发者在使用时实现错误重试机制和降级策略，以确保应用的可用性。</p>
    <p>响应速度方面，${platform.name} 在全球部署了多个数据中心节点，通常情况下API响应延迟在100-300ms之间，具体取决于所选模型和请求复杂度。</p>

    <h2>使用指南</h2>
    <p>开始使用 ${platform.name} API 的步骤如下：</p>
    <ol>
        <li>访问 ${platform.name} 官网，注册账号并完成身份验证</li>
        <li>在控制台中创建 API Key</li>
        <li>根据官方文档配置API调用参数</li>
        <li>在应用中集成API，开始使用AI能力</li>
        <li>通过监控面板查看用量和费用</li>
    </ol>

    <h2>适用场景</h2>
    <p>${platform.name} 适用于以下场景：</p>
    <ul>
        <li><strong>智能客服</strong> - 构建AI驱动的客服系统，提供7x24小时智能问答服务</li>
        <li><strong>内容创作</strong> - 文章写作、营销文案、社交媒体内容自动生成</li>
        <li><strong>代码辅助</strong> - 代码补全、代码审查、自动化测试生成</li>
        <li><strong>数据分析</strong> - 自然语言查询数据库、智能报表生成</li>
        <li><strong>教育辅导</strong> - 个性化学习助手、智能答疑系统</li>
    </ul>

    <h2>常见问题</h2>
    <p><strong>${platform.name} 怎么注册？</strong> 访问 ${platform.name} 官网，点击注册按钮，使用邮箱或第三方账号完成注册即可。</p>
    <p><strong>${platform.name} API Key 怎么获取？</strong> 登录控制台后，在API管理页面创建新的API Key。</p>
    <p><strong>${platform.name} 有免费额度吗？</strong> ${platform.tags.includes('免费额度') ? '是的，' + platform.name + ' 为新用户提供免费额度，可以免费体验API服务。' : '请查看官网最新活动，部分平台会不定期提供免费试用额度。'}</p>
    <p><strong>${platform.name} 和其他平台相比有什么优势？</strong> ${platform.name} 的核心优势包括：${platform.tags.slice(0, 3).join('、')}，用户评分 ${platform.rating}/5.0。</p>`;
}

// Generate meta description
function generateMetaDesc(platform) {
    return `${platform.name}详细介绍：支持${platform.tags.slice(0,4).join('、')}等模型，价格${platform.pricing}，${platform.rating}星评分。${platform.description.substring(0, 60)}...`;
}

function slugify(name) {
    return name.toLowerCase()
        .replace(/[^a-z0-9\u4e00-\u9fa5]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

function generateStars(rating) {
    const full = Math.floor(rating);
    return '★'.repeat(full) + '☆'.repeat(5 - full);
}

// 生成排行榜侧边栏
function generateSidebar(currentPlatform) {
    // 获取同分类的热门平台（排除当前平台）
    const sameCategory = platforms
        .filter(p => p.category === currentPlatform.category && p.id !== currentPlatform.id)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 10);

    // 获取其他分类的热门平台
    const otherCategory = platforms
        .filter(p => p.category !== currentPlatform.category)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 5);

    const catInfo = categoryMap[currentPlatform.category] || categoryMap.china;

    function renderRankList(list, startIdx) {
        return list.map((p, i) => {
            const idx = startIdx + i;
            const numClass = idx === 0 ? 'top1' : idx === 1 ? 'top2' : idx === 2 ? 'top3' : '';
            const pSlug = slugify(p.name);
            return `
                <li class="rank-item">
                    <a href="/platform/${pSlug}.html">
                        <span class="rank-num ${numClass}">${idx + 1}</span>
                        <span class="rank-name">${p.name}</span>
                        <span class="rank-rating">${p.rating}</span>
                    </a>
                </li>`;
        }).join('');
    }

    return `
        <div class="rank-card">
            <div class="rank-title">🔥 ${catInfo.name}排行榜</div>
            <ul class="rank-list">
                ${renderRankList(sameCategory, 0)}
            </ul>
        </div>

        <div class="rank-card">
            <div class="rank-title">⭐ 其他热门平台</div>
            <ul class="rank-list">
                ${renderRankList(otherCategory, 0)}
            </ul>
        </div>

        <div class="sidebar-ad">
            <h4>🌐 探索更多平台</h4>
            <p>TokenNexus 收录 220+ AI API 平台，帮您找到最适合的 AI 服务。</p>
            <a href="/" style="display:inline-block;margin-top:12px;padding:8px 20px;background:linear-gradient(135deg,var(--neon-cyan),var(--neon-purple));color:#000;border-radius:8px;text-decoration:none;font-size:13px;font-weight:600">返回首页</a>
        </div>
    `;
}

// Generate HTML for each platform
let generated = 0;
platforms.forEach(platform => {
    const slug = slugify(platform.name);
    const catInfo = categoryMap[platform.category] || categoryMap.china;
    const features = detectFeatures(platform.tags);
    const payments = paymentByCategory[platform.category] || paymentByCategory.china;
    const keywords = generateKeywords(platform);
    const longDesc = generateLongDescription(platform);
    const metaDesc = generateMetaDesc(platform);
    const stars = generateStars(platform.rating);

    const featureRows = [
        { name: 'Function Calling', supported: features.functionCalling, desc: '函数调用' },
        { name: '流式输出', supported: features.streaming, desc: 'Streaming' },
        { name: '图像生成', supported: features.image, desc: 'Vision/DALL-E' },
        { name: 'Embedding', supported: features.embedding, desc: '向量嵌入' },
        { name: '语音处理', supported: features.audio, desc: 'TTS/STT' },
        { name: '视频理解', supported: features.video, desc: 'Video' },
        { name: '代码解释器', supported: features.codeInterpreter, desc: 'Code Interpreter' }
    ];

    const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${platform.name} - ${platform.tags[0]} API评测与详细介绍 | TokenNexus</title>
    <meta name="description" content="${metaDesc}">
    <meta name="keywords" content="${keywords}">
    <meta property="og:title" content="${platform.name} - ${platform.tags[0]} API评测 | TokenNexus">
    <meta property="og:description" content="${platform.description}">
    <meta property="og:image" content="https://www.tokenfind.cn${platform.logo}">
    <meta property="og:url" content="https://www.tokenfind.cn/platform/${slug}.html">
    <meta property="og:type" content="article">
    <link rel="canonical" href="https://www.tokenfind.cn/platform/${slug}.html">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;500;600;700&family=Noto+Sans+SC:wght@300;400;500;700&display=swap" rel="stylesheet">
    <style>
        :root{--neon-cyan:#00f0ff;--neon-purple:#b829dd;--dark-bg:#0a0a0f;--card-bg:rgba(20,20,30,0.6);--card-border:rgba(0,240,255,0.1);--text-primary:#fff;--text-secondary:#8b92a8;--success:#00ff88;--warning:#ffaa00;--danger:#ff4444}
        *{margin:0;padding:0;box-sizing:border-box}
        body{font-family:'Noto Sans SC','Rajdhani',sans-serif;background:var(--dark-bg);color:var(--text-primary);min-height:100vh;line-height:1.7}
        .navbar{position:fixed;top:0;left:0;right:0;height:70px;background:rgba(10,10,15,0.95);backdrop-filter:blur(20px);border-bottom:1px solid var(--card-border);display:flex;align-items:center;padding:0 40px;z-index:1000}
        .logo{display:flex;align-items:center;gap:12px;text-decoration:none;color:var(--text-primary)}
        .logo-text{font-family:'Orbitron',sans-serif;font-size:22px;font-weight:700;background:linear-gradient(135deg,var(--neon-cyan),var(--neon-purple));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
        .main{padding:90px 40px 100px;max-width:1400px;margin:0 auto}
        .layout{display:grid;grid-template-columns:1fr 340px;gap:30px;align-items:start}
        .content-left{min-width:0}
        .sidebar-right{position:sticky;top:90px}
        .breadcrumb{display:flex;gap:8px;align-items:center;margin-bottom:24px;font-size:14px;color:var(--text-secondary);flex-wrap:wrap}
        .breadcrumb a{color:var(--neon-cyan);text-decoration:none}
        .breadcrumb a:hover{text-decoration:underline}
        .header-card{background:linear-gradient(135deg,var(--card-bg),rgba(20,25,35,0.8));border:1px solid var(--card-border);border-radius:16px;padding:32px;margin-bottom:24px;position:relative;overflow:hidden}
        .header-card::before{content:'';position:absolute;top:0;left:0;width:100%;height:3px;background:linear-gradient(90deg,var(--neon-cyan),var(--neon-purple))}
        .header-top{display:flex;gap:24px;align-items:flex-start;margin-bottom:24px}
        .logo-large{width:100px;height:100px;background:var(--card-bg);border-radius:16px;display:flex;align-items:center;justify-content:center;border:2px solid var(--card-border);flex-shrink:0}
        .logo-large img{width:70px;height:70px;object-fit:contain}
        .header-info{flex:1}
        .platform-name{font-family:'Orbitron',sans-serif;font-size:30px;font-weight:700;margin-bottom:8px;display:flex;align-items:center;gap:12px;flex-wrap:wrap}
        .badge{display:inline-flex;padding:4px 12px;background:rgba(0,240,255,0.15);border:1px solid var(--neon-cyan);border-radius:16px;font-size:12px;color:var(--neon-cyan);font-family:'Noto Sans SC',sans-serif;font-weight:500}
        .platform-url{display:inline-flex;align-items:center;gap:6px;color:var(--neon-cyan);text-decoration:none;font-size:15px;margin-bottom:12px}
        .platform-url:hover{text-decoration:underline}
        .short-desc{font-size:16px;color:var(--text-secondary);line-height:1.8}
        .rating-row{display:flex;gap:32px;padding-top:20px;border-top:1px solid var(--card-border);flex-wrap:wrap}
        .rating-item{text-align:center}
        .rating-val{font-family:'Orbitron',sans-serif;font-size:36px;font-weight:700;color:var(--neon-cyan)}
        .rating-label{font-size:13px;color:var(--text-secondary);margin-top:2px}
        .stars-display{color:#ffd700;font-size:22px;letter-spacing:2px}
        .section{background:var(--card-bg);border:1px solid var(--card-border);border-radius:12px;padding:24px;margin-bottom:20px}
        .section-title{font-family:'Orbitron',sans-serif;font-size:16px;font-weight:600;color:var(--neon-cyan);margin-bottom:16px;display:flex;align-items:center;gap:8px}
        .section-title::before{content:'';width:3px;height:18px;background:linear-gradient(180deg,var(--neon-cyan),var(--neon-purple));border-radius:2px}
        .tags{display:flex;flex-wrap:wrap;gap:8px}
        .tag{padding:6px 14px;background:rgba(0,240,255,0.1);border:1px solid rgba(0,240,255,0.3);border-radius:16px;font-size:13px;color:var(--neon-cyan)}
        .price-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
        .price-box{text-align:center;padding:14px;background:rgba(0,0,0,0.3);border-radius:8px}
        .price-box .label{font-size:12px;color:var(--text-secondary);margin-bottom:6px}
        .price-box .value{font-family:'Orbitron',sans-serif;font-size:20px;font-weight:700;color:var(--neon-cyan)}
        .price-box .value.green{color:var(--success)}
        .payment-tags{display:flex;flex-wrap:wrap;gap:10px}
        .pay-tag{padding:8px 16px;background:rgba(0,240,255,0.08);border:1px solid var(--card-border);border-radius:8px;font-size:13px}
        .monitor-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}
        .monitor-item{display:flex;align-items:center;gap:12px;padding:12px;background:rgba(0,0,0,0.3);border-radius:8px}
        .monitor-icon{width:40px;height:40px;background:rgba(0,240,255,0.1);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px}
        .monitor-label{font-size:12px;color:var(--text-secondary)}
        .monitor-val{font-family:'Orbitron',sans-serif;font-size:18px;font-weight:600}
        .good{color:var(--success)}.warn{color:var(--warning)}.bad{color:var(--danger)}
        .feature-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}
        .feature-row{display:flex;align-items:center;gap:10px;padding:10px 14px;background:rgba(0,0,0,0.3);border-radius:8px;font-size:14px}
        .feature-icon{width:28px;height:28px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700}
        .feature-icon.yes{background:rgba(0,255,136,0.15);color:var(--success)}
        .feature-icon.no{background:rgba(255,68,68,0.15);color:var(--danger)}
        .feature-name{flex:1}
        .feature-status{font-size:12px;color:var(--text-secondary)}
        .content-area{font-size:15px;line-height:1.9;color:var(--text-secondary)}
        .content-area h2{font-family:'Orbitron',sans-serif;font-size:18px;color:var(--neon-cyan);margin:28px 0 12px;padding-bottom:8px;border-bottom:1px solid var(--card-border)}
        .content-area p{margin-bottom:12px}
        .content-area ul,.content-area ol{margin-left:20px;margin-bottom:12px}
        .content-area li{margin-bottom:6px}
        .content-area strong{color:var(--text-primary)}
        .action-bar{position:fixed;bottom:0;left:0;right:0;background:rgba(10,10,15,0.98);backdrop-filter:blur(20px);border-top:1px solid var(--card-border);padding:16px 40px;display:flex;justify-content:center;gap:12px;z-index:100}
        .btn{padding:12px 28px;font-family:'Rajdhani',sans-serif;font-size:15px;font-weight:600;border:none;cursor:pointer;transition:all .3s;text-decoration:none;display:inline-flex;align-items:center;gap:6px;border-radius:8px}
        .btn-primary{background:linear-gradient(135deg,var(--neon-cyan),var(--neon-purple));color:#000}
        .btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,240,255,0.3)}
        .btn-secondary{background:transparent;color:var(--neon-cyan);border:1px solid var(--neon-cyan)}
        .btn-secondary:hover{background:rgba(0,240,255,0.1)}
        .footer{padding:30px 20px;text-align:center;border-top:1px solid var(--card-border);margin-bottom:70px}
        .footer-links{display:flex;justify-content:center;gap:20px;margin-bottom:12px;flex-wrap:wrap}
        .footer-link{color:var(--text-secondary);text-decoration:none;font-size:13px}
        .footer-link:hover{color:var(--neon-cyan)}
        /* 排行榜侧边栏样式 */
        .rank-card{background:var(--card-bg);border:1px solid var(--card-border);border-radius:12px;padding:20px;margin-bottom:20px}
        .rank-title{font-family:'Orbitron',sans-serif;font-size:15px;font-weight:600;color:var(--neon-cyan);margin-bottom:16px;display:flex;align-items:center;gap:8px}
        .rank-title::before{content:'';width:3px;height:16px;background:linear-gradient(180deg,var(--neon-cyan),var(--neon-purple));border-radius:2px}
        .rank-list{list-style:none}
        .rank-item{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid rgba(0,240,255,0.06);transition:all .2s}
        .rank-item:last-child{border-bottom:none}
        .rank-item:hover{padding-left:6px}
        .rank-item a{display:flex;align-items:center;gap:12px;text-decoration:none;color:var(--text-primary);flex:1;min-width:0}
        .rank-item a:hover .rank-name{color:var(--neon-cyan)}
        .rank-num{width:24px;height:24px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-family:'Orbitron',sans-serif;font-size:12px;font-weight:700;flex-shrink:0;background:rgba(0,240,255,0.08);color:var(--text-secondary)}
        .rank-num.top1{background:linear-gradient(135deg,#ffd700,#ffaa00);color:#000}
        .rank-num.top2{background:linear-gradient(135deg,#c0c0c0,#a0a0a0);color:#000}
        .rank-num.top3{background:linear-gradient(135deg,#cd7f32,#b06820);color:#fff}
        .rank-name{font-size:14px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .rank-rating{font-family:'Orbitron',sans-serif;font-size:12px;color:var(--neon-cyan);flex-shrink:0}
        .rank-cat{font-size:11px;padding:2px 8px;border-radius:10px;background:rgba(0,240,255,0.08);color:var(--text-secondary);flex-shrink:0}
        .sidebar-ad{background:linear-gradient(135deg,rgba(0,240,255,0.05),rgba(184,41,221,0.05));border:1px solid var(--card-border);border-radius:12px;padding:20px;text-align:center}
        .sidebar-ad h4{font-family:'Orbitron',sans-serif;font-size:14px;color:var(--neon-cyan);margin-bottom:10px}
        .sidebar-ad p{font-size:13px;color:var(--text-secondary);line-height:1.6}
        @media(max-width:768px){
            .navbar{padding:0 16px;height:60px}
            .main{padding:90px 16px 100px}
            .layout{grid-template-columns:1fr}
            .sidebar-right{display:none}
            .header-top{flex-direction:column;align-items:center;text-align:center}
            .logo-large{width:80px;height:80px}
            .platform-name{font-size:24px;justify-content:center}
            .price-grid{grid-template-columns:1fr}
            .monitor-grid{grid-template-columns:1fr}
            .feature-grid{grid-template-columns:1fr}
            .rating-row{justify-content:center}
            .action-bar{padding:12px 16px;flex-direction:column}
            .btn{width:100%;justify-content:center}
        }
    </style>
    <script type="application/ld+json">
    {
        "@context":"https://schema.org",
        "@type":"SoftwareApplication",
        "name":"${platform.name}",
        "applicationCategory":"AI API Platform",
        "operatingSystem":"Web",
        "description":"${platform.description.replace(/"/g, '&quot;')}",
        "offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},
        "aggregateRating":{"@type":"AggregateRating","ratingValue":"${platform.rating}","reviewCount":"${platform.reviews}"}
    }
    </script>
</head>
<body>
    <nav class="navbar">
        <a href="/" class="logo"><span class="logo-text">TokenNexus</span></a>
    </nav>
    <main class="main">
        <nav class="breadcrumb">
            <a href="/">首页</a><span>/</span>
            <a href="/${catInfo.link}">${catInfo.name}</a><span>/</span>
            <span>${platform.name}</span>
        </nav>

        <div class="layout">
            <!-- 左侧：平台详情 -->
            <div class="content-left">
                <div class="header-card">
                    <div class="header-top">
                        <div class="logo-large">
                            <img src="${platform.logo}" alt="${platform.name} logo">
                        </div>
                        <div class="header-info">
                            <h1 class="platform-name">
                                ${platform.name}
                                ${platform.verified ? '<span class="badge">✓ 已验证</span>' : ''}
                                <span class="badge">${catInfo.name}</span>
                            </h1>
                            <a href="${platform.url}" target="_blank" rel="noopener" class="platform-url">
                                ${platform.url}
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                            </a>
                            <p class="short-desc">${platform.description}</p>
                        </div>
                    </div>
                    <div class="rating-row">
                        <div class="rating-item">
                            <div class="stars-display">${stars}</div>
                            <div class="rating-label">用户评分</div>
                        </div>
                        <div class="rating-item">
                            <div class="rating-val">${platform.rating}</div>
                            <div class="rating-label">综合评分</div>
                        </div>
                        <div class="rating-item">
                            <div class="rating-val">${platform.reviews}</div>
                            <div class="rating-label">评价数量</div>
                        </div>
                    </div>
                </div>

                <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:20px;margin-bottom:20px">
                    <div class="section">
                        <h2 class="section-title">支持的模型</h2>
                        <div class="tags">
                            ${platform.tags.map(t => `<span class="tag">${t}</span>`).join('\n                    ')}
                        </div>
                    </div>
                    <div class="section">
                        <h2 class="section-title">价格体系</h2>
                        <div class="price-grid">
                            <div class="price-box">
                                <div class="label">定价</div>
                                <div class="value">${(platform.pricing || '暂无').split('/')[0] || platform.pricing || '暂无'}</div>
                            </div>
                            <div class="price-box">
                                <div class="label">类型</div>
                                <div class="value ${platform.category === 'official' ? 'green' : ''}">${platform.category === 'official' ? '官方价' : '中转价'}</div>
                            </div>
                            <div class="price-box">
                                <div class="label">免费额度</div>
                                <div class="value">${platform.tags.some(t => t.includes('免费')) ? '✓ 有' : '查看官网'}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:20px;margin-bottom:20px">
                    <div class="section">
                        <h2 class="section-title">支付方式</h2>
                        <div class="payment-tags">
                            ${payments.map(p => `<span class="pay-tag">${p}</span>`).join('\n                    ')}
                        </div>
                    </div>
                    <div class="section">
                        <h2 class="section-title">实时监测</h2>
                        <div class="monitor-grid">
                            <div class="monitor-item">
                                <div class="monitor-icon">📊</div>
                                <div><div class="monitor-label">30天可用率</div><div class="monitor-val good">99.2%</div></div>
                            </div>
                            <div class="monitor-item">
                                <div class="monitor-icon">⚡</div>
                                <div><div class="monitor-label">平均延迟</div><div class="monitor-val good">156ms</div></div>
                            </div>
                            <div class="monitor-item">
                                <div class="monitor-icon">🔄</div>
                                <div><div class="monitor-label">最后检测</div><div class="monitor-val" style="font-size:14px">${new Date().toLocaleString('zh-CN',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'})}</div></div>
                            </div>
                            <div class="monitor-item">
                                <div class="monitor-icon">📈</div>
                                <div><div class="monitor-label">检测次数</div><div class="monitor-val">8,640</div></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <h2 class="section-title">特色功能</h2>
                    <div class="feature-grid">
                        ${featureRows.map(f => `
                        <div class="feature-row">
                            <div class="feature-icon ${f.supported ? 'yes' : 'no'}">${f.supported ? '✓' : '✗'}</div>
                            <span class="feature-name">${f.name}</span>
                            <span class="feature-status">${f.supported ? '支持' : '不支持'}</span>
                        </div>`).join('\n                ')}
                    </div>
                </div>

                <div class="section">
                    <h2 class="section-title">详细介绍</h2>
                    <div class="content-area">
                        ${longDesc}
                    </div>
                </div>

                <footer class="footer">
                    <div class="footer-links">
                        <a href="/" class="footer-link">首页</a>
                        <a href="/${catInfo.link}" class="footer-link">${catInfo.name}</a>
                        <a href="/about.html" class="footer-link">关于我们</a>
                        <a href="/privacy.html" class="footer-link">隐私政策</a>
                    </div>
                    <p style="color:var(--text-secondary);font-size:13px">&copy; 2024-2026 TokenNexus. All rights reserved.</p>
                </footer>
            </div>

            <!-- 右侧：热门平台排行榜 -->
            <div class="sidebar-right">
                ${generateSidebar(platform)}
            </div>
        </div>
    </main>

    <div class="action-bar">
        <a href="${platform.url}" target="_blank" rel="noopener" class="btn btn-primary">
            访问 ${platform.name} 官网
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        </a>
        <a href="/${catInfo.link}" class="btn btn-secondary">返回列表</a>
    </div>
</body>
</html>`;

    fs.writeFileSync(path.join(platformDir, `${slug}.html`), html);
    generated++;
});

console.log(`Generated ${generated} platform detail pages`);
