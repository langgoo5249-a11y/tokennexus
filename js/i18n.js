/**
 * 网站多语言切换组件
 * 使用Google Translate Website Widget实现翻译
 * 支持主流语言和东南亚语言
 */

const I18N = {
    // 当前语言
    currentLang: 'zh',
    
    // 支持的语言
    languages: {
        'zh': { name: 'Chinese', native: '中文', code: 'zh-CN' },
        'en': { name: 'English', native: 'English', code: 'en' },
        'ja': { name: 'Japanese', native: '日本語', code: 'ja' },
        'ko': { name: 'Korean', native: '한국어', code: 'ko' },
        'es': { name: 'Spanish', native: 'Español', code: 'es' },
        'fr': { name: 'French', native: 'Français', code: 'fr' },
        'de': { name: 'German', native: 'Deutsch', code: 'de' },
        'ru': { name: 'Russian', native: 'Русский', code: 'ru' },
        'ar': { name: 'Arabic', native: 'العربية', code: 'ar' },
        'vi': { name: 'Vietnamese', native: 'Tiếng Việt', code: 'vi' },
        'th': { name: 'Thai', native: 'ไทย', code: 'th' },
        'id': { name: 'Indonesian', native: 'Bahasa Indonesia', code: 'id' },
        'ms': { name: 'Malay', native: 'Bahasa Melayu', code: 'ms' },
        'fil': { name: 'Filipino', native: 'Filipino', code: 'tl' }
    },
    
    // Google Translate实例
    gtLoaded: false,
    
    /**
     * 初始化
     */
    init() {
        this.loadLanguage();
        this.createLanguageSelector();
        
        // 如果保存的语言不是中文，自动翻译
        if (this.currentLang !== 'zh') {
            this.loadGoogleTranslate(() => {
                this.translateTo(this.currentLang);
            });
        }
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
    setLanguage(lang) {
        if (lang === this.currentLang) {
            this.toggleDropdown();
            return;
        }
        
        // 如果切换回中文，刷新页面
        if (lang === 'zh') {
            this.saveLanguage('zh');
            // 清除Google Translate cookie
            document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.' + window.location.hostname;
            location.reload();
            return;
        }
        
        this.saveLanguage(lang);
        
        // 更新按钮显示
        document.querySelector('.i18n-current-lang').textContent = this.languages[lang].native;
        
        // 更新下拉菜单选中状态
        document.querySelectorAll('.i18n-option').forEach(opt => {
            opt.classList.toggle('active', opt.dataset.lang === lang);
        });
        
        // 加载Google Translate并翻译
        this.loadGoogleTranslate(() => {
            this.translateTo(lang);
        });
        
        this.toggleDropdown();
    },
    
    /**
     * 加载Google Translate脚本
     */
    loadGoogleTranslate(callback) {
        if (this.gtLoaded) {
            callback && callback();
            return;
        }
        
        // 创建Google Translate元素容器（隐藏）
        if (!document.getElementById('google_translate_element')) {
            const div = document.createElement('div');
            div.id = 'google_translate_element';
            div.style.display = 'none';
            document.body.appendChild(div);
        }
        
        // 加载Google Translate脚本
        const script = document.createElement('script');
        script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.onload = () => {
            this.gtLoaded = true;
            callback && callback();
        };
        script.onerror = () => {
            console.error('Failed to load Google Translate');
            alert('翻译服务加载失败，请检查网络连接');
        };
        document.body.appendChild(script);
    },
    
    /**
     * 翻译到指定语言
     */
    translateTo(lang) {
        const langCode = this.languages[lang].code;
        
        // 设置Google Translate cookie
        const domain = window.location.hostname;
        document.cookie = `googtrans=/zh-CN/${langCode}; path=/;`;
        document.cookie = `googtrans=/zh-CN/${langCode}; path=/; domain=.${domain};`;
        
        // 触发翻译
        if (window.google && window.google.translate) {
            const frame = document.querySelector('.goog-te-banner-frame');
            if (frame) {
                // 已经加载过，刷新页面应用新语言
                location.reload();
            }
        }
    },
    
    /**
     * 隐藏Google Translate顶部栏
     */
    hideTopBar() {
        const style = document.createElement('style');
        style.textContent = `
            /* 隐藏Google Translate顶部栏 */
            .goog-te-banner-frame,
            .goog-te-gadget,
            .goog-te-ftab,
            .skiptranslate {
                display: none !important;
            }
            body {
                top: 0 !important;
            }
            .goog-text-highlight {
                background: none !important;
                box-shadow: none !important;
            }
            /* 隐藏Google Translate水印 */
            .goog-logo-link, .goog-logo-link img {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    }
};

// Google Translate初始化回调
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'zh-CN',
        includedLanguages: 'en,ja,ko,es,fr,de,ru,ar,vi,th,id,ms,tl',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
    }, 'google_translate_element');
    
    // 隐藏Google Translate UI
    I18N.hideTopBar();
}

// 添加样式
const style = document.createElement('style');
style.textContent = `
.i18n-selector {
    position: fixed;
    top: 80px;
    right: 20px;
    z-index: 9999;
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
    max-height: 400px;
    overflow-y: auto;
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
    
    .i18n-dropdown {
        max-height: 300px;
    }
}
`;
document.head.appendChild(style);

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    I18N.init();
});
