import codecs

file_path = 'frontend/src/pages/QuizPage.tsx'

with codecs.open(file_path, 'r', 'utf-8') as f:
    content = f.read()

# Add SpeechButton to the active quiz question
content = content.replace(
    '<p className="quiz-question-text">{q.question}</p>',
    '<p className="quiz-question-text" style={{ display: \'flex\', alignItems: \'center\', gap: \'0.5rem\' }}>{q.question} <SpeechButton text={q.question} lang="en-US" /></p>'
)

with codecs.open(file_path, 'w', 'utf-8') as f:
    f.write(content)

print("QuizPage updated")
