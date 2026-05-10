-- TokenNexus D1 Database Schema
-- Cloudflare D1 SQL Schema for AI API Platform monitoring

-- 平台基础信息表
CREATE TABLE platforms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,           -- URL友好的标识符
    name TEXT NOT NULL,                  -- 平台名称
    name_en TEXT,                        -- 英文名称
    url TEXT NOT NULL,                   -- 官网地址
    logo_file TEXT,                      -- Logo文件名
    category TEXT NOT NULL,              -- official/china/aggregator
    short_description TEXT,              -- 简短描述
    long_description TEXT,               -- 详细描述（支持HTML）
    verified BOOLEAN DEFAULT 0,          -- 是否已验证
    
    -- 价格体系
    price_multiplier REAL DEFAULT 1.0,   -- 倍率 (1.0, 1.2, 1.5...)
    is_original_price BOOLEAN DEFAULT 0, -- 是否按原价
    has_monthly BOOLEAN DEFAULT 0,       -- 是否支持包月
    
    -- 评分
    rating REAL DEFAULT 4.0,             -- 综合评分 0-5
    review_count INTEGER DEFAULT 0,      -- 评价数量
    
    -- SEO
    meta_keywords TEXT,                  -- 关键词
    meta_description TEXT,               -- Meta描述
    
    -- 状态
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 支持的模型表
CREATE TABLE platform_models (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    platform_id INTEGER NOT NULL,
    model_name TEXT NOT NULL,            -- GPT-4o, Claude-3.5-Sonnet...
    model_type TEXT,                     -- chat/image/audio/embedding
    is_available BOOLEAN DEFAULT 1,
    FOREIGN KEY (platform_id) REFERENCES platforms(id) ON DELETE CASCADE
);

-- 支付方式表
CREATE TABLE platform_payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    platform_id INTEGER NOT NULL,
    payment_method TEXT NOT NULL,        -- 支付宝/微信/USDT/信用卡
    is_available BOOLEAN DEFAULT 1,
    FOREIGN KEY (platform_id) REFERENCES platforms(id) ON DELETE CASCADE
);

-- 功能特性表
CREATE TABLE platform_features (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    platform_id INTEGER NOT NULL,
    feature_name TEXT NOT NULL,          -- function_calling/streaming/image/embedding
    is_supported BOOLEAN DEFAULT 0,
    notes TEXT,                          -- 备注说明
    FOREIGN KEY (platform_id) REFERENCES platforms(id) ON DELETE CASCADE
);

-- 监测数据表（每5分钟写入一次）
CREATE TABLE monitoring_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    platform_id INTEGER NOT NULL,
    checked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- 可用性检测
    is_available BOOLEAN,                -- 是否可用
    http_status INTEGER,                 -- HTTP状态码
    response_time_ms INTEGER,            -- 响应时间（毫秒）
    
    -- 错误信息
    error_message TEXT,                  -- 错误信息（如果有）
    error_type TEXT,                     -- 错误类型
    
    -- 检测节点
    check_region TEXT DEFAULT 'CN',      -- 检测节点地区
    
    FOREIGN KEY (platform_id) REFERENCES platforms(id) ON DELETE CASCADE
);

-- 监测统计表（每日汇总）
CREATE TABLE monitoring_stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    platform_id INTEGER NOT NULL,
    stat_date DATE NOT NULL,             -- 统计日期
    
    -- 可用性统计
    total_checks INTEGER DEFAULT 0,      -- 总检测次数
    available_checks INTEGER DEFAULT 0,  -- 可用次数
    uptime_percentage REAL DEFAULT 100,  -- 可用率
    
    -- 性能统计
    avg_response_time INTEGER,           -- 平均响应时间
    min_response_time INTEGER,           -- 最小响应时间
    max_response_time INTEGER,           -- 最大响应时间
    
    -- 错误统计
    error_count INTEGER DEFAULT 0,       -- 错误次数
    
    UNIQUE(platform_id, stat_date),
    FOREIGN KEY (platform_id) REFERENCES platforms(id) ON DELETE CASCADE
);

-- 长尾关键词表（SEO优化）
CREATE TABLE seo_keywords (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    platform_id INTEGER NOT NULL,
    keyword TEXT NOT NULL,               -- 长尾关键词
    search_volume INTEGER,               -- 预估搜索量
    difficulty INTEGER,                  -- 竞争难度 1-100
    is_primary BOOLEAN DEFAULT 0,        -- 是否主要关键词
    FOREIGN KEY (platform_id) REFERENCES platforms(id) ON DELETE CASCADE
);

-- 创建索引优化查询
CREATE INDEX idx_platforms_category ON platforms(category);
CREATE INDEX idx_platforms_slug ON platforms(slug);
CREATE INDEX idx_platforms_active ON platforms(is_active);
CREATE INDEX idx_monitoring_platform_time ON monitoring_logs(platform_id, checked_at);
CREATE INDEX idx_monitoring_stats_platform_date ON monitoring_stats(platform_id, stat_date);

