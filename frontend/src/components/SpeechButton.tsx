import { useState, useEffect } from 'react';

interface SpeechButtonProps {
  text: string;
  lang?: 'en-US' | 'hi-IN';
}

export default function SpeechButton({ text, lang = 'en-US' }: SpeechButtonProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setSupported(false);
    }
  }, []);

  const handleSpeak = () => {
    if (!supported) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    
    // Optional: Try to find a high quality local voice for the language
    const voices = window.speechSynthesis.getVoices();
    const targetVoice = voices.find(v => v.lang.startsWith(lang.substring(0, 2)));
    if (targetVoice) {
      utterance.voice = targetVoice;
    }

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  if (!supported) return null;

  return (
    <button 
      onClick={handleSpeak}
      className={`btn btn-sm ${isSpeaking ? 'btn-danger' : 'btn-outline'}`}
      style={{ padding: '0.2rem 0.5rem', marginLeft: '0.5rem', borderRadius: '50%' }}
      title={isSpeaking ? 'Stop Reading' : 'Read Aloud'}
      aria-label="Read Aloud"
    >
      {isSpeaking ? '🛑' : '🔊'}
    </button>
  );
}
