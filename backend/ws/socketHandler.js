import { addMessage, resetMemory } from "../llm/chatMemory.js";
import { askGemini } from "../llm/llm.js";

export const socketHandler = async (ws, rawData) => {
  try {
    const { type, payload, persona = "friendly" } = JSON.parse(rawData);
    const sessionId = ws._socket.remoteAddress + ":" + ws._socket.remotePort; // crude but effective

    switch (type) {
      case "speak":
        console.log(`🎤 Prompt: ${payload} | Persona: ${persona}`);
        addMessage(sessionId, "user", payload);

        const reply = await askGemini(sessionId, payload, persona);

        addMessage(sessionId, "model", reply);

        ws.send(JSON.stringify({ type: "llm-response", payload: reply }));
        break;

      case "reset-memory":
        resetMemory(sessionId);
        ws.send(JSON.stringify({ type: "info", payload: "Memory cleared." }));
        break;

      default:
        ws.send(
          JSON.stringify({ type: "error", payload: "Unknown message type" })
        );
    }
  } catch (err) {
    console.log("Handler Error:", err.message);
    ws.send(JSON.stringify({ type: "error", payload: "Something went wrong" }));
  }
};
