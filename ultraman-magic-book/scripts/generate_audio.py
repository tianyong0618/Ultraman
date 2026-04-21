#!/usr/bin/env python3
import os
import sys
import asyncio
from gtts import gTTS

DATA_FILE = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'ultraman.js')

def parse_ultraman_data():
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        content = f.read()
    
    data = []
    in_array = False
    current_obj = {}
    brace_count = 0
    
    for line in content.split('\n'):
        if '{ id:' in line:
            current_obj = {}
            in_array = True
            brace_count = 0
        
        if in_array:
            brace_count += line.count('{') - line.count('}')
            
            if 'id:' in line and ':' in line:
                parts = line.split('id:')
                if len(parts) > 1:
                    try:
                        current_obj['id'] = int(parts[1].split(',')[0].strip())
                    except:
                        pass
            if "name: '" in line:
                start = line.find("name: '") + 7
                end = line.find("',", start)
                if end > start:
                    current_obj['name'] = line[start:end]
            if 'desc: "' in line:
                start = line.find('desc: "') + 6
                end = line.find('",', start)
                if end > start:
                    current_obj['desc'] = line[start:end]
            if 'forms: [' in line:
                start = line.find('forms: [') + 8
                end = line.find(']', start)
                if end > start:
                    forms_str = line[start:end]
                    current_obj['forms'] = [f.strip().strip("'\"") for f in forms_str.split(',') if f.strip()]
            if 'skills: [' in line:
                start = line.find('skills: [') + 8
                end = line.find(']', start)
                if end > start:
                    skills_str = line[start:end]
                    current_obj['skills'] = [s.strip().strip("'\"") for s in skills_str.split(',') if s.strip()]
            if 'human: "' in line:
                start = line.find('human: "') + 8
                end = line.find('",', start)
                if end > start:
                    current_obj['human'] = line[start:end]
            if 'catchphrase: "' in line:
                start = line.find('catchphrase: "') + 12
                end = line.find('"', start)
                if end > start:
                    current_obj['catchphrase'] = line[start:end]
            
            if brace_count == 0 and current_obj.get('id'):
                data.append(current_obj)
                in_array = False
    
    return data

def generate_audio():
    ultraman_data = parse_ultraman_data()
    output_dir = os.path.join(os.path.dirname(__file__), '..', 'public', 'audio')
    
    types = ['name', 'desc', 'forms', 'skills', 'human', 'catchphrase']
    
    for t in types:
        t_dir = os.path.join(output_dir, t)
        os.makedirs(t_dir, exist_ok=True)
    
    for item in ultraman_data:
        item_id = item.get('id')
        if not item_id:
            continue
        
        for t in types:
            if t == 'name':
                text = item.get('name', '')
            elif t == 'desc':
                text = item.get('desc', '')
            elif t == 'forms':
                forms = item.get('forms', [])
                text = '、'.join(forms) if forms else '无多种形态'
            elif t == 'skills':
                skills = item.get('skills', [])
                text = '、'.join(skills) if skills else '无技能数据'
            elif t == 'human':
                text = item.get('human', '待补充')
            elif t == 'catchphrase':
                text = item.get('catchphrase', '')
            
            if not text or text in ['待补充', '无技能数据', '无']:
                continue
            
            output_file = os.path.join(output_dir, t, f'{item_id}.mp3')
            if os.path.exists(output_file):
                print(f'Skipped: {t}/{item_id}.mp3')
                continue
            
            try:
                tts = gTTS(text=text, lang='zh-CN')
                tts.save(output_file)
                print(f'Generated: {t}/{item_id}.mp3')
            except Exception as e:
                print(f'Failed: {t}/{item_id}.mp3 - {e}')

if __name__ == '__main__':
    generate_audio()