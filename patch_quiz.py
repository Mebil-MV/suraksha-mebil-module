import codecs

with codecs.open('frontend/src/pages/QuizPage.tsx', 'r', 'utf-8') as f:
    content = f.read()

replacements = [
    ('<h1>🎯 Disaster Preparedness Quiz</h1>', "<h1>🎯 {t('quiz_page.title')}</h1>"),
    ('<p>Test your knowledge across {ALL_QUESTIONS.length} questions in {categoryNames.length} categories</p>', "<p>{t('quiz_page.subtitle')} {ALL_QUESTIONS.length} {t('quiz_page.questions_in')} {categoryNames.length} {t('quiz_page.categories')}</p>"),
    ('🚀 Start All Questions', "🚀 {t('quiz_page.start_all')}"),
    ('<h2>Or choose a category:</h2>', "<h2>{t('quiz_page.or_choose')}</h2>"),
    ('Or choose a category:', "{t('quiz_page.or_choose')}"),
    ('Question {currentIndex + 1} of {questions.length}', "{t('quiz_page.question')} {currentIndex + 1} {t('quiz_page.of')} {questions.length}"),
    ('pts', "{t('quiz_page.pts')}"),
    ('✅ Correct!', "✅ {t('quiz_page.correct')}"),
    ("⏰ Time's Up!", "⏰ {t('quiz_page.times_up')}"),
    ('❌ Incorrect', "❌ {t('quiz_page.incorrect')}"),
    ('Next Question →', "{t('quiz_page.next')}"),
    ('Finish Quiz →', "{t('quiz_page.finish')}"),
    ('<h1>Quiz Complete! 🎉</h1>', "<h1>{t('quiz_page.complete')} 🎉</h1>"),
    ('<span className="quiz-score-label">Score</span>', '<span className="quiz-score-label">{t(\'quiz_page.score\')}</span>'),
    ('Grade: {grade}', '{t(\'quiz_page.grade\')} {grade}'),
    ('<span className="stat-label">Correct</span>', '<span className="stat-label">{t(\'quiz_page.correct_ans\')}</span>'),
    ('<span className="stat-label">Wrong</span>', '<span className="stat-label">{t(\'quiz_page.wrong_ans\')}</span>'),
    ('<span className="stat-label">Unanswered</span>', '<span className="stat-label">{t(\'quiz_page.unanswered\')}</span>'),
    ('<span className="stat-label">Points</span>', '<span className="stat-label">{t(\'quiz_page.total_points\')}</span>'),
    ('<h2>Category Breakdown</h2>', "<h2>{t('quiz_page.category_breakdown')}</h2>"),
    ('🔄 Retake Quiz', "🔄 {t('quiz_page.retake')}"),
    ('🏠 Back to Home', "🏠 {t('quiz_page.back_home')}"),
]

for old, new in replacements:
    content = content.replace(old, new)

with codecs.open('frontend/src/pages/QuizPage.tsx', 'w', 'utf-8') as f:
    f.write(content)

print("QuizPage patched.")
