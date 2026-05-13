/**
 * 网站多语言切换组件
 * 使用Google Translate免费API实现实时翻译
 * 支持主流语言和东南亚语言
 */

const I18N = {
    // 当前语言
    currentLang: 'zh',
    
    // 支持的语言
    languages: {
        'zh': { name: 'Chinese', native: '中文', dir: 'ltr' },
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
    },
    
    // 翻译缓存
    cache: {},
    
    // 需要翻译的选择器
    translateSelectors: [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'p', 'span', 'label', 'button', 'a',
        '.platform-name', '.platform-description', '.tag',
        '.category-info h3', '.category-info p',
        '.filter-tag', '.stat-label', '.section-title',
        '.nav-link', '.footer-link', '.modal-title',
        '.btn', '.submit-comment', '.comment-input::placeholder'
    ],
    
    // 不翻译的类名
    excludeClasses: ['no-translate', 'logo', 'platform-logo', 'price', 'rating'],
    
    /**
     * 初始化
     */
    init() {
        this.loadLanguage();
        this.createLanguageSelector();
        this.updateHtmlLang();
    },
    
    /**
     * 加载保存的语言设置
     */
    loadLanguage() {
        const saved = localStorage.getItem('i18n_lang');
        if (saved && this.languages[saved]) {
            this.currentLang = saved;
        }
    },
    
    /**
     * 保存语言设置
     */
    saveLanguage(lang) {
        localStorage.setItem('i18n_lang', lang);
        this.currentLang = lang;
    },
    
    /**
     * 创建语言选择器
     */
    createLanguageSelector() {
        const selector = document.createElement('div');
        selector.className = 'i18n-selector';
        selector.innerHTML = `
            <button class="i18n-btn" onclick="I18N.toggleDropdown()" aria-label="Select Language">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
                <span class="i18n-current-lang">${this.languages[this.currentLang].native}</span>
            </button>
            <div class="i18n-dropdown" id="i18nDropdown">
                ${Object.entries(this.languages).map(([code, lang]) => `
                    <button class="i18n-option ${code === this.currentLang ? 'active' : ''}" 
                            onclick="I18N.setLanguage('${code}')"
                            data-lang="${code}">
                        <span class="lang-native">${lang.native}</span>
                        <span class="lang-name">${lang.name}</span>
                    </button>
                `).join('')}
            </div>
        `;
        
        document.body.appendChild(selector);
        
        // 点击外部关闭下拉菜单
        document.addEventListener('click', (e) => {
            if (!selector.contains(e.target)) {
                document.getElementById('i18nDropdown').classList.remove('show');
            }
        });
    },
    
    /**
     * 切换下拉菜单
     */
    toggleDropdown() {
        document.getElementById('i18nDropdown').classList.toggle('show');
    },
    
    /**
     * 设置语言
     */
    async setLanguage(lang) {
        if (lang === this.currentLang) {
            this.toggleDropdown();
            return;
        }
        
        // 如果切换回中文，直接刷新页面
        if (lang === 'zh') {
            this.saveLanguage('zh');
            location.reload();
            return;
        }
        
        // 显示加载状态
        const btn = document.querySelector('.i18n-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span class="i18n-loading">翻译中...</span>';
        
        try {
            await this.translatePage(lang);
            this.saveLanguage(lang);
            this.updateHtmlLang();
            
            // 更新按钮显示
            document.querySelector('.i18n-current-lang').textContent = this.languages[lang].native;
            
            // 更新下拉菜单选中状态
            document.querySelectorAll('.i18n-option').forEach(opt => {
                opt.classList.toggle('active', opt.dataset.lang === lang);
            });
            
        } catch (error) {
            console.error('Translation error:', error);
            alert('翻译失败，请稍后重试');
            btn.innerHTML = originalText;
        }
        
        this.toggleDropdown();
    },
    
    /**
     * 翻译整个页面
     */
    async translatePage(targetLang) {
        const elements = this.getTranslatableElements();
        const texts = [];
        const elementMap = new Map();
        
        // 收集所有需要翻译的文本
        elements.forEach((el, index) => {
            const text = el.textContent.trim();
            if (text && !this.isExcluded(el)) {
                texts.push(text);
                elementMap.set(index, el);
            }
        });
        
        // 批量翻译
        const translations = await this.batchTranslate(texts, targetLang);
        
        // 应用翻译
        let translationIndex = 0;
        elements.forEach((el) => {
            const text = el.textContent.trim();
            if (text && !this.isExcluded(el)) {
                el.textContent = translations[translationIndex] || text;
                el.setAttribute('data-i18n-original', text);
                translationIndex++;
            }
        });
        
        // 翻译placeholder属性
        document.querySelectorAll('[placeholder]').forEach(el => {
            const placeholder = el.getAttribute('placeholder');
            if (placeholder) {
                el.setAttribute('data-i18n-original-placeholder', placeholder);
                this.translateText(placeholder, targetLang).then(translated => {
                    el.setAttribute('placeholder', translated);
                });
            }
        });
    },
    
    /**
     * 获取可翻译的元素
     */
    getTranslatableElements() {
        const selector = this.translateSelectors.join(', ');
        return Array.from(document.querySelectorAll(selector));
    },
    
    /**
     * 检查元素是否排除翻译
     */
    isExcluded(el) {
        return this.excludeClasses.some(cls => el.classList.contains(cls)) ||
               el.closest('.' + this.excludeClasses.join(', .'));
    },
    
    /**
     * 批量翻译
     */
    async batchTranslate(texts, targetLang) {
        // 去重
        const uniqueTexts = [...new Set(texts)];
        
        // 检查缓存
        const results = [];
        const toTranslate = [];
        const toTranslateIndices = [];
        
        uniqueTexts.forEach((text, index) => {
            const cacheKey = `${targetLang}:${text}`;
            if (this.cache[cacheKey]) {
                results[index] = this.cache[cacheKey];
            } else {
                toTranslate.push(text);
                toTranslateIndices.push(index);
            }
        });
        
        // 翻译未缓存的文本
        if (toTranslate.length > 0) {
            const translations = await Promise.all(
                toTranslate.map(text => this.translateText(text, targetLang))
            );
            
            translations.forEach((translated, i) => {
                const originalIndex = toTranslateIndices[i];
                results[originalIndex] = translated;
                
                // 缓存结果
                const cacheKey = `${targetLang}:${toTranslate[i]}`;
                this.cache[cacheKey] = translated;
            });
        }
        
        // 映射回原始文本顺序
        return texts.map(text => {
            const cacheKey = `${targetLang}:${text}`;
            return this.cache[cacheKey] || text;
        });
    },
    
    /**
     * 翻译单个文本
     */
    async translateText(text, targetLang) {
        if (!text || text.trim() === '') return text;
        
        // 检查缓存
        const cacheKey = `${targetLang}:${text}`;
        if (this.cache[cacheKey]) {
            return this.cache[cacheKey];
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
            this.cache[cacheKey] = translated;
            
            // 保存到localStorage
            this.saveCache();
            
            return translated;
        } catch (error) {
            console.error('Translation error:', error);
            return text;
        }
    },
    
    /**
     * 保存缓存到localStorage
     */
    saveCache() {
        try {
            localStorage.setItem('i18n_cache', JSON.stringify(this.cache));
        } catch (e) {
            // 缓存已满，清理旧缓存
            if (e.name === 'QuotaExceededError') {
                this.cache = {};
                localStorage.removeItem('i18n_cache');
            }
        }
    },
    
    /**
     * 加载缓存
     */
    loadCache() {
        try {
            const saved = localStorage.getItem('i18n_cache');
            if (saved) {
                this.cache = JSON.parse(saved);
            }
        } catch (e) {
            this.cache = {};
        }
    },
    
    /**
     * 更新HTML lang属性
     */
    updateHtmlLang() {
        document.documentElement.lang = this.currentLang;
        document.documentElement.dir = this.languages[this.currentLang].dir;
    }
};

// 添加样式
const style = document.createElement('style');
style.textContent = `
.i18n-selector {
    position: fixed;
    top: 80px;
    right: 20px;
    z-index: 1000;
}

.i18n-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(0, 240, 255, 0.1);
    border: 1px solid rgba(0, 240, 255, 0.3);
    color: #fff;
    padding: 10px 16px;
    border-radius: 12px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
}

.i18n-btn:hover {
    background: rgba(0, 240, 255, 0.2);
    border-color: rgba(0, 240, 255, 0.5);
    transform: translateY(-2px);
}

.i18n-btn svg {
    width: 18px;
    height: 18px;
}

.i18n-dropdown {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    background: rgba(26, 26, 46, 0.95);
    border: 1px solid rgba(0, 240, 255, 0.3);
    border-radius: 12px;
    padding: 8px;
    min-width: 180px;
    display: none;
    backdrop-filter: blur(20px);
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.i18n-dropdown.show {
    display: block;
    animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
}

.i18n-option {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 10px 12px;
    background: transparent;
    border: none;
    color: #fff;
    cursor: pointer;
    border-radius: 8px;
    transition: all 0.2s ease;
}

.i18n-option:hover {
    background: rgba(0, 240, 255, 0.1);
}

.i18n-option.active {
    background: rgba(0, 240, 255, 0.2);
}

.lang-native {
    font-weight: 500;
}

.lang-name {
    color: rgba(255, 255, 255, 0.5);
    font-size: 12px;
}

.i18n-loading {
    color: rgba(0, 240, 255, 1);
}

/* RTL语言支持 */
[dir="rtl"] .i18n-selector {
    right: auto;
    left: 20px;
}

[dir="rtl"] .i18n-dropdown {
    right: auto;
    left: 0;
}

/* 移动端适配 */
@media (max-width: 768px) {
    .i18n-selector {
        top: auto;
        bottom: 20px;
        right: 20px;
    }
    
    .i18n-btn {
        padding: 8px 12px;
    }
    
    .i18n-btn span:not(.i18n-current-lang) {
        display: none;
    }
}
`;
document.head.appendChild(style);

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    I18N.loadCache();
    I18N.init();
    
    // 如果保存的语言不是中文，自动翻译
    if (I18N.currentLang !== 'zh') {
        I18N.setLanguage(I18N.currentLang);
    }
});