-- 插入示例数据
INSERT INTO platforms (slug, name, url, logo_file, category, short_description, long_description, price_multiplier, is_original_price, has_monthly, rating, review_count, meta_keywords, meta_description) VALUES
('openai', 'OpenAI', 'https://openai.com', 'openai.png', 'official', 
 'OpenAI官方API，支持GPT-4o、o1、o3等全系列模型', 
 '<h3>平台介绍</h3><p>OpenAI是全球领先的AI研究公司，提供GPT系列大模型API服务。作为官方渠道，提供最全的模型支持和最稳定的服务质量。</p><h3>核心优势</h3><ul><li>官方直连，数据安全有保障</li><li>支持最新模型：GPT-4o、o1、o3</li><li>完整功能：Function Calling、Vision、DALL-E</li><li>企业级SLA保障</li></ul><h3>适用场景</h3><p>适合对数据安全要求高、需要最新模型能力的企业用户和开发者。</p>',
 1.0, 1, 1, 4.8, 2345, 'OpenAI API,GPT-4o,GPT-4,ChatGPT API,OpenAI官方,AI API', 'OpenAI官方API服务，支持GPT-4o、GPT-4、o1等全系列模型，提供Function Calling、Vision、DALL-E等完整功能。'),

('anthropic', 'Anthropic Claude', 'https://anthropic.com', 'anthropic.png', 'official',
 'Anthropic官方API，Claude系列模型以安全性和长上下文著称',
 '<h3>平台介绍</h3><p>Anthropic是AI安全领域的领导者，Claude模型以出色的安全性、长上下文窗口和推理能力著称。</p><h3>核心优势</h3><ul><li>200K超长上下文窗口</li><li>业界领先的AI安全对齐</li><li>出色的代码和推理能力</li><li>企业级隐私保护</li></ul>',
 1.0, 1, 1, 4.7, 1890, 'Claude API,Anthropic,Claude 3.5,Claude Sonnet,AI API,长上下文', 'Anthropic Claude官方API，200K上下文，业界领先的AI安全对齐，出色的代码和推理能力。'),

('openrouter', 'OpenRouter', 'https://openrouter.ai', 'openrouter.png', 'aggregator',
 '一站式AI模型聚合平台，支持400+模型统一接口',
 '<h3>平台介绍</h3><p>OpenRouter是最大的AI模型聚合平台，提供统一API接口访问400+模型，自动路由到最优服务商。</p><h3>核心优势</h3><ul><li>400+模型一站式接入</li><li>OpenAI兼容格式，零成本迁移</li><li>智能路由，自动选择最优模型</li><li>价格透明，实时比价</li></ul>',
 1.2, 0, 0, 4.5, 1234, 'OpenRouter,AI模型聚合,多模型API,模型路由,AI API中转', 'OpenRouter一站式AI模型聚合平台，支持400+模型统一接口，OpenAI兼容格式，智能路由选择最优服务商。');

-- 插入模型数据
INSERT INTO platform_models (platform_id, model_name, model_type, is_available) VALUES
(1, 'GPT-4o', 'chat', 1),
(1, 'GPT-4o-mini', 'chat', 1),
(1, 'o1-preview', 'chat', 1),
(1, 'o3-mini', 'chat', 1),
(1, 'DALL-E 3', 'image', 1),
(1, 'text-embedding-3', 'embedding', 1),
(2, 'Claude 3.5 Sonnet', 'chat', 1),
(2, 'Claude 3.5 Haiku', 'chat', 1),
(2, 'Claude 3 Opus', 'chat', 1),
(3, 'GPT-4o', 'chat', 1),
(3, 'Claude 3.5 Sonnet', 'chat', 1),
(3, 'Gemini 1.5 Pro', 'chat', 1),
(3, 'Llama 3.1', 'chat', 1);

-- 插入支付方式
INSERT INTO platform_payments (platform_id, payment_method, is_available) VALUES
(1, '信用卡', 1),
(1, 'PayPal', 1),
(2, '信用卡', 1),
(3, '支付宝', 1),
(3, '微信', 1),
(3, 'USDT', 1),
(3, '信用卡', 1);

-- 插入功能特性
INSERT INTO platform_features (platform_id, feature_name, is_supported, notes) VALUES
(1, 'function_calling', 1, '完整支持'),
(1, 'streaming', 1, '完整支持'),
(1, 'image', 1, 'DALL-E 3'),
(1, 'embedding', 1, 'text-embedding-3'),
(2, 'function_calling', 1, '完整支持'),
(2, 'streaming', 1, '完整支持'),
(2, 'image', 1, 'Claude Vision'),
(2, 'embedding', 0, NULL),
(3, 'function_calling', 1, '取决于底层模型'),
(3, 'streaming', 1, '完整支持'),
(3, 'image', 1, '取决于底层模型'),
(3, 'embedding', 1, '取决于底层模型');

-- 插入SEO关键词
INSERT INTO seo_keywords (platform_id, keyword, search_volume, difficulty, is_primary) VALUES
(1, 'OpenAI API购买', 5000, 45, 1),
(1, 'GPT-4o API', 3000, 50, 1),
(1, 'ChatGPT API Key', 4500, 40, 0),
(1, 'OpenAI API价格', 2800, 35, 0),
(2, 'Claude API购买', 3200, 40, 1),
(2, 'Claude 3.5 API', 2500, 45, 1),
(2, 'Anthropic API Key', 1800, 35, 0),
(3, 'OpenRouter API', 1500, 30, 1),
(3, 'AI模型聚合平台', 800, 25, 0),
(3, '多模型API', 600, 20, 0);
