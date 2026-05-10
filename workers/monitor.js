// TokenNexus Monitoring Worker
// Cloudflare Worker for monitoring AI API platforms
// Trigger: Cron (every 5 minutes)

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // API路由
    if (url.pathname === '/api/monitor/check') {
      return await checkAllPlatforms(env);
    }
    
    if (url.pathname === '/api/monitor/stats') {
      return await getStats(env, url.searchParams);
    }
    
    if (url.pathname === '/api/platform/detail') {
      return await getPlatformDetail(env, url.searchParams.get('slug'));
    }
    
    return new Response('Not Found', { status: 404 });
  },

  async scheduled(event, env, ctx) {
    // Cron触发：每5分钟执行一次监测
    ctx.waitUntil(checkAllPlatforms(env));
    ctx.waitUntil(updateDailyStats(env));
  }
};

// 检测所有平台
async function checkAllPlatforms(env) {
  const platforms = await env.DB.prepare(
    'SELECT id, slug, url, is_active FROM platforms WHERE is_active = 1'
  ).all();

  const results = [];
  
  for (const platform of platforms.results) {
    const result = await checkPlatform(platform);
    
    // 写入监测日志
    await env.DB.prepare(
      `INSERT INTO monitoring_logs 
       (platform_id, is_available, http_status, response_time_ms, error_message, error_type, check_region)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      platform.id,
      result.isAvailable,
      result.statusCode,
      result.responseTime,
      result.error || null,
      result.errorType || null,
      'CN'
    ).run();
    
    results.push({
      slug: platform.slug,
      ...result
    });
  }

  return new Response(JSON.stringify({ 
    checked_at: new Date().toISOString(),
    results 
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

// 检测单个平台
async function checkPlatform(platform) {
  const startTime = Date.now();
  
  try {
    // 尝试访问平台API端点或首页
    const checkUrl = platform.url + '/v1/models';
    
    const response = await fetch(checkUrl, {
      method: 'HEAD',
      headers: {
        'User-Agent': 'TokenNexus-Monitor/1.0'
      },
      // 5秒超时
      signal: AbortSignal.timeout(5000)
    });
    
    const responseTime = Date.now() - startTime;
    
    return {
      isAvailable: response.status < 500,
      statusCode: response.status,
      responseTime,
      error: null,
      errorType: null
    };
    
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    let errorType = 'unknown';
    if (error.name === 'TimeoutError') {
      errorType = 'timeout';
    } else if (error.message.includes('fetch')) {
      errorType = 'network';
    }
    
    return {
      isAvailable: false,
      statusCode: 0,
      responseTime,
      error: error.message,
      errorType
    };
  }
}

// 更新每日统计
async function updateDailyStats(env) {
  const today = new Date().toISOString().split('T')[0];
  
  // 获取所有平台
  const platforms = await env.DB.prepare(
    'SELECT id FROM platforms WHERE is_active = 1'
  ).all();

  for (const platform of platforms.results) {
    // 计算今日统计
    const stats = await env.DB.prepare(
      `SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN is_available = 1 THEN 1 ELSE 0 END) as available,
        AVG(response_time_ms) as avg_time,
        MIN(response_time_ms) as min_time,
        MAX(response_time_ms) as max_time,
        SUM(CASE WHEN is_available = 0 THEN 1 ELSE 0 END) as errors
       FROM monitoring_logs 
       WHERE platform_id = ? 
       AND DATE(checked_at) = ?`
    ).bind(platform.id, today).first();

    if (stats && stats.total > 0) {
      const uptime = (stats.available / stats.total * 100).toFixed(2);
      
      // 插入或更新统计
      await env.DB.prepare(
        `INSERT INTO monitoring_stats 
         (platform_id, stat_date, total_checks, available_checks, uptime_percentage, 
          avg_response_time, min_response_time, max_response_time, error_count)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(platform_id, stat_date) DO UPDATE SET
         total_checks = excluded.total_checks,
         available_checks = excluded.available_checks,
         uptime_percentage = excluded.uptime_percentage,
         avg_response_time = excluded.avg_response_time,
         min_response_time = excluded.min_response_time,
         max_response_time = excluded.max_response_time,
         error_count = excluded.error_count`
      ).bind(
        platform.id,
        today,
        stats.total,
        stats.available,
        uptime,
        Math.round(stats.avg_time || 0),
        stats.min_time || 0,
        stats.max_time || 0,
        stats.errors || 0
      ).run();
    }
  }
}

// 获取平台统计数据
async function getStats(env, params) {
  const slug = params.get('slug');
  const days = parseInt(params.get('days') || '30');
  
  if (!slug) {
    return new Response(JSON.stringify({ error: 'slug required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 获取平台ID
  const platform = await env.DB.prepare(
    'SELECT id FROM platforms WHERE slug = ?'
  ).bind(slug).first();

  if (!platform) {
    return new Response(JSON.stringify({ error: 'platform not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 获取最近N天统计
  const stats = await env.DB.prepare(
    `SELECT * FROM monitoring_stats 
     WHERE platform_id = ? 
     AND stat_date >= DATE('now', '-${days} days')
     ORDER BY stat_date DESC`
  ).bind(platform.id).all();

  // 计算汇总数据
  const summary = await env.DB.prepare(
    `SELECT 
      AVG(uptime_percentage) as avg_uptime,
      AVG(avg_response_time) as avg_response,
      SUM(error_count) as total_errors
     FROM monitoring_stats 
     WHERE platform_id = ? 
     AND stat_date >= DATE('now', '-${days} days')`
  ).bind(platform.id).first();

  return new Response(JSON.stringify({
    slug,
    days,
    summary: {
      avgUptime: summary?.avg_uptime?.toFixed(2) || 100,
      avgResponseTime: Math.round(summary?.avg_response || 0),
      totalErrors: summary?.total_errors || 0
    },
    daily: stats.results
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

// 获取平台详情（包含所有关联数据）
async function getPlatformDetail(env, slug) {
  if (!slug) {
    return new Response(JSON.stringify({ error: 'slug required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 获取平台基础信息
  const platform = await env.DB.prepare(
    `SELECT * FROM platforms WHERE slug = ? AND is_active = 1`
  ).bind(slug).first();

  if (!platform) {
    return new Response(JSON.stringify({ error: 'platform not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 获取支持的模型
  const models = await env.DB.prepare(
    `SELECT model_name, model_type, is_available 
     FROM platform_models 
     WHERE platform_id = ?`
  ).bind(platform.id).all();

  // 获取支付方式
  const payments = await env.DB.prepare(
    `SELECT payment_method, is_available 
     FROM platform_payments 
     WHERE platform_id = ?`
  ).bind(platform.id).all();

  // 获取功能特性
  const features = await env.DB.prepare(
    `SELECT feature_name, is_supported, notes 
     FROM platform_features 
     WHERE platform_id = ?`
  ).bind(platform.id).all();

  // 获取最近30天可用率
  const uptimeStats = await env.DB.prepare(
    `SELECT AVG(uptime_percentage) as avg_uptime,
            AVG(avg_response_time) as avg_response
     FROM monitoring_stats 
     WHERE platform_id = ? 
     AND stat_date >= DATE('now', '-30 days')`
  ).bind(platform.id).first();

  // 获取最后一次检测
  const lastCheck = await env.DB.prepare(
    `SELECT checked_at, is_available, response_time_ms
     FROM monitoring_logs 
     WHERE platform_id = ? 
     ORDER BY checked_at DESC 
     LIMIT 1`
  ).bind(platform.id).first();

  // 获取检测次数
  const checkCount = await env.DB.prepare(
    `SELECT COUNT(*) as count FROM monitoring_logs WHERE platform_id = ?`
  ).bind(platform.id).first();

  // 获取SEO关键词
  const keywords = await env.DB.prepare(
    `SELECT keyword, is_primary FROM seo_keywords 
     WHERE platform_id = ? 
     ORDER BY is_primary DESC, search_volume DESC`
  ).bind(platform.id).all();

  return new Response(JSON.stringify({
    ...platform,
    models: models.results.map(m => m.model_name),
    paymentMethods: payments.results.map(p => p.payment_method),
    features: {
      functionCalling: features.results.find(f => f.feature_name === 'function_calling')?.is_supported || false,
      streaming: features.results.find(f => f.feature_name === 'streaming')?.is_supported || false,
      image: features.results.find(f => f.feature_name === 'image')?.is_supported || false,
      embedding: features.results.find(f => f.feature_name === 'embedding')?.is_supported || false
    },
    uptime30d: Math.round(uptimeStats?.avg_uptime || 99),
    avgLatency: Math.round(uptimeStats?.avg_response || 100),
    lastCheck: lastCheck ? new Date(lastCheck.checked_at).toLocaleString('zh-CN') : '未检测',
    checkCount: checkCount?.count || 0,
    keywords: keywords.results.map(k => k.keyword),
    stars: '★'.repeat(Math.floor(platform.rating)) + '☆'.repeat(5 - Math.floor(platform.rating))
  }), {
    headers: { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
