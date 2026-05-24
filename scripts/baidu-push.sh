#!/bin/bash

# 百度URL推送脚本
# 每天自动推送网站核心页面到百度

SITE="https://www.tokenfind.cn"
TOKEN="zJsDaj5ibt8ZlVgz"
PUSH_URL="http://data.zz.baidu.com/urls?site=${SITE}&token=${TOKEN}"

# 日志文件
LOG_FILE="/workspace/token-nav/logs/baidu-push.log"
mkdir -p "$(dirname "$LOG_FILE")"

# 获取当前日期
DATE=$(date '+%Y-%m-%d %H:%M:%S')

echo "[$DATE] 开始执行百度URL推送..." >> "$LOG_FILE"

# 定义要推送的URL列表（核心页面）
URLS=(
    "https://www.tokenfind.cn/"
    "https://www.tokenfind.cn/index.html"
    "https://www.tokenfind.cn/blog/guides.html"
    "https://www.tokenfind.cn/blog/free-ai-api-guide-2026.html"
    "https://www.tokenfind.cn/blog/ai-model-routing-guide-2026.html"
    "https://www.tokenfind.cn/blog/ai-api-pricing-comparison-guide-2025.html"
    "https://www.tokenfind.cn/blog/china-api-transit-platform-guide.html"
    "https://www.tokenfind.cn/official.html"
    "https://www.tokenfind.cn/aggregator.html"
    "https://www.tokenfind.cn/china.html"
)

# 将URL列表转换为换行分隔的字符串
URL_STRING=$(printf "%s\n" "${URLS[@]}")

# 调用百度推送接口
RESPONSE=$(curl -s -H 'Content-Type:text/plain' --data-binary "$URL_STRING" "$PUSH_URL")

# 记录响应
echo "[$DATE] 推送结果: $RESPONSE" >> "$LOG_FILE"

# 解析响应结果
REMAIN=$(echo "$RESPONSE" | grep -o '"remain":[0-9]*' | cut -d':' -f2)
SUCCESS=$(echo "$RESPONSE" | grep -o '"success":[0-9]*' | cut -d':' -f2)

if [ -n "$SUCCESS" ] && [ "$SUCCESS" -gt 0 ]; then
    echo "[$DATE] 推送成功: $SUCCESS 个URL, 剩余配额: $REMAIN" >> "$LOG_FILE"
    exit 0
else
    echo "[$DATE] 推送失败或配额已用完" >> "$LOG_FILE"
    exit 1
fi
