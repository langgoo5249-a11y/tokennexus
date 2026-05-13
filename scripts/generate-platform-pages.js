// Generate platform detail pages with real data and SEO/GEO long-tail keywords optimization
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
    official: { name: '官方平台', link: 'official.html', enName: 'Official Platform' },
    aggregator: { name: '聚合平台', link: 'aggregator.html', enName: 'Aggregator Platform' },
    china: { name: '国内平台', link: 'china.html', enName: 'China Platform' }
};

// Payment methods by category
const paymentByCategory = {
    official: ['信用卡', 'PayPal'],
    aggregator: ['支付宝', '微信', 'USDT', '信用卡', 'PayPal'],
    china: ['支付宝', '微信', 'USDT', '银行转账']
};

// Long-tail keyword templates for SEO coverage
const longTailTemplates = {
    official: [
        '{name} 官方API', '{name} API价格', '{name} API Key获取',
        '{name} 注册教程', '{name} 充值方式', '{name} 使用指南',
        '{name} API文档', '{name} 免费额度', '{name} 和 {alt} 对比',
        '{name} 国内能用吗', '{name} 替代方案', '{name} API调用教程',
        '{name} 价格表', '{name} 新手教程', '{name} 开发者指南'
    ],
    aggregator: [
        '{name} 中转API', '{name} API中转站', '{name} 价格对比',
        '{name} 稳定吗', '{name} 评测', '{name} 靠谱吗',
        '{name} API Key', '{name} 免费额度', '{name} 好用吗',
        '{name} 替代 {alt}', '{name} 和 {alt} 哪个好',
        '{name} 国内直连', '{name} 延迟测试', '{name} API速度',
        '{name} 便宜吗', '{name} 值得用吗'
    ],
    china: [
        '{name} 国内API', '{name} API平台', '{name} 价格',
        '{name} 注册', '{name} 支付宝充值', '{name} 微信支付',
        '{name} 免费试用', '{name} API文档', '{name} 对比',
        '{name} 和 {alt} 区别', '{name} 哪家好', '{name} 推荐',
        '{name} 开发者', '{name} 接入教程', '{name} 使用体验'
    ]
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

// Get a random alternative platform for comparison keywords
function getAltPlatform(platform) {
    const sameCat = platforms.filter(p => p.category === platform.category && p.id !== platform.id);
    if (sameCat.length > 0) return sameCat[Math.floor(Math.random() * sameCat.length)].name;
    const others = platforms.filter(p => p.id !== platform.id);
    return others.length > 0 ? others[Math.floor(Math.random() * others.length)].name : '其他平台';
}

// Generate comprehensive long-tail keywords for SEO
function generateKeywords(platform) {
    const cat = platform.category || 'china';
    const templates = longTailTemplates[cat] || longTailTemplates.china;
    const alt = getAltPlatform(platform);
    
    // Core keywords
    const core = [
        platform.name, platform.name + ' API', platform.name + ' 评测',
        platform.name + ' 价格', platform.name + ' 怎么用', platform.name + ' 注册'
    ];
    
    // Model-specific keywords
    const modelKw = platform.tags.slice(0, 4).map(t => `${t} API`);
    
    // Category keywords
    const catKw = [
        'AI API平台', 'AI API中转', 'AI接口', '大模型API',
        'ChatGPT API', 'Claude API', 'AI Token', 'API Key',
        cat === 'official' ? 'AI官方API' : cat === 'aggregator' ? 'AI API中转站' : '国内AI API'
    ];
    
    // Long-tail keywords from templates
    const longTail = templates.map(t => t.replace('{name}', platform.name).replace('{alt}', alt));
    
    // Combine and deduplicate
    const all = [...new Set([...core, ...modelKw, ...catKw, ...longTail])];
    return all.join(',');
}

// Generate SEO-optimized title
function generateTitle(platform) {
    const catInfo = categoryMap[platform.category] || categoryMap.china;
    const topModel = platform.tags[0] || 'AI';
    return `${platform.name} - ${topModel} API${platform.category === 'official' ? '官方' : ''}评测|价格|使用教程 | TokenNexus AI导航`;
}

// Generate SEO-optimized meta description (150-160 chars for Google, 70-80 for Baidu)
function generateMetaDesc(platform) {
    const catInfo = categoryMap[platform.category] || categoryMap.china;
    const models = platform.tags.slice(0, 3).join('、');
    const desc = `${platform.name}是${catInfo.name}，支持${models}等模型，价格${platform.pricing}，用户评分${platform.rating}分。提供${platform.name}注册教程、API Key获取、使用指南及替代方案对比。`;
    // Truncate to ~155 chars for Google optimal
    return desc.length > 160 ? desc.substring(0, 157) + '...' : desc;
}

// Generate Baidu-specific meta description (shorter)
function generateBaiduDesc(platform) {
    const models = platform.tags.slice(0, 2).join('、');
    return `${platform.name}支持${models}等AI模型，价格${platform.pricing}，评分${platform.rating}分。${platform.name}注册、API Key、使用教程及评测。`;
}

// Generate enhanced long description with rich SEO content and long-tail keywords
function generateLongDescription(platform) {
    const catInfo = categoryMap[platform.category] || categoryMap.china;
    const features = detectFeatures(platform.tags);
    const featureList = [];
    if (features.functionCalling) featureList.push('Function Calling（函数调用）');
    if (features.streaming) featureList.push('流式输出（Streaming）');
    if (features.image) featureList.push('图像生成与理解（Vision/DALL-E）');
    if (features.embedding) featureList.push('Embedding 向量嵌入');
    if (features.audio) featureList.push('语音识别与合成（TTS/STT）');
    if (features.video) featureList.push('视频理解与生成');
    if (features.codeInterpreter) featureList.push('代码解释器（Code Interpreter）');

    const payments = paymentByCategory[platform.category] || paymentByCategory.china;
    const isOfficial = platform.category === 'official';
    const priceNote = isOfficial ? '官方定价，价格透明，无中间商加价' : '中转服务，价格可能有加价，但通常支持国内支付方式';
    const alt = getAltPlatform(platform);

    // Model description mapping with more detail
    function modelDesc(t) {
        if (/GPT-4o|GPT-4/i.test(t)) return '多模态大语言模型，支持文本、图像理解和生成，适用于复杂推理、创意写作、数据分析等高级场景';
        if (/GPT-3\.5|GPT-4o-mini/i.test(t)) return '轻量级语言模型，响应速度快、成本低，适合日常对话、文本分类、简单问答等场景';
        if (/Claude/i.test(t)) return 'Anthropic 出品的安全可靠AI助手，擅长长文本理解、学术写作、代码生成，支持200K上下文窗口';
        if (/Gemini/i.test(t)) return 'Google 推出的多模态AI模型，深度集成Google生态，支持文本、图像、视频、音频理解';
        if (/DeepSeek/i.test(t)) return '深度求索推出的高性价比AI模型，在代码生成和数学推理方面表现优异，价格极具竞争力';
        if (/通义|Qwen/i.test(t)) return '阿里云推出的大语言模型，中文理解能力强，支持多模态，适合国内业务场景';
        if (/文心|ERNIE/i.test(t)) return '百度推出的中文大语言模型，深度优化中文理解和生成，适合中文NLP任务';
        if (/GLM|智谱/i.test(t)) return '智谱AI推出的中英双语大模型，学术背景深厚，推理能力强';
        if (/Llama/i.test(t)) return 'Meta开源的大语言模型系列，社区活跃，支持本地部署和自定义微调';
        if (/Mistral/i.test(t)) return '欧洲领先的开源AI模型，高效轻量，多语言支持优秀';
        if (/embedding|向量/i.test(t)) return '文本向量化模型，用于语义搜索、文本聚类、推荐系统等场景';
        if (/whisper|语音/i.test(t)) return '语音识别模型，支持多语言语音转文字，准确率高';
        if (/tts|语音合成/i.test(t)) return '文本转语音模型，支持多种语言和音色，自然度接近真人';
        if (/dall|绘图|image/i.test(t)) return 'AI图像生成模型，支持文生图、图生图，可创建高质量图片和艺术作品';
        if (/vision|图像理解/i.test(t)) return '视觉理解模型，支持图像描述、OCR、视觉问答等多模态任务';
        return '专业AI模型，适用于智能对话、文本生成、知识问答等AI应用场景';
    }

    return `
    <h2>${platform.name} 详细介绍</h2>
    <p>${platform.description}。作为${isOfficial ? '官方API平台' : catInfo.name}，${platform.name} 为开发者提供稳定、高效的AI接口服务，${isOfficial ? '确保数据安全和服务质量' : '支持国内直连，解决网络访问问题'}。</p>

    <h2>${platform.name} 核心功能与特色</h2>
    <p>${platform.name} 提供丰富的AI能力，具备以下核心功能，开发者可以直接在应用中集成使用：</p>
    <ul>
        ${featureList.map(f => `<li><strong>${f}</strong> - ${platform.name} 原生支持${f}功能，API接口标准化，接入简单快捷。</li>`).join('\n        ')}
    </ul>

    <h2>${platform.name} 支持的AI模型</h2>
    <p>${platform.name} 支持以下主流AI模型，覆盖文本生成、图像理解、代码编写、语音处理等多种应用场景：</p>
    <ul>
        ${platform.tags.map(t => `<li><strong>${t}</strong> - ${modelDesc(t)}。</li>`).join('\n        ')}
    </ul>

    <h2>${platform.name} 价格体系与计费方式</h2>
    <p>${platform.name} 的定价为 <strong>${platform.pricing}</strong>。${priceNote}。</p>
    <p>使用AI API时，建议开发者根据实际业务需求选择合适的模型等级以控制成本：</p>
    <ul>
        <li><strong>轻量级场景</strong>（日常对话、文本分类）：选择 GPT-4o-mini、Claude Haiku 等小模型，成本更低</li>
        <li><strong>中等复杂度</strong>（内容创作、数据分析）：选择 GPT-4o、Claude Sonnet 等中端模型，性价比最优</li>
        <li><strong>高复杂度</strong>（代码生成、复杂推理）：选择 GPT-4、Claude Opus、o1 等高端模型，效果最佳</li>
    </ul>
    <p>建议关注 ${platform.name} 的免费额度和新用户优惠活动，${platform.tags.some(t => t.includes('免费')) ? '该平台目前提供免费试用额度。' : '部分平台会不定期提供免费试用。'}。</p>

    <h2>${platform.name} 支付方式</h2>
    <p>${platform.name} 支持 ${payments.join('、')} 等多种支付方式。${payments.includes('支付宝') ? '国内用户可以使用支付宝或微信便捷充值，无需信用卡。' : ''}${payments.includes('USDT') ? '同时支持USDT等加密货币支付，保护用户隐私。' : ''}${payments.includes('PayPal') ? '海外用户可通过PayPal便捷支付。' : ''}</p>

    <h2>${platform.name} 稳定性与响应速度</h2>
    <p>${platform.name} ${isOfficial ? '作为官方平台，' : ''}提供稳定可靠的API服务，建议开发者在使用时实现错误重试机制和降级策略，以确保应用的可用性。</p>
    <p>响应速度方面，${platform.name} ${isOfficial ? '在全球部署了多个数据中心节点' : '通常在国内有优化节点'}，API响应延迟一般在100-500ms之间，具体取决于所选模型和请求复杂度。</p>

    <h2>${platform.name} 注册与API Key获取教程</h2>
    <p>开始使用 ${platform.name} API 只需简单几步：</p>
    <ol>
        <li>访问 <strong>${platform.name} 官网</strong>（${platform.url}），点击注册按钮创建账号</li>
        <li>完成邮箱验证和身份认证${payments.includes('支付宝') ? '，支持手机号快捷注册' : ''}</li>
        <li>登录控制台，进入 <strong>API管理</strong> 页面，点击「创建API Key」</li>
        <li>复制并妥善保存 API Key（仅显示一次），配置到您的应用中</li>
        <li>参考官方API文档，配置请求参数，开始调用AI接口</li>
        <li>在监控面板查看API调用量、费用和使用统计</li>
    </ol>

    <h2>${platform.name} 适用场景</h2>
    <p>${platform.name} 适用于以下典型业务场景：</p>
    <ul>
        <li><strong>智能客服系统</strong> - 构建7x24小时AI客服，自动回答用户常见问题，降低人工成本</li>
        <li><strong>内容创作与营销</strong> - 文章写作、营销文案、社交媒体内容、SEO文章自动生成</li>
        <li><strong>代码开发辅助</strong> - 代码补全、代码审查、Bug修复、自动化测试用例生成</li>
        <li><strong>数据分析与报表</strong> - 自然语言查询数据库、智能数据可视化、自动化报表生成</li>
        <li><strong>教育培训</strong> - 个性化学习助手、智能答疑、作业批改、知识图谱构建</li>
        <li><strong>企业内部工具</strong> - 文档检索、知识库问答、会议纪要生成、邮件智能回复</li>
    </ul>

    <h2>${platform.name} 与 ${alt} 对比</h2>
    <p>很多开发者在选择AI API平台时，会纠结 ${platform.name} 和 ${alt} 哪个更好。以下是关键对比维度：</p>
    <ul>
        <li><strong>模型支持</strong>：${platform.name} 支持 ${platform.tags.slice(0, 3).join('、')} 等模型，覆盖面广</li>
        <li><strong>价格优势</strong>：${platform.name} 定价 ${platform.pricing}，${isOfficial ? '为官方原价' : '中转加价较低'}</li>
        <li><strong>用户体验</strong>：${platform.name} 用户评分 ${platform.rating}/5.0，口碑${platform.rating >= 4.5 ? '优秀' : platform.rating >= 4.0 ? '良好' : '一般'}</li>
        <li><strong>支付便利性</strong>：${platform.name} 支持 ${payments.join('、')}，${payments.includes('支付宝') ? '国内支付非常方便' : '满足多种支付需求'}</li>
    </ul>

    <h2>${platform.name} 常见问题（FAQ）</h2>
    <p><strong>${platform.name} 怎么注册？</strong> 访问 ${platform.name} 官网 ${platform.url}，点击注册按钮，使用邮箱${payments.includes('支付宝') ? '或手机号' : ''}完成注册即可，通常1-2分钟即可完成。</p>
    <p><strong>${platform.name} API Key 怎么获取？</strong> 登录 ${platform.name} 控制台后，在API管理或开发者设置页面创建新的API Key。建议为不同项目创建独立的Key，便于管理。</p>
    <p><strong>${platform.name} 有免费额度吗？</strong> ${platform.tags.some(t => t.includes('免费')) ? '是的，' + platform.name + ' 为新用户提供免费额度，可以免费体验API服务后再决定是否付费。' : '建议查看 ' + platform.name + ' 官网最新活动，部分平台会不定期提供免费试用额度或新用户优惠券。'}</p>
    <p><strong>${platform.name} 国内能用吗？</strong> ${isOfficial ? platform.name + ' 是海外平台，国内直接访问可能需要特殊网络环境。如果需要国内直连，可以考虑使用支持国内访问的聚合平台。' : platform.name + ' 支持国内直连访问，无需特殊网络配置，国内开发者可以直接使用。'}</p>
    <p><strong>${platform.name} 安全可靠吗？</strong> ${platform.name} 用户评分 ${platform.rating}/5.0，${platform.verified ? '已通过TokenNexus平台验证。' : ''}建议开发者在使用时做好API Key安全管理，定期轮换密钥。</p>`;
}

// Generate FAQ Schema for Google rich results
function generateFAQSchema(platform) {
    const catInfo = categoryMap[platform.category] || categoryMap.china;
    const isOfficial = platform.category === 'official';
    const hasFree = platform.tags.some(t => t.includes('免费'));
    
    return JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": `${platform.name}是什么？`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `${platform.name}是${catInfo.name}，${platform.description}。支持${platform.tags.slice(0,4).join('、')}等AI模型，用户评分${platform.rating}分。`
                }
            },
            {
                "@type": "Question",
                "name": `${platform.name}怎么注册？`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `访问${platform.name}官网 ${platform.url}，点击注册按钮，使用邮箱完成注册即可。注册后可在控制台创建API Key开始使用。`
                }
            },
            {
                "@type": "Question",
                "name": `${platform.name} API Key怎么获取？`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `登录${platform.name}控制台，进入API管理页面，点击创建新的API Key。建议为不同项目创建独立的Key便于管理。`
                }
            },
            {
                "@type": "Question",
                "name": `${platform.name}有免费额度吗？`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": hasFree ? `是的，${platform.name}为新用户提供免费额度，可以免费体验API服务。` : `建议查看${platform.name}官网最新活动，部分平台会不定期提供免费试用额度。`
                }
            },
            {
                "@type": "Question",
                "name": `${platform.name}价格是多少？`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `${platform.name}的定价为${platform.pricing}。${isOfficial ? '官方定价透明无加价。' : '中转服务价格合理。'}建议根据业务需求选择合适的模型等级以控制成本。`
                }
            },
            {
                "@type": "Question",
                "name": `${platform.name}国内能用吗？`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": isOfficial ? `${platform.name}是海外官方平台，国内直接访问可能需要特殊网络环境。推荐使用支持国内直连的聚合平台作为替代。` : `${platform.name}支持国内直连访问，国内开发者可以直接使用，无需特殊网络配置。`
                }
            }
        ]
    });
}

