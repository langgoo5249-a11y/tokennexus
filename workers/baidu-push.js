// Cloudflare Worker - 百度链接自动推送
// 每天自动推送网站所有链接到百度搜索引擎
// 通过 Cloudflare Cron Triggers 触发

export default {
  async scheduled(event, env, ctx) {
    const SITE = 'https://www.tokenfind.cn';
    const BAIDU_TOKEN = env.BAIDU_PUSH_TOKEN || 'zJsDaj5ibt8ZlVgz';
    const BAIDU_API = `http://data.zz.baidu.com/urls?site=${SITE}&token=${BAIDU_TOKEN}`;

    // 生成所有需要推送的URL
    const urls = generateAllUrls(SITE);
    console.log(`[百度推送] 开始推送 ${urls.length} 个URL`);

    // 分批推送（每批最多2000条）
    const batchSize = 2000;
    let totalSuccess = 0;
    let totalRemain = 0;

    for (let i = 0; i < urls.length; i += batchSize) {
      const batch = urls.slice(i, i + batchSize);
      try {
        const result = await pushToBaidu(BAIDU_API, batch);
        totalSuccess += result.success || 0;
        totalRemain = result.remain || 0;
        console.log(`[百度推送] 第${Math.floor(i / batchSize) + 1}批: 成功${result.success || 0}条, 剩余配额${result.remain || 0}`);
      } catch (e) {
        console.log(`[百度推送] 第${Math.floor(i / batchSize) + 1}批失败: ${e.message}`);
      }
    }

    console.log(`[百度推送] 完成! 总成功: ${totalSuccess}, 剩余配额: ${totalRemain}`);
    return new Response(JSON.stringify({ success: true, total: urls.length, pushed: totalSuccess, remain: totalRemain }));
  },

  // 手动触发（GET请求）
  async fetch(request, env, ctx) {
    if (request.method === 'GET') {
      return this.scheduled({}, env, ctx);
    }
    return new Response('Method not allowed', { status: 405 });
  }
};

// 生成所有URL
function generateAllUrls(site) {
  const urls = [];

  // 主要页面
  const mainPages = [
    '/', '/official.html', '/aggregator.html', '/china.html',
    '/about.html', '/contact.html', '/business.html',
    '/submit.html', '/privacy.html', '/terms.html'
  ];
  mainPages.forEach(p => urls.push(`${site}${p}`));

  // 平台详情页（从KV或硬编码列表获取）
  const platforms = getPlatformList();
  platforms.forEach(slug => urls.push(`${site}/platform/${slug}.html`));

  return urls;
}

// 平台列表（与网站保持同步）
function getPlatformList() {
  return [
    'openai','anthropic-claude','google-gemini','deepseek','azure-openai',
    'aws-bedrock','mistral-ai','cohere','ai21-labs','perplexity-ai',
    'groq','together-ai','anyscale','fireworks-ai','replicate',
    'hugging-face','stability-ai','midjourney-api','runway-ml','elevenlabs',
    'assemblyai','whisper-api','cartesia-ai','suno-ai','heygen',
    'cerebras','modal','baseten','beam','banana-dev',
    'clarifai','aleph-alpha','aihubmix','api2d','ohmygpt',
    'chatany','wildcard','closeai','chatgpt-next','gpt-api',
    'ai-mix','allapi-ai','newapi','one-api','chatgpt-free',
    'chimeragpt','free-gpt','gptgod','poe-api','forefront-api',
    'you-com','phind','duckduckgo-ai','bing-chat','copilot-api',
    'chutes-ai','pawan-osin','koboldai','textsynth','inferless',
    'cerebrium','lepton-ai','octoai','lightning-ai','brev-dev',
    '360智脑','阿里云百炼','百度千帆','腾讯混元','字节豆包',
    '通义千问','文心一言','智谱glm','月之暗面api','minimax',
    '零一万物','百川智能','讯飞星火','商汤日日新','昆仑万维天工',
    '阶跃星辰','深度求索','小红书ai','即梦ai','腾讯混元图像',
    '通义万相','知乎知海图ai','soulapp-ai','360智脑api','华为盘古',
    '金山wps-ai','网易有道子曰','联想ai','荣耀ai','oppo-ai',
    'vivo-ai','小米ai','商汤如影','出门问问','硅基智能',
    '澜码科技','实在智能','容联云','容联七陌','智齿科技',
    '网易七鱼','小能科技','乐言科技','追一科技','竹间智能',
    '循环智能','百应科技','深兰科技','云从科技','依图科技',
    '旷视科技','商汤科技','科大讯飞','思必驰','出门问问-ai',
    '蓦然认知','三角兽','奇点机智','助理来也','微软小冰',
    '百度unit','阿里云nls','腾讯云nlp','华为云nlp','京东ai',
    '拼多多ai','美团ai','滴滴ai','字节ai','快手ai',
    '哔哩哔哩ai','知乎ai','微博ai','豆瓣ai','淘宝ai',
    '京东ai-api','拼多多ai-api','美团ai-api','滴滴ai-api',
    '字节ai-api','快手ai-api','bilibili-ai','zhihu-ai','weibo-ai',
    'douban-ai','taobao-ai','openrouter','novita-ai','deepinfra',
    'openrouter-api','poekemon','shuttleai','shuttleai-api','zukijourney',
    'g4f-api','free-chatgpt','chatgpt-free-api','freeapi','chatapi',
    'ai365','ai365-api','chatgpt-api-free','gpt-free-api','free-gpt4',
    'claude-free','gemini-free','deepseek-free','qwen-free','glm-free',
    'api-mix','mix-api','ai-hub','ai-park','api-park',
    'apipark','ai-api','gpt-api-hub','token-api','key-api',
    'free-api','open-api','ai-gateway','llm-gateway','model-api',
    'chat-api','bot-api','agent-api','rag-api','embedding-api',
    'tts-api','stt-api','vision-api','image-api','video-api',
    'code-api','search-api','translate-api','summary-api','rewrite-api'
  ];
}

// 推送到百度
async function pushToBaidu(apiUrl, urls) {
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: urls.join('\n')
  });
  return await response.json();
}
