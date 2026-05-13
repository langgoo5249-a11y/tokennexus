/**
 * 网站多语言切换组件 v2
 * 使用预置翻译数据，支持模糊匹配
 * 覆盖全站所有页面
 */

const I18N = {
    currentLang: 'zh',

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

    translations: {
'en': {
'AI Token 宇宙':'AI Token Universe','收录全球 280+ TOKEN 销售平台':'280+ Global TOKEN Platforms Listed',
'首页':'Home','海外官方':'Official','聚合中转':'Aggregator','国内平台':'Domestic',
'关于我们':'About','联系我们':'Contact','商务合作':'Business','提交收录':'Submit',
'登录':'Login','注册':'Register','退出':'Logout','取消':'Cancel','同意':'Agree',
'海外官方平台':'Official Platforms','聚合中转平台':'Aggregator Platforms','国内平台':'Domestic Platforms',
'OpenAI、Anthropic、Google等官方API直连':'Direct API access to OpenAI, Anthropic, Google, etc.',
'一站式访问多模型，价格更优更便捷':'One-stop multi-model access, better prices',
'国产大模型与国内中转服务，支付便捷':'Domestic LLMs & relay services, easy payment',
'快速筛选':'Quick Filter','全部':'All','全部平台':'All Platforms',
'免费额度':'Free Tier','最便宜':'Cheapest','最稳定':'Most Stable',
'官方平台':'Official','聚合平台':'Aggregator','聚合/中转平台':'Aggregator / Relay',
'收录平台':'Platforms','AI 模型':'AI Models','用户评价':'Reviews',
'热门平台':'Popular Platforms','热门模型':'Popular Models','个平台':'platforms',
'加载中...':'Loading...','查看详情':'View Details','访问官网':'Visit Website',
'返回列表':'Back to List','评论':'Comments','查看评论':'View Comments',
'暂无评论，成为第一个评论者吧！':'No comments yet, be the first!',
'登录后发表评论':'Login to comment','发表评论':'Post Comment',
'分享你的使用体验...':'Share your experience...',
'搜索平台名称、描述或标签...':'Search platform name, description or tags...',
'搜索平台':'Search Platform','隐私政策':'Privacy Policy','服务条款':'Terms of Service',
'免责声明':'Disclaimer','免责申明':'Disclaimer','版权所有':'Copyright',
'用户名':'Username','密码':'Password','邮箱':'Email','邮箱地址':'Email Address',
'确认密码':'Confirm Password','已有账号？':'Already have an account?',
'立即登录':'Login Now','立即注册':'Register Now','还没有账号？':'No account yet?',
'注册后即可评论和评分平台':'Register to comment and rate platforms',
'登录以参与评论和评分':'Login to comment and rate',
'欢迎回来':'Welcome Back','创建账号':'Create Account',
'关于TokenNexus':'About TokenNexus','致力于打造最全面的全球 AI Token 导航平台':'Dedicated to building the most comprehensive global AI Token navigator',
'收录280+国内外AI API服务商，提供平台对比、用户评价和实时价格信息。':'280+ domestic and international AI API providers with platform comparison, user reviews, and real-time pricing.',
'汇聚真实用户使用体验，帮助您做出明智决策':'Real user experiences to help you make informed decisions',
'统一计费单位，清晰展示各平台Token价格，拒绝隐藏费用':'Unified billing units, clear Token pricing, no hidden fees',
'多维度对比各平台价格、稳定性、响应速度，一键找到最优选择':'Multi-dimensional comparison of pricing, stability, and speed',
'7x24小时监控平台可用性，第一时间发现服务异常':'24/7 monitoring of platform availability',
'平台分类导航':'Platform Categories','平台分类':'Categories',
'价格信息':'Pricing Info','价格透明':'Transparent Pricing',
'支持模型':'Supported Models','热门模型支持':'Popular Model Support',
'教程工具箱':'Tools & Tutorials','免费资源分享':'Free Resources',
'信息差获取':'Information Edge','实时监控':'Real-time Monitoring',
'智能对比':'Smart Comparison','数据交换':'Data Exchange',
'我的评论':'My Comments','评论平台':'Review Platform',
'提交收录申请':'Submit Listing Request','提交合作咨询':'Submit Partnership Inquiry',
'探索':'Explore','友情链接':'Friendly Links',
'Cookie':'Cookie','我们使用Cookie来提升您的浏览体验。继续使用本网站即表示您同意我们的':'We use cookies to enhance your browsing experience. By continuing, you agree to our',
'预算范围':'Budget Range','合作类型':'Partnership Type',
'合作详情':'Partnership Details','联系人':'Contact Person',
'联系电话':'Phone Number','联系邮箱':'Contact Email','联系邮箱：':'Contact Email:',
'公司名称':'Company Name','公司网站':'Company Website',
'加入时间':'Join Date','评分数据来源于用户反馈和公开信息，仅供参考':'Ratings are based on user feedback and public information, for reference only',
'OpenAI、Anthropic、Google、Meta等官方API服务':'Official API services from OpenAI, Anthropic, Google, Meta, etc.',
'OpenRouter、Together AI等多模型聚合服务':'Multi-model aggregation services like OpenRouter, Together AI',
'阿里云百炼、百度千帆、讯飞星火等国内AI服务':'Domestic AI services like Alibaba Bailian, Baidu Qianfan, iFlytek Spark',
'战略合作':'Strategic Partnership','API对接':'API Integration',
'广告投放':'Advertising','提交平台收录':'Submit Platform','⭐ 优先收录':'⭐ Priority Listing',
'返回首页':'Back to Home',
'平台名称':'Platform Name','平台描述':'Description','平台网址':'Website URL',
'真实评价':'Authentic Reviews','号码标记清除':'Number Mark Removal','紫微排盘':'Purple Star Astrology',
'全球最全的AI Token导航平台':'The most comprehensive AI Token navigation platform',
'AI API平台对比':'AI API Platform Comparison','价格查询':'Price Lookup',
'用户评价':'User Reviews','API Key获取教程':'API Key Tutorials',
'平台详情':'Platform Details','平台介绍':'Introduction',
'评分':'Rating','评分分布':'Rating Distribution',
'5星':'5 Stars','4星':'4 Stars','3星':'3 Stars','2星':'2 Stars','1星':'1 Star',
'相关推荐':'Related Recommendations','同类平台':'Similar Platforms',
'返回':'Back','分享':'Share','复制链接':'Copy Link',
'已复制':'Copied','复制失败':'Copy failed',
'请先登录':'Please login first','评论内容不能为空':'Comment cannot be empty',
'评论成功':'Comment submitted','评论失败':'Comment failed',
'加载评论失败':'Failed to load comments',
'暂无数据':'No data','没有找到匹配的平台':'No matching platforms found',
'请输入搜索关键词':'Please enter search keywords',
'确认':'Confirm','关闭':'Close','保存':'Save','删除':'Delete',
'编辑':'Edit','发送':'Send','提交':'Submit','重置':'Reset',
'上一页':'Previous','下一页':'Next','共':'Total','页':'Page',
'条':'items','每页':'Per page','显示':'Show',
'排序':'Sort','默认排序':'Default','评分最高':'Highest Rated',
'最新发布':'Newest','价格最低':'Lowest Price',
'筛选':'Filter','重置筛选':'Reset Filters',
'已验证':'Verified','官方':'Official','推荐':'Recommended',
'免费':'Free','付费':'Paid','开源':'Open Source',
'查看更多':'View More','收起':'Collapse',
'展开':'Expand','详情':'Details','简介':'Overview',
'特点':'Features','优势':'Advantages','适用场景':'Use Cases',
'支持的语言':'Supported Languages','API文档':'API Docs',
'开始使用':'Get Started','立即体验':'Try Now',
'了解更多':'Learn More','前往官网':'Visit Official Site',
'温馨提示':'Friendly Reminder','注意':'Notice',
'成功':'Success','失败':'Failed','错误':'Error',
'正在加载':'Loading','请稍候':'Please wait',
'网络错误':'Network Error','请求超时':'Request Timeout',
'服务不可用':'Service Unavailable','权限不足':'Permission Denied',
'未找到':'Not Found','页面不存在':'Page Not Found',
'返回上一页':'Go Back','回到首页':'Back to Home'
},
'ja': {
'AI Token 宇宙':'AI Token 宇宙','收录全球 280+ TOKEN 销售平台':'280以上のグローバルTOKENプラットフォームを掲載',
'首页':'ホーム','海外官方':'公式','聚合中转':'アグリゲーター','国内平台':'国内',
'关于我们':'私たちについて','联系我们':'お問い合わせ','商务合作':'ビジネス','提交收录':'掲載申請',
'登录':'ログイン','注册':'登録','退出':'ログアウト','取消':'キャンセル','同意':'同意',
'海外官方平台':'公式プラットフォーム','聚合中转平台':'アグリゲータープラットフォーム','国内平台':'国内プラットフォーム',
'OpenAI、Anthropic、Google等官方API直连':'OpenAI、Anthropic、Google等の公式API直結',
'一站式访问多模型，价格更优更便捷':'多モデルをワンストップで、より良い価格と利便性',
'国产大模型与国内中转服务，支付便捷':'国産LLMと国内リレイサービス、決済が便利',
'快速筛选':'クイックフィルター','全部':'すべて','全部平台':'すべてのプラットフォーム',
'免费额度':'無料枠','最便宜':'最安値','最稳定':'最安定',
'官方平台':'公式','聚合平台':'アグリゲーター','聚合/中转平台':'アグリゲーター/リレー',
'收录平台':'プラットフォーム','AI 模型':'AIモデル','用户评价':'レビュー',
'热门平台':'人気プラットフォーム','热门模型':'人気モデル','个平台':'プラットフォーム',
'加载中...':'読み込み中...','查看详情':'詳細を見る','访问官网':'公式サイトへ',
'返回列表':'リストに戻る','评论':'コメント','查看评论':'コメントを見る',
'登录后发表评论':'ログインしてコメント','发表评论':'コメントを投稿',
'分享你的使用体验...':'あなたの体験を共有...',
'搜索平台名称、描述或标签...':'プラットフォーム名、説明、タグを検索...',
'搜索平台':'プラットフォーム検索','隐私政策':'プライバシーポリシー','服务条款':'利用規約',
'免责声明':'免責事項','免责申明':'免責事項','版权所有':'著作権',
'用户名':'ユーザー名','密码':'パスワード','邮箱':'メール','邮箱地址':'メールアドレス',
'已有账号？':'アカウントをお持ちですか？','立即登录':'今すぐログイン','立即注册':'今すぐ登録',
'还没有账号？':'アカウントをお持ちでないですか？',
'注册后即可评论和评分平台':'登録してプラットフォームを評価・コメント',
'登录以参与评论和评分':'ログインして評価・コメントに参加',
'欢迎回来':'おかえりなさい','创建账号':'アカウント作成',
'关于TokenNexus':'TokenNexusについて',
'致力于打造最全面的全球 AI Token 导航平台':'最も包括的なグローバルAI Tokenナビゲーターの構築',
'收录280+国内外AI API服务商，提供平台对比、用户评价和实时价格信息。':'280以上の国内外AI APIプロバイダー、プラットフォーム比較、ユーレビュー、リアルタイム価格情報。',
'汇聚真实用户使用体验，帮助您做出明智决策':'実際のユーザー体験を集約し、賢明な決定をサポート',
'统一计费单位，清晰展示各平台Token价格，拒绝隐藏费用':'統一課金単位、明確なToken価格、隠れた費用なし',
'多维度对比各平台价格、稳定性、响应速度，一键找到最优选择':'価格、安定性、応答速度の多次元比較',
'7x24小时监控平台可用性，第一时间发现服务异常':'24時間365日プラットフォーム可用性監視',
'平台分类导航':'プラットフォームカテゴリ','平台分类':'カテゴリ',
'价格信息':'価格情報','价格透明':'透明な価格',
'支持模型':'対応モデル','热门模型支持':'人気モデル対応',
'教程工具箱':'ツールとチュートリアル','免费资源分享':'無料リソース共有',
'信息差获取':'情報差の取得','实时监控':'リアルタイム監視',
'智能对比':'スマート比較','数据交换':'データ交換',
'我的评论':'マイコメント','评论平台':'プラットフォームをレビュー',
'提交收录申请':'掲載申請','提交合作咨询':'パートナーシップ相談',
'探索':'探索','友情链接':'リンク集',
'我们使用Cookie来提升您的浏览体验。继续使用本网站即表示您同意我们的':'Cookieを使用してブラウジング体験を向上させています。',
'预算范围':'予算範囲','合作类型':'パートナーシップタイプ',
'合作详情':'パートナーシップ詳細','联系人':'担当者',
'联系电话':'電話番号','联系邮箱':'連絡先メール','联系邮箱：':'連絡先メール：',
'公司名称':'会社名','公司网站':'会社サイト',
'加入时间':'参加日','评分数据来源于用户反馈和公开信息，仅供参考':'評価データはユーザーフィードバックと公開情報に基づき、参考用です',
'战略合作':'戦略的パートナーシップ','API对接':'API連携',
'广告投放':'広告掲載','提交平台收录':'プラットフォーム掲載','⭐ 优先收录':'⭐ 優先掲載',
'返回首页':'ホームに戻る',
'平台名称':'プラットフォーム名','平台描述':'説明','平台网址':'サイトURL',
'真实评价':'本物のレビュー','全球最全的AI Token导航平台':'最も包括的なAI Tokenナビゲーションプラットフォーム',
'平台详情':'プラットフォーム詳細','平台介绍':'紹介',
'评分':'評価','评分分布':'評価分布',
'5星':'5つ星','4星':'4つ星','3星':'3つ星','2星':'2つ星','1星':'1つ星',
'相关推荐':'関連おすすめ','同类平台':'類似プラットフォーム',
'返回':'戻る','分享':'共有','复制链接':'リンクをコピー',
'已复制':'コピーしました','查看更多':'もっと見る',
'开始使用':'始める','立即前往':'公式サイトへ','了解更多':'詳細を見る',
'温馨提示':'ヒント','确认':'確認','关闭':'閉じる',
'成功':'成功','失败':'失敗','错误':'エラー',
'正在加载':'読み込み中','请稍候':'お待ちください',
'网络错误':'ネットワークエラー','未找到':'見つかりません',
'页面不存在':'ページが存在しません','返回上一页':'前のページへ'
},
'ko': {
'AI Token 宇宙':'AI Token 유니버스','收录全球 280+ TOKEN 销售平台':'280+ 글로벌 TOKEN 플랫폼 등록',
'首页':'홈','海外官方':'공식','聚合中转':'애그리게이터','国内平台':'국내',
'关于我们':'소개','联系我们':'문의','商务合作':'비즈니스','提交收录':'등록 신청',
'登录':'로그인','注册':'회원가입','退出':'로그아웃','取消':'취소','同意':'동의',
'海外官方平台':'공식 플랫폼','聚合中转平台':'애그리게이터 플랫폼','国内平台':'국내 플랫폼',
'快速筛选':'빠른 필터','全部':'전체','全部平台':'모든 플랫폼',
'免费额度':'무료 한도','最便宜':'최저가','最稳定':'최안정',
'官方平台':'공식','聚合平台':'애그리게이터',
'收录平台':'플랫폼','AI 模型':'AI 모델','用户评价':'리뷰',
'热门平台':'인기 플랫폼','热门模型':'인기 모델','个平台':'플랫폼',
'加载中...':'로딩 중...','查看详情':'상세 보기','访问官网':'공식 사이트 방문',
'返回列表':'목록으로','评论':'댓글','查看评论':'댓글 보기',
'登录后发表评论':'로그인 후 댓글 작성','发表评论':'댓글 작성',
'搜索平台名称、描述或标签...':'플랫폼 이름, 설명, 태그 검색...',
'搜索平台':'플랫폼 검색','隐私政策':'개인정보 처리방침','服务条款':'이용약관',
'免责声明':'면책 조항','免责申明':'면책 조항',
'用户名':'사용자명','密码':'비밀번호','邮箱':'이메일',
'已有账号？':'이미 계정이 있으신가요?','立即登录':'로그인','立即注册':'회원가입',
'还没有账号？':'아직 계정이 없으신가요?',
'欢迎回来':'다시 오셨군요','创建账号':'계정 만들기',
'关于TokenNexus':'TokenNexus 소개',
'致力于打造最全面的全球 AI Token 导航平台':'가장 포괄적인 글로벌 AI Token 내비게이터 구축',
'收录280+国内外AI API服务商，提供平台对比、用户评价和实时价格信息。':'280+ 국내외 AI API 제공업체, 플랫폼 비교, 사용자 리뷰, 실시간 가격 정보.',
'汇聚真实用户使用体验，帮助您做出明智决策':'실제 사용자 경험을 모아 현명한 결정을 지원',
'平台分类导航':'플랫폼 카테고리','平台分类':'카테고리',
'价格信息':'가격 정보','价格透明':'투명한 가격',
'支持模型':'지원 모델','教程工具箱':'도구 및 튜토리얼',
'实时监控':'실시간 모니터링','智能对比':'스마트 비교',
'我的评论':'내 리뷰','评论平台':'플랫폼 리뷰',
'探索':'탐색','友情链接':'링크',
'合作详情':'파트너십 상세','联系人':'담당자',
'联系电话':'전화번호','联系邮箱':'연락처 이메일','联系邮箱：':'연락처 이메일:',
'公司名称':'회사명','公司网站':'회사 웹사이트',
'战略合作':'전략적 파트너십','API对接':'API 연동',
'广告投放':'광고','提交平台收录':'플랫폼 등록','⭐ 优先收录':'⭐ 우선 등록',
'返回首页':'홈으로','平台名称':'플랫폼명','平台描述':'설명','平台网址':'웹사이트 URL',
'全球最全的AI Token导航平台':'가장 포괄적인 AI Token 내비게이션 플랫폼',
'平台详情':'플랫폼 상세','平台介绍':'소개',
'评分':'평점','评分分布':'평점 분포',
'5星':'5점','4星':'4점','3星':'3점','2星':'2점','1星':'1점',
'相关推荐':'관련 추천','同类平台':'유사 플랫폼',
'返回':'뒤로','分享':'공유','查看更多':'더 보기',
'开始使用':'시작하기','立即前往':'바로가기','了解更多':'자세히 보기',
'确认':'확인','关闭':'닫기','成功':'성공','失败':'실패',
'正在加载':'로딩 중','请稍候':'잠시만 기다려 주세요',
'网络错误':'네트워크 오류','未找到':'찾을 수 없음',
'页面不存在':'페이지가 존재하지 않습니다','返回上一页':'이전 페이지로'
},
'es': {
'AI Token 宇宙':'Universo AI Token','收录全球 280+ TOKEN 销售平台':'280+ plataformas TOKEN globales',
'首页':'Inicio','海外官方':'Oficial','聚合中转':'Agregador','国内平台':'Nacional',
'关于我们':'Sobre nosotros','联系我们':'Contacto','商务合作':'Negocios','提交收录':'Enviar',
'登录':'Iniciar sesión','注册':'Registrarse','退出':'Salir','取消':'Cancelar','同意':'Aceptar',
'海外官方平台':'Plataformas Oficiales','聚合中转平台':'Plataformas Agregador','国内平台':'Plataformas Nacionales',
'快速筛选':'Filtro rápido','全部':'Todo','全部平台':'Todas las plataformas',
'免费额度':'Gratis','最便宜':'Más barato','最稳定':'Más estable',
'官方平台':'Oficial','聚合平台':'Agregador',
'收录平台':'Plataformas','AI 模型':'Modelos IA','用户评价':'Reseñas',
'热门平台':'Plataformas populares','热门模型':'Modelos populares','个平台':'plataformas',
'加载中...':'Cargando...','查看详情':'Ver detalles','访问官网':'Visitar sitio',
'返回列表':'Volver','评论':'Comentarios','查看评论':'Ver comentarios',
'登录后发表评论':'Inicia sesión para comentar','发表评论':'Publicar comentario',
'搜索平台名称、描述或标签...':'Buscar nombre, descripción o etiquetas...',
'搜索平台':'Buscar plataforma','隐私政策':'Política de privacidad','服务条款':'Términos de servicio',
'免责声明':'Descargo de responsabilidad','免责申明':'Descargo de responsabilidad',
'用户名':'Usuario','密码':'Contraseña','邮箱':'Correo electrónico',
'已有账号？':'¿Ya tienes cuenta?','立即登录':'Iniciar sesión','立即注册':'Registrarse',
'还没有账号？':'¿No tienes cuenta?','欢迎回来':'Bienvenido de nuevo','创建账号':'Crear cuenta',
'关于TokenNexus':'Sobre TokenNexus',
'致力于打造最全面的全球 AI Token 导航平台':'Dedicado a crear el navegador AI Token más completo',
'收录280+国内外AI API服务商，提供平台对比、用户评价和实时价格信息。':'280+ proveedores de API IA nacionales e internacionales.',
'汇聚真实用户使用体验，帮助您做出明智决策':'Experiencias reales para ayudarle a tomar decisiones informadas',
'平台分类导航':'Categorías de plataformas','平台分类':'Categorías',
'价格信息':'Información de precios','价格透明':'Precios transparentes',
'支持模型':'Modelos soportados','教程工具箱':'Herramientas y tutoriales',
'实时监控':'Monitorización en tiempo real','智能对比':'Comparación inteligente',
'我的评论':'Mis comentarios','评论平台':'Reseñar plataforma',
'探索':'Explorar','友情链接':'Enlaces',
'合作详情':'Detalles de cooperación','联系人':'Contacto',
'联系电话':'Teléfono','联系邮箱':'Email','联系邮箱：':'Email:',
'公司名称':'Empresa','公司网站':'Sitio web',
'战略合作':'Asociación estratégica','API对接':'Integración API',
'广告投放':'Publicidad','提交平台收录':'Enviar plataforma','⭐ 优先收录':'⭐ Prioridad',
'返回首页':'Volver al inicio','平台名称':'Nombre','平台描述':'Descripción','平台网址':'URL',
'全球最全的AI Token导航平台':'El navegador AI Token más completo del mundo',
'平台详情':'Detalles','平台介绍':'Introducción','评分':'Puntuación','评分分布':'Distribución',
'5星':'5 estrellas','4星':'4 estrellas','3星':'3 estrellas','2星':'2 estrellas','1星':'1 estrella',
'相关推荐':'Recomendados','同类平台':'Plataformas similares',
'返回':'Volver','分享':'Compartir','查看更多':'Ver más',
'开始使用':'Comenzar','立即前往':'Ir al sitio','了解更多':'Saber más',
'确认':'Confirmar','关闭':'Cerrar','成功':'Éxito','失败':'Error',
'正在加载':'Cargando','请稍候':'Espere','网络错误':'Error de red',
'页面不存在':'Página no encontrada','返回上一页':'Volver'
},
'fr': {
'AI Token 宇宙':'Univers AI Token','收录全球 280+ TOKEN 销售平台':'280+ plateformes TOKEN mondiales',
'首页':'Accueil','海外官方':'Officiel','聚合中转':'Agrégateur','国内平台':'National',
'关于我们':'À propos','联系我们':'Contact','商务合作':'Affaires','提交收录':'Soumettre',
'登录':'Connexion','注册':'S\'inscrire','退出':'Déconnexion','取消':'Annuler','同意':'Accepter',
'海外官方平台':'Plateformes Officielles','聚合中转平台':'Plateformes Agrégateur','国内平台':'Plateformes Nationales',
'快速筛选':'Filtre rapide','全部':'Tout','全部平台':'Toutes les plateformes',
'免费额度':'Gratuit','最便宜':'Le moins cher','最稳定':'Le plus stable',
'官方平台':'Officiel','聚合平台':'Agrégateur',
'收录平台':'Plateformes','AI 模型':'Modèles IA','用户评价':'Avis',
'热门平台':'Plateformes populaires','热门模型':'Modèles populaires','个平台':'plateformes',
'加载中...':'Chargement...','查看详情':'Voir détails','访问官网':'Visiter le site',
'返回列表':'Retour','评论':'Commentaires','查看评论':'Voir commentaires',
'登录后发表评论':'Connectez-vous pour commenter','发表评论':'Publier un commentaire',
'搜索平台名称、描述或标签...':'Rechercher nom, description ou tags...',
'搜索平台':'Rechercher','隐私政策':'Politique de confidentialité','服务条款':'Conditions d\'utilisation',
'免责声明':'Avertissement','免责申明':'Avertissement',
'用户名':'Nom d\'utilisateur','密码':'Mot de passe','邮箱':'E-mail',
'已有账号？':'Déjà un compte?','立即登录':'Se connecter','立即注册':'S\'inscrire',
'还没有账号？':'Pas encore de compte?','欢迎回来':'Bon retour','创建账号':'Créer un compte',
'关于TokenNexus':'À propos de TokenNexus',
'致力于打造最全面的全球 AI Token 导航平台':'Dédié à créer le navigateur AI Token le plus complet',
'平台分类导航':'Catégories','平台分类':'Catégories',
'价格信息':'Tarifs','价格透明':'Prix transparents',
'支持模型':'Modèles supportés','教程工具箱':'Outils et tutoriels',
'实时监控':'Surveillance en temps réel','智能对比':'Comparaison intelligente',
'我的评论':'Mes commentaires','探索':'Explorer','友情链接':'Liens',
'合作详情':'Détails de coopération','联系人':'Contact',
'联系电话':'Téléphone','联系邮箱':'Email','联系邮箱：':'Email :',
'公司名称':'Entreprise','公司网站':'Site web',
'战略合作':'Partenariat stratégique','API对接':'Intégration API',
'返回首页':'Retour à l\'accueil','平台名称':'Nom','平台描述':'Description','平台网址':'URL',
'全球最全的AI Token导航平台':'Le navigateur AI Token le plus complet au monde',
'平台详情':'Détails','平台介绍':'Introduction','评分':'Note','评分分布':'Distribution',
'5星':'5 étoiles','4星':'4 étoiles','3星':'3 étoiles','2星':'2 étoiles','1星':'1 étoile',
'相关推荐':'Recommandations','同类平台':'Plateformes similaires',
'返回':'Retour','分享':'Partager','查看更多':'Voir plus',
'开始使用':'Commencer','立即前往':'Visiter','了解更多':'En savoir plus',
'确认':'Confirmer','关闭':'Fermer','成功':'Succès','失败':'Échec',
'正在加载':'Chargement','请稍候':'Veuillez patienter','网络错误':'Erreur réseau',
'页面不存在':'Page non trouvée','返回上一页':'Retour'
},
'de': {
'AI Token 宇宙':'AI Token Universum','收录全球 280+ TOKEN 销售平台':'280+ globale TOKEN-Plattformen',
'首页':'Startseite','海外官方':'Offiziell','聚合中转':'Aggregator','国内平台':'Inländisch',
'关于我们':'Über uns','联系我们':'Kontakt','商务合作':'Geschäft','提交收录':'Einreichen',
'登录':'Anmelden','注册':'Registrieren','退出':'Abmelden','取消':'Abbrechen','同意':'Zustimmen',
'海外官方平台':'Offizielle Plattformen','聚合中转平台':'Aggregator-Plattformen','国内平台':'Inländische Plattformen',
'快速筛选':'Schnellfilter','全部':'Alle','全部平台':'Alle Plattformen',
'免费额度':'Kostenlos','最便宜':'Günstigste','最稳定':'Stabilste',
'官方平台':'Offiziell','聚合平台':'Aggregator',
'收录平台':'Plattformen','AI 模型':'KI-Modelle','用户评价':'Bewertungen',
'热门平台':'Beliebte Plattformen','热门模型':'Beliebte Modelle','个平台':'Plattformen',
'加载中...':'Laden...','查看详情':'Details anzeigen','访问官网':'Website besuchen',
'返回列表':'Zurück','评论':'Kommentare','查看评论':'Kommentare anzeigen',
'登录后发表评论':'Anmelden um zu kommentieren','发表评论':'Kommentar posten',
'搜索平台名称、描述或标签...':'Name, Beschreibung oder Tags suchen...',
'搜索平台':'Plattform suchen','隐私政策':'Datenschutz','服务条款':'Nutzungsbedingungen',
'免责声明':'Haftungsausschluss','免责申明':'Haftungsausschluss',
'用户名':'Benutzername','密码':'Passwort','邮箱':'E-Mail',
'已有账号？':'Bereits ein Konto?','立即登录':'Anmelden','立即注册':'Registrieren',
'还没有账号？':'Noch kein Konto?','欢迎回来':'Willkommen zurück','创建账号':'Konto erstellen',
'关于TokenNexus':'Über TokenNexus',
'致力于打造最全面的全球 AI Token 导航平台':'Der umfassendste globale AI Token Navigator',
'平台分类导航':'Plattform-Kategorien','平台分类':'Kategorien',
'价格信息':'Preisinfo','价格透明':'Transparente Preise',
'支持模型':'Unterstützte Modelle','教程工具箱':'Tools & Tutorials',
'实时监控':'Echtzeit-Überwachung','智能对比':'Intelligenter Vergleich',
'我的评论':'Meine Kommentare','探索':'Entdecken','友情链接':'Links',
'合作详情':'Kooperationsdetails','联系人':'Kontakt',
'联系电话':'Telefon','联系邮箱':'E-Mail','联系邮箱：':'E-Mail:',
'公司名称':'Firma','公司网站':'Website',
'战略合作':'Strategische Partnerschaft','API对接':'API-Integration',
'返回首页':'Zur Startseite','平台名称':'Name','平台描述':'Beschreibung','平台网址':'URL',
'全球最全的AI Token导航平台':'Der umfassendste AI Token Navigator weltweit',
'平台详情':'Details','平台介绍':'Einführung','评分':'Bewertung','评分分布':'Verteilung',
'5星':'5 Sterne','4星':'4 Sterne','3星':'3 Sterne','2星':'2 Sterne','1星':'1 Stern',
'相关推荐':'Empfehlungen','同类平台':'Ähnliche Plattformen',
'返回':'Zurück','分享':'Teilen','查看更多':'Mehr anzeigen',
'开始使用':'Loslegen','立即前往':'Besuchen','了解更多':'Mehr erfahren',
'确认':'Bestätigen','关闭':'Schließen','成功':'Erfolg','失败':'Fehler',
'正在加载':'Laden','请稍候':'Bitte warten','网络错误':'Netzwerkfehler',
'页面不存在':'Seite nicht gefunden','返回上一页':'Zurück'
},
'ru': {
'AI Token 宇宙':'Вселенная AI Token','收录全球 280+ TOKEN 销售平台':'280+ глобальных TOKEN-платформ',
'首页':'Главная','海外官方':'Официальные','聚合中转':'Агрегаторы','国内平台':'Отечественные',
'关于我们':'О нас','联系我们':'Контакты','商务合作':'Бизнес','提交收录':'Добавить',
'登录':'Войти','注册':'Регистрация','退出':'Выйти','取消':'Отмена','同意':'Согласен',
'海外官方平台':'Официальные платформы','聚合中转平台':'Платформы-агрегаторы','国内平台':'Отечественные платформы',
'快速筛选':'Быстрый фильтр','全部':'Все','全部平台':'Все платформы',
'免费额度':'Бесплатно','最便宜':'Дешевле','最稳定':'Стабильнее',
'官方平台':'Официальные','聚合平台':'Агрегаторы',
'收录平台':'Платформы','AI 模型':'ИИ-модели','用户评价':'Отзывы',
'热门平台':'Популярные платформы','热门模型':'Популярные модели','个平台':'платформ',
'加载中...':'Загрузка...','查看详情':'Подробнее','访问官网':'Перейти на сайт',
'返回列表':'Назад','评论':'Комментарии','查看评论':'Показать комментарии',
'登录后发表评论':'Войдите, чтобы комментировать','发表评论':'Оставить комментарий',
'搜索平台名称、描述或标签...':'Поиск по названию, описанию или тегам...',
'搜索平台':'Поиск платформы','隐私政策':'Политика конфиденциальности','服务条款':'Условия использования',
'免责声明':'Отказ от ответственности','免责申明':'Отказ от ответственности',
'用户名':'Имя пользователя','密码':'Пароль','邮箱':'Эл. почта',
'已有账号？':'Уже есть аккаунт?','立即登录':'Войти','立即注册':'Зарегистрироваться',
'还没有账号？':'Нет аккаунта?','欢迎回来':'С возвращением','创建账号':'Создать аккаунт',
'关于TokenNexus':'О TokenNexus',
'致力于打造最全面的全球 AI Token 导航平台':'Самый полный глобальный навигатор AI Token',
'平台分类导航':'Категории платформ','平台分类':'Категории',
'价格信息':'Цены','价格透明':'Прозрачные цены',
'支持模型':'Поддерживаемые модели','教程工具箱':'Инструменты',
'实时监控':'Мониторинг','智能对比':'Умное сравнение',
'我的评论':'Мои комментарии','探索':'Обзор','友情链接':'Ссылки',
'合作详情':'Детали сотрудничества','联系人':'Контакт',
'联系电话':'Телефон','联系邮箱':'Email','联系邮箱：':'Email:',
'公司名称':'Компания','公司网站':'Сайт',
'战略合作':'Стратегическое партнёрство','API对接':'API-интеграция',
'返回首页':'На главную','平台名称':'Название','平台描述':'Описание','平台网址':'URL',
'全球最全的AI Token导航平台':'Самый полный навигатор AI Token в мире',
'平台详情':'Детали','平台介绍':'Описание','评分':'Рейтинг','评分分布':'Распределение',
'5星':'5 звёзд','4星':'4 звезды','3星':'3 звезды','2星':'2 звезды','1星':'1 звезда',
'相关推荐':'Рекомендации','同类平台':'Похожие платформы',
'返回':'Назад','分享':'Поделиться','查看更多':'Ещё',
'开始使用':'Начать','立即前往':'Перейти','了解更多':'Узнать больше',
'确认':'Подтвердить','关闭':'Закрыть','成功':'Успех','失败':'Ошибка',
'正在加载':'Загрузка','请稍候':'Подождите','网络错误':'Ошибка сети',
'页面不存在':'Страница не найдена','返回上一页':'Назад'
},
'ar': {
'AI Token 宇宙':'كون AI Token','收录全球 280+ TOKEN 销售平台':'280+ منصة TOKEN عالمية',
'首页':'الرئيسية','海外官方':'رسمي','聚合中转':'مجمّع','国内平台':'محلي',
'关于我们':'من نحن','联系我们':'اتصل بنا','商务合作':'أعمال','提交收录':'إرسال',
'登录':'تسجيل الدخول','注册':'التسجيل','退出':'خروج','取消':'إلغاء','同意':'موافق',
'海外官方平台':'المنصات الرسمية','聚合中转平台':'منصات المجمّع','国内平台':'المنصات المحلية',
'快速筛选':'تصفية سريعة','全部':'الكل','全部平台':'جميع المنصات',
'免费额度':'مجاني','最便宜':'الأرخص','最稳定':'الأكثر استقراراً',
'官方平台':'رسمي','聚合平台':'مجمّع',
'收录平台':'منصات','AI 模型':'نماذج الذكاء','用户评价':'التقييمات',
'热门平台':'المنصات الشائعة','热门模型':'النماذج الشائعة','个平台':'منصات',
'加载中...':'جاري التحميل...','查看详情':'عرض التفاصيل','访问官网':'زيارة الموقع',
'返回列表':'رجوع','评论':'التعليقات','查看评论':'عرض التعليقات',
'登录后发表评论':'سجّل الدخول للتعليق','发表评论':'نشر تعليق',
'搜索平台名称、描述或标签...':'ابحث عن الاسم أو الوصف أو العلامات...',
'搜索平台':'بحث','隐私政策':'سياسة الخصوصية','服务条款':'شروط الخدمة',
'免责声明':'إخلاء المسؤولية','免责申明':'إخلاء المسؤولية',
'用户名':'اسم المستخدم','密码':'كلمة المرور','邮箱':'البريد الإلكتروني',
'已有账号？':'لديك حساب؟','立即登录':'تسجيل الدخول','立即注册':'التسجيل',
'还没有账号؟':'ليس لديك حساب؟','欢迎回来':'مرحباً بعودتك','创建账号':'إنشاء حساب',
'关于TokenNexus':'عن TokenNexus',
'致力于打造最全面的全球 AI Token 导航平台':'الأكثر شمولاً لملاح AI Token العالمي',
'平台分类导航':'فئات المنصات','平台分类':'الفئات',
'价格信息':'الأسعار','价格透明':'أسعار شفافة',
'支持模型':'النماذج المدعومة','教程工具箱':'الأدوات',
'实时监控':'المراقبة','智能对比':'مقارنة ذكية',
'我的评论':'تعليقاتي','探索':'استكشاف','友情链接':'روابط',
'合作详情':'تفاصيل التعاون','联系人':'جهة الاتصال',
'联系电话':'الهاتف','联系邮箱':'البريد','联系邮箱：':'البريد:',
'公司名称':'الشركة','公司网站':'الموقع',
'战略合作':'شراكة استراتيجية','API对接':'ربط API',
'返回首页':'الرئيسية','平台名称':'الاسم','平台描述':'الوصف','平台网址':'الرابط',
'全球最全的AI Token导航平台':'الأكثر شمولاً لملاح AI Token في العالم',
'平台详情':'التفاصيل','平台介绍':'المقدمة','评分':'التقييم','评分分布':'التوزيع',
'5星':'5 نجوم','4星':'4 نجوم','3星':'3 نجوم','2星':'نجمتان','1星':'نجمة واحدة',
'相关推荐':'توصيات','同类平台':'منصات مشابهة',
'返回':'رجوع','分享':'مشاركة','查看更多':'المزيد',
'开始使用':'ابدأ','立即前往':'زيارة','了解更多':'اعرف المزيد',
'确认':'تأكيد','关闭':'إغلاق','成功':'نجاح','失败':'فشل',
'正在加载':'جاري التحميل','请稍候':'انتظر','网络错误':'خطأ في الشبكة',
'页面不存在':'الصفحة غير موجودة','返回上一页':'رجوع'
},
'vi': {
'AI Token 宇宙':'Vũ trụ AI Token','收录全球 280+ TOKEN 销售平台':'280+ nền tảng TOKEN toàn cầu',
'首页':'Trang chủ','海外官方':'Chính thức','聚合中转':'Tổng hợp','国内平台':'Trong nước',
'关于我们':'Giới thiệu','联系我们':'Liên hệ','商务合作':'Kinh doanh','提交收录':'Gửi',
'登录':'Đăng nhập','注册':'Đăng ký','退出':'Thoát','取消':'Hủy','同意':'Đồng ý',
'海外官方平台':'Nền tảng Chính thức','聚合中转平台':'Nền tảng Tổng hợp','国内平台':'Nền tảng Trong nước',
'快速筛选':'Lọc nhanh','全部':'Tất cả','全部平台':'Tất cả nền tảng',
'免费额度':'Miễn phí','最便宜':'Rẻ nhất','最稳定':'Ổn định nhất',
'官方平台':'Chính thức','聚合平台':'Tổng hợp',
'收录平台':'Nền tảng','AI 模型':'Mô hình AI','用户评价':'Đánh giá',
'热门平台':'Nền tảng phổ biến','热门模型':'Mô hình phổ biến','个平台':'nền tảng',
'加载中...':'Đang tải...','查看详情':'Xem chi tiết','访问官网':'Truy cập',
'返回列表':'Quay lại','评论':'Bình luận','查看评论':'Xem bình luận',
'登录后发表评论':'Đăng nhập để bình luận','发表评论':'Gửi bình luận',
'搜索平台名称、描述或标签...':'Tìm kiếm tên, mô tả hoặc thẻ...',
'搜索平台':'Tìm kiếm','隐私政策':'Chính sách bảo mật','服务条款':'Điều khoản dịch vụ',
'免责声明':'Miễn trừ trách nhiệm','免责申明':'Miễn trừ trách nhiệm',
'用户名':'Tên người dùng','密码':'Mật khẩu','邮箱':'Email',
'已有账号？':'Đã có tài khoản?','立即登录':'Đăng nhập','立即注册':'Đăng ký',
'还没有账号？':'Chưa có tài khoản?','欢迎回来':'Chào mừng trở lại','创建账号':'Tạo tài khoản',
'关于TokenNexus':'Giới thiệu TokenNexus',
'致力于打造最全面的全球 AI Token 导航平台':'Điều hướng AI Token toàn cầu toàn diện nhất',
'平台分类导航':'Danh mục','平台分类':'Danh mục',
'价格信息':'Giá','价格透明':'Giá minh bạch',
'支持模型':'Mô hình hỗ trợ','教程工具箱':'Công cụ',
'实时监控':'Giám sát','智能对比':'So sánh thông minh',
'我的评论':'Bình luận của tôi','探索':'Khám phá','友情链接':'Liên kết',
'合作详情':'Chi tiết hợp tác','联系人':'Liên hệ',
'联系电话':'Điện thoại','联系邮箱':'Email','联系邮箱：':'Email:',
'公司名称':'Công ty','公司网站':'Website',
'战略合作':'Đối tác chiến lược','API对接':'Tích hợp API',
'返回首页':'Về trang chủ','平台名称':'Tên','平台描述':'Mô tả','平台网址':'URL',
'全球最全的AI Token导航平台':'Điều hướng AI Token toàn cầu toàn diện nhất',
'平台详情':'Chi tiết','平台介绍':'Giới thiệu','评分':'Đánh giá','评分分布':'Phân bố',
'5星':'5 sao','4星':'4 sao','3星':'3 sao','2星':'2 sao','1星':'1 sao',
'相关推荐':'Đề xuất','同类平台':'Nền tảng tương tự',
'返回':'Quay lại','分享':'Chia sẻ','查看更多':'Xem thêm',
'开始使用':'Bắt đầu','立即前往':'Truy cập','了解更多':'Tìm hiểu thêm',
'确认':'Xác nhận','关闭':'Đóng','成功':'Thành công','失败':'Thất bại',
'正在加载':'Đang tải','请稍候':'Vui lòng đợi','网络错误':'Lỗi mạng',
'页面不存在':'Không tìm thấy trang','返回上一页':'Quay lại'
},
'th': {
'AI Token 宇宙':'จักรวาล AI Token','收录全球 280+ TOKEN 销售平台':'280+ แพลตฟอร์ม TOKEN ทั่วโลก',
'首页':'หน้าแรก','海外官方':'ทางการ','聚合中转':'รวมศูนย์','国内平台':'ในประเทศ',
'关于我们':'เกี่ยวกับ','联系我们':'ติดต่อ','商务合作':'ธุรกิจ','提交收录':'ส่ง',
'登录':'เข้าสู่ระบบ','注册':'ลงทะเบียน','退出':'ออก','取消':'ยกเลิก','同意':'ยอมรับ',
'海外官方平台':'แพลตฟอร์มทางการ','聚合中转平台':'แพลตฟอร์มรวมศูนย์','国内平台':'แพลตฟอร์มในประเทศ',
'快速筛选':'กรองเร็ว','全部':'ทั้งหมด','全部平台':'ทุกแพลตฟอร์ม',
'免费额度':'ฟรี','最便宜':'ราคาถูกสุด','最稳定':'เสถียรที่สุด',
'官方平台':'ทางการ','聚合平台':'รวมศูนย์',
'收录平台':'แพลตฟอร์ม','AI 模型':'โมเดล AI','用户评价':'รีวิว',
'热门平台':'แพลตฟอร์มยอดนิยม','热门模型':'โมเดลยอดนิยม','个平台':'แพลตฟอร์ม',
'加载中...':'กำลังโหลด...','查看详情':'ดูรายละเอียด','访问官网':'เยี่ยมชมเว็บ',
'返回列表':'กลับ','评论':'ความคิดเห็น','查看评论':'ดูความคิดเห็น',
'登录后发表评论':'เข้าสู่ระบบเพื่อแสดงความคิดเห็น','发表评论':'ส่งความคิดเห็น',
'搜索平台名称、描述或标签...':'ค้นหาชื่อ คำอธิบาย หรือแท็ก...',
'搜索平台':'ค้นหา','隐私政策':'นโยบายความเป็นส่วนตัว','服务条款':'ข้อกำหนด',
'免责声明':'ข้อจำกัดความรับผิดชอบ','免责申明':'ข้อจำกัดความรับผิดชอบ',
'用户名':'ชื่อผู้ใช้','密码':'รหัสผ่าน','邮箱':'อีเมล',
'已有账号？':'มีบัญชีแล้ว?','立即登录':'เข้าสู่ระบบ','立即注册':'ลงทะเบียน',
'还没有账号？':'ยังไม่มีบัญชี?','欢迎回来':'ยินดีต้อนรับกลับ','创建账号':'สร้างบัญชี',
'关于TokenNexus':'เกี่ยวกับ TokenNexus',
'致力于打造最全面的全球 AI Token 导航平台':'สร้างนำทาง AI Token ที่ครอบคลุมที่สุด',
'平台分类导航':'หมวดหมู่','平台分类':'หมวดหมู่',
'价格信息':'ราคา','价格透明':'ราคาโปร่งใส',
'支持模型':'โมเดลที่รองรับ','教程工具箱':'เครื่องมือ',
'实时监控':'ติดตามแบบเรียลไทม์','智能对比':'เปรียบเทียบอัจฉริยะ',
'我的评论':'ความคิดเห็นของฉัน','探索':'สำรวจ','友情链接':'ลิงก์',
'合作详情':'รายละเอียดความร่วมมือ','联系人':'ผู้ติดต่อ',
'联系电话':'โทรศัพท์','联系邮箱':'อีเมล','联系邮箱：':'อีเมล:',
'公司名称':'บริษัท','公司网站':'เว็บไซต์',
'战略合作':'พันธมิตรเชิงกลยุทธ์','API对接':'เชื่อมต่อ API',
'返回首页':'กลับหน้าแรก','平台名称':'ชื่อ','平台描述':'คำอธิบาย','平台网址':'URL',
'全球最全的AI Token导航平台':'นำทาง AI Token ที่ครอบคลุมที่สุดในโลก',
'平台详情':'รายละเอียด','平台介绍':'แนะนำ','评分':'คะแนน','评分分布':'การกระจาย',
'5星':'5 ดาว','4星':'4 ดาว','3星':'3 ดาว','2星':'2 ดาว','1星':'1 ดาว',
'相关推荐':'แนะนำ','同类平台':'แพลตฟอร์มที่คล้ายกัน',
'返回':'กลับ','分享':'แชร์','查看更多':'ดูเพิ่มเติม',
'开始使用':'เริ่มต้น','立即前往':'ไปที่','了解更多':'เรียนรู้เพิ่มเติม',
'确认':'ยืนยัน','关闭':'ปิด','成功':'สำเร็จ','失败':'ล้มเหลว',
'正在加载':'กำลังโหลด','请稍候':'กรุณารอ','网络错误':'ข้อผิดพลาดเครือข่าย',
'页面不存在':'ไม่พบหน้า','返回上一页':'กลับ'
},
'id': {
'AI Token 宇宙':'Alam Semesta AI Token','收录全球 280+ TOKEN 销售平台':'280+ platform TOKEN global',
'首页':'Beranda','海外官方':'Resmi','聚合中转':'Agregator','国内平台':'Domestik',
'关于我们':'Tentang kami','联系我们':'Kontak','商务合作':'Bisnis','提交收录':'Kirim',
'登录':'Masuk','注册':'Daftar','退出':'Keluar','取消':'Batal','同意':'Setuju',
'海外官方平台':'Platform Resmi','聚合中转平台':'Platform Agregator','国内平台':'Platform Domestik',
'快速筛选':'Filter Cepat','全部':'Semua','全部平台':'Semua Platform',
'免费额度':'Gratis','最便宜':'Termurah','最稳定':'Paling Stabil',
'官方平台':'Resmi','聚合平台':'Agregator',
'收录平台':'Platform','AI 模型':'Model AI','用户评价':'Ulasan',
'热门平台':'Platform Populer','热门模型':'Model Populer','个平台':'platform',
'加载中...':'Memuat...','查看详情':'Lihat Detail','访问官网':'Kunjungi Situs',
'返回列表':'Kembali','评论':'Komentar','查看评论':'Lihat Komentar',
'登录后发表评论':'Masuk untuk berkomentar','发表评论':'Kirim Komentar',
'搜索平台名称、描述或标签...':'Cari nama, deskripsi, atau tag...',
'搜索平台':'Cari Platform','隐私政策':'Kebijakan Privasi','服务条款':'Syarat Layanan',
'免责声明':'Sanggahan','免责申明':'Sanggahan',
'用户名':'Username','密码':'Password','邮箱':'Email',
'已有账号？':'Sudah punya akun?','立即登录':'Masuk','立即注册':'Daftar',
'还没有账号？':'Belum punya akun?','欢迎回来':'Selamat datang kembali','创建账号':'Buat Akun',
'关于TokenNexus':'Tentang TokenNexus',
'致力于打造最全面的全球 AI Token 导航平台':'Membangun navigator AI Token paling komprehensif',
'平台分类导航':'Kategori Platform','平台分类':'Kategori',
'价格信息':'Info Harga','价格透明':'Harga Transparan',
'支持模型':'Model Didukung','教程工具箱':'Alat & Tutorial',
'实时监控':'Pantauan Real-time','智能对比':'Perbandingan Cerdas',
'我的评论':'Komentar Saya','探索':'Jelajahi','友情链接':'Tautan',
'合作详情':'Detail Kerjasama','联系人':'Kontak',
'联系电话':'Telepon','联系邮箱':'Email','联系邮箱：':'Email:',
'公司名称':'Perusahaan','公司网站':'Website',
'战略合作':'Kemitraan Strategis','API对接':'Integrasi API',
'返回首页':'Ke Beranda','平台名称':'Nama','平台描述':'Deskripsi','平台网址':'URL',
'全球最全的AI Token导航平台':'Navigator AI Token paling komprehensif di dunia',
'平台详情':'Detail','平台介绍':'Pengantar','评分':'Rating','评分分布':'Distribusi',
'5星':'5 Bintang','4星':'4 Bintang','3星':'3 Bintang','2星':'2 Bintang','1星':'1 Bintang',
'相关推荐':'Rekomendasi','同类平台':'Platform Serupa',
'返回':'Kembali','分享':'Bagikan','查看更多':'Lihat Lebih',
'开始使用':'Mulai','立即前往':'Kunjungi','了解更多':'Pelajari Lebih',
'确认':'Konfirmasi','关闭':'Tutup','成功':'Berhasil','失败':'Gagal',
'正在加载':'Memuat','请稍候':'Mohon tunggu','网络错误':'Kesalahan Jaringan',
'页面不存在':'Halaman Tidak Ditemukan','返回上一页':'Kembali'
},
'ms': {
'AI Token 宇宙':'Alam Semesta AI Token','收录全球 280+ TOKEN 销售平台':'280+ platform TOKEN global',
'首页':'Laman Utama','海外官方':'Rasmi','聚合中转':'Agregator','国内平台':'Domestik',
'关于我们':'Tentang kami','联系我们':'Hubungi','商务合作':'Perniagaan','提交收录':'Hantar',
'登录':'Log Masuk','注册':'Daftar','退出':'Log Keluar','取消':'Batal','同意':'Setuju',
'海外官方平台':'Platform Rasmi','聚合中转平台':'Platform Agregator','国内平台':'Platform Domestik',
'快速筛选':'Penapis Pantas','全部':'Semua','全部平台':'Semua Platform',
'免费额度':'Percuma','最便宜':'Paling Murah','最稳定':'Paling Stabil',
'官方平台':'Rasmi','聚合平台':'Agregator',
'收录平台':'Platform','AI 模型':'Model AI','用户评价':'Ulasan',
'热门平台':'Platform Popular','热门模型':'Model Popular','个平台':'platform',
'加载中...':'Memuatkan...','查看详情':'Lihat Butiran','访问官网':'Lawati Laman',
'返回列表':'Kembali','评论':'Komen','查看评论':'Lihat Komen',
'登录后发表评论':'Log masuk untuk komen','发表评论':'Hantar Komen',
'搜索平台名称、描述或标签...':'Cari nama, penerangan, atau tag...',
'搜索平台':'Cari Platform','隐私政策':'Dasar Privasi','服务条款':'Terma Perkhidmatan',
'免责声明':'Penafian','免责申明':'Penafian',
'用户名':'Nama Pengguna','密码':'Kata Laluan','邮箱':'E-mel',
'已有账号？':'Sudah ada akaun?','立即登录':'Log Masuk','立即注册':'Daftar',
'还没有账号？':'Belum ada akaun?','欢迎回来':'Selamat kembali','创建账号':'Cipta Akaun',
'关于TokenNexus':'Tentang TokenNexus',
'致力于打造最全面的全球 AI Token 导航平台':'Membina navigator AI Token paling komprehensif',
'平台分类导航':'Kategori Platform','平台分类':'Kategori',
'价格信息':'Maklumat Harga','价格透明':'Harga Telus',
'支持模型':'Model Disokong','教程工具箱':'Alat & Tutorial',
'实时监控':'Pantauan Masa Nyata','智能对比':'Perbandingan Pintar',
'我的评论':'Komen Saya','探索':'Terokai','友情链接':'Pautan',
'合作详情':'Butiran Kerjasama','联系人':'Hubungi',
'联系电话':'Telefon','联系邮箱':'E-mel','联系邮箱：':'E-mel:',
'公司名称':'Syarikat','公司网站':'Laman Web',
'战略合作':'Perkongsian Strategik','API对接':'Integrasi API',
'返回首页':'Ke Laman Utama','平台名称':'Nama','平台描述':'Penerangan','平台网址':'URL',
'全球最全的AI Token导航平台':'Navigator AI Token paling komprehensif di dunia',
'平台详情':'Butiran','平台介绍':'Pengenalan','评分':'Penilaian','评分分布':'Pengedaran',
'5星':'5 Bintang','4星':'4 Bintang','3星':'3 Bintang','2星':'2 Bintang','1星':'1 Bintang',
'相关推荐':'Cadangan','同类平台':'Platform Serupa',
'返回':'Kembali','分享':'Kongsi','查看更多':'Lihat Lagi',
'开始使用':'Mula','立即前往':'Lawati','了解更多':'Ketahui Lebih',
'确认':'Sahkan','关闭':'Tutup','成功':'Berjaya','失败':'Gagal',
'正在加载':'Memuatkan','请稍候':'Sila tunggu','网络错误':'Ralat Rangkaian',
'页面不存在':'Halaman Tidak Dijumpai','返回上一页':'Kembali'
},
'fil': {
'AI Token 宇宙':'AI Token Universe','收录全球 280+ TOKEN 销售平台':'280+ global na TOKEN platform',
'首页':'Home','海外官方':'Opisyal','聚合中转':'Agregator','国内平台':'Domestiko',
'关于我们':'Tungkol sa amin','联系我们':'Makipag-ugnay','商务合作':'Negosyo','提交收录':'Isumite',
'登录':'Mag-login','注册':'Mag-register','退出':'Mag-logout','取消':'Kanselahin','同意':'Sumang-ayon',
'海外官方平台':'Opisyal na Platform','聚合中转平台':'Agregator na Platform','国内平台':'Domestik na Platform',
'快速筛选':'Mabilis na Filter','全部':'Lahat','全部平台':'Lahat ng Platform',
'免费额度':'Libre','最便宜':'Pinakamura','最稳定':'Pinakatatag',
'官方平台':'Opisyal','聚合平台':'Agregator',
'收录平台':'Platform','AI 模型':'AI Modelo','用户评价':'Review',
'热门平台':'Mga Sikat na Platform','热门模型':'Sikat na Modelo','个平台':'platform',
'加载中...':'Naglo-load...','查看详情':'Tingnan ang Detalye','访问官网':'Bisitahin ang Site',
'返回列表':'Bumalik','评论':'Komento','查看评论':'Tingnan ang Komento',
'登录后发表评论':'Mag-login para magkomento','发表评论':'I-post ang Komento',
'搜索平台名称、描述或标签...':'Maghanap ng pangalan, deskripsyon, o tag...',
'搜索平台':'Maghanap','隐私政策':'Patakaran sa Privacy','服务条款':'Mga Tuntunin',
'免责声明':'Pagtatanggi','免责申明':'Pagtatanggi',
'用户名':'Username','密码':'Password','邮箱':'Email',
'已有账号？':'May account na?','立即登录':'Mag-login','立即注册':'Mag-register',
'还没有账号？':'Wala pang account?','欢迎回来':'Maligayang pagbabalik','创建账号':'Gumawa ng Account',
'关于TokenNexus':'Tungkol sa TokenNexus',
'致力于打造最全面的全球 AI Token 导航平台':'Ang pinakakomprehensibong global na AI Token navigator',
'平台分类导航':'Kategorya','平台分类':'Kategorya',
'价格信息':'Presyo','价格透明':'Transparent na Presyo',
'支持模型':'Suportadong Modelo','教程工具箱':'Mga Tool',
'实时监控':'Real-time Monitoring','智能对比':'Matalinong Paghahambing',
'我的评论':'Aking Komento','探索':'Galugarin','友情链接':'Mga Link',
'合作详情':'Detalye ng Kooperasyon','联系人':'Kontakt',
'联系电话':'Telepono','联系邮箱':'Email','联系邮箱：':'Email:',
'公司名称':'Kumpanya','公司网站':'Website',
'战略合作':'Strategikong Partnership','API对接':'API Integration',
'返回首页':'Bumalik sa Home','平台名称':'Pangalan','平台描述':'Deskripsyon','平台网址':'URL',
'全球最全的AI Token导航平台':'Ang pinakakomprehensibong AI Token navigator sa mundo',
'平台详情':'Detalye','平台介绍':'Panimula','评分':'Rating','评分分布':'Distribusyon',
'5星':'5 Bituin','4星':'4 Bituin','3星':'3 Bituin','2星':'2 Bituin','1星':'1 Bituin',
'相关推荐':'Mga Rekomendasyon','同类平台':'Katulad na Platform',
'返回':'Bumalik','分享':'Ibahagi','查看更多':'Tingnan Pa',
'开始使用':'Simulan','立即前往':'Pumunta','了解更多':'Alamin Pa',
'确认':'Kumpirmahin','关闭':'Isara','成功':'Tagumpay','失败':'Nabigo',
'正在加载':'Naglo-load','请稍候':'Mangyari maghintay','网络错误':'Network Error',
'页面不存在':'Hindi Nahanap ang Pahina','返回上一页':'Bumalik'
}
    },

    init() {
        this.loadLanguage();
        this.createLanguageSelector();
        if (this.currentLang !== 'zh') {
            this.translatePage(this.currentLang);
        }
    },

    loadLanguage() {
        const saved = localStorage.getItem('i18n_lang');
        if (saved && this.languages[saved]) this.currentLang = saved;
    },

    saveLanguage(lang) {
        localStorage.setItem('i18n_lang', lang);
        this.currentLang = lang;
    },

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
                            onclick="I18N.setLanguage('${code}')" data-lang="${code}">
                        <span class="lang-native">${lang.native}</span>
                        <span class="lang-name">${lang.name}</span>
                    </button>
                `).join('')}
            </div>
        `;
        document.body.appendChild(selector);
        document.addEventListener('click', (e) => {
            if (!selector.contains(e.target)) document.getElementById('i18nDropdown').classList.remove('show');
        });
    },

    toggleDropdown() {
        document.getElementById('i18nDropdown').classList.toggle('show');
    },

    setLanguage(lang) {
        if (lang === this.currentLang) { this.toggleDropdown(); return; }
        if (lang === 'zh') { this.saveLanguage('zh'); location.reload(); return; }
        this.saveLanguage(lang);
        document.querySelector('.i18n-current-lang').textContent = this.languages[lang].native;
        document.querySelectorAll('.i18n-option').forEach(opt => {
            opt.classList.toggle('active', opt.dataset.lang === lang);
        });
        this.translatePage(lang);
        this.toggleDropdown();
    },

    translatePage(lang) {
        const dict = this.translations[lang];
        if (!dict) return;

        // 翻译所有文本节点（支持模糊匹配：包含中文即尝试翻译）
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);

        nodes.forEach(node => {
            const text = node.textContent.trim();
            if (!text || !/[\u4e00-\u9fff]/.test(text)) return;

            // 1. 精确匹配
            if (dict[text]) {
                node.textContent = dict[text];
                return;
            }

            // 2. 去除前后空白和emoji后匹配
            const cleaned = text.replace(/^[\s\p{Emoji}\p{Symbol}]+|[\s\p{Emoji}\p{Symbol}]+$/gu, '').trim();
            if (cleaned !== text && dict[cleaned]) {
                node.textContent = text.replace(cleaned, dict[cleaned]);
                return;
            }

            // 3. 遍历字典，对较长的key做包含匹配
            for (const [key, val] of Object.entries(dict)) {
                if (key.length >= 4 && text.includes(key)) {
                    node.textContent = text.replace(key, val);
                    return;
                }
            }
        });

        // 翻译placeholder
        document.querySelectorAll('[placeholder]').forEach(el => {
            const ph = el.getAttribute('placeholder');
            if (ph && dict[ph]) el.setAttribute('placeholder', dict[ph]);
        });

        // 翻译title
        if (document.title) {
            let title = document.title;
            for (const [key, val] of Object.entries(dict)) {
                if (title.includes(key)) { title = title.replace(key, val); }
            }
            document.title = title;
        }

        document.documentElement.lang = lang;
    }
};

