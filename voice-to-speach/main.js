const GetSpeech = () => {
    setStatus("clicked microphone");
    const SpeechRecognition =  window.SpeechRecognition || window.webkitSpeechRecognition;

    let recognition = new SpeechRecognition();
    recognition.onstart = () => {
        setStatus("start listening, speak in microphone now");
    }
    recognition.onspeechend = () => {
        setStatus("speechend: stop listening now");
        recognition.stop();
    }
    recognition.onresult = (result) => {
        setStatus(result.results[0][0].transcript);
    }

    recognition.start();
}

function setStatus(msg) {
    document.getElementById('status').innerHTML = msg;
}