const chatBox = document.getElementById("chat-box");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");

// 模擬訊息送出
chatForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const messageText = chatInput.value.trim();
    if (!messageText) return;

    // 顯示使用者訊息
    const userMsg = createMessageElement(messageText, "user");
    chatBox.appendChild(userMsg);
    chatBox.scrollTop = chatBox.scrollHeight;

    chatInput.value = "";

    // 模擬透過 Fetch API 傳送訊息到伺服器
    fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({message: messageText})
    })
    .then(response => response.json())
    .then(data => {
        // 模擬對方回覆訊息，並標註已讀
        setTimeout(() => {
            const friendMsg = createMessageElement("已讀回覆: " + messageText, "friend");
            chatBox.appendChild(friendMsg);

            // 標記使用者訊息已讀
            const readMark = document.createElement("span");
            readMark.className = "read-status";
            readMark.textContent = "已讀";
            userMsg.appendChild(readMark);

            chatBox.scrollTop = chatBox.scrollHeight;
        }, 1000); // 模擬延遲 1 秒
    })
    .catch(err => console.error(err));
});

// 建立訊息元素
function createMessageElement(text, type) {
    const msg = document.createElement("div");
    msg.className = `message ${type}`;
    msg.textContent = text;
    return msg;
}
