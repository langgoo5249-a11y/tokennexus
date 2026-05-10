# TokenNexus 域名配置指南

## 当前状态
- 域名已购买: `tokenfind.cn`
- 目标: 配置 `www.tokenfind.cn` 指向 Cloudflare Pages

## 配置步骤

### 步骤1: Cloudflare Pages 添加自定义域名

1. 登录 Cloudflare Dashboard
2. 进入 Pages 项目 (tokennexus)
3. 点击 "自定义域" (Custom Domains)
4. 点击 "设置自定义域"
5. 输入: `www.tokenfind.cn`
6. 点击 "继续"

### 步骤2: DNS 配置

在 tokenfind.cn 的 DNS 管理中添加以下记录:

```
类型    名称    目标                        TTL
CNAME   www     tokennexus.pages.dev        自动
```

或者使用 A 记录（如果 Cloudflare 提供了 IP）:
```
类型    名称    目标                        TTL
A       www     192.0.2.1                   自动
```

### 步骤3: 根域名重定向 (可选但推荐)

让 `tokenfind.cn` 自动跳转到 `www.tokenfind.cn`:

```
类型    名称    目标                        TTL
CNAME   @       www.tokenfind.cn            自动
```

或者在 Pages 设置中开启 "根域名重定向"。

### 步骤4: 验证配置

配置完成后，验证以下URL是否正常:

```bash
# 测试网站访问
curl -I https://www.tokenfind.cn/

# 测试OG图片
curl -I https://www.tokenfind.cn/og-image.png

# 测试301重定向 (pages.dev → www)
curl -I https://tokennexus.pages.dev/
```

## 已完成的代码配置

以下配置已在代码中完成，无需手动修改:

### 1. Canonical URL
```html
<link rel="canonical" href="https://www.tokenfind.cn/">
```

### 2. Open Graph
```html
<meta property="og:url" content="https://www.tokenfind.cn/">
<meta property="og:image" content="https://www.tokenfind.cn/og-image.png">
```

### 3. Sitemap
```xml
<loc>https://www.tokenfind.cn/</loc>
```

### 4. 301 重定向规则 (_redirects)
```
# 根域名 → www
https://tokenfind.cn/* https://www.tokenfind.cn/:splat 301

# pages.dev → www
https://tokennexus-*.pages.dev/* https://www.tokenfind.cn/:splat 301
https://tokennexus.pages.dev/* https://www.tokenfind.cn/:splat 301

# 旧域名 → www
https://tokennexus.skillxm.cn/* https://www.tokenfind.cn/:splat 301
```

## 配置生效时间

- DNS 传播: 通常 5-30 分钟
- SSL 证书签发: 通常 1-5 分钟
- 完全生效: 最长 24 小时

## 故障排查

### 问题1: 访问 www.tokenfind.cn 显示 404
**解决**: 检查 Cloudflare Pages 中是否已添加 `www.tokenfind.cn` 为自定义域

### 问题2: og-image.png 返回 404
**解决**: 确保文件已上传到 Pages，路径为 `/og-image.png`

### 问题3: SSL 证书错误
**解决**: 等待 Cloudflare 自动签发证书，或手动在 SSL/TLS 设置中点击"刷新"

## 配置完成后验证清单

- [ ] https://www.tokenfind.cn/ 正常访问
- [ ] https://www.tokenfind.cn/og-image.png 正常显示
- [ ] https://tokennexus.pages.dev/ 301 跳转到 www.tokenfind.cn
- [ ] 微信/微博分享显示预览图
- [ ] 百度/谷歌搜索收录正常
