// Track available system voices
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const updateVoices = () => {
        const available = window.speechSynthesis.getVoices();
        setVoices(available);
      };

      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  // Smart Voice Picker & Pronunciation Handler
  const speakText = (text: string) => {
    if (!isVoiceOutputEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    // Clean markdown symbols
    const cleanText = text.replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Detect if text is Urdu / Roman Urdu
    const isUrduContext = /(aap|apna|hain|nahi|karna|shukriya|mojood|bhi|hoga|rahe|karein|kiya)/i.test(cleanText) ||
      /[\u0600-\u06FF]/.test(cleanText);

    if (isUrduContext) {
      // Prioritize Urdu or South Asian phonetic voices (ur-PK, ur, hi-IN, en-IN)
      const desiVoice = voices.find(v => 
        v.lang.startsWith('ur') || 
        v.lang === 'hi-IN' || 
        v.lang === 'en-IN' ||
        v.name.toLowerCase().includes('urdu') ||
        v.name.toLowerCase().includes('hindi') ||
        v.name.toLowerCase().includes('india')
      );

      if (desiVoice) {
        utterance.voice = desiVoice;
        utterance.lang = desiVoice.lang;
      }
      utterance.rate = 0.92; // Slightly slower cadence for natural Urdu rhythm
      utterance.pitch = 1.0;
    } else {
      // Standard English voice
      const englishVoice = voices.find(v => v.lang.startsWith('en-US') || v.lang.startsWith('en-GB'));
      if (englishVoice) utterance.voice = englishVoice;
      utterance.rate = 1.0;
    }

    window.speechSynthesis.speak(utterance);
  };
