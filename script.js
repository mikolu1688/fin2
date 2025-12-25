/* ===== 聊天系統 + 30秒倒數定位 ===== */
const chatBox = document.getElementById("chat-box");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");

chatForm.addEventListener("submit", e=>{
  e.preventDefault();
  const text = chatInput.value.trim();
  if(!text) return;

  addMsg(text,"user");
  chatInput.value="";

  const wait = document.createElement("div");
  wait.className="message friend";
  const txt = document.createElement("div");
  let sec = 30;
  txt.textContent=`⏳ 等待對方回覆中… ${sec}秒`;

  const barWrap=document.createElement("div");
  barWrap.className="progress-container";
  const bar=document.createElement("div");
  bar.className="progress-bar";
  barWrap.appendChild(bar);

  wait.appendChild(txt);
  wait.appendChild(barWrap);
  chatBox.appendChild(wait);
  chatBox.scrollTop=chatBox.scrollHeight;

  const timer=setInterval(()=>{
    sec--;
    txt.textContent=`⏳ 等待對方回覆中… ${sec}秒`;
    bar.style.width=(sec/30*100)+"%";
    if(sec<=0) clearInterval(timer);
  },1000);

  setTimeout(()=>{
    wait.remove();
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(pos=>{
        addMsg(
          `⚡ 30秒未回覆，已自動回傳定位：${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`,
          "friend"
        );
      });
    }
  },30000);
});

function addMsg(text,type){
  const d=document.createElement("div");
  d.className=`message ${type}`;
  d.textContent=text;
  chatBox.appendChild(d);
  chatBox.scrollTop=chatBox.scrollHeight;
}

/* ===== DeviceOrientation 行動感測器 ===== */
const sensorBtn=document.getElementById("sensorBtn");
const alphaEl=document.getElementById("alpha");
const betaEl=document.getElementById("beta");
const gammaEl=document.getElementById("gamma");

sensorBtn.addEventListener("click",async()=>{
  try{
    if(typeof DeviceOrientationEvent==="undefined"){
      alert("此裝置不支援感測器");
      return;
    }

    if(typeof DeviceOrientationEvent.requestPermission==="function"){
      const res=await DeviceOrientationEvent.requestPermission();
      if(res!=="granted"){
        alert("未授權感測器");
        return;
      }
    }

    window.addEventListener("deviceorientation",e=>{
      alphaEl.textContent=e.alpha?.toFixed(2) ?? "-";
      betaEl.textContent=e.beta?.toFixed(2) ?? "-";
      gammaEl.textContent=e.gamma?.toFixed(2) ?? "-";
    });

    sensorBtn.disabled=true;
    sensorBtn.textContent="感測器已啟動";

  }catch(err){
    alert("錯誤："+err);
  }
});
