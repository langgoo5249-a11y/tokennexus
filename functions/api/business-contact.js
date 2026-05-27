/**
 * TokenNexus - 商务合作提交 API
 * Cloudflare Pages Function
 */
export async function onRequest(context) {
  const { request } = context;
  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
  
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405, headers: corsHeaders
    });
  }
  
  try {
    const body = await request.text();
    if (!body) {
      return new Response(JSON.stringify({ success: false, message: '请提供JSON数据' }), {
        status: 400, headers: corsHeaders
      });
    }
    
    let data;
    try { data = JSON.parse(body); } catch (e) {
      return new Response(JSON.stringify({ success: false, message: '无效的JSON格式' }), {
        status: 400, headers: corsHeaders
      });
    }
    
    if (!data.company_name || !data.contact_name || !data.contact_email) {
      return new Response(JSON.stringify({ 
        success: false, message: '请填写必填字段（公司名称、联系人、联系邮箱）'
      }), { status: 400, headers: corsHeaders });
    }
    
    return new Response(JSON.stringify({ 
      success: true, message: '提交成功！我们会尽快与您联系。'
    }), { status: 200, headers: corsHeaders });
    
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, message: '服务器内部错误'
    }), { status: 500, headers: corsHeaders });
  }
}
