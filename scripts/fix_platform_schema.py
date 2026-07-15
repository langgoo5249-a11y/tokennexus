#!/usr/bin/env python3
"""批量修复平台页面 Product JSON-LD Schema 缺失字段"""
import os, re, json
from datetime import datetime

PLATFORM_DIR = "/workspace/tokennexus/platform"

PRODUCT_PATTERN = re.compile(
    r'(<script\s+type="application/ld\+json">)\s*'
    r'(\{.*?"@type"\s*:\s*"Product".*?\})\s*'
    r'(</script>)',
    re.DOTALL
)

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()

    # 提取 og:image
    og_img = re.search(r'<meta\s+property="og:image"\s+content="([^"]+)"', html)
    if not og_img:
        return False, "no og:image"
    image_url = og_img.group(1)

    m = PRODUCT_PATTERN.search(html)
    if not m:
        return False, "no Product JSON-LD"

    script_open = m.group(1)
    json_str = m.group(2)
    script_close = m.group(3)

    # 已修复则跳过
    if '"image"' in json_str:
        return False, "already has image"

    try:
        data = json.loads(json_str)
    except json.JSONDecodeError as e:
        return False, f"JSON parse error: {e}"

    # 添加 image
    data["image"] = image_url

    # 修复 Offer 非严重问题
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
    new_block = f'{script_open}\n    {new_json}\n    {script_close}'
    html = html.replace(m.group(0), new_block, 1)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html)

    return True, f"image={image_url.split('/')[-1]}"

def main():
    print(f"平台页面 Product JSON-LD Schema 修复")
    print(f"时间: {datetime.now().isoformat()}")
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
        for f, msg in errors[:10]:
            print(f"  ❌ {f}: {msg}")

if __name__ == "__main__":
    main()