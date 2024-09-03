// Устанавливаем дату окончания отсчета (например, 30 дней от текущей даты)
const targetDate = new Date();
targetDate.setDate(targetDate.getDate() + 30);
targetDate.setHours(0, 0, 0, 0); // Устанавливаем время на полночь

function updateCountdown() {
    const now = new Date();
    const distance = targetDate - now;


    if (distance < 0) {
        document.querySelector('.countdown-container').innerHTML = "<div class='finished'>Отсчет завершен!</div>";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);


    document.getElementById('days').textContent = days < 10 ? '0' + days : days;
    document.getElementById('hours').textContent = hours < 10 ? '0' + hours : hours;
    document.getElementById('minutes').textContent = minutes < 10 ? '0' + minutes : minutes;
    document.getElementById('seconds').textContent = seconds < 10 ? '0' + seconds : seconds;
}


// Обновляем отсчет каждую секунду
setInterval(updateCountdown, 1000);

// Инициализируем отсчет при загрузке страницы
updateCountdown();

// Функция для скрытия видео и показа содержимого сайта
function handleVideoEnd() {
    document.querySelector('.video-overlay').style.display = 'none';
    document.getElementById('siteContent').classList.add('show-content');
    document.querySelector('.start-button').style.display = 'block'; // Показать кнопку "Start"
}

// Обработка завершения видео
document.getElementById('introVideo').addEventListener('ended', handleVideoEnd);

// Функция для перенаправления на новую страницу при нажатии кнопки "Start"
document.querySelector('.start-button').addEventListener('click', () => {
    window.location.href = '../page2/next-page.html'; // Переход на новую страницу в папке page2
});

// Запуск фоново аудио
// Глобальная переменная для аудио
// Глобальная переменная для аудио
let audio;

window.addEventListener('load', () => {
    audio = document.getElementById('background-audio');

    audio.addEventListener('canplaythrough', () => {
        console.log('Аудиофайл загружен и готов к воспроизведению.');
    });

    audio.addEventListener('error', (e) => {
        console.error('Ошибка при загрузке или воспроизведении аудиофайла:', e);
    });

    audio.loop = true; // Зацикливание аудио
});

// Запуск и остановка аудио при клике на красную кнопку
document.getElementById('playButton').addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        console.log('Аудио воспроизводится');
    } else {
        audio.pause();
        console.log('Аудио приостановлено');
    }
});
