const SERVER_URL = "https://aura-ai-3zi9.onrender.com/chat";

function addMessage(message) {
  const chatBox = document.getElementById("chat-box");
  chatBox.innerHTML += `<p>${message}</p>`;
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const inputField = document.getElementById("user-input");
  const input = inputField.value.trim();
  if (input === "") return;

  addMessage("Tu: " + input);
  inputField.value = "";

  const response = await fetch(SERVER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: input })
  });

  const data = await response.json();
  addMessage("AI: " + data.reply);
}
