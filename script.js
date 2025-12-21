/* ====== 行動互動：捲動動畫 ====== */
const box = document.getElementById("moving-box");
window.addEventListener("scroll", () => {
    box.style.transform = `translateX(${window.scrollY * 0.3}px)`;
});

/* ====== 裝置互動：相機+麥克風 ====== */
const btnDevice = document.getElementById('btn-device');
const video = document.getElementById('video');
const deviceStatus = document.getElementById('device-status');
btnDevice.onclick = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({video:true,audio:true});
        video.srcObject = stream;
        deviceStatus.textContent = "✅ 相機與麥克風已啟用";
    } catch (err) {
        console.error(err); alert("無法取得相機或麥克風權限");
    }
};

/* ====== 行動專屬功能 ====== */
const mobileMessage = document.getElementById("mobile-message");
const mobileBtn = document.getElementById("mobile-btn");
const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
if(isMobile){
    mobileMessage.textContent = "歡迎使用行動裝置！";
    mobileBtn.style.display="inline-block";
    mobileBtn.addEventListener("click",()=>alert("行動裝置專屬功能啟動🎉"));
}else{
    mobileMessage.textContent="⚠️ 此功能僅限行動裝置使用";
}

/* ====== 表單通訊 + Fetch API ====== */
const form = document.getElementById("contact-form");
const statusMessage = document.getElementById("form-status");
form.addEventListener("submit", e=>{
    e.preventDefault();
    const name=document.getElementById("name").value;
    const email=document.getElementById("email").value;
    const message=document.getElementById("message").value;

    fetch("https://jsonplaceholder.typicode.com/posts",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({name,email,message})
    })
    .then(res=>res.json())
    .then(data=>{
        statusMessage.textContent="✅ 訊息已成功送出";
        statusMessage.style.color="green"; form.reset();
    })
    .catch(err=>{
        statusMessage.textContent="❌ 傳送失敗"; statusMessage.style.color="red";
    });
});

/* ====== 即時聊天 + 已讀 + 自動回傳定位 ====== */
const chatBox=document.getElementById("chat-box");
const chatForm=document.getElementById("chat-form");
const chatInput=document.getElementById("chat-input");

chatForm.addEventListener("submit", e=>{
    e.preventDefault();
    const text=chatInput.value.trim();
    if(!text) return;

    const userMsg=createMessageElement(text,"user");
    chatBox.appendChild(userMsg); chatBox.scrollTop=chatBox.scrollHeight;
    chatInput.value="";

    // 模擬送訊息
    fetch("https://jsonplaceholder.typicode.com/posts",{
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({message:text})
    })
    .then(res=>res.json())
    .then(data=>{
        // 5秒未回覆自動回傳位置
        const replyTimeout=setTimeout(()=>{
            if(navigator.geolocation){
                navigator.geolocation.getCurrentPosition(pos=>{
                    const {latitude, longitude}=pos;
                    fetch("https://jsonplaceholder.typicode.com/posts",{
                        method:"POST", headers:{"Content-Type":"application/json"},
                        body:JSON.stringify({latitude,longitude})
                    });
                    const locMsg=createMessageElement(`⚡ 對方未回覆，已自動回傳位置: [${latitude.toFixed(5)},${longitude.toFixed(5)}]`,"friend");
                    chatBox.appendChild(locMsg); chatBox.scrollTop=chatBox.scrollHeight;
                });
            }
        },5000);

        // 模擬對方回覆
        setTimeout(()=>{
            clearTimeout(replyTimeout);
            const friendMsg=createMessageElement("已讀回覆: "+text,"friend");
            const readMark=document.createElement("span");
            readMark.className="read-status"; readMark.textContent="已讀";
            userMsg.appendChild(readMark);
            chatBox.appendChild(friendMsg); chatBox.scrollTop=chatBox.scrollHeight;
        },1000);
    })
    .catch(err=>console.error(err));
});

function createMessageElement(text,type){
    const msg=document.createElement("div");
    msg.className=`message ${type}`; msg.textContent=text;
    return msg;
}
