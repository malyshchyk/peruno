import mqtt from 'mqtt';

const client = mqtt.connect("ws://192.168.0.181:1885/mqtt");

client.on("connect", () => {
    console.log("Connected to MQTT broker");
    client.subscribe("chat", (err) => {
        if (err) {
            console.error("Subscription error:", err);
        }
    });
});

client.on("message", (topic: string, message: Buffer) => {
    const messageDiv = document.getElementById("messages");
    if (messageDiv) {
        const newMessage = document.createElement("div");
        newMessage.textContent = message.toString();
        messageDiv.appendChild(newMessage);
    }
});

function sendMessage() {
    const usernameInput = document.getElementById("usernameInput") as HTMLInputElement;
    const messageInput = document.getElementById("messageInput") as HTMLInputElement;
    const username = usernameInput.value;
    const message = messageInput.value;

    if (username && message) {
        const fullMessage = `${username}: ${message}`;
        client.publish("chat", fullMessage);
        messageInput.value = "";
    } else {
        alert("Please enter both username and message.");
    }
}

// Add event listener to the div with class 'send-button'
window.addEventListener('load', () => {
  const sendButton = document.querySelector('.button');
  if (sendButton) {
      sendButton.addEventListener('click', sendMessage);
  }
});

// Expose sendMessage to the global scope
(window as any).sendMessage = sendMessage;