// 样式
const style = document.createElement('style');
style.textContent = `
.i18n-selector{position:fixed;top:80px;right:20px;z-index:9999}
.i18n-btn{display:flex;align-items:center;gap:8px;background:rgba(0,240,255,.1);border:1px solid rgba(0,240,255,.3);color:#fff;padding:10px 16px;border-radius:12px;cursor:pointer;font-size:14px;transition:all .3s;backdrop-filter:blur(10px)}
.i18n-btn:hover{background:rgba(0,240,255,.2);border-color:rgba(0,240,255,.5);transform:translateY(-2px)}
.i18n-btn svg{width:18px;height:18px}
.i18n-dropdown{position:absolute;top:calc(100% + 8px);right:0;background:rgba(26,26,46,.95);border:1px solid rgba(0,240,255,.3);border-radius:12px;padding:8px;min-width:180px;display:none;backdrop-filter:blur(20px);box-shadow:0 10px 40px rgba(0,0,0,.3);max-height:400px;overflow-y:auto}
.i18n-dropdown.show{display:block;animation:fadeIn .2s ease}
@keyframes fadeIn{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
.i18n-option{display:flex;justify-content:space-between;align-items:center;width:100%;padding:10px 12px;background:0 0;border:none;color:#fff;cursor:pointer;border-radius:8px;transition:all .2s}
.i18n-option:hover{background:rgba(0,240,255,.1)}
.i18n-option.active{background:rgba(0,240,255,.2)}
.lang-native{font-weight:500}
.lang-name{color:rgba(255,255,255,.5);font-size:12px}
@media(max-width:768px){.i18n-selector{top:auto;bottom:20px;right:20px}.i18n-btn{padding:8px 12px}.i18n-dropdown{max-height:300px}}
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', () => { I18N.init(); });
