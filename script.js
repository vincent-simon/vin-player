const image = document.querySelector('img');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const audio = document.querySelector('audio');

const progressContainer = document.getElementById('progress-container');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const prevBtn = document.getElementById('prev');
const playBtn = document.getElementById('play');
const nextBtn = document.getElementById('next');

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const songs = [
  {
    name: 'KoobzZ',
    displayName: 'Dreaming a Reality',
    artist: 'KoobzZ',
  },
  {
    name: 'KoobzZ - Deeper Thoughts',
    displayName: 'Deeper Thoughts',
    artist: 'KoobzZ',
  },

  {
    name: 'jacinto-1',
    displayName: 'Electic Chill Machine',
    artist: 'Jacinto Design',
  },
  {
    name: 'jacinto-2',
    displayName: 'Seven Nation Army (Remix)',
    artist: 'Jacinto Design',
  },
  {
    name: 'jacinto-3',
    displayName: 'Goodnight, Disco Queen',
    artist: 'Jacinto Design',
  },
  {
    name: 'metric-1',
    displayName: 'Front Row (Remix) ',
    artist: 'Metro/Jacinto Design',
  },
];

// check if playing
let isPlaying = false;

// Play
function playSong() {
  isPlaying = true;
  playBtn.classList.replace('fa-play', 'fa-pause');
  playBtn.setAttribute('title', 'Pause');
  audio.play();
}

// Pause
function pauseSong() {
  playBtn.classList.replace('fa-pause', 'fa-play');
  playBtn.setAttribute('title', 'Play');
  isPlaying = false;
  audio.pause();
}

// play or pause event
playBtn.addEventListener('click', () => (isPlaying ? pauseSong() : playSong()));

// update de DOM
function loadSong(song) {
  title.textContent = song.displayName;
  artist.textContent = song.artist;
  audio.src = `music/${song.name}.mp3`;
  //audio.src = `http://127.0.0.1:5500/music/${song.name}.mp3`;
  // audio.src = `https://redsquirrrel.github.io/test-music-player/music/${song.name}.mp3`;
  image.src = `img/${song.name}.jpg`;
  //console.log(audio.src);
}

//current song
let songIndex = 0;

// next song
function nextSong() {
  songIndex++;
  if (songIndex > songs.length - 1) {
    songIndex = 0;
  }
  loadSong(songs[songIndex]);
  playSong();
}

// prev song
function prevSong() {
  songIndex--;
  if (songIndex < 0) {
    songIndex = songs.length - 1;
  }
  loadSong(songs[songIndex]);
  playSong();
}

// On load - select the First Song
loadSong(songs[songIndex]);

// update progress bar & time
function updateProgressBar(e) {
  if (isPlaying) {
    const { duration, currentTime } = e.srcElement;

    // update progress bar width
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;

    // Calculate display for duration
    const durationMinutes = Math.floor(duration / 60);

    let durationSeconds = Math.floor(duration % 60);
    if (durationSeconds < 10) {
      durationSeconds = `0${durationSeconds}`;
    }

    // delay switching duration Element to avoid NaN
    if (durationMinutes) {
      durationEl.textContent = `${durationMinutes}:${durationSeconds}`;
    }

    // Calculate display for current time
    const currentMinutes = Math.floor(currentTime / 60);

    let currentSeconds = Math.floor(currentTime % 60);
    if (currentSeconds < 10) {
      currentSeconds = `0${currentSeconds}`;
    }

    currentTimeEl.textContent = `${currentMinutes}:${currentSeconds}`;
  }
}

//  set progress bar
function setProgressBar(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const { duration } = audio;
  audio.currentTime = (clickX / width) * duration;
}

// event listeners
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
audio.addEventListener('ended', nextSong);
audio.addEventListener('timeupdate', updateProgressBar);
progressContainer.addEventListener('click', setProgressBar);

audio.crossOrigin = 'anonymous';

playBtn.addEventListener('click', () => {
  const context = new (window.AudioContext || window.webkitAudioContext)();
  const osc = context.createOscillator();
  osc.connect(context.destination);
  let src = context.createMediaElementSource(audio);

  const analyser = context.createAnalyser();
  src.connect(analyser);

  let bufferLength = analyser.frequencyBinCount;
  let dataArray = new Uint8Array(bufferLength);
  analyser.connect(context.destination);
  analyser.fftSize = 1024;

  let WIDTH = canvas.width;
  let HEIGHT = canvas.height;

  let barWidth = (WIDTH / bufferLength) * 14; // set the bar width
  let barHeight;
  let x = 0;
  hue = Math.random() * 360;
  hue = 0;

  function renderFrame() {
    requestAnimationFrame(renderFrame);
    x = 0;

    analyser.getByteFrequencyData(dataArray);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i] * 0.5; // set the bar height

      ctx.fillStyle = 'hsl(' + barHeight * 5 + ', 100%, 50%)';
      ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
      hue++;

      x += barWidth + 0.5; // set space between bars
    }
  }
  renderFrame();
});
