import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 替换Pouch输入区域
new_pouch = '''                        <div class="pouch-inputs" style="display: flex; gap: 10px; flex-wrap: wrap; justify-content: space-between;">
                            <div class="pouch-item" style="flex: 1; min-width: 120px; padding: 8px; background: #f8f9fa; border-radius: 6px; border: 1px solid #e9ecef;">
                                <div class="pouch-icon" style="display: flex; align-items: center; gap: 6px; margin-bottom: 5px; font-size: 0.85rem; color: #495057;">
                                    <img src="assets/images/pouch4.png" alt="pouch1" class="pouch-img" style="width: 24px; height: 24px;">
                                    <span>pouch1:</span>
                                </div>
                                <input type="number" id="pouch1" class="pouch-input" value="0" min="0" data-index="0" style="width: 100%; padding: 6px 8px; font-size: 0.9rem; text-align: center; border: 1px solid #ced4da; border-radius: 4px;">
                            </div>
                            <div class="pouch-item" style="flex: 1; min-width: 120px; padding: 8px; background: #f8f9fa; border-radius: 6px; border: 1px solid #e9ecef;">
                                <div class="pouch-icon" style="display: flex; align-items: center; gap: 6px; margin-bottom: 5px; font-size: 0.85rem; color: #495057;">
                                    <img src="assets/images/pouch4.png" alt="pouch2" class="pouch-img" style="width: 24px; height: 24px;">
                                    <span>pouch2:</span>
                                </div>
                                <input type="number" id="pouch2" class="pouch-input" value="0" min="0" data-index="1" style="width: 100%; padding: 6px 8px; font-size: 0.9rem; text-align: center; border: 1px solid #ced4da; border-radius: 4px;">
                            </div>
                            <div class="pouch-item" style="flex: 1; min-width: 120px; padding: 8px; background: #f8f9fa; border-radius: 6px; border: 1px solid #e9ecef;">
                                <div class="pouch-icon" style="display: flex; align-items: center; gap: 6px; margin-bottom: 5px; font-size: 0.85rem; color: #495057;">
                                    <img src="assets/images/pouch4.png" alt="pouch3" class="pouch-img" style="width: 24px; height: 24px;">
                                    <span>pouch3:</span>
                                </div>
                                <input type="number" id="pouch3" class="pouch-input" value="0" min="0" data-index="2" style="width: 100%; padding: 6px 8px; font-size: 0.9rem; text-align: center; border: 1px solid #ced4da; border-radius: 4px;">
                            </div>
                            <div class="pouch-item" style="flex: 1; min-width: 120px; padding: 8px; background: #f8f9fa; border-radius: 6px; border: 1px solid #e9ecef;">
                                <div class="pouch-icon" style="display: flex; align-items: center; gap: 6px; margin-bottom: 5px; font-size: 0.85rem; color: #495057;">
                                    <img src="assets/images/pouch4.png" alt="pouch4" class="pouch-img" style="width: 24px; height: 24px;">
                                    <span>pouch4:</span>
                                </div>
                                <input type="number" id="pouch4" class="pouch-input" value="0" min="0" data-index="3" style="width: 100%; padding: 6px 8px; font-size: 0.9rem; text-align: center; border: 1px solid #ced4da; border-radius: 4px;">
                            </div>
                        </div>'''

# 找到并替换
old_pouch_pattern = r'<div class="pouch-inputs">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>'
content = re.sub(old_pouch_pattern, new_pouch, content)

# 修复玩家管理区复选框（删除重复的checkmark）
content = content.replace('<span class="checkmark"></span>', '')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Pouch区域已更新为紧凑水平布局")
