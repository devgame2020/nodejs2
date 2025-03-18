const WebSocket = require("ws");

// Web Socket을 이용한 채팅서버 (8080)

const server = new WebSocket.Server({ port: 8080 });

let clients = new Map(); // 사용자 목록 (socket -> username 매핑)

server.on("connection", (socket) => {
    console.log("새로운 클라이언트 연결됨");

    socket.on("message", (data) => {
        const messageData = JSON.parse(data);

        if (messageData.type === "join") {
            // 새 사용자 접속
            clients.set(socket, messageData.username);
            broadcastMessage("system", `${messageData.username}님이 입장하셨습니다.`);
        } else if (messageData.type === "chat") {
            // 일반 채팅 메시지
            const username = clients.get(socket) || "익명";
            broadcastMessage(username, messageData.text);
        }
    });

    socket.on("close", () => {
        const username = clients.get(socket);
        if (username) {
            clients.delete(socket);
            broadcastMessage("system", `${username}님이 퇴장하셨습니다.`);
        }
    });
});

function broadcastMessage(sender, text) {
    const message = JSON.stringify({ sender, text });
    server.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

console.log("WebSocket 서버가 ws://localhost:8080 에서 실행 중입니다.");
