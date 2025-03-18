let socket;
let username;

document.getElementById("join-button").addEventListener("click", () => {
    username = document.getElementById("username-input").value.trim();
    if (!username) {
        alert("닉네임을 입력하세요.");
        return;
    }

    document.getElementById("login-container").style.display = "none";
    document.getElementById("chat-container").style.display = "block";

    socket = new WebSocket("ws://158.180.86.250:8080");

    socket.onopen = () => {
        console.log("서버에 연결됨");
        socket.send(JSON.stringify({ type: "join", username }));
    };

    socket.onmessage = (event) => {
        const { sender, text } = JSON.parse(event.data);
        displayMessage(sender, text);
    };

    socket.onclose = () => {
        console.log("서버 연결이 종료되었습니다.");
        displayMessage("system", "서버와의 연결이 종료되었습니다.");
    };
});

document.getElementById("send-button").addEventListener("click", sendMessage);
document.getElementById("message-input").addEventListener("keypress", (event) => {
    if (event.key === "Enter") sendMessage();
});

function sendMessage() {
    const input = document.getElementById("message-input");
    const message = input.value.trim();

    if (message && socket) {
        socket.send(JSON.stringify({ type: "chat", text: message }));
        input.value = "";
    }
}

function displayMessage(sender, text) {
    const chatBox = document.getElementById("chat-box");
    const messageDiv = document.createElement("div");

    if (sender === "system") {
        messageDiv.style.color = "gray";
        messageDiv.style.fontStyle = "italic";
    } else {
        messageDiv.style.fontWeight = "bold";
    }

    messageDiv.textContent = sender + ": " + text;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}
