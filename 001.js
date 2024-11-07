document.title = "Udd chaliye"
console.log("Aashu")
let currSong = new Audio();

async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/songs/");
    let response = await a.text();
    // console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    // console.log(div)

    let as = div.getElementsByTagName("a");
    let songs = [];

    for (let i = 0; i < as.length; i++) {
        const element = as[i];

        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])
        }

    }
    return songs;

}
async function getFolder() {
    let a = await fetch("http://127.0.0.1:3000/Playlist/");
    let response = await a.text();
    // console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    // console.log(div)

    let as = div.getElementsByTagName("a");
    // console.log(as)
    let Playlist = [];

    for (let i = 1; i < as.length; i++) {
        const element = as[i];
        Playlist.push(element.href.split("/Playlist/")[1])

    }
    return Playlist;

}


const playMusic = (track) => {
    // console.log(track); 
    currSong.src = "/songs/" + track + ".mp3"
    //let audio = new Audio("/songs/" + track + ".mp3"); // Use 'track' instead of 'e'
    currSong.play();
    play.src = "pause.svg"

    document.querySelector(".songinfo").innerHTML = track;

}



async function main() {

    //get songlist
    let songs = await getSongs()
    console.log(songs)


    //show in Library
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    let chk = 0;
    for (const song of songs) {
        if (chk == 0) {
            currSong.src = "/songs/" + song
            chk = 1;
            document.querySelector(".songinfo").innerHTML = song;
            document.querySelector(".songtime").innerHTML = "00:00 / 00:00"

        }

        let a = song.replaceAll(".mp3", ""); // .replaceAll("_", " ").replaceAll(".mp3", "").replaceAll("(256k)", "")
        songUL.innerHTML = songUL.innerHTML + `<li>
                            <img src="music.svg" alt="" class="invert">
                            <div class="info">
                                <div>${a}</div>
                                <div class = "artist">Song Artist</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now </span>
                                <img src="play1.svg" alt="" class="invert">
                            </div>
        
        </li>`;
    }

    // Adding Playlist


    let Playlists = await getFolder();

    let PlayUl = document.getElementById("playlst")

    for (const lst of Playlists) {
        PlayUl.innerHTML = PlayUl.innerHTML + `                    <div class="card">
                        <div class="playbtn">
                            <img src="play.svg" alt="">
                        </div>

                        <img src="https://i.scdn.co/image/ab67616d00001e02aad3f4b601ae8763b3fc4e88" alt="">
                        <h3>2024 Hits ad</h3>
                        <p> Lorem ipsum dolor, sit amet.</p>

                    </div>`
    }


    //Changing Library wth choosen playlist

    Array.from(document.getElementById("playlst").getElementsByTagName("div")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e);

        })
    });


    //attatch Event Listner to each song

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML)

        })
    });

    // Attatch eventlistner to play next prev

    play.addEventListener("click", () => {
        if (currSong.paused) {
            currSong.play()
            play.src = "pause.svg"
        } else {
            currSong.pause();
            play.src = "play1.svg"
        }
    })


    // Listen for time update
    // Update song time only when metadata is loaded
    currSong.addEventListener("loadedmetadata", () => {
        let ttlmin = Math.floor(currSong.duration / 60);
        let ttlsec = Math.floor(currSong.duration % 60);
        ttlmin = ttlmin < 10 ? "0" + ttlmin : ttlmin;
        ttlsec = ttlsec < 10 ? "0" + ttlsec : ttlsec;
        document.querySelector(".songtime").innerHTML = `00:00 / ${ttlmin}:${ttlsec}`;
    });

    // Listen for time update
    currSong.addEventListener("timeupdate", () => {
        let currmin = Math.floor(currSong.currentTime / 60);
        let currsec = Math.floor(currSong.currentTime % 60);
        let ttlmin = Math.floor(currSong.duration / 60);
        let ttlsec = Math.floor(currSong.duration % 60);

        currmin = currmin < 10 ? "0" + currmin : currmin;
        currsec = currsec < 10 ? "0" + currsec : currsec;
        ttlmin = ttlmin < 10 ? "0" + ttlmin : ttlmin;
        ttlsec = ttlsec < 10 ? "0" + ttlsec : ttlsec;

        document.querySelector(".songtime").innerHTML = `${currmin}:${currsec} / ${ttlmin}:${ttlsec}`;

        document.querySelector(".circle").style.left = `${Math.floor((currSong.currentTime / currSong.duration) * 100)}%`

    });

    // moving seekbar circle

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percentplay = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percentplay + "%";

        currSong.currentTime = (currSong.duration * percentplay) / 100
    })

    const circlee = document.getElementById('circlee');
    const skbar = document.getElementById('skbar');

    skbar.addEventListener('click', () => {
        circlee.classList.add('transition-0s'); // No transition on first click
        setTimeout(() => {
            circlee.classList.remove('transition-0s'); // Revert back to 2s transition after the first click
        }, 0);

    });



    // console.log(songUL.innerHTML)
    // let audio = new Audio(songs[0]);
    // audio.play();
}

main()

