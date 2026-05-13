/**
 * 多语言网站翻译脚本
 * 使用免费翻译API生成静态多语言版本
 */

const fs = require('fs');
const path = require('path');

// 支持的语言列表
const LANGUAGES = {
    'en': { name: 'English', native: 'English', dir: 'ltr' },
    'ja': { name: 'Japanese', native: '日本語', dir: 'ltr' },
    'ko': { name: 'Korean', native: '한국어', dir: 'ltr' },
    'es': { name: 'Spanish', native: 'Español', dir: 'ltr' },
    'fr': { name: 'French', native: 'Français', dir: 'ltr' },
    'de': { name: 'German', native: 'Deutsch', dir: 'ltr' },
    'ru': { name: 'Russian', native: 'Русский', dir: 'ltr' },
    'ar': { name: 'Arabic', native: 'العربية', dir: 'rtl' },
    'vi': { name: 'Vietnamese', native: 'Tiếng Việt', dir: 'ltr' },
    'th': { name: 'Thai', native: 'ไทย', dir: 'ltr' },
    'id': { name: 'Indonesian', native: 'Bahasa Indonesia', dir: 'ltr' },
    'ms': { name: 'Malay', native: 'Bahasa Melayu', dir: 'ltr' },
    'fil': { name: 'Filipino', native: 'Filipino', dir: 'ltr' }
};

// 需要翻译的文本内容（从平台数据中提取）
const TRANSLATABLE_TEXTS = {
    // 网站标题和描述
    site_title: 'TokenNexus | 全球AI Token导航',
    site_description: '全球最全的AI Token导航平台，收录280+国内外AI API服务商',
    
    // 导航菜单
    nav_home: '首页',
    nav_official: '海外官方',
    nav_aggregator: '聚合中转',
    nav_china: '国内平台',
    nav_about: '关于我们',
    nav_contact: '联系我们',
    
    // 分类标题
    category_official: '海外官方平台',
    category_aggregator: '聚合中转平台',
    category_china: '国内平台',
    
    // 分类描述
    desc_official: 'OpenAI、Anthropic、Google等官方API直连',
    desc_aggregator: '一站式访问多模型，价格更优更便捷',
    desc_china: '国产大模型与国内中转服务，支付便捷',
    
    // 筛选标签
    filter_all: '全部',
    filter_free: '免费额度',
    filter_cheapest: '最便宜',
    filter_stable: '最稳定',
    
    // 统计标签
    stat_platforms: '收录平台',
    stat_models: 'AI 模型',
    stat_reviews: '用户评价',
    
    // 按钮文本
    btn_view_details: '查看详情',
    btn_login: '登录',
    btn_register: '注册',
    btn_submit_comment: '发表评论',
    
    // 表单标签
    form_username: '用户名',
    form_password: '密码',
    form_email: '邮箱',
    form_comment: '评论',
    
    // 页脚
    footer_about: '关于我们',
    footer_privacy: '隐私政策',
    footer_terms: '服务条款',
    footer_contact: '联系我们',
    
    // SEO相关
    seo_title: 'AI API平台对比|价格|评测',
    seo_description: '提供AI API平台对比、价格查询、用户评价、API Key获取教程',
    
    // 搜索
    search_placeholder: '搜索平台名称、描述或标签...',
    
    // 评论
    comments_title: '评论',
    comments_empty: '暂无评论，成为第一个评论者吧！',
    comments_login_required: '登录后发表评论',
    
    // 验证标签
    verified_badge: '已验证'
};

// 翻译缓存
const translationCache = {};

/**
 * 使用Google Translate免费API翻译文本
 */
async function translateText(text, targetLang) {
    if (!text || text.trim() === '') return text;
    
    // 检查缓存
    const cacheKey = `${targetLang}:${text}`;
    if (translationCache[cacheKey]) {
        return translationCache[cacheKey];
    }
    
    try {
        // 使用Google Translate免费API
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=zh-CN&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Translation failed: ${response.status}`);
        }
        
        const data = await response.json();
        const translated = data[0].map(item => item[0]).join('');
        
        // 缓存结果
        translationCache[cacheKey] = translated;
        
        // 添加延迟避免请求过快
        await new Promise(resolve => setTimeout(resolve, 100));
        
        return translated;
    } catch (error) {
        console.error(`Translation error for "${text}": ${error.message}`);
        return text; // 返回原文
    }
}

/**
 * 批量翻译文本
 */
async function translateBatch(texts, targetLang) {
    const results = {};
    for (const [key, text] of Object.entries(texts)) {
        results[key] = await translateText(text, targetLang);
        console.log(`  Translated: ${key}`);
    }
    return results;
}

/**
 * 生成语言选择器HTML
 */
function generateLanguageSelector(currentLang = 'zh') {
    const options = Object.entries(LANGUAGES).map(([code, lang]) => {
        const selected = code === currentLang ? 'selected' : '';
        return `<option value="${code}" ${selected}>${lang.native}</option>`;
    }).join('\n');
    
    return `
    <div class="language-selector">
        <select id="langSelect" onchange="changeLanguage(this.value)" aria-label="Select Language">
            <option value="zh" ${currentLang === 'zh' ? 'selected' : ''}>中文</option>
            ${options}
        </select>
    </div>
    <style>
    .language-selector {
        position: fixed;
        top: 80px;
        right: 20px;
        z-index: 1000;
    }
    .language-selector select {
        background: rgba(0, 240, 255, 0.1);
        border: 1px solid rgba(0, 240, 255, 0.3);
        color: #fff;
        padding: 8px 12px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
    }
    .language-selector select:hover {
        background: rgba(0, 240, 255, 0.2);
    }
    .language-selector select option {
        background: #1a1a2e;
        color: #fff;
    }
    </style>
    <script>
    function changeLanguage(lang) {
        if (lang === 'zh') {
            window.location.href = '/';
        } else {
            window.location.href = '/' + lang + '/';
        }
    }
    </script>`;
}

/**
 * 主函数：生成所有语言的翻译
 */
async function main() {
    console.log('========================================');
    console.log('多语言网站翻译生成器');
    console.log('========================================\n');
    
    const baseDir = '/workspace/token-nav';
    
    // 为每种语言创建目录并翻译
    for (const [langCode, langInfo] of Object.entries(LANGUAGES)) {
        console.log(`\n[${langInfo.native}] 开始翻译...`);
        
        const langDir = path.join(baseDir, langCode);
        
        // 创建语言目录
        if (!fs.existsSync(langDir)) {
            fs.mkdirSync(langDir, { recursive: true });
        }
        
        // 翻译文本
        const translations = await translateBatch(TRANSLATABLE_TEXTS, langCode);
        
        // 保存翻译结果
        const translationsPath = path.join(langDir, 'translations.json');
        fs.writeFileSync(translationsPath, JSON.stringify(translations, null, 2), 'utf-8');
        
        console.log(`  ✓ 翻译完成，保存到: ${translationsPath}`);
    }
    
    console.log('\n========================================');
    console.log('翻译完成！');
    console.log('========================================');
}

// 导出函数
module.exports = {
    LANGUAGES,
    translateText,
    translateBatch,
    generateLanguageSelector,
    TRANSLATABLE_TEXTS
};

// 如果直接运行
if (require.main === module) {
    main().catch(console.error);
}
