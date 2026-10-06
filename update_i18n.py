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
  'home': {
    'title': 'Disaster Preparedness Hero',
    'readiness_score': 'Readiness Score',
    'challenges_done': 'Challenges Done',
    'badges_earned': 'Badges Earned',
    'overall_readiness': 'Overall Readiness',
    'scenarios_title': 'Disaster Scenarios',
    'scenarios_subtitle': 'Test your survival knowledge — pick the right action in each emergency',
    'quiz_promo_title': 'Test Your Disaster Knowledge',
    'quiz_promo_desc': '50+ questions across 8 categories. Earn points and track your progress!',
    'start_quiz': 'Start Quiz →',
    'pts': 'pts',
    'status_completed': 'Completed',
    'status_pending': 'Not Started',
    'done': 'Done',
    'btn_review': 'Review →',
    'btn_start': 'Start Challenge →'
  },
  'hazard': {
    'EARTHQUAKE': 'EARTHQUAKE',
    'FLOOD': 'FLOOD',
    'FIRE': 'FIRE',
    'TSUNAMI': 'TSUNAMI',
    'CYCLONE': 'CYCLONE',
    'LANDSLIDE': 'LANDSLIDE'
  },
  'game': {
    'title': 'Emergency Evacuation Packer',
    'subtitle': 'A disaster has been declared! You have',
    'seconds': 'seconds',
    'to_pack': 'to pack your emergency bag.',
    'how_to_play': 'How to Play:',
    'rule1': 'You can only carry',
    'items': 'items',
    'rule1_end': 'in your backpack.',
    'rule2': 'Choose essential survival items wisely.',
    'rule3': 'Avoid heavy or useless items that will slow you down.',
    'rule4': 'Race against the clock!',
    'start_btn': 'START EVACUATION 🚨',
    'evacuate_now': 'EVACUATE NOW 🏃‍♂️',
    'your_backpack': 'Your Backpack',
    'empty_slot': 'Empty Slot',
    'backpack_full': 'Backpack is full!',
    'house_items': 'House Items',
    'click_to_pack': 'Click to pack',
    'expert': 'Survival Expert! 🏆',
    'survived': 'You Survived! 🏃',
    'needs_planning': 'Needs Better Planning ⚠️',
    'points': 'Points',
    'your_packed_items': 'Your Packed Items',
    'empty_bag_msg': 'You evacuated with an empty backpack!',
    'play_again': '🔄 Play Again',
    'home': '🏠 Home'
  },
  'flood_game': {
    'title': 'Flood Escape Simulator',
    'subtitle': 'Learn what to do when waters rise quickly.',
    'are_you_ready': 'Are you ready?',
    'ready_desc': 'Experience an interactive story to learn vital flood survival skills.',
    'start': 'Start Simulation',
    'guidance_1': 'The water is rising fast inside your house. What do you do?',
    'hide': 'Hide under the bed 🛏️',
    'pack_toys': 'Pack my favorite toys 🧸',
    'roof': 'Grab Go-Bag & go to the roof 🎒🪜',
    'guidance_2': 'You are safe from the immediate water, but you need to be rescued.',
    'swim': 'Jump in and swim for help 🏊',
    'signal': 'Stay high and wave a bright cloth 🏳️',
    'failed': '⚠️ Simulation Failed',
    'survival_rule': 'Survival Rule:',
    'rule_1': "Turn Around, Don't Drown!",
    'rule_1_desc': 'Always seek higher ground and never enter floodwaters.',
    'try_again': 'Try Again 🔄',
    'survived': '🎉 You Survived!',
    'rule_followed': 'Survival Rule Followed:',
    'rule_2_desc': 'You sought higher ground immediately and signaled for help safely without entering the water.',
    'play_again': 'Play Again 🔄',
    'home': 'Home'
  }
}

