import { useEffect, useRef, useState } from 'react';
import './App.css';
import { cleanForSpeech } from './Utils/speechUtil.js';

const PERSONAS = [
  { id: 'friendly', label: 'Friendly' },
  { id: 'sarcastic', label: 'Sarcastic' },
  { id: 'nerdy', label: 'Nerdy' },
  { id: 'minimalist', label: 'Minimalist' },
  { id: 'deep', label: 'Deep Thinker' },
];

function App() {
  const [connected, setConnected] = useState(false);
  const [persona, setPersona] = useState('friendly');
  const [response, setResponse] = useState('');
  const ws = useRef(null);

  useEffect(() => {
    const url = import.meta.env.VITE_WS_URL;
    console.log(url);
    ws.current = new WebSocket(url);
    ws.current.onopen = () => setConnected(true);

    ws.current.onmessage = (event) => {
      const { type, payload } = JSON.parse(event.data);
      if (type === 'llm-response') {
        setResponse(payload);
        const utterance = new SpeechSynthesisUtterance(cleanForSpeech(payload));
        speechSynthesis.speak(utterance);
      }
    };

    return () => ws.current.close();
  }, []);

  const handleMicClick = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Browser does not support SpeechRecognition');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      ws.current.send(JSON.stringify({
        type: 'speak',
        payload: transcript,
        persona,
      }));
    };

    recognition.start();
  };

  const handleResetMemory = () => {
    ws.current.send(JSON.stringify({ type: 'reset-memory' }));
    setResponse('');
  };

  return (
    <div className="app">
      <h1>🎙️ Gemini Voice Assistant</h1>
      <div className="controls">
        <select value={persona} onChange={(e) => setPersona(e.target.value)}>
          {PERSONAS.map(p => (
            <option key={p.id} value={p.id}>{p.label}</option>
          ))}
        </select>
        <button onClick={handleMicClick}>🎤 Start Talking</button>
        <button onClick={handleResetMemory}>🧠 Reset Memory</button>
      </div>
      <div className="response-box">
        <strong>Gemini says:</strong>
        <p>{response}</p>
      </div>
    </div>
  );
}

export default App;
