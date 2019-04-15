let screenshot;
const canvas = document.createElement('canvas'); // create a canvas
const ctx = canvas.getContext('2d'); // get its context
let faceId;
function processImage() {
    // Replace <Subscription Key> with your valid subscription key.
    var subscriptionKey = "5882f9eb1ff3442fa4beaf16c491edfe";

    // NOTE: You must use the same region in your REST call as you used to
    // obtain your subscription keys. For example, if you obtained your
    // subscription keys from westus, replace "westcentralus" in the URL
    // below with "westus".
    //
    // Free trial subscription keys are generated in the "westus" region.
    // If you use a free trial subscription key, you shouldn't need to change 
    // this region.
    var uriBase =
        "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=false";
    

    // Perform the REST API call.
    let data = canvas.toDataURL('image/jpeg');

    fetch(uriBase, {
        method: 'POST',
        body: makeBlob(data),
        headers: {
            'Content-Type': 'application/octet-stream',
            'Ocp-Apim-Subscription-Key': '5882f9eb1ff3442fa4beaf16c491edfe'
        }
    })  
        .then(res => res.json())
        .then(response => {
            faceId = response[0].faceId;
            return verify(faceId);
        })
        .catch(err => {
            setTimeout(function(){
            document.querySelector('.modal').classList.remove('active');
            window.alert("You are not Andy...")    
          }, 2000);
        });

    }

    // $.ajax({
    //     url: uriBase,
    //     // Request headers.
    //     beforeSend: function(xhrObj){
    //         xhrObj.setRequestHeader("Content-Type","application/octet-stream");
    //         xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
    //     },

    //     type: "POST",
    //     // Request body.
    //     data: screenshot,
    // })

    // .done(function(data) {
    //     // Show formatted JSON on webpage.
    //     $("#responseTextArea").val(JSON.stringify(data, null, 2));
    // })

    // .fail(function(jqXHR, textStatus, errorThrown) {
    //     // Display error message.
    //     var errorString = (errorThrown === "") ?
    //         "Error. " : errorThrown + " (" + jqXHR.status + "): ";
    //     errorString += (jqXHR.responseText === "") ?
    //         "" : (jQuery.parseJSON(jqXHR.responseText).message) ?
    //             jQuery.parseJSON(jqXHR.responseText).message :
    //                 jQuery.parseJSON(jqXHR.responseText).error.message;
    //     alert(errorString);
    // });
function verify(id) {
    var subscriptionKey = "5882f9eb1ff3442fa4beaf16c491edfe";
    var uriBase =
        "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/identify";

    fetch(uriBase, {
        method: 'POST',
        body: JSON.stringify({
            personGroupId: "users",
            faceIds: [id], 
        }),
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': '5882f9eb1ff3442fa4beaf16c491edfe'
    }
})  
    .then(res => res.json())
    .then(response => {
        if (response[0].candidates[0].confidence) {
        setTimeout(function(){
            window.alert("♥♥♥     Welcome back, Andy!!!!!!     ♥♥♥\nYou are now entering Andy's secret page :)  ")
            window.location = "http://localhost:3000/user"; 
        }, 2000);
          
        } 
    })
    .catch(err => {
        setTimeout(function(){
            document.querySelector('.modal').classList.remove('active');
            window.alert("You are not Andy...")    
        }, 2000);
    });
}
