const ws = new WebSocket("ws://localhost:3000");

ws.addEventListener("open", () => {
  console.log("[WS] Connected to backend");
});

ws.addEventListener("message", (event) => {
  const { type, payload } = JSON.parse(event.data);
  if (type === "llm-response") {
    document.getElementById("response").textContent = payload;

    const cleaned = cleanForSpeech(payload);
    const utterance = new SpeechSynthesisUtterance(cleaned);
    speechSynthesis.speak(utterance);
  }
});

function cleanForSpeech(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold **
    .replace(/\*(.*?)\*/g, "$1") // Remove italic *
    .replace(/`(.*?)`/g, "$1") // Remove inline code
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1") // Remove links, keep label
    .replace(/^#+\s/gm, "") // Remove markdown headings
    .replace(/[_*~]/g, "") // Catch any leftover markdown
    .replace(/\n{2,}/g, ". ") // Paragraphs to pauses
    .trim();
}

const startBtn = document.getElementById("start");
let recognition;

startBtn.addEventListener("click", () => {
  if (!("webkitSpeechRecognition" in window)) {
    alert("Your browser does not support Web Speech API. Try Chrome!");
    return;
  }

  recognition = new webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = "en-US";

  recognition.onstart = () => {
    startBtn.textContent = "🎧 Listening...";
  };

  recognition.onend = () => {
    startBtn.textContent = "🎤 Start Talking";
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    console.log("[STT] You said:", transcript);
    ws.send(JSON.stringify({ type: "speak", payload: transcript,persona:"friendly" }));
  };

  recognition.start();
});
