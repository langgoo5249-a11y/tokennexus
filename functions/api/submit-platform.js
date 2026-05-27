export async function onRequest(context) {
  const { request } = context;
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ success: false, message: 'Method not allowed' }), { status: 405, headers });
  }

  try {
    const raw = await request.text();
    const data = JSON.parse(raw);

    if (!data.platform_name || !data.platform_url || !data.contact_email) {
      return new Response(JSON.stringify({ success: false, message: '请填写必填字段' }), { status: 400, headers });
    }

    return new Response(JSON.stringify({ success: true, message: '提交成功！' }), { status: 200, headers });
  } catch (e) {
    return new Response(JSON.stringify({ success: false, message: 'JSON解析失败: ' + e.message }), { status: 400, headers });
  }
}
