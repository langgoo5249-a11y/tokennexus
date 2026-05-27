/**
 * TokenNexus - 商务合作提交 API
 * Cloudflare Pages Function
 * 
 * POST /api/business-contact
 * 接收商务合作咨询并发送邮件通知
 */
export async function onRequest(context) {
  const { request } = context;
  
  // 仅接受 POST 请求
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
  
  try {
    const data = await request.json();
    
    // 验证必填字段
    if (!data.company_name || !data.contact_name || !data.contact_email) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: '请填写必填字段（公司名称、联系人、联系邮箱）' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }
    
    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.contact_email)) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: '请输入有效的邮箱地址' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }
    
    // TODO: 在这里添加实际的存储/通知逻辑
    // 例如：发送邮件到 support@tokenfind.cn
    // 或者存储到 Cloudflare KV
    
    console.log('New business inquiry:', JSON.stringify(data, null, 2));
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: '提交成功！我们会尽快与您联系。' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
    
  } catch (error) {
    console.error('Business contact error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: '提交失败，请稍后重试' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}
