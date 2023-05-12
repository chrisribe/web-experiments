const GetSpeech = () => {
    const SpeechRecognition =  window.SpeechRecognition || window.webkitSpeechRecognition;

    let recognition = new SpeechRecognition();
    recognition.onstart = () => {
        setMsgToElement("status", "SpeechRecognition now listening, go ahead and speak in the microphone now!");
    }
    recognition.onspeechend = () => {
        setMsgToElement("status", "SpeechRecognition listen stopped");
        recognition.stop();
    }
    recognition.onresult = (result) => {
        setMsgToElement("output", result.results[0][0].transcript);
    }

    recognition.start();
}

function setMsgToElement(elId, msg) {
    document.getElementById(elId).innerHTML = msg;
}
