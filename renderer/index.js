const coverImg = document.getElementById("cover");
const songName = document.getElementById("song-name");
const artistName = document.getElementById('artist');
const playButton = document.getElementById("play")
const nextButton = document.getElementById("playNext")
const prevButton = document.getElementById("playPrev")
const shuffleButton = document.getElementById("shuffle")
const timeText = document.getElementById("time")
let audioDuration;

const playlist = [
    {   id: 1,
        title: 'Still Monster',
        artist: 'ENHYPEN',
        src: './songs/Still Monster.mp3',
        cover: './png/orangeBlood.jpg'
    },{   id: 2,
        title: 'Fatal Trouble',
        artist: 'ENHYPEN',
        src: './songs/Fatal Trouble.mp3',
        cover: './png/memorabilia.jpg'
    },
    {   id: 3,
        title: 'Somebody that I used to know',
        artist: 'Gotye',
        src: './songs/gotye.mp3',
        cover: './png/gotye.jpg'
    },
    {   id: 4,
        title: 'Sweater Weather',
        artist: 'The Neighbourhood',
        src: './songs/sweater weather.mp3',
        cover: './png/sweater.jpg'
    },
    {   id: 5,
        title: 'Softcore',
        artist: 'The Neighbourhood',
        src: './songs/softcore.mp3',
        cover: './png/softcore.jpg'
    },
    
]

const audio = new Audio();
let userData = {
  songs: [...playlist],
  currentSong: null,
  songCurrentTime: 0,
  isShuffle: false,
};

const playSong = (id) => {
    const song = userData.songs.find(song => song.id === id);
    if (userData.currentSong === null || userData.currentSong.id !== song.id) {
        audio.currentTime = 0;
    } else {
        audio.currentTime = userData.songCurrentTime;
    }

    userData.currentSong = song;

    audio.src = song.src;
    audio.title = song.title;

    songName.textContent = song.title;
    artistName.textContent = song.artist;
    coverImg.style.backgroundImage = `url(${song.cover})`;
    timeText.textContent = "0:00";
    playButton.classList.remove("notPlaying");
    playButton.classList.add("playing");
    if (artistName.offsetWidth > 120) {
        artistName.style.fontSize = '1rem'
        artistName.style.padding = '5px 5px 0px 5px'
    }
    else {
        artistName.style.fontSize = '1.3rem'
        artistName.style.padding = '5px 20px 0px 5px'
    }
    audio.play();
    getCurrentTime();
};

const playNextSong = () => {
    const songPlaying = getCurrentSongIndex();
    if (userData.isShuffle) {
        const randomIndex = Math.floor(Math.random() * userData.songs.length);
        if(randomIndex !== songPlaying) {
        playSong(userData.songs[randomIndex].id);
        }
        else if (songPlaying === userData.songs.length - 1) {
            playSong(userData.songs[0].id);
        }
        else {
            playSong(userData.songs[randomIndex + 1].id);
        }
    } else {
        
        if (songPlaying === userData.songs.length - 1) {
            playSong(userData.songs[0].id);
        } else {
            const nextSong = userData.songs[songPlaying + 1];
            playSong(nextSong.id);
        }
    }
};

const playPrevSong = () => {
    if (userData?.currentSong === null || userData?.currentSong.id === 1) {
        playSong(userData?.songs[0].id)
    }
   else {
    const currentSong = getCurrentSongIndex();
    console.log(currentSong)
    const prevSong = userData?.songs[currentSong - 1];
    playSong(prevSong.id);
   }
}

const pauseSong = () => {
    if (userData?.currentSong !== null) {
        userData.songCurrentTime = audio.currentTime 
        audio.pause()
        playButton.classList.add("notPlaying")
        playButton.classList.remove("playing")
    }
}


const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

const getCurrentTime = () => {
    const timer = setInterval(() => {
        const currentTime = audio.currentTime;
       timeText.textContent =formatTime(currentTime);
    }, 1000);
}


const getCurrentSongIndex = () => userData?.songs.indexOf(userData?.currentSong);

playButton.addEventListener("click", () => {
    if (playButton.classList.contains("notPlaying")) {
        if (userData.currentSong === null) {
            playSong(userData.songs[0].id);
        } else {
            audio.currentTime = userData.songCurrentTime;
            audio.play();
            playButton.classList.remove("notPlaying");
            playButton.classList.add("playing");
        }
    } else {
        pauseSong();
    }
});
audio.addEventListener("ended", () => {
    const lastSong = getCurrentSongIndex()
    if (lastSong === userData.songs.length - 1) {
        playSong(userData?.songs[0].id);
    }
    else {
    playNextSong()
    }
})

shuffleButton.addEventListener("click", () => {
    userData.isShuffle = !userData.isShuffle;
    shuffleButton.classList.toggle("shuffleOn");
});
nextButton.addEventListener("click", playNextSong)
prevButton.addEventListener("click", playPrevSong)
