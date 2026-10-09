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
    
    // Try to find a high-quality 'realistic' voice (Google or Microsoft Natural)
    const voices = window.speechSynthesis.getVoices();
    
    let targetVoice = voices.find(v => 
      v.lang.startsWith(lang.substring(0, 2)) && 
      (v.name.includes('Natural') || v.name.includes('Online') || v.name.includes('Google'))
    );

    // Fallback to any matching language voice if natural one isn't found
    if (!targetVoice) {
      targetVoice = voices.find(v => v.lang.startsWith(lang.substring(0, 2)));
    }

    if (targetVoice) {
      utterance.voice = targetVoice;
    }
    
    // Slightly adjust rate for better clarity
    utterance.rate = 0.95;

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