hi_updates = {
  'home': {
    'title': 'आपदा तैयारी हीरो',
    'readiness_score': 'तैयारी स्कोर',
    'challenges_done': 'चुनौतियाँ पूरी',
    'badges_earned': 'बैज अर्जित',
    'overall_readiness': 'कुल तैयारी',
    'scenarios_title': 'आपदा परिदृश्य',
    'scenarios_subtitle': 'अपने अस्तित्व ज्ञान का परीक्षण करें — सही विकल्प चुनें',
    'quiz_promo_title': 'अपने आपदा ज्ञान का परीक्षण करें',
    'quiz_promo_desc': '8 श्रेणियों में 50+ प्रश्न। अंक अर्जित करें और प्रगति देखें!',
    'start_quiz': 'क्विज़ शुरू करें →',
    'pts': 'अंक',
    'status_completed': 'पूरा हुआ',
    'status_pending': 'शुरू नहीं हुआ',
    'done': 'पूर्ण',
    'btn_review': 'समीक्षा करें →',
    'btn_start': 'चुनौती शुरू करें →'
  },
  'hazard': {
    'EARTHQUAKE': 'भूकंप',
    'FLOOD': 'बाढ़',
    'FIRE': 'आग',
    'TSUNAMI': 'सुनामी',
    'CYCLONE': 'चक्रवात',
    'LANDSLIDE': 'भूस्खलन'
  },
  'game': {
    'title': 'आपातकालीन निकासी पैकर',
    'subtitle': 'आपदा घोषित कर दी गई है! आपके पास है',
    'seconds': 'सेकंड',
    'to_pack': 'अपना आपातकालीन बैग पैक करने के लिए।',
    'how_to_play': 'कैसे खेलें:',
    'rule1': 'आप केवल ले जा सकते हैं',
    'items': 'वस्तुएं',
    'rule1_end': 'अपने बैकपैक में।',
    'rule2': 'आवश्यक उत्तरजीविता वस्तुओं को बुद्धिमानी से चुनें।',
    'rule3': 'भारी या बेकार वस्तुओं से बचें जो आपको धीमा कर देंगी।',
    'rule4': 'समय के खिलाफ दौड़ें!',
    'start_btn': 'निकासी शुरू करें 🚨',
    'evacuate_now': 'अभी बाहर निकलें 🏃‍♂️',
    'your_backpack': 'आपका बैकपैक',
    'empty_slot': 'खाली जगह',
    'backpack_full': 'बैकपैक भर गया है!',
    'house_items': 'घर की वस्तुएं',
    'click_to_pack': 'पैक करने के लिए क्लिक करें',
    'expert': 'उत्तरजीविता विशेषज्ञ! 🏆',
    'survived': 'आप बच गए! 🏃',
    'needs_planning': 'बेहतर योजना की आवश्यकता ⚠️',
    'points': 'अंक',
    'your_packed_items': 'आपके पैक किए गए आइटम',
    'empty_bag_msg': 'आप खाली बैकपैक के साथ बाहर निकले!',
    'play_again': '🔄 फिर से खेलें',
    'home': '🏠 होम'
  },
  'flood_game': {
    'title': 'बाढ़ से बचाव सिम्युलेटर',
    'subtitle': 'जानें कि जब पानी तेजी से बढ़ता है तो क्या करना चाहिए।',
    'are_you_ready': 'क्या आप तैयार हैं?',
    'ready_desc': 'महत्वपूर्ण बाढ़ से बचाव कौशल सीखने के लिए एक संवादात्मक कहानी का अनुभव करें।',
    'start': 'सिमुलेशन शुरू करें',
    'guidance_1': 'आपके घर के अंदर पानी तेजी से बढ़ रहा है। तुम क्या करते हो?',
    'hide': 'बिस्तर के नीचे छुपें 🛏️',
    'pack_toys': 'अपने पसंदीदा खिलौने पैक करें 🧸',
    'roof': 'गो-बैग लें और छत पर जाएँ 🎒🪜',
    'guidance_2': 'आप पानी से सुरक्षित हैं, लेकिन आपको बचाए जाने की जरूरत है।',
    'swim': 'अंदर कूदें और मदद के लिए तैरें 🏊',
    'signal': 'ऊपर रहें और एक चमकीला कपड़ा लहराएं 🏳️',
    'failed': '⚠️ सिमुलेशन विफल',
    'survival_rule': 'बचाव नियम:',
    'rule_1': 'मुड़ो, डूबो मत!',
    'rule_1_desc': 'हमेशा ऊंची जमीन की तलाश करें और कभी भी बाढ़ के पानी में न घुसें।',
    'try_again': 'पुनः प्रयास करें 🔄',
    'survived': '🎉 आप बच गए!',
    'rule_followed': 'बचाव नियम का पालन किया:',
    'rule_2_desc': 'आपने तुरंत ऊंची जमीन की तलाश की और पानी में प्रवेश किए बिना सुरक्षित रूप से मदद के लिए इशारा किया।',
    'play_again': 'फिर से खेलें 🔄',
    'home': 'होम'
  }
}

update_json('frontend/src/i18n/en.json', en_updates)
update_json('frontend/src/i18n/hi.json', hi_updates)
print('JSON updated')
