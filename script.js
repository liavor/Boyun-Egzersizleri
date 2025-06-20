document.addEventListener('DOMContentLoaded', () => {
    const counterLabel = document.getElementById('counter');
    const setInfoLabel = document.getElementById('set-info');
    const startButton = document.getElementById('startButton');

    let currentCount = 0;
    let currentSet = 1;
    const TOTAL_SETS = 15;
    const COUNT_DURATION = 5; // Sayım süresi (saniye)
    const REST_DURATION = 2; // Mola süresi (saniye)

    let countdownInterval;
    let restInterval;

    // Küçük bir bip sesi çalmak için fonksiyon
    function playSound() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.type = 'sine'; // Sinüs dalgası (daha yumuşak bir bip için)
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // 440 Hz

        gainNode.gain.setValueAtTime(1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1); // Kısa bir fade out

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1); // 100 milisaniye sonra durdur
    }

    function startCountdown() {
        currentCount = 0;
        clearInterval(restInterval); // Mola sayacını durdur

        countdownInterval = setInterval(() => {
            currentCount++;
            counterLabel.textContent = currentCount;
            playSound(); // Her saniyede bip sesi çal

            if (currentCount >= COUNT_DURATION) {
                clearInterval(countdownInterval); // Sayım sayacını durdur
                counterLabel.textContent = `${currentSet}. set`;

                if (currentSet < TOTAL_SETS) {
                    startRest(); // Mola sürecini başlat
                } else {
                    counterLabel.textContent = "Tamamlandı!";
                    startButton.disabled = false; // Başla butonunu tekrar etkinleştir
                }
            }
        }, 1000); // Her 1 saniyede bir çalış
    }

    function startRest() {
        let restCountdown = REST_DURATION;
        counterLabel.textContent = `Mola: ${restCountdown}`;
        playSound(); // Mola başlangıcında bip sesi çal

        restInterval = setInterval(() => {
            restCountdown--;
            counterLabel.textContent = `Mola: ${restCountdown}`;
            playSound(); // Her saniyede bip sesi çal

            if (restCountdown <= 0) {
                clearInterval(restInterval); // Mola sayacını durdur
                currentSet++;
                setInfoLabel.textContent = `Set: ${currentSet} / ${TOTAL_SETS}`;
                startCountdown(); // Yeni set için sayımı başlat
            }
        }, 1000); // Her 1 saniyede bir çalış
    }

    startButton.addEventListener('click', () => {
        startButton.disabled = true; // Başla butonunu devre dışı bırak
        currentSet = 1; // Set sayacını sıfırla
        setInfoLabel.textContent = `Set: ${currentSet} / ${TOTAL_SETS}`;
        startCountdown(); // Sayacı başlat
    });
});