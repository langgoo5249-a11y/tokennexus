-- 平台信息表
CREATE TABLE IF NOT EXISTS platforms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    url TEXT,
    logo TEXT,
    description TEXT,
    category TEXT DEFAULT 'aggregator',
    tags TEXT DEFAULT '[]',
    models TEXT DEFAULT '[]',
    pricing_type TEXT DEFAULT 'ratio',
    pricing_ratio REAL DEFAULT 1.0,
    pricing_monthly TEXT,
    pricing_note TEXT,
    payment_methods TEXT DEFAULT '[]',
    features TEXT DEFAULT '[]',
    rating REAL DEFAULT 0,
    reviews INTEGER DEFAULT 0,
    verified INTEGER DEFAULT 0,
    status INTEGER DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- 监测数据表（原始记录）
CREATE TABLE IF NOT EXISTS monitor_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    platform_id INTEGER NOT NULL,
    status_code INTEGER DEFAULT 0,
    response_time_ms INTEGER DEFAULT 0,
    is_up INTEGER DEFAULT 1,
    error_message TEXT,
    checked_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (platform_id) REFERENCES platforms(id) ON DELETE CASCADE
);

-- 可用率统计表（每日汇总）
CREATE TABLE IF NOT EXISTS uptime_stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    platform_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    total_checks INTEGER DEFAULT 0,
    up_checks INTEGER DEFAULT 0,
    avg_response_ms INTEGER DEFAULT 0,
    min_response_ms INTEGER DEFAULT 0,
    max_response_ms INTEGER DEFAULT 0,
    uptime_percent REAL DEFAULT 100,
    FOREIGN KEY (platform_id) REFERENCES platforms(id) ON DELETE CASCADE,
    UNIQUE(platform_id, date)
);

-- 用户评价表
CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    platform_id INTEGER NOT NULL,
    rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
    content TEXT,
    author TEXT DEFAULT '匿名用户',
    ip_hash TEXT,
    status INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (platform_id) REFERENCES platforms(id) ON DELETE CASCADE
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_platforms_slug ON platforms(slug);
CREATE INDEX IF NOT EXISTS idx_platforms_category ON platforms(category);
CREATE INDEX IF NOT EXISTS idx_platforms_status ON platforms(status);
CREATE INDEX IF NOT EXISTS idx_monitor_platform ON monitor_data(platform_id);
CREATE INDEX IF NOT EXISTS idx_monitor_time ON monitor_data(checked_at);
CREATE INDEX IF NOT EXISTS idx_uptime_platform ON uptime_stats(platform_id);
CREATE INDEX IF NOT EXISTS idx_uptime_date ON uptime_stats(date);
CREATE INDEX IF NOT EXISTS idx_reviews_platform ON reviews(platform_id);
