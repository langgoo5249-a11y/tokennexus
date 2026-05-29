#!/usr/bin/env python3
"""批量添加脚本到所有HTML文件的<head>标签后"""

import os
import re
from pathlib import Path

# 要添加的脚本
SCRIPT = '''<script src="https://quge5.com/88/tag.min.js" data-zone="244102" async data-cfasync="false"></script>
'''

def add_script(file_path):
    """添加脚本到<head>标签后"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 检查是否已经有这个脚本
    if 'quge5.com/88/tag.min.js' in content:
        print(f"  [已存在] {file_path}")
        return False
    
    # 在<head>标签后插入脚本
    head_pattern = re.compile(r'(<head[^>]*>)', re.IGNORECASE)
    match = head_pattern.search(content)
    
    if match:
        insert_pos = match.end()
        new_content = content[:insert_pos] + '\n    ' + SCRIPT + content[insert_pos:]
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"  [已添加] {file_path}")
        return True
    else:
        print(f"  [无head] {file_path}")
        return False

def main():
    """主函数"""
    base_dir = Path('/workspace/token-nav')
    
    # 获取所有HTML文件
    html_files = []
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if file.endswith('.html'):
                html_files.append(Path(root) / file)
    
    print(f"找到 {len(html_files)} 个HTML文件")
    print("开始添加脚本...")
    
    added_count = 0
    for file_path in html_files:
        if add_script(file_path):
            added_count += 1
    
    print(f"\n完成！共添加 {added_count} 个文件")

if __name__ == '__main__':
    main()
