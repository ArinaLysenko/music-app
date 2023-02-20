let search = new URLSearchParams(window.location.search);
let i = search.get(`i`);
// готово! i это нужное нам число
let container = document.querySelector(`.album`);

let album = albums[i];
if (!album) {
  renderError();
} else {
  renderAlbumInfo();

  renderTracks();

  setupAudio();
}

// обработка ошибки если нет альбома
function renderError() {
  container.innerHTML = `Ошибка. Возвращаемся на главную страниц...`;
  setTimeout(() => {
    window.location.pathname = `index.html`;
  }, 5000);
}

// отрисовываем альбом
function renderAlbumInfo() {
  container.innerHTML = `
  <div class="card mb-3">
  <div class="row g-0">
      <div class="col-md-4">
          <img src="${album.img}" alt="..." class="img-fluid rounded-start">
      </div>
      <div class="col-md-8">
          <div class="card-body">
              <h5 class="card-title">${album.title}</h5>
              <p class="card-text">${album.description}</p>
              <p class="card-text"><small class="text-muted">Сборник выпущен в ${album.year} году</small></p>
          </div>
      </div>
  </div>
  </div>
  `;
}

// отрисовываем трэки

function renderTracks() {
  let playlist = document.querySelector(`.playlist`);
  let tracks = album.tracks;

  for (let j = 0; j < tracks.length; j++) {
    let track = tracks[j];
    playlist.innerHTML += `
       <li class="track list-group-item d-flex align-item-center">
                      <img src="assets/play.png" alt="" class="me-3 play" height="30px">
                      <div>
                        <div>${track.title}</div>
                        <div class="text-secondary">${track.author}</div>
                      </div> 
                      <div class="progress">
                          <div class="progress-bar" role="progressbar" style="width: 0%;"></div>
                      </div>
                      <div class="ms-auto time">${track.time}</div>
                      <audio class="audio" src="${track.src}"></audio>
                  </li>
       `;
  }
}

// настраиваем воспроизведение
function setupAudio() {
  // Найди коллекцию с треками
  let trackNodes = document.querySelectorAll(`.track`);
  for (let i = 0; i < trackNodes.length; i++) {
    // let track = tracks[i];
    // Один элемент
    let node = trackNodes[i];
    let timeNode = document.querySelectorAll(`.time`);
    // Тег аудио внутри этого элемента
    let audio = node.querySelector(`.audio`);
    console.log(audio);
    let imgPlay = node.querySelector(`.play`);
    let progressBar = document.querySelectorAll(`.progress-bar`);

    let isPlaying = false;
    node.addEventListener(`click`, function () {
      // Если трек сейчас играет...
      if (isPlaying) {
        isPlaying = false;
        // Поставить на паузу
        audio.pause();
        imgPlay.src = `assets/play.png`;

        // Если трек сейчас не играет...
      } else {
        isPlaying = true;
        // Включить проигрывание
        audio.play();
        imgPlay.src = `assets/pause.png`;
        updateProgress();
      }
    });

    function updateProgress() {
      // Нарисовать актуальное время
      let time = getTime(audio.currentTime);
      if (time.innerHTML != time) {
        timeNode[i].innerHTML = time;
        progressBar[i].style.width =
          (audio.currentTime * 100) / audio.duration + `%`;
      }

      // Нужно ли вызвать её ещё раз?
      if (isPlaying) {
        requestAnimationFrame(updateProgress);
      }
    }
  }
}

// время воспроизведения треков
function getTime(time) {
  let currentSeconds = Math.floor(time);
  let minutes = Math.floor(currentSeconds / 60);
  // остаток от деления
  let seconds = Math.floor(currentSeconds % 60);

  if (minutes < 10) {
    minutes = `0` + minutes;
  }
  if (seconds < 10) {
    seconds = `0` + seconds;
  }
  return `${minutes}:${seconds}`;
}
