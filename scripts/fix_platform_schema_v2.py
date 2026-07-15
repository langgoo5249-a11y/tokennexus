#!/usr/bin/env python3
"""批量修复平台页面 Product JSON-LD Schema 缺失字段 — v2 (修复 24 个失败)"""
import os, re, json
from datetime import datetime

PLATFORM_DIR = "/workspace/tokennexus/platform"

def find_product_jsonld(html):
    """找到包含 Product 的 JSON-LD script 块"""
    # 匹配每个独立的 script 块
    script_pattern = re.compile(
        r'<script\s+type="application/ld\+json">\s*(.*?)\s*</script>',
        re.DOTALL
    )
    for m in script_pattern.finditer(html):
        inner = m.group(1).strip()
        if '"@type"' in inner and '"Product"' in inner:
            # 用括号匹配找到正确的 JSON 边界
            start = m.start(1)
            # 从第一个 { 开始匹配
            brace_start = inner.index('{')
            actual_start = start + brace_start
            depth = 0
            end = actual_start
            for i, c in enumerate(html[actual_start:], actual_start):
                if c == '{': depth += 1
                elif c == '}': depth -= 1
                if depth == 0:
                    end = i + 1
                    break
            json_str = html[actual_start:end]
            return m.group(0), json_str, actual_start, end
    return None, None, None, None

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()

    og_img = re.search(r'<meta\s+property="og:image"\s+content="([^"]+)"', html)
    if not og_img:
        return False, "no og:image"
    image_url = og_img.group(1)

    old_block, json_str, start, end = find_product_jsonld(html)
    if not old_block:
        return False, "no Product JSON-LD"

    if '"image"' in json_str:
        return False, "already has image"

    try:
        data = json.loads(json_str)
    except json.JSONDecodeError as e:
        return False, f"JSON parse error: {e}"

    data["image"] = image_url

    if "offers" in data and isinstance(data["offers"], dict):
        offer = data["offers"]
        if "shippingDetails" not in offer:
            offer["shippingDetails"] = {
                "@type": "OfferShippingDetails",
                "shippingRate": {"@type": "MonetaryAmount", "value": "0", "currency": "USD"},
                "shippingDestination": {"@type": "DefinedRegion", "addressCountry": "CN"},
                "deliveryTime": {"@type": "ShippingDeliveryTime",
                    "handlingTime": {"@type": "QuantitativeValue", "minValue": 0, "maxValue": 0, "unitCode": "DAY"}}
            }
        if "hasMerchantReturnPolicy" not in offer:
            offer["hasMerchantReturnPolicy"] = {
                "@type": "MerchantReturnPolicy",
                "returnPolicyCategory": "https://schema.org/MerchantReturnNotApplicable",
                "merchantReturnDays": 0,
                "returnMethod": "https://schema.org/ReturnNotApplicable",
                "returnFees": "https://schema.org/FreeReturn"
            }

    new_json = json.dumps(data, ensure_ascii=False, indent=4)
    new_block = f'    <script type="application/ld+json">\n    {new_json}\n    </script>'
    html = html.replace(old_block, new_block, 1)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html)

    return True, f"image={image_url.split('/')[-1]}"

def main():
    print(f"平台页面 Product JSON-LD Schema 修复 v2")
    print("=" * 60)

    files = sorted([f for f in os.listdir(PLATFORM_DIR) if f.endswith('.html')])
    fixed, skipped, errors = 0, 0, []

    for f in files:
        fp = os.path.join(PLATFORM_DIR, f)
        ok, msg = fix_file(fp)
        if ok:
            fixed += 1
        elif "already" in msg:
            skipped += 1
        else:
            errors.append((f, msg))

    print(f"修复: {fixed} | 跳过: {skipped} | 失败: {len(errors)}")
    if errors:
        for f, msg in errors:
            print(f"  ❌ {f}: {msg}")

if __name__ == "__main__":
    main()