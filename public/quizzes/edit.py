import json

with open('PHRASETEST.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for q in data['questions']:
    q['question'] = q['question'].replace('不限顺序配对短语：', '不限顺序配对短语：\n').replace('③', '\n③')

with open('PHRASETEST_modified.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)