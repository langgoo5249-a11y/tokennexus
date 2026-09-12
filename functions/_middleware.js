// functions/_middleware.js
//
// P1-5: 下线 tokennexus.pages.dev 镜像 —— 所有 .pages.dev 访问 301 到主域。
// 为什么用 middleware 而不是 _redirects：CF Pages 的 _redirects 规则不按 host
// 区分，"https://tokennexus.pages.dev/*" 写法无效（实测 200 返回主站镜像）。
// middleware 在请求到达 Pages 运行时时执行，可靠地按 URL.hostname 判断。
//
// 影响：所有命中 Pages 运行时的请求都会跑一次 onRequest（极轻量）。
// Pages 默认对静态 HTML 已 DYNAMIC 走运行时，因此本次只是再增一次
// JS 入口判断，TTFB 增加 < 1ms，可忽略。
export async function onRequest(context) {
  const url = new URL(context.request.url);
  if (url.hostname.endsWith(".pages.dev")) {
    const target = "https://www.tokenfind.cn" + url.pathname + url.search;
    return Response.redirect(target, 301);
  }
  return context.next();
}