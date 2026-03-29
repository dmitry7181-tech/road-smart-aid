import requests, json, hashlib, os

print("🔍 Start check...")
url = "https://publication.pravo.gov.ru/document/0001202305020028"

try:
    r = requests.get(url, timeout=20)
    new_hash = hashlib.sha256(r.text.encode()).hexdigest()[:16]
    
    with open("data/legal-base.json", "r", encoding="utf-8") as f:
        db = json.load(f)
    
    old_hash = db["documents"]["mvd_order_264"].get("content_hash", "")
    
    if new_hash != old_hash:
        print(f"⚠️ Update found: {old_hash} -> {new_hash}")
        db["documents"]["mvd_order_264"]["content_hash"] = new_hash
        db["metadata"]["last_verified"] = "2026-03-30T12:00:00Z"
        with open("data/legal-base.json", "w", encoding="utf-8") as f:
            json.dump(db, f, indent=2, ensure_ascii=False)
    else:
        print("✅ All up to date")
except Exception as e:
    print(f"❌ Error: {e}")
    exit(1)
