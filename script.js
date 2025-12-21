/* ====== 行動專屬功能 ====== */
const mobileMessage = document.getElementById("mobile-message");
const mobileBtn = document.getElementById("mobile-btn");
const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

if(isMobile){
    mobileMessage.textContent = "歡迎使用行動裝置！";
    mobileBtn.style.display="inline-block";
    mobileBtn.addEventListener("click", ()=>alert("行動裝置專屬功能啟動🎉"));
}else{
    mobileMessage.textContent="⚠️ 此功能僅限行動裝置使用";
}

/* ====== 即時聊天 + 自動回傳定位（無預設回覆） ====== */
const chatBox = document.getElementById("chat-box");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");

chatForm.addEventListener("submit", e => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if(!text) return;

    // 顯示使用者訊息
    const userMsg = createMessageElement(text, "user");
    chatBox.appendChild(userMsg);
    chatBox.scrollTop = chatBox.scrollHeight;
    chatInput.value="";

    // 傳送訊息到伺服器 (模擬)
    fetch("https://jsonplaceholder.typicode.com/posts", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({message:text})
    }).catch(err => console.error(err));

    // 5秒未回覆，自動回傳定位
    setTimeout(()=>{
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(pos => {
                const {latitude, longitude} = pos;

                // 傳送位置到伺服器 (模擬)
                fetch("https://jsonplaceholder.typicode.com/posts",{
                    method:"POST",
                    headers:{"Content-Type":"application/json"},
                    body:JSON.stringify({latitude,longitude})
                });

                const locMsg = createMessageElement(
                    `⚡ 對方未回覆，已自動回傳位置: [${latitude.toFixed(5)}, ${longitude.toFixed(5)}]`,
                    "friend"
                );
                chatBox.appendChild(locMsg);
                chatBox.scrollTop = chatBox.scrollHeight;
            }, err => console.error("無法取得定位", err));
        }
    }, 5000); // 5秒
});

// 建立訊息元素
function createMessageElement(text,type){
    const msg = document.createElement("div");
    msg.className = `message ${type}`;
    msg.textContent = text;
    return msg;
}
