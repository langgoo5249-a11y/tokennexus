/**
 * 网站多语言切换组件
 * 使用预置翻译数据，无需外部API
 * 支持主流语言和东南亚语言
 */

const I18N = {
    // 当前语言
    currentLang: 'zh',
    
    // 支持的语言
    languages: {
        'zh': { name: 'Chinese', native: '中文' },
        'en': { name: 'English', native: 'English' },
        'ja': { name: 'Japanese', native: '日本語' },
        'ko': { name: 'Korean', native: '한국어' },
        'es': { name: 'Spanish', native: 'Español' },
        'fr': { name: 'French', native: 'Français' },
        'de': { name: 'German', native: 'Deutsch' },
        'ru': { name: 'Russian', native: 'Русский' },
        'ar': { name: 'Arabic', native: 'العربية' },
        'vi': { name: 'Vietnamese', native: 'Tiếng Việt' },
        'th': { name: 'Thai', native: 'ไทย' },
        'id': { name: 'Indonesian', native: 'Bahasa Indonesia' },
        'ms': { name: 'Malay', native: 'Bahasa Melayu' },
        'fil': { name: 'Filipino', native: 'Filipino' }
    },
    
    // 预置翻译数据
    translations: {
        'en': {
            // 网站标题
            'TokenNexus | 全球AI Token导航': 'TokenNexus | Global AI Token Navigator',
            'AI Token 宇宙': 'AI Token Universe',
            '收录全球 280+ TOKEN 销售平台': '280+ Global TOKEN Platforms Listed',
            
            // 导航
            '首页': 'Home',
            '海外官方': 'Official',
            '聚合中转': 'Aggregator',
            '国内平台': 'Domestic',
            '关于我们': 'About',
            '联系我们': 'Contact',
            '商务合作': 'Business',
            '提交收录': 'Submit',
            '登录': 'Login',
            '注册': 'Register',
            '退出': 'Logout',
            
            // 分类
            '海外官方平台': 'Official Platforms',
            '聚合中转平台': 'Aggregator Platforms',
            '国内平台': 'Domestic Platforms',
            'OpenAI、Anthropic、Google等官方API直连': 'Direct API access to OpenAI, Anthropic, Google, etc.',
            '一站式访问多模型，价格更优更便捷': 'One-stop multi-model access, better prices',
            '国产大模型与国内中转服务，支付便捷': 'Domestic LLMs & relay services, easy payment',
            
            // 筛选
            '快速筛选': 'Quick Filter',
            '全部': 'All',
            '免费额度': 'Free Tier',
            '最便宜': 'Cheapest',
            '最稳定': 'Most Stable',
            '官方平台': 'Official',
            '聚合平台': 'Aggregator',
            
            // 统计
            '收录平台': 'Platforms',
            'AI 模型': 'AI Models',
            '用户评价': 'Reviews',
            
            // 平台列表
            '热门平台': 'Popular Platforms',
            '个平台': 'platforms',
            '加载中...': 'Loading...',
            '查看详情': 'View Details',
            '访问官网': 'Visit Website',
            '返回列表': 'Back to List',
            
            // 评论
            '评论': 'Comments',
            '查看评论': 'View Comments',
            '暂无评论，成为第一个评论者吧！': 'No comments yet, be the first!',
            '登录后发表评论': 'Login to comment',
            '发表评论': 'Post Comment',
            '分享你的使用体验...': 'Share your experience...',
            
            // 搜索
            '搜索平台名称、描述或标签...': 'Search platform name, description or tags...',
            
            // 页脚
            '隐私政策': 'Privacy Policy',
            '服务条款': 'Terms of Service',
            '免责声明': 'Disclaimer',
            '版权所有': 'Copyright',
            
            // 表单
            '用户名': 'Username',
            '密码': 'Password',
            '邮箱': 'Email',
            '确认密码': 'Confirm Password',
            '已有账号？立即登录': 'Already have an account? Login',
            '没有账号？立即注册': 'No account? Register now',
            
            // 提示
            '翻译失败，请稍后重试': 'Translation failed, please try again',
            '网络错误，请稍后重试': 'Network error, please try again',
            '提交成功': 'Submitted successfully',
            '操作成功': 'Operation successful'
        },
        'ja': {
            'TokenNexus | 全球AI Token导航': 'TokenNexus | グローバルAI Tokenナビ',
            'AI Token 宇宙': 'AI Token 宇宙',
            '收录全球 280+ TOKEN 销售平台': '280以上のグローバルTOKENプラットフォームを掲載',
            '首页': 'ホーム',
            '海外官方': '公式',
            '聚合中转': 'アグリゲーター',
            '国内平台': '国内',
            '关于我们': '私たちについて',
            '联系我们': 'お問い合わせ',
            '商务合作': 'ビジネス',
            '提交收录': '掲載申請',
            '登录': 'ログイン',
            '注册': '登録',
            '海外官方平台': '公式プラットフォーム',
            '聚合中转平台': 'アグリゲータープラットフォーム',
            '国内平台': '国内プラットフォーム',
            '全部': 'すべて',
            '免费额度': '無料枠',
            '最便宜': '最安値',
            '最稳定': '最安定',
            '收录平台': 'プラットフォーム',
            'AI 模型': 'AIモデル',
            '用户评价': 'レビュー',
            '热门平台': '人気プラットフォーム',
            '个平台': 'プラットフォーム',
            '查看详情': '詳細を見る',
            '访问官网': '公式サイトへ',
            '返回列表': 'リストに戻る',
            '评论': 'コメント',
            '查看评论': 'コメントを見る',
            '搜索平台名称、描述或标签...': 'プラットフォーム名、説明、タグを検索...'
        },
        'ko': {
            'TokenNexus | 全球AI Token导航': 'TokenNexus | 글로벌 AI Token 내비게이터',
            'AI Token 宇宙': 'AI Token 유니버스',
            '收录全球 280+ TOKEN 销售平台': '280+ 글로벌 TOKEN 플랫폼 등록',
            '首页': '홈',
            '海外官方': '공식',
            '聚合中转': '애그리게이터',
            '国内平台': '국내',
            '登录': '로그인',
            '注册': '회원가입',
            '海外官方平台': '공식 플랫폼',
            '聚合中转平台': '애그리게이터 플랫폼',
            '国内平台': '국내 플랫폼',
            '全部': '전체',
            '免费额度': '무료 한도',
            '最便宜': '최저가',
            '最稳定': '최안정',
            '收录平台': '플랫폼',
            'AI 模型': 'AI 모델',
            '用户评价': '리뷰',
            '热门平台': '인기 플랫폼',
            '个平台': '플랫폼',
            '查看详情': '상세 보기',
            '访问官网': '공식 사이트 방문',
            '返回列表': '목록으로',
            '评论': '댓글',
            '查看评论': '댓글 보기'
        },
        'vi': {
            'TokenNexus | 全球AI Token导航': 'TokenNexus | Điều hướng AI Token toàn cầu',
            'AI Token 宇宙': 'Vũ trụ AI Token',
            '收录全球 280+ TOKEN 销售平台': 'Hơn 280 nền tảng TOKEN toàn cầu',
            '首页': 'Trang chủ',
            '海外官方': 'Chính thức',
            '聚合中转': 'Tổng hợp',
            '国内平台': 'Trong nước',
            '登录': 'Đăng nhập',
            '注册': 'Đăng ký',
            '全部': 'Tất cả',
            '免费额度': 'Miễn phí',
            '热门平台': 'Nền tảng phổ biến',
            '查看详情': 'Xem chi tiết',
            '访问官网': 'Truy cập trang web',
            '返回列表': 'Quay lại danh sách',
            '评论': 'Bình luận'
        },
        'th': {
            'TokenNexus | 全球AI Token导航': 'TokenNexus | ตัวนำทาง AI Token ระดับโลก',
            'AI Token 宇宙': 'จักรวาล AI Token',
            '首页': 'หน้าแรก',
            '登录': 'เข้าสู่ระบบ',
            '注册': 'ลงทะเบียน',
            '全部': 'ทั้งหมด',
            '热门平台': 'แพลตฟอร์มยอดนิยม',
            '查看详情': 'ดูรายละเอียด',
            '评论': 'ความคิดเห็น'
        },
        'id': {
            'TokenNexus | 全球AI Token导航': 'TokenNexus | Navigator AI Token Global',
            'AI Token 宇宙': 'Alam Semesta AI Token',
            '首页': 'Beranda',
            '登录': 'Masuk',
            '注册': 'Daftar',
            '全部': 'Semua',
            '热门平台': 'Platform Populer',
            '查看详情': 'Lihat Detail',
            '评论': 'Komentar'
        },
        'es': {
            'TokenNexus | 全球AI Token导航': 'TokenNexus | Navegador de AI Token Global',
            'AI Token 宇宙': 'Universo AI Token',
            '首页': 'Inicio',
            '登录': 'Iniciar sesión',
            '注册': 'Registrarse',
            '全部': 'Todo',
            '热门平台': 'Plataformas Populares',
            '查看详情': 'Ver Detalles',
            '评论': 'Comentarios'
        },
        'fr': {
            'TokenNexus | 全球AI Token导航': 'TokenNexus | Navigateur AI Token Mondial',
            'AI Token 宇宙': 'Univers AI Token',
            '首页': 'Accueil',
            '登录': 'Connexion',
            '注册': 'S\'inscrire',
            '全部': 'Tout',
            '热门平台': 'Plateformes Populaires',
            '查看详情': 'Voir Détails',
            '评论': 'Commentaires'
        },
        'de': {
            'TokenNexus | 全球AI Token导航': 'TokenNexus | Globaler AI Token Navigator',
            'AI Token 宇宙': 'AI Token Universum',
            '首页': 'Startseite',
            '登录': 'Anmelden',
            '注册': 'Registrieren',
            '全部': 'Alle',
            '热门平台': 'Beliebte Plattformen',
            '查看详情': 'Details anzeigen',
            '评论': 'Kommentare'
        },
        'ru': {
            'TokenNexus | 全球AI Token导航': 'TokenNexus | Глобальный навигатор AI Token',
            'AI Token 宇宙': 'Вселенная AI Token',
            '首页': 'Главная',
            '登录': 'Войти',
            '注册': 'Регистрация',
            '全部': 'Все',
            '热门平台': 'Популярные платформы',
            '查看详情': 'Подробнее',
            '评论': 'Комментарии'
        },
        'ar': {
            'TokenNexus | 全球AI Token导航': 'TokenNexus | ملاح AI Token العالمي',
            'AI Token 宇宙': 'كون AI Token',
            '首页': 'الرئيسية',
            '登录': 'تسجيل الدخول',
            '注册': 'التسجيل',
            '全部': 'الكل',
            '热门平台': 'المنصات الشائعة',
            '查看详情': 'عرض التفاصيل',
            '评论': 'التعليقات'
        },
        'ms': {
            'TokenNexus | 全球AI Token导航': 'TokenNexus | Navigator AI Token Global',
            '首页': 'Laman Utama',
            '登录': 'Log Masuk',
            '注册': 'Daftar',
            '全部': 'Semua',
            '热门平台': 'Platform Popular',
            '查看详情': 'Lihat Butiran'
        },
        'fil': {
            'TokenNexus | 全球AI Token导航': 'TokenNexus | Global AI Token Navigator',
            '首页': 'Home',
            '登录': 'Mag-login',
            '注册': 'Mag-register',
            '全部': 'Lahat',
            '热门平台': 'Mga Sikat na Platform',
            '查看详情': 'Tingnan ang Detalye'
        }
    },
    
    /**
     * 初始化
     */
    init() {
        this.loadLanguage();
        this.createLanguageSelector();
        
        // 如果保存的语言不是中文，自动翻译
        if (this.currentLang !== 'zh') {
            this.translatePage(this.currentLang);
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
        
        // 翻译页面
        this.translatePage(lang);
        
        this.toggleDropdown();
    },
    
    /**
     * 翻译页面
     */
    translatePage(lang) {
        const translations = this.translations[lang];
        if (!translations) return;
        
        // 翻译所有文本节点
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        const textNodes = [];
        while (walker.nextNode()) {
            textNodes.push(walker.currentNode);
        }
        
        textNodes.forEach(node => {
            const text = node.textContent.trim();
            if (text && translations[text]) {
                node.textContent = translations[text];
            }
        });
        
        // 翻译placeholder属性
        document.querySelectorAll('[placeholder]').forEach(el => {
            const placeholder = el.getAttribute('placeholder');
            if (placeholder && translations[placeholder]) {
                el.setAttribute('placeholder', translations[placeholder]);
            }
        });
        
        // 翻译title
        if (document.title && translations[document.title]) {
            document.title = translations[document.title];
        }
        
        // 更新HTML lang属性
        document.documentElement.lang = lang;
    }
};

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