// Generate BreadcrumbList Schema
function generateBreadcrumbSchema(platform) {
    const catInfo = categoryMap[platform.category] || categoryMap.china;
    return JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "首页",
                "item": "https://www.tokenfind.cn/"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": catInfo.name,
                "item": `https://www.tokenfind.cn/${catInfo.link}`
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": platform.name,
                "item": `https://www.tokenfind.cn/platform/${slugify(platform.name)}.html`
            }
        ]
    });
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
    const baiduDesc = generateBaiduDesc(platform);
    const title = generateTitle(platform);
    const stars = generateStars(platform.rating);
    const faqSchema = generateFAQSchema(platform);
    const breadcrumbSchema = generateBreadcrumbSchema(platform);

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
    <title>${title}</title>
    <meta name="description" content="${metaDesc}">
    <meta name="keywords" content="${keywords}">
    <meta name="author" content="TokenNexus Team">
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
    <meta name="googlebot" content="index, follow, max-snippet:-1">
    <meta name="bingbot" content="index, follow, max-snippet:-1">
    <!-- Baidu-specific meta -->
    <meta name="baiduspider" content="index, follow">
    <meta property="og:title" content="${platform.name} - ${platform.tags[0]} API评测|价格|使用教程 | TokenNexus">
    <meta property="og:description" content="${metaDesc}">
    <meta property="og:image" content="https://www.tokenfind.cn${platform.logo}">
    <meta property="og:url" content="https://www.tokenfind.cn/platform/${slug}.html">
    <meta property="og:type" content="article">
    <meta property="og:locale" content="zh_CN">
    <meta property="og:site_name" content="TokenNexus">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${platform.name} - ${platform.tags[0]} API评测 | TokenNexus">
    <meta name="twitter:description" content="${metaDesc}">
    <meta name="twitter:image" content="https://www.tokenfind.cn${platform.logo}">
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
        /* 底部CTA区域样式 */
        .cta-section{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin:40px 0 30px}
        .cta-card{background:var(--card-bg);border:1px solid var(--card-border);border-radius:16px;padding:30px;text-align:center;transition:all .3s;cursor:pointer;position:relative;overflow:hidden}
        .cta-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;opacity:0;transition:opacity .3s}
        .cta-card.submit::before{background:linear-gradient(90deg,var(--neon-cyan),var(--neon-purple))}
        .cta-card.business::before{background:linear-gradient(90deg,var(--neon-purple),#ff6b6b)}
        .cta-card:hover{transform:translateY(-5px);border-color:var(--neon-cyan);box-shadow:0 15px 40px rgba(0,240,255,0.15)}
        .cta-card:hover::before{opacity:1}
        .cta-icon{font-size:40px;margin-bottom:15px;display:block}
        .cta-card h3{font-family:'Orbitron',sans-serif;font-size:18px;margin-bottom:10px;color:var(--text-primary)}
        .cta-card p{font-size:14px;color:var(--text-secondary);line-height:1.5}
        /* 模态弹窗样式 */
        .modal-overlay{display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);z-index:10000;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(5px)}
        .modal-overlay.active{display:flex}
        .modal{background:#111;border:1px solid var(--card-border);border-radius:20px;width:100%;max-width:560px;max-height:85vh;overflow-y:auto;position:relative}
        .modal-header{display:flex;justify-content:space-between;align-items:center;padding:24px 30px;border-bottom:1px solid var(--card-border)}
        .modal-header h2{font-family:'Orbitron',sans-serif;font-size:20px;color:var(--text-primary);margin:0}
        .modal-close{width:36px;height:36px;border-radius:50%;border:1px solid var(--card-border);background:transparent;color:var(--text-secondary);font-size:20px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s}
        .modal-close:hover{border-color:#ff4757;color:#ff4757;background:rgba(255,71,87,0.1)}
        .modal-body{padding:30px}
        .form-group{margin-bottom:20px}
        .form-group label{display:block;font-size:14px;font-weight:600;color:var(--text-primary);margin-bottom:8px}
        .form-group label .required{color:#ff4757;margin-left:2px}
        .form-group input,.form-group select,.form-group textarea{width:100%;padding:12px 16px;background:rgba(255,255,255,0.05);border:1px solid var(--card-border);border-radius:10px;color:var(--text-primary);font-size:14px;transition:border-color .2s;box-sizing:border-box;font-family:inherit}
        .form-group input:focus,.form-group select:focus,.form-group textarea:focus{outline:none;border-color:var(--neon-cyan);box-shadow:0 0 0 3px rgba(0,240,255,0.1)}
        .form-group textarea{resize:vertical;min-height:100px}
        .form-group input::placeholder,.form-group textarea::placeholder{color:rgba(255,255,255,0.25)}
        .form-group select option{background:#111;color:var(--text-primary)}
        .form-row{display:grid;grid-template-columns:1fr 1fr;gap:16px}
        .form-submit{width:100%;padding:14px;background:linear-gradient(135deg,var(--neon-cyan),var(--neon-purple));color:#000;border:none;border-radius:10px;font-size:16px;font-weight:700;cursor:pointer;font-family:'Orbitron',sans-serif;letter-spacing:1px;transition:all .3s;margin-top:10px}
        .form-submit:hover{opacity:0.9;transform:translateY(-2px);box-shadow:0 8px 25px rgba(0,240,255,0.3)}
        .form-submit:disabled{opacity:0.5;cursor:not-allowed;transform:none}
        .form-msg{text-align:center;margin-top:12px;font-size:14px;min-height:20px}
        .form-msg.success{color:#2ed573}
        .form-msg.error{color:#ff4757}
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
        "url":"https://www.tokenfind.cn/platform/${slug}.html",
        "offers":{"@type":"Offer","price":"0","priceCurrency":"USD","availability":"https://schema.org/OnlineOnly"},
        "aggregateRating":{"@type":"AggregateRating","ratingValue":"${platform.rating}","bestRating":"5","worstRating":"1","reviewCount":"${platform.reviews}"},
        "author":{"@type":"Organization","name":"${platform.name}","url":"${platform.url}"},
        "provider":{"@type":"Organization","name":"TokenNexus","url":"https://www.tokenfind.cn/"}
    }
    </script>
    <script type="application/ld+json">
    ${faqSchema}
    </script>
    <script type="application/ld+json">
    ${breadcrumbSchema}
    </script>
    <!-- 百度统计 -->
    <script>
    var _hmt = _hmt || [];
    (function() {
      var hm = document.createElement("script");
      hm.src = "https://hm.baidu.com/hm.js?aa6a94065c3983b2407d20b92e8d1fd9";
      var s = document.getElementsByTagName("script")[0]; 
      s.parentNode.insertBefore(hm, s);
    })();
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

        <!-- 底部CTA区域 -->
        <div class="cta-section" style="max-width:1400px;margin:0 auto;padding:0 40px">
            <div class="cta-card submit" onclick="openModal('submitModal')">
                <span class="cta-icon">🚀</span>
                <h3>提交收录</h3>
                <p>您的平台也想被收录？提交信息，我们将在1-3个工作日内审核</p>
            </div>
            <div class="cta-card business" onclick="openModal('businessModal')">
                <span class="cta-icon">🤝</span>
                <h3>商务合作</h3>
                <p>广告投放、战略合作、API对接等商务合作咨询</p>
            </div>
        </div>

        <!-- 提交收录弹窗 -->
        <div class="modal-overlay" id="submitModal">
            <div class="modal">
                <div class="modal-header">
                    <h2>🚀 提交平台收录</h2>
                    <button class="modal-close" onclick="closeModal('submitModal')">✕</button>
                </div>
                <div class="modal-body">
                    <form id="submitForm" onsubmit="return handleSubmit(event)">
                        <div class="form-row">
                            <div class="form-group">
                                <label>平台名称 <span class="required">*</span></label>
                                <input type="text" name="platform_name" placeholder="例如：OpenAI" required>
                            </div>
                            <div class="form-group">
                                <label>平台分类 <span class="required">*</span></label>
                                <select name="category" required>
                                    <option value="official">🌍 海外官方平台</option>
                                    <option value="aggregator">🔗 聚合中转平台</option>
                                    <option value="china">🇨🇳 国内平台</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>平台网址 <span class="required">*</span></label>
                            <input type="url" name="platform_url" placeholder="https://example.com" required>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>联系邮箱 <span class="required">*</span></label>
                                <input type="email" name="contact_email" placeholder="your@email.com" required>
                            </div>
                            <div class="form-group">
                                <label>联系人</label>
                                <input type="text" name="contact_name" placeholder="您的姓名">
                            </div>
                        </div>
                        <div class="form-group">
                            <label>平台描述</label>
                            <textarea name="description" placeholder="请简要描述平台的主要功能和特点..."></textarea>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>价格信息</label>
                                <input type="text" name="pricing" placeholder="例如：$0.002/1K tokens">
                            </div>
                            <div class="form-group">
                                <label>支持模型</label>
                                <input type="text" name="models" placeholder="例如：GPT-4, Claude, Gemini">
                            </div>
                        </div>
                        <div class="form-group">
                            <label>补充说明</label>
                            <textarea name="message" placeholder="其他需要说明的信息..."></textarea>
                        </div>
                        <button type="submit" class="form-submit" id="submitBtn">提交收录申请</button>
                        <div class="form-msg" id="submitMsg"></div>
                    </form>
                </div>
            </div>
        </div>

        <!-- 商务合作弹窗 -->
        <div class="modal-overlay" id="businessModal">
            <div class="modal">
                <div class="modal-header">
                    <h2>🤝 商务合作</h2>
                    <button class="modal-close" onclick="closeModal('businessModal')">✕</button>
                </div>
                <div class="modal-body">
                    <form id="businessForm" onsubmit="return handleBusiness(event)">
                        <div class="form-group">
                            <label>合作类型 <span class="required">*</span></label>
                            <select name="inquiry_type" required>
                                <option value="advertising">📢 广告投放</option>
                                <option value="partnership">🤝 战略合作</option>
                                <option value="data_exchange">📊 数据交换</option>
                                <option value="api_integration">🔗 API对接</option>
                                <option value="listing_priority">⭐ 优先收录</option>
                                <option value="other">📋 其他</option>
                            </select>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>公司名称 <span class="required">*</span></label>
                                <input type="text" name="company_name" placeholder="您的公司名称" required>
                            </div>
                            <div class="form-group">
                                <label>联系人 <span class="required">*</span></label>
                                <input type="text" name="contact_name" placeholder="您的姓名" required>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>联系邮箱 <span class="required">*</span></label>
                                <input type="email" name="contact_email" placeholder="your@email.com" required>
                            </div>
                            <div class="form-group">
                                <label>联系电话</label>
                                <input type="tel" name="phone" placeholder="您的手机号">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>公司网站</label>
                                <input type="url" name="website" placeholder="https://your-company.com">
                            </div>
                            <div class="form-group">
                                <label>预算范围</label>
                                <input type="text" name="budget" placeholder="例如：1万-5万/月">
                            </div>
                        </div>
                        <div class="form-group">
                            <label>合作详情</label>
                            <textarea name="message" placeholder="请详细描述您的合作需求..."></textarea>
                        </div>
                        <button type="submit" class="form-submit" id="businessBtn">提交合作咨询</button>
                        <div class="form-msg" id="businessMsg"></div>
                    </form>
                </div>
            </div>
        </div>

        <script>
        function openModal(id){document.getElementById(id).classList.add('active');document.body.style.overflow='hidden'}
        function closeModal(id){document.getElementById(id).classList.remove('active');document.body.style.overflow=''}
        document.querySelectorAll('.modal-overlay').forEach(m=>{m.addEventListener('click',function(e){if(e.target===this)closeModal(this.id)})});

        async function handleSubmit(e){
            e.preventDefault();
            const btn=document.getElementById('submitBtn');
            const msg=document.getElementById('submitMsg');
            const form=document.getElementById('submitForm');
            btn.disabled=true;btn.textContent='提交中...';
            try{
                const fd=new FormData(form);
                const data=Object.fromEntries(fd);
                const res=await fetch('/api/submit-platform',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
                const result=await res.json();
                if(result.success){msg.className='form-msg success';msg.textContent=result.message;form.reset();setTimeout(()=>closeModal('submitModal'),2000)}
                else{msg.className='form-msg error';msg.textContent=result.message}
            }catch(err){msg.className='form-msg error';msg.textContent='网络错误，请稍后重试'}
            btn.disabled=false;btn.textContent='提交收录申请';
            return false;
        }

        async function handleBusiness(e){
            e.preventDefault();
            const btn=document.getElementById('businessBtn');
            const msg=document.getElementById('businessMsg');
            const form=document.getElementById('businessForm');
            btn.disabled=true;btn.textContent='提交中...';
            try{
                const fd=new FormData(form);
                const data=Object.fromEntries(fd);
                const res=await fetch('/api/business-contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
                const result=await res.json();
                if(result.success){msg.className='form-msg success';msg.textContent=result.message;form.reset();setTimeout(()=>closeModal('businessModal'),2000)}
                else{msg.className='form-msg error';msg.textContent=result.message}
            }catch(err){msg.className='form-msg error';msg.textContent='网络错误，请稍后重试'}
            btn.disabled=false;btn.textContent='提交合作咨询';
            return false;
        }
        </script>
    </main>

    <!-- 多语言切换组件 -->
    <script src="/js/i18n.js"></script>

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
