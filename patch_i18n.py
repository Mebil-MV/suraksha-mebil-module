import json
import codecs

def update_json(filepath, updates):
    with codecs.open(filepath, 'r', 'utf-8') as f:
        data = json.load(f)
    
    for k, v in updates.items():
        if k not in data:
            data[k] = {}
        data[k].update(v)
        
    with codecs.open(filepath, 'w', 'utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

en_updates = {
  'community': {
    'assign_volunteer': 'Assign Volunteer'
  }
}

hi_updates = {
  'community': {
    'assign_volunteer': 'स्वयंसेवक सौंपें'
  }
}

update_json('frontend/src/i18n/en.json', en_updates)
update_json('frontend/src/i18n/hi.json', hi_updates)
print('JSON updated')
