const startButton = document.getElementById('start-button');
const candles = document.querySelectorAll('.candle');
const birthdayCard = document.getElementById('birthday-card');

async function startBlowingCandles() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Trình duyệt của bạn không hỗ trợ thu âm.");
        return;
    }

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        source.connect(analyser);

        function detectBlow() {
            analyser.getByteFrequencyData(dataArray);
            const volume = dataArray.reduce((a, b) => a + b) / dataArray.length;
            if (volume > 50) {  // Ngưỡng để phát hiện tiếng thổi
                blowOutCandles();
            }
            requestAnimationFrame(detectBlow);
        }

        detectBlow();
    } catch (error) {
        console.error("Không thể truy cập micro:", error);
    }
}

function blowOutCandles() {
    candles.forEach((candle) => {
        candle.style.backgroundColor = "gray";
        candle.style.opacity = 0.5;
        candle.style.animation = "none"; // Tắt hiệu ứng lung linh
    });
    birthdayCard.style.display = "block"; // Hiện thiệp chúc mừng
}

startButton.addEventListener('click', startBlowingCandles);
