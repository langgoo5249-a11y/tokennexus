/**
 * TokenNexus API Worker
 * 提供平台数据API和自动监测功能
 */

// CORS 头
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

// JSON 响应助手
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders
    }
  });
}

// 错误响应
function errorResponse(message, status = 400) {
  return jsonResponse({ success: false, error: message }, status);
}

export default {
  async fetch(request, env, ctx) {
    // 处理 CORS 预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // API 路由
      if (path.startsWith('/api/')) {
        return await handleAPI(request, env, path, url);
      }

      // 监测触发端点（由 Cron 调用）
      if (path === '/__monitor') {
        return await runMonitor(env);
      }

      // 健康检查
      if (path === '/health') {
        return jsonResponse({ status: 'ok', timestamp: new Date().toISOString() });
      }

      return errorResponse('Not Found', 404);
    } catch (error) {
      console.error('Error:', error);
      return errorResponse(error.message, 500);
    }
  },

  // Cron 定时任务
  async scheduled(event, env, ctx) {
    ctx.waitUntil(runMonitor(env));
  }
};

// API 路由处理
async function handleAPI(request, env, path, url) {
  const method = request.method;
  const segments = path.split('/').filter(Boolean);

  // GET /api/platforms - 获取所有平台
  if (path === '/api/platforms' && method === 'GET') {
    return await getPlatforms(env, url);
  }

  // GET /api/platforms/:slug - 获取单个平台
  const platformMatch = path.match(/^\/api\/platforms\/([^\/]+)$/);
  if (platformMatch && method === 'GET') {
    return await getPlatform(env, platformMatch[1]);
  }

  // GET /api/platforms/:slug/monitor - 获取监测数据
  const monitorMatch = path.match(/^\/api\/platforms\/([^\/]+)\/monitor$/);
  if (monitorMatch && method === 'GET') {
    return await getMonitorData(env, monitorMatch[1], url);
  }

  // GET /api/platforms/:slug/uptime - 获取可用率统计
  const uptimeMatch = path.match(/^\/api\/platforms\/([^\/]+)\/uptime$/);
  if (uptimeMatch && method === 'GET') {
    return await getUptimeStats(env, uptimeMatch[1], url);
  }

  // GET /api/compare - 多平台对比
  if (path === '/api/compare' && method === 'GET') {
    return await comparePlatforms(env, url);
  }

  // POST /api/reviews - 提交评价
  if (path === '/api/reviews' && method === 'POST') {
    return await submitReview(env, request);
  }

  // GET /api/stats - 获取统计数据
  if (path === '/api/stats' && method === 'GET') {
    return await getStats(env);
  }

  return errorResponse('API endpoint not found', 404);
}

// 获取所有平台
async function getPlatforms(env, url) {
  const category = url.searchParams.get('category');
  const status = url.searchParams.get('status') || '1';
  const limit = parseInt(url.searchParams.get('limit')) || 100;
  const offset = parseInt(url.searchParams.get('offset')) || 0;

  let sql = 'SELECT * FROM platforms WHERE status = ?';
  const params = [status];

  if (category) {
    sql += ' AND category = ?';
    params.push(category);
  }

  sql += ' ORDER BY sort_order ASC, rating DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const result = await env.DB.prepare(sql).bind(...params).all();

  // 解析 JSON 字段
  const platforms = result.results.map(p => ({
    ...p,
    tags: JSON.parse(p.tags || '[]'),
    models: JSON.parse(p.models || '[]'),
    payment_methods: JSON.parse(p.payment_methods || '[]'),
    features: JSON.parse(p.features || '[]')
  }));

  return jsonResponse({ success: true, data: platforms, total: platforms.length });
}

// 获取单个平台
async function getPlatform(env, slug) {
  const result = await env.DB.prepare(
    'SELECT * FROM platforms WHERE slug = ?'
  ).bind(slug).first();

  if (!result) {
    return errorResponse('Platform not found', 404);
  }

  // 获取最新监测数据
  const latestMonitor = await env.DB.prepare(`
    SELECT * FROM monitor_data 
    WHERE platform_id = ? 
    ORDER BY checked_at DESC LIMIT 1
  `).bind(result.id).first();

  // 获取30天可用率
  const uptime = await env.DB.prepare(`
    SELECT 
      AVG(uptime_percent) as avg_uptime,
      AVG(avg_response_ms) as avg_response
    FROM uptime_stats 
    WHERE platform_id = ? 
    AND date >= date('now', '-30 days')
  `).bind(result.id).first();

  const platform = {
    ...result,
    tags: JSON.parse(result.tags || '[]'),
    models: JSON.parse(result.models || '[]'),
    payment_methods: JSON.parse(result.payment_methods || '[]'),
    features: JSON.parse(result.features || '[]'),
    monitor: latestMonitor,
    uptime_30d: uptime
  };

  return jsonResponse({ success: true, data: platform });
}

// 获取监测数据
async function getMonitorData(env, slug, url) {
  const platform = await env.DB.prepare(
    'SELECT id FROM platforms WHERE slug = ?'
  ).bind(slug).first();

  if (!platform) {
    return errorResponse('Platform not found', 404);
  }

  const hours = parseInt(url.searchParams.get('hours')) || 24;
  const limit = hours * 12; // 每5分钟一次

  const result = await env.DB.prepare(`
    SELECT * FROM monitor_data 
    WHERE platform_id = ? 
    ORDER BY checked_at DESC 
    LIMIT ?
  `).bind(platform.id, limit).all();

  return jsonResponse({ success: true, data: result.results.reverse() });
}

