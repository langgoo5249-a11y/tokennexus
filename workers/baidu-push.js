// Cloudflare Worker - 百度链接自动推送
// 每天北京时间09:00自动推送网站所有链接到百度搜索引擎

const SITE = 'https://www.tokenfind.cn';
const BAIDU_TOKEN = typeof env !== 'undefined' && env.BAIDU_TOKEN ? env.BAIDU_TOKEN : 'zJsDaj5ibt8ZlVgz';
const BAIDU_API = `http://data.zz.baidu.com/urls?site=${SITE}&token=${BAIDU_TOKEN}`;

const PLATFORM_SLUGS = [
"360智脑","4s-api","ai--api","ai-hk","ai-mix","ai-ml-api","ai21-labs","aihubmix","aleph-alpha","allapi-ai","anthropic-claude","anyai","anyscale","api","api2d","apipark","api易","assemblyai","aws-bedrock","azure-openai","banana-dev","baseten-更新","baseten","beam","cartesia-ai","cerebras","cerebrium","chatany","chatgpt-free","chimeragpt","chutes-ai","clarifai","claude2api","closeai","cloudflare-workers-ai","cohere-embed","cohere","coreweave","databricks-mosaicml","datapaas","deepgram","deepinfra","deepseek","digitalocean-genai","dmxapi","elevenlabs","fal-ai","fireworks-ai","freegpt4","getgoapi","getgpt","github-models","glean","glm","globalai","gmi-cloud","google-ai-studio","google-gemini","gpt4free","gradient-ai","groq","helicone","heygen","hugging-face","huggingface-inference","hume-ai","ibm-watsonx","ideogram","inference-net","inflection-ai","internlm","jina-ai","kfcv50api","kimi","lambda-labs","lamini","langbase","langchain","leonardo-ai","lepton-ai","litellm","lovo-ai","meta-llama","midjourney-api","mimo","minimax","mistral-ai","mistral-embed","mnapi","modal","modelscope","modelslab","n1n-ai","nebius-ai","new-api","nomic-ai","novita-ai","nvidia-nim","octoai","ohmygpt","ollama","oneconnect-platform","openai","openailabs","openrouter","parasail","pawan-osint","perplexity-ai","perplexity","platform-34","platform-35","platform-36","platform-37","platform-38","platform-42","platform-43","platform-44","platform-45","platform-48","platform-49","platform-55","playht","portkey","predibase","reka-ai","replicate-更新","replicate","runpod","sambanova","scaleway","segmind","shuttleai","siliconflow","snowflake-cortex-ai","soulapp-ai","speechmatics","stability-ai","suno-ai","synthesia","tavus","thunder-compute","together-ai","tokenapi","triton-inference-server","udio","uiuiapi","uiuiapi聚合平台","unify","vast-ai","vllm","voyage-ai","wavespeedai","wildcard","wps-ai","writer","xai-grok","xinliu","yourapi","zukijourney","七牛云ai","中国科技云ai","书生-internlm","云知声山海","便携ai聚合api","出门问问序列猴子","华为云盘古","即梦ai","商汤日日新","商汤科技","壁仞科技","天工ai","天数智芯","字节豆包","小米-mimo","小红书ai","幂简集成","循环智能","心流-xinliu","快手万擎","思必驰dui","拓尔思","摩尔线程","文心一格","无问芯穹","昆仑万维天工","星环科技","星链4s-api","智谱-glm","智谱ai","月之暗面-kimi","月之暗面api","沐曦intellilux","海光信息","海天瑞声","深度求索api","澜舟科技孟子","火山引擎豆包api","燧原科技","白山云ai","百川智能","百应科技","百度千帆","知乎知海图ai","硅基流动-siliconflow","神马中转api","竹间智能","第四范式","简易api","网易七鱼","网易有道子曰","老张api","腾讯混元","腾讯混元图像","蚂蚁百灵","讯飞星火","诗云api","达观数据","追一科技aiforce","通义万相","金山办公-wps-ai","阶跃星辰","阿里云百炼","零一万物","魔搭社区-modelscope"
];

const MAIN_PAGES = [
  '/', '/official.html', '/aggregator.html', '/china.html',
  '/about.html', '/contact.html', '/business.html',
  '/submit.html', '/privacy.html', '/terms.html'
];

function generateAllUrls() {
  const urls = MAIN_PAGES.map(p => SITE + p);
  PLATFORM_SLUGS.forEach(slug => urls.push(SITE + '/platform/' + slug + '.html'));
  return urls;
}

async function pushToBaidu(urls) {
  const response = await fetch(BAIDU_API, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: urls.join('\n')
  });
  return await response.json();
}

export default {
  async scheduled(event, env, ctx) {
    const urls = generateAllUrls();
    console.log('[百度推送] 开始推送 ' + urls.length + ' 个URL');

    const batchSize = 2000;
    let totalSuccess = 0;
    let totalRemain = 0;

    for (let i = 0; i < urls.length; i += batchSize) {
      const batch = urls.slice(i, i + batchSize);
      try {
        const result = await pushToBaidu(batch);
        totalSuccess += result.success || 0;
        totalRemain = result.remain || 0;
        console.log('[百度推送] 第' + (Math.floor(i / batchSize) + 1) + '批: 成功' + (result.success || 0) + '条, 剩余配额' + (result.remain || 0));
      } catch (e) {
        console.log('[百度推送] 第' + (Math.floor(i / batchSize) + 1) + '批失败: ' + e.message);
      }
    }

    console.log('[百度推送] 完成! 总成功: ' + totalSuccess + ', 剩余配额: ' + totalRemain);
  },

  async fetch(request, env, ctx) {
    if (request.method === 'GET') {
      const urls = generateAllUrls();
      const result = await pushToBaidu(urls);
      return new Response(JSON.stringify({
        success: true,
        total: urls.length,
        pushed: result.success || 0,
        remain: result.remain || 0,
        time: new Date().toISOString()
      }), { headers: { 'Content-Type': 'application/json' } });
    }
    return new Response('Method not allowed', { status: 405 });
  }
};
