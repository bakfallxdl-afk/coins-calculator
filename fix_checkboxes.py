import re

with open('index-terminal-commands-backup.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 确保participantCheckboxes容器存在且正确
if '<div id="participantCheckboxes"' not in content:
    # 在roll-section中合适位置添加
    content = content.replace(
        '<div class="roll-section">\n                        <h3>Random Roll / 随机Roll点</h3>',
        '''<div class="roll-section">
                        <h3>Random Roll / 随机Roll点</h3>
                        
                        <div class="input-group">
                            <label>
                                <span class="en">Participants / 参与者:</span>
                            </label>
                            <div id="participantCheckboxes" class="checkbox-group">
                                <!-- 动态生成 -->
                            </div>
                        </div>'''
    )

with open('index-terminal-commands-backup.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ 确保复选框容器存在")
