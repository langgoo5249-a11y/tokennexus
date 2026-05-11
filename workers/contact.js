// TokenNexus Contact Worker
// 处理提交收录和商务合作表单，通过 Cloudflare Email Workers 发送邮件

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // CORS 预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // 提交收录 API
    if (url.pathname === '/api/submit-platform' && request.method === 'POST') {
      return await handleSubmitPlatform(request, env);
    }

    // 商务合作 API
    if (url.pathname === '/api/business-contact' && request.method === 'POST') {
      return await handleBusinessContact(request, env);
    }

    return new Response(JSON.stringify({ error: '未找到接口' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  },
};

// 验证表单数据
function validateRequired(data, fields) {
  for (const field of fields) {
    if (!data[field] || data[field].trim() === '') {
      return { valid: false, missing: field };
    }
  }
  return { valid: true };
}

// 安全检查：防止XSS和注入
function sanitize(str) {
  return str.replace(/[<>'"&]/g, (c) => ({
    '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;', '&': '&amp;'
  }[c])).trim().slice(0, 500);
}

// 发送邮件（通过 Cloudflare Email Workers）
async function sendEmail(env, subject, htmlContent) {
  try {
    // 方式1: 使用 Cloudflare Email Routing 的 send_email API
    if (env.EMAIL) {
      await env.EMAIL.send({
        from: 'noreply@tokenfind.cn',
        to: 'admin@tokenfind.cn',
        subject: subject,
        html: htmlContent,
      });
      return true;
    }
    
    // 方式2: 如果没有 Email Worker，记录到日志（需要配置 D1 或 KV 存储）
    console.log('Email would be sent:', subject);
    console.log('Content:', htmlContent);
    
    // 方式3: 使用 Cloudflare Email Routing 转发
    // 需要在 Cloudflare Dashboard 中配置 Email Routing
    // 将 noreply@tokenfind.cn 转发到 admin@tokenfind.cn
    return true;
  } catch (error) {
    console.error('发送邮件失败:', error);
    return false;
  }
}

