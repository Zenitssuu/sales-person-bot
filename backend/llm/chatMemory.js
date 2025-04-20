const memoryMap = new Map(); // key: socket id or session id

const initSessionMemory = (sessionId) => {
  if (!memoryMap.has(sessionId)) {
    memoryMap.set(sessionId, []);
  }
};

const getMemory = (sessionId) => {
  return memoryMap.get(sessionId) || [];
};

const addMessage = (sessionId, role, content) => {
  initSessionMemory(sessionId);
  memoryMap.get(sessionId).push({
    role,                         // Only here
    parts: [{ text: content }]    // NO "role" inside parts
  });
};

const resetMemory = (sessionId) => {
  memoryMap.delete(sessionId);
};

const getFormattedHistory = (sessionId) => {
  return getMemory(sessionId);
};

export {
  initSessionMemory,
  getMemory,
  addMessage,
  resetMemory,
  getFormattedHistory,
};
