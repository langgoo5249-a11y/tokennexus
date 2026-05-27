/**
 * TokenNexus 访问计数 Worker
 * 使用 Cloudflare KV 存储访问量
 */

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

/**
 * 处理请求
 */
async function handleRequest(request) {
  const url = new URL(request.url);
  
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
  
  // Handle OPTIONS for CORS
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  // API endpoints
  if (url.pathname === '/api/visit') {
    return await handleVisit(corsHeaders);
  }
  
  if (url.pathname === '/api/stats') {
    return await handleStats(corsHeaders);
  }
  
  // Default response
  return new Response('TokenNexus Visit Counter API', {
    headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
  });
}

/**
 * 处理访问请求 - 增加计数
 */
async function handleVisit(corsHeaders) {
  try {
    // 获取当前计数
    const currentCount = await VISIT_KV.get('total_visits') || '0';
    const newCount = parseInt(currentCount) + 1;
    
    // 存储新计数
    await VISIT_KV.put('total_visits', newCount.toString());
    
    // 同时记录今日访问
    const today = new Date().toISOString().split('T')[0];
    const todayKey = 'visits_' + today;
    const todayCount = await VISIT_KV.get(todayKey) || '0';
    await VISIT_KV.put(todayKey, (parseInt(todayCount) + 1).toString());
    
    return new Response(JSON.stringify({
      success: true,
      total: newCount,
      today: parseInt(todayCount) + 1
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

/**
 * 处理统计查询 - 只读取计数
 */
async function handleStats(corsHeaders) {
  try {
    const totalVisits = await VISIT_KV.get('total_visits') || '0';
    
    // 获取今日访问
    const today = new Date().toISOString().split('T')[0];
    const todayKey = 'visits_' + today;
    const todayVisits = await VISIT_KV.get(todayKey) || '0';
    
    return new Response(JSON.stringify({
      success: true,
      total: parseInt(totalVisits),
      today: parseInt(todayVisits)
    }), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      total: 0,
      error: error.message
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}