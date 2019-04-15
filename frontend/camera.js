const video = document.querySelector("#videoElement");
            
if (navigator.mediaDevices.getUserMedia) {       
    navigator.mediaDevices.getUserMedia({video: true})
    .then(function(stream) {
        video.srcObject = stream;
        return video.play();
    })
    .then(()=>{ // enable the button
        const btn = document.querySelector('#button');
        btn.disabled = false;
        btn.onclick = e => {
            document.querySelector('.modal').classList.add('active');
            takeASnap()
            .then(download)
        };
    })
    .catch(function(error) {
        console.log("Something went wrong!");
    });
}

function takeASnap() {
    
    canvas.width = video.videoWidth; // set its size to the one of the video
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0,0); // the video
screenshot = canvas.toDataURL('image/jpeg')
    let dataUri = canvas.toDataURL('image/jpeg');
    let data = dataUri.split(',')[1];
    let mimeType = dataUri.split(';')[0].slice(5)

    let bytes = window.atob(data);
    let buf = new ArrayBuffer(bytes.length);
    let byteArr = new Uint8Array(buf);

    for (let i = 0; i < bytes.length; i++) {
        byteArr[i] = bytes.charCodeAt(i);
    }
    screenshot = byteArr;
    return new Promise((res, rej)=> {
        canvas.toBlob(res, 'image/jpeg'); // request a Blob from the canvas
    });
}

function makeBlob(dataURL) {

const BASE64_MARKER = ';base64,';
const parts = dataURL.split(BASE64_MARKER);
const contentType = parts[0].split(':')[1];
const raw = window.atob(parts[1]);
const rawLength = raw.length;

const uInt8Array = new Uint8Array(rawLength);

    for (var i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], { type: contentType });
}

function download(blob){ 
    // screenshot = canvas.toDataURL(blob);
    // screenshot = URL.createObjectURL(blob);
    // screenshot = screenshot.slice(5);
    processImage();
    // a.download = 'screenshot.jpg';
}