```javascript
// ======================================
// DA14585 Web Tool
// app.js
// ======================================

import { BLEManager } from "./ble.js";
import { FirmwareManager } from "./firmware.js";
import { WatchFaceManager } from "./watchface.js";

const ble = new BLEManager();
const firmware = new FirmwareManager(ble);
const watchface = new WatchFaceManager(ble);

//==============================
// DOM
//==============================

const connectBtn = document.getElementById("connectBtn");
const disconnectBtn = document.getElementById("disconnectBtn");
const syncBtn = document.getElementById("syncBtn");
const calBtn = document.getElementById("calBtn");

const uploadFirmwareBtn = document.getElementById("uploadFirmwareBtn");
const uploadImageBtn = document.getElementById("uploadImageBtn");

const firmwareInput = document.getElementById("firmwareInput");
const imageInput = document.getElementById("imageInput");

const status = document.getElementById("status");
const deviceName = document.getElementById("deviceName");
const batteryVoltage = document.getElementById("batteryVoltage");
const firmwareVersion = document.getElementById("firmwareVersion");
const deviceTime = document.getElementById("deviceTime");
const pcTime = document.getElementById("pcTime");

const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");

const logBox = document.getElementById("log");

//==============================
// LOG
//==============================

function log(message){

    const time = new Date().toLocaleTimeString();

    logBox.value += "[" + time + "] " + message + "\n";

    logBox.scrollTop = logBox.scrollHeight;

}

//==============================

document.getElementById("clearLog").onclick = ()=>{

    logBox.value="";

};

//==============================
// Progress
//==============================

function setProgress(percent){

    progressBar.style.width = percent + "%";

    progressText.innerHTML = percent + "%";

}

//==============================
// Update PC Time
//==============================

setInterval(()=>{

    pcTime.innerHTML = new Date().toLocaleString();

},1000);

//==============================
// CONNECT
//==============================

connectBtn.onclick = async()=>{

    try{

        log("Searching Bluetooth Device...");

        await ble.connect();

        status.innerHTML="Connected";

        status.className="value green";

        deviceName.innerHTML=ble.device.name;

        connectBtn.disabled=true;
        disconnectBtn.disabled=false;

        syncBtn.disabled=false;
        calBtn.disabled=false;

        uploadFirmwareBtn.disabled=false;
        uploadImageBtn.disabled=false;

        batteryVoltage.innerHTML = await ble.readBattery();

        firmwareVersion.innerHTML = await ble.readVersion();

        deviceTime.innerHTML = await ble.readTime();

        log("Connected");

    }
    catch(e){

        log(e.message);

    }

};

//==============================
// Disconnect
//==============================

disconnectBtn.onclick=()=>{

    ble.disconnect();

    status.innerHTML="Disconnected";

    status.className="value red";

    deviceName.innerHTML="-";

    batteryVoltage.innerHTML="-";

    firmwareVersion.innerHTML="-";

    deviceTime.innerHTML="-";

    connectBtn.disabled=false;

    disconnectBtn.disabled=true;

    syncBtn.disabled=true;

    calBtn.disabled=true;

    uploadFirmwareBtn.disabled=true;

    uploadImageBtn.disabled=true;

    log("Disconnected");

};

//==============================
// Sync Time
//==============================

syncBtn.onclick = async()=>{

    try{

        log("Sync Time...");

        await ble.syncTime();

        deviceTime.innerHTML=await ble.readTime();

        log("Sync Complete");

    }
    catch(e){

        log(e.message);

    }

};

//==============================
// Calibration
//==============================

calBtn.onclick = async()=>{

    try{

        log("Calibration...");

        await ble.calibration();

        log("Calibration Finished");

    }
    catch(e){

        log(e.message);

    }

};

//==============================
// Firmware
//==============================

uploadFirmwareBtn.onclick = async()=>{

    if(firmwareInput.files.length===0){

        alert("Please Select Firmware");

        return;

    }

    const file=firmwareInput.files[0];

    log("Firmware : "+file.name);

    firmware.onProgress=(p)=>{

        setProgress(p);

    };

    try{

        await firmware.upload(file);

        log("Firmware Upload Complete");

    }
    catch(e){

        log(e.message);

    }

};

//==============================
// Watch Face
//==============================

uploadImageBtn.onclick = async()=>{

    if(imageInput.files.length===0){

        alert("Please Select Image");

        return;

    }

    const file=imageInput.files[0];

    log("Image : "+file.name);

    watchface.onProgress=(p)=>{

        setProgress(p);

    };

    try{

        await watchface.upload(file);

        log("Watch Face Upload Complete");

    }
    catch(e){

        log(e.message);

    }

};

//==============================
// Preview Image
//==============================

imageInput.onchange = ()=>{

    const file=imageInput.files[0];

    if(!file) return;

    const reader=new FileReader();

    reader.onload=(e)=>{

        const img=new Image();

        img.onload=()=>{

            const canvas=document.getElementById("preview");

            const ctx=canvas.getContext("2d");

            ctx.clearRect(0,0,canvas.width,canvas.height);

            ctx.drawImage(img,0,0,250,122);

        };

        img.src=e.target.result;

    };

    reader.readAsDataURL(file);

};

log("DA14585 Web Tool Ready");
setProgress(0);
```
