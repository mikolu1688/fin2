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

/* ====== 即時聊天 + 30秒倒數秒數顯示 + 進度條 + 自動回傳定位 ====== */
const chatBox = document.getElementById("chat-box");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");

chatForm.addEventListener("submit", e => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if(!text) return;

    // 顯示使用者訊息
    const userMsg = createMessageElement(text,"user");
    chatBox.appendChild(userMsg);
    chatBox.scrollTop = chatBox.scrollHeight;
    chatInput.value="";

    // 建立等待提示與倒數條
    const waitMsg = createMessageElement("", "friend");
    waitMsg.id="wait-msg";

    const waitText = document.createElement("div");
    let duration = 30; // 秒
    let remaining = duration;
    waitText.textContent = `⏳ 等待對方回覆中… ${remaining}秒`;

    const progressContainer = document.createElement("div");
    progressContainer.className="progress-container";
    const progressBar = document.createElement("div");
    progressBar.className="progress-bar";
    progressContainer.appendChild(progressBar);

    waitMsg.appendChild(waitText);
    waitMsg.appendChild(progressContainer);
    chatBox.appendChild(waitMsg);
    chatBox.scrollTop = chatBox.scrollHeight;

    // 每秒更新倒數文字與進度條
    const interval = setInterval(()=>{
        remaining--;
        if(remaining>=0){
            waitText.textContent = `⏳ 等待對方回覆中… ${remaining}秒`;
            progressBar.style.width = (remaining/duration*100) + "%";
        } else {
            clearInterval(interval);
        }
    },1000);

    // 傳送訊息到伺服器 (模擬)
    fetch("https://jsonplaceholder.typicode.com/posts", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({message:text})
    }).catch(err => console.error(err));

    // 30秒未回覆，自動回傳定位
    setTimeout(()=>{
        if(document.getElementById("wait-msg")){
            waitMsg.remove(); // 移除等待訊息

            if(navigator.geolocation){
                navigator.geolocation.getCurrentPosition(pos=>{
                    const {latitude,longitude}=pos;

                    // 傳送位置到伺服器 (模擬)
                    fetch("https://jsonplaceholder.typicode.com/posts",{
                        method:"POST",
                        headers:{"Content-Type":"application/json"},
                        body:JSON.stringify({latitude,longitude})
                    });

                    // 顯示自動回傳定位訊息
                    const locMsg=createMessageElement(
                        `⚡ 30秒內未回覆，已自動回傳位置: [${latitude.toFixed(5)}, ${longitude.toFixed(5)}]`,
                        "friend"
                    );
                    chatBox.appendChild(locMsg);
                    chatBox.scrollTop=chatBox.scrollHeight;
                }, err=>console.error("無法取得定位", err));
            }
        }
    }, duration*1000); // 30秒
});

// 建立訊息元素
function createMessageElement(text,type){
    const msg=document.createElement("div");
    msg.className=`message ${type}`;
    msg.textContent=text;
    return msg;
}
