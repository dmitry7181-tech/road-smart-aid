import requests
import json
import hashlib
import os
from datetime import datetime

print("🔍 Запуск проверки обновлений...")

try:
    url = "https://publication.pravo.gov.ru/document/0001202305020028"
    print(f"📥 Загрузка с {url}...")
    
    headers = {
        'User-Agent': 'RoadSmartAid-Bot/1.0 (Social Project)'
    }
    
    response = requests.get(url, headers=headers, timeout=30)
    response.raise_for_status()
    
    new_hash = hashlib.sha256(response.text.encode('utf-8')).hexdigest()[:16]
    print(f"🔑 Новый хэш: {new_hash}")
    
    # Чтение текущего файла
    with open('data/legal-base.json', 'r', encoding='utf-8') as f:
        db = json.load(f)
    
    old_hash = db['documents']['mvd_order_264'].get('content_hash', '')
    print(f"🔑 Старый хэш: {old_hash}")
    
    if new_hash != old_hash:
        print("⚠️ ОБНАРУЖЕНО ОБНОВЛЕНИЕ!")
        
        # Обновление данных
        db['documents']['mvd_order_264']['content_hash'] = new_hash
        db['metadata']['last_verified'] = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')
        db['metadata']['auto_updated'] = True
        
        # Сохранение
        with open('data/legal-base.json', 'w', encoding='utf-8') as f:
            json.dump(db, f, indent=2, ensure_ascii=False)
        
        print("✅ Файл обновлён")
    else:
        print("✅ Всё актуально, изменений нет")
        
        # Просто обновим дату проверки
        db['metadata']['last_verified'] = datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')
        with open('data/legal-base.json', 'w', encoding='utf-8') as f:
            json.dump(db, f, indent=2, ensure_ascii=False)

except Exception as e:
    print(f"❌ Ошибка: {e}")
    exit(1)

print("🎉 Проверка завершена")