// 处理提交收录
async function handleSubmitPlatform(request, env) {
  try {
    const data = await request.json();
    
    // 验证必填字段
    const validation = validateRequired(data, ['platform_name', 'platform_url', 'contact_email']);
    if (!validation.valid) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: `请填写必填字段：${validation.missing}` 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    // 安全清理
    const platformName = sanitize(data.platform_name);
    const platformUrl = sanitize(data.platform_url);
    const contactEmail = sanitize(data.contact_email);
    const contactName = sanitize(data.contact_name || '');
    const description = sanitize(data.description || '');
    const category = sanitize(data.category || '未指定');
    const pricing = sanitize(data.pricing || '');
    const models = sanitize(data.models || '');
    const message = sanitize(data.message || '');

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactEmail)) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: '请输入正确的邮箱地址' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    // 验证URL格式
    try {
      new URL(platformUrl);
    } catch {
      return new Response(JSON.stringify({ 
        success: false, 
        message: '请输入正确的网站URL（需包含 https://）' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    // 构建邮件内容
    const subject = `【平台收录申请】${platformName}`;
    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <div style="background: linear-gradient(135deg, #00f0ff, #b829dd); padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: #fff; margin: 0; font-size: 24px;">🆕 平台收录申请</h1>
        </div>
        <div style="background: #fff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 12px 12px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px; background: #f8f9fa; font-weight: 600; width: 120px; border: 1px solid #e0e0e0;">平台名称</td>
              <td style="padding: 12px; border: 1px solid #e0e0e0;">${platformName}</td>
            </tr>
            <tr>
              <td style="padding: 12px; background: #f8f9fa; font-weight: 600; border: 1px solid #e0e0e0;">平台网址</td>
              <td style="padding: 12px; border: 1px solid #e0e0e0;"><a href="${platformUrl}" style="color: #0066cc;">${platformUrl}</a></td>
            </tr>
            <tr>
              <td style="padding: 12px; background: #f8f9fa; font-weight: 600; border: 1px solid #e0e0e0;">平台分类</td>
              <td style="padding: 12px; border: 1px solid #e0e0e0;">${category}</td>
            </tr>
            <tr>
              <td style="padding: 12px; background: #f8f9fa; font-weight: 600; border: 1px solid #e0e0e0;">联系人</td>
              <td style="padding: 12px; border: 1px solid #e0e0e0;">${contactName || '未填写'}</td>
            </tr>
            <tr>
              <td style="padding: 12px; background: #f8f9fa; font-weight: 600; border: 1px solid #e0e0e0;">联系邮箱</td>
              <td style="padding: 12px; border: 1px solid #e0e0e0;"><a href="mailto:${contactEmail}" style="color: #0066cc;">${contactEmail}</a></td>
            </tr>
            ${description ? `
            <tr>
              <td style="padding: 12px; background: #f8f9fa; font-weight: 600; border: 1px solid #e0e0e0;">平台描述</td>
              <td style="padding: 12px; border: 1px solid #e0e0e0;">${description}</td>
            </tr>` : ''}
            ${pricing ? `
            <tr>
              <td style="padding: 12px; background: #f8f9fa; font-weight: 600; border: 1px solid #e0e0e0;">价格信息</td>
              <td style="padding: 12px; border: 1px solid #e0e0e0;">${pricing}</td>
            </tr>` : ''}
            ${models ? `
            <tr>
              <td style="padding: 12px; background: #f8f9fa; font-weight: 600; border: 1px solid #e0e0e0;">支持模型</td>
              <td style="padding: 12px; border: 1px solid #e0e0e0;">${models}</td>
            </tr>` : ''}
            ${message ? `
            <tr>
              <td style="padding: 12px; background: #f8f9fa; font-weight: 600; border: 1px solid #e0e0e0;">补充说明</td>
              <td style="padding: 12px; border: 1px solid #e0e0e0;">${message}</td>
            </tr>` : ''}
          </table>
          <div style="margin-top: 20px; padding-top: 15px; border-top: 2px solid #f0f0f0; font-size: 12px; color: #999; text-align: center;">
            提交时间：${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}<br>
            来自 TokenNexus 收录申请系统
          </div>
        </div>
      </div>
    `;

    // 发送邮件
    const emailSent = await sendEmail(env, subject, htmlContent);

    return new Response(JSON.stringify({ 
      success: true, 
      message: emailSent ? '提交成功！我们将在1-3个工作日内审核并回复您。' : '提交成功！我们已收到您的申请。' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      message: '提交失败，请稍后重试。错误：' + error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}

// 处理商务合作
async function handleBusinessContact(request, env) {
  try {
    const data = await request.json();
    
    // 验证必填字段
    const validation = validateRequired(data, ['contact_name', 'contact_email', 'company_name', 'inquiry_type']);
    if (!validation.valid) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: `请填写必填字段：${validation.missing}` 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    // 安全清理
    const contactName = sanitize(data.contact_name);
    const contactEmail = sanitize(data.contact_email);
    const companyName = sanitize(data.company_name);
    const inquiryType = sanitize(data.inquiry_type);
    const phone = sanitize(data.phone || '');
    const website = sanitize(data.website || '');
    const budget = sanitize(data.budget || '');
    const message = sanitize(data.message || '');

    // 验证邮箱
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactEmail)) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: '请输入正确的邮箱地址' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    // 合作类型映射
    const inquiryTypeMap = {
      'advertising': '广告投放',
      'partnership': '战略合作',
      'data_exchange': '数据交换',
      'api_integration': 'API对接',
      'listing_priority': '优先收录',
      'other': '其他'
    };
    const inquiryLabel = inquiryTypeMap[inquiryType] || inquiryType;

    // 构建邮件
    const subject = `【商务合作】${inquiryLabel} - ${companyName}`;
    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <div style="background: linear-gradient(135deg, #b829dd, #ff6b6b); padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: #fff; margin: 0; font-size: 24px;">🤝 商务合作咨询</h1>
        </div>
        <div style="background: #fff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 12px 12px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px; background: #f8f9fa; font-weight: 600; width: 120px; border: 1px solid #e0e0e0;">合作类型</td>
              <td style="padding: 12px; border: 1px solid #e0e0e0;"><span style="background: #f0e6ff; padding: 4px 12px; border-radius: 12px; font-size: 14px;">${inquiryLabel}</span></td>
            </tr>
            <tr>
              <td style="padding: 12px; background: #f8f9fa; font-weight: 600; border: 1px solid #e0e0e0;">公司名称</td>
              <td style="padding: 12px; border: 1px solid #e0e0e0;">${companyName}</td>
            </tr>
            <tr>
              <td style="padding: 12px; background: #f8f9fa; font-weight: 600; border: 1px solid #e0e0e0;">联系人</td>
              <td style="padding: 12px; border: 1px solid #e0e0e0;">${contactName}</td>
            </tr>
            <tr>
              <td style="padding: 12px; background: #f8f9fa; font-weight: 600; border: 1px solid #e0e0e0;">联系邮箱</td>
              <td style="padding: 12px; border: 1px solid #e0e0e0;"><a href="mailto:${contactEmail}" style="color: #0066cc;">${contactEmail}</a></td>
            </tr>
            ${phone ? `
            <tr>
              <td style="padding: 12px; background: #f8f9fa; font-weight: 600; border: 1px solid #e0e0e0;">联系电话</td>
              <td style="padding: 12px; border: 1px solid #e0e0e0;">${phone}</td>
            </tr>` : ''}
            ${website ? `
            <tr>
              <td style="padding: 12px; background: #f8f9fa; font-weight: 600; border: 1px solid #e0e0e0;">公司网站</td>
              <td style="padding: 12px; border: 1px solid #e0e0e0;"><a href="${website}" style="color: #0066cc;">${website}</a></td>
            </tr>` : ''}
            ${budget ? `
            <tr>
              <td style="padding: 12px; background: #f8f9fa; font-weight: 600; border: 1px solid #e0e0e0;">预算范围</td>
              <td style="padding: 12px; border: 1px solid #e0e0e0;">${budget}</td>
            </tr>` : ''}
            <tr>
              <td style="padding: 12px; background: #f8f9fa; font-weight: 600; border: 1px solid #e0e0e0;">合作详情</td>
              <td style="padding: 12px; border: 1px solid #e0e0e0;">${message || '未填写'}</td>
            </tr>
          </table>
          <div style="margin-top: 20px; padding-top: 15px; border-top: 2px solid #f0f0f0; font-size: 12px; color: #999; text-align: center;">
            提交时间：${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}<br>
            来自 TokenNexus 商务合作系统
          </div>
        </div>
      </div>
    `;

    const emailSent = await sendEmail(env, subject, htmlContent);

    return new Response(JSON.stringify({ 
      success: true, 
      message: emailSent ? '提交成功！我们将在1个工作日内与您联系。' : '提交成功！我们已收到您的咨询。' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      message: '提交失败，请稍后重试。错误：' + error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}
