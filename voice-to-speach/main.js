const GetSpeech = () => {
    setMsgToElement("status", "clicked microphone");
    const SpeechRecognition =  window.SpeechRecognition || window.webkitSpeechRecognition;

    let recognition = new SpeechRecognition();
    recognition.onstart = () => {
        setMsgToElement("status", "start listening, speak in microphone now");
    }
    recognition.onspeechend = () => {
        setMsgToElement("status", "speechend: stop listening now");
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
