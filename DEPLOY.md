# Cloudflare Pages 部署配置

## 手动设置步骤（只需一次）

### 1. 打开 Cloudflare Dashboard
访问: https://dash.cloudflare.com/pages

### 2. 创建项目
1. 点击 **Create a project**
2. 选择 **Connect to Git**
3. 授权 GitHub 账户
4. 选择仓库 `jm6-lang/token`
5. 设置:
   - **Project name**: `token`
   - **Production branch**: `main`
   - **Build command**: (留空)
   - **Build output directory**: `/`
6. 点击 **Save and Deploy**

### 3. 完成！
以后每次推送到 GitHub，Cloudflare 会自动部署。

## 部署后访问地址
你的网站将部署在: `https://token.pages.dev`

## 手动部署命令（备用）
如果 GitHub 集成失败，可以手动部署:

```bash
# 安装 wrangler
npm install -g wrangler

# 设置 token
export CLOUDFLARE_API_TOKEN="your_token"

# 手动部署
wrangler pages deploy . --project-name=token
```