// 获取可用率统计
async function getUptimeStats(env, slug, url) {
  const platform = await env.DB.prepare(
    'SELECT id FROM platforms WHERE slug = ?'
  ).bind(slug).first();

  if (!platform) {
    return errorResponse('Platform not found', 404);
  }

  const days = parseInt(url.searchParams.get('days')) || 30;

  const result = await env.DB.prepare(`
    SELECT * FROM uptime_stats 
    WHERE platform_id = ? 
    AND date >= date('now', '-' || ? || ' days')
    ORDER BY date DESC
  `).bind(platform.id, days).all();

  return jsonResponse({ success: true, data: result.results });
}

// 多平台对比
async function comparePlatforms(env, url) {
  const ids = url.searchParams.get('ids');
  if (!ids) {
    return errorResponse('Missing ids parameter', 400);
  }

  const idList = ids.split(',').map(id => parseInt(id)).filter(id => id);
  if (idList.length === 0 || idList.length > 4) {
    return errorResponse('Invalid ids (1-4 platforms required)', 400);
  }

  const placeholders = idList.map(() => '?').join(',');
  const result = await env.DB.prepare(
    `SELECT * FROM platforms WHERE id IN (${placeholders})`
  ).bind(...idList).all();

  const platforms = result.results.map(p => ({
    ...p,
    tags: JSON.parse(p.tags || '[]'),
    models: JSON.parse(p.models || '[]'),
    payment_methods: JSON.parse(p.payment_methods || '[]'),
    features: JSON.parse(p.features || '[]')
  }));

  return jsonResponse({ success: true, data: platforms });
}

// 提交评价
async function submitReview(env, request) {
  const body = await request.json();
  const { platform_id, rating, content, author } = body;

  if (!platform_id || !rating || rating < 1 || rating > 5) {
    return errorResponse('Invalid rating (1-5 required)', 400);
  }

  // 插入评价
  await env.DB.prepare(`
    INSERT INTO reviews (platform_id, rating, content, author)
    VALUES (?, ?, ?, ?)
  `).bind(platform_id, rating, content || '', author || '匿名用户').run();

  // 更新平台评分
  await env.DB.prepare(`
    UPDATE platforms SET 
      rating = (SELECT AVG(rating) FROM reviews WHERE platform_id = ?),
      reviews = (SELECT COUNT(*) FROM reviews WHERE platform_id = ?),
      updated_at = datetime('now')
    WHERE id = ?
  `).bind(platform_id, platform_id, platform_id).run();

  return jsonResponse({ success: true, message: 'Review submitted' });
}

// 获取统计数据
async function getStats(env) {
  const totalPlatforms = await env.DB.prepare(
    'SELECT COUNT(*) as count FROM platforms WHERE status = 1'
  ).first();

  const categoryStats = await env.DB.prepare(`
    SELECT category, COUNT(*) as count 
    FROM platforms 
    WHERE status = 1 
    GROUP BY category
  `).all();

  const avgUptime = await env.DB.prepare(`
    SELECT AVG(uptime_percent) as avg 
    FROM uptime_stats 
    WHERE date = date('now', '-1 day')
  `).first();

  return jsonResponse({
    success: true,
    data: {
      total_platforms: totalPlatforms.count,
      by_category: categoryStats.results,
      avg_uptime: avgUptime.avg || 0
    }
  });
}

// 运行监测
async function runMonitor(env) {
  console.log('Starting monitor run...');

  // 获取所有需要监测的平台
  const platforms = await env.DB.prepare(
    'SELECT id, url FROM platforms WHERE status = 1 AND url IS NOT NULL'
  ).all();

  const results = [];

  for (const platform of platforms.results) {
    try {
      const startTime = Date.now();
      const response = await fetch(platform.url, {
        method: 'HEAD',
        signal: AbortSignal.timeout(10000) // 10秒超时
      });
      const responseTime = Date.now() - startTime;

      const isUp = response.status >= 200 && response.status < 400 ? 1 : 0;

      // 插入监测数据
      await env.DB.prepare(`
        INSERT INTO monitor_data (platform_id, status_code, response_time_ms, is_up)
        VALUES (?, ?, ?, ?)
      `).bind(platform.id, response.status, responseTime, isUp).run();

      results.push({ id: platform.id, up: isUp, time: responseTime });
    } catch (error) {
      // 请求失败
      await env.DB.prepare(`
        INSERT INTO monitor_data (platform_id, status_code, response_time_ms, is_up, error_message)
        VALUES (?, ?, ?, ?, ?)
      `).bind(platform.id, 0, 0, 0, error.message).run();

      results.push({ id: platform.id, up: false, error: error.message });
    }
  }

  // 更新每日统计
  await updateDailyStats(env);

  console.log(`Monitor run completed. Checked ${results.length} platforms.`);
  return jsonResponse({ success: true, checked: results.length, results });
}

// 更新每日统计
async function updateDailyStats(env) {
  const today = new Date().toISOString().split('T')[0];

  await env.DB.prepare(`
    INSERT OR REPLACE INTO uptime_stats 
    (platform_id, date, total_checks, up_checks, avg_response_ms, min_response_ms, max_response_ms, uptime_percent)
    SELECT 
      platform_id,
      ? as date,
      COUNT(*) as total_checks,
      SUM(is_up) as up_checks,
      AVG(response_time_ms) as avg_response_ms,
      MIN(response_time_ms) as min_response_ms,
      MAX(response_time_ms) as max_response_ms,
      (SUM(is_up) * 100.0 / COUNT(*)) as uptime_percent
    FROM monitor_data
    WHERE date(checked_at) = ?
    GROUP BY platform_id
  `).bind(today, today).run();
}
