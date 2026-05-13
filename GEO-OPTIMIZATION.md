# TokenNexus GEO地理位置优化指南

## 什么是GEO？
GEO（Geographic Optimization）是通过地理位置信息优化网站在特定地区的搜索可见性。

## 主要搜索引擎的GEO设置

### Google
- 使用 `geo.region`、`geo.placename`、`geo.position` meta标签
- 添加地理位置结构化数据

### 百度
- 使用 `<meta name="location" content="province=北京;city=北京">`
- 在百度搜索资源平台设置地域标签

### Yandex
- 使用 `<meta name="geo.position" content="latitude;longitude">`

## 我们的GEO优化措施

### 1. HTML层面
- `<meta name="geo.region" content="CN">` - 中国区域
- `<meta name="geo.placename" content="Global">` - 全球服务

### 2. 目标市场
- 主要市场：中国大陆
- 次要市场：东南亚（越南、泰国、印尼、马来西亚、菲律宾）
- 海外市场：英语、日语、韩语、西班牙语社区

### 3. 结构化数据
- 添加LocalBusiness schema（针对中国市场）
- 添加Place schema（服务覆盖范围）

## 百度GEO设置

请在百度搜索资源平台设置：
1. 登录 https://ziyuan.baidu.com
2. 选择站点 tokenfind.cn
3. 站点属性 → 地域设置
4. 选择"全球"或具体省市

## Google Business Profile（可选）

如果需要更强的本地SEO效果：
1. 创建Google Business Profile
2. 添加实体地址
3. 添加联系电话
4. 设置营业时间
