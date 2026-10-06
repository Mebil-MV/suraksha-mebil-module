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
  'quiz_page': {
    'title': 'Disaster Preparedness Quiz',
    'subtitle': 'Test your knowledge across',
    'questions_in': 'questions in',
    'categories': 'categories',
    'start_all': 'Start All Questions',
    'or_choose': 'Or choose a category:',
    'question': 'Question',
    'of': 'of',
    'pts': 'pts',
    'correct': 'Correct!',
    'times_up': "Time's Up!",
    'incorrect': 'Incorrect',
    'next': 'Next Question →',
    'finish': 'Finish Quiz →',
    'complete': 'Quiz Complete!',
    'score': 'Score',
    'grade': 'Grade:',
    'correct_ans': 'Correct',
    'wrong_ans': 'Wrong',
    'unanswered': 'Unanswered',
    'total_points': 'Points',
    'category_breakdown': 'Category Breakdown',
    'retake': 'Retake Quiz',
    'back_home': 'Back to Home'
  }
}

hi_updates = {
  'quiz_page': {
    'title': 'आपदा तैयारी क्विज़',
    'subtitle': 'अपने ज्ञान का परीक्षण करें',
    'questions_in': 'प्रश्नों में',
    'categories': 'श्रेणियों के अंतर्गत',
    'start_all': 'सभी प्रश्न शुरू करें',
    'or_choose': 'या श्रेणी चुनें:',
    'question': 'प्रश्न',
    'of': 'में से',
    'pts': 'अंक',
    'correct': 'सही!',
    'times_up': 'समय समाप्त!',
    'incorrect': 'गलत',
    'next': 'अगला प्रश्न →',
    'finish': 'क्विज़ समाप्त करें →',
    'complete': 'क्विज़ पूरा हुआ!',
    'score': 'स्कोर',
    'grade': 'ग्रेड:',
    'correct_ans': 'सही',
    'wrong_ans': 'गलत',
    'unanswered': 'अनुत्तरित',
    'total_points': 'कुल अंक',
    'category_breakdown': 'श्रेणीवार प्रदर्शन',
    'retake': 'फिर से क्विज़ लें',
    'back_home': 'होम पर वापस जाएं'
  }
}

update_json('frontend/src/i18n/en.json', en_updates)
update_json('frontend/src/i18n/hi.json', hi_updates)
print('JSON updated')
