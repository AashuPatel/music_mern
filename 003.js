document.title = "Udd chaliye";
console.log("Aashu");
let currSong = new Audio();
let songs = [];
let curplay;

// Fetch songs from a given folder
async function getSongs(fldr) {
    let response = await fetch(fldr);
    let text = await response.text();
    let div = document.createElement("div");
    div.innerHTML = text;

    let as = div.getElementsByTagName("a");
    let songss = [];

    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {
            songss.push(element.href.split("/Playlist/")[1]);
        }
    }
    return songss;
}

// Fetch playlist folders
async function getFolder() {
    let response = await fetch("http://127.0.0.1:3000/Playlist/");
    let text = await response.text();
    let div = document.createElement("div");
    div.innerHTML = text;

    let as = div.getElementsByTagName("a");
    let Playlist = [];
    for (let i = 1; i < as.length; i++) {
        Playlist.push(as[i].href);
    }
    return Playlist;
}

// Play the selected track
const playMusic = (track) => {
    currSong.src = "/songs/" + track + ".mp3";
    currSong.play();
    play.src = "pause.svg";
    document.querySelector(".songinfo").innerHTML = track.split("/").pop();
};

// Load songs into the playlist
async function getsonglist(linkk) {
    songs = await getSongs(linkk);
    console.log("Loaded songs:", songs);

    let songUL = document.querySelector(".songlist ul");
    songUL.innerHTML = ""; // Clear previous songs

    if (songs.length > 0) {
        playMusic(songs[0].split("/")[1].split(".")[0]); // Auto-play first song
    }

    songs.forEach(song => {
        let a = song.replace(".mp3", "").split("/").pop();
        songUL.innerHTML += `
            <li>
                <img src="music.svg" alt="" class="invert">
                <div class="info">
                    <div>${a}</div>
                    <div class="artist">Song Artist</div>
                </div>
                <div class="playnow">
                    <span>Play Now </span>
                    <img src="play1.svg" alt="" class="invert">
                </div>
            </li>`;
    });
}

// Main function to initialize the player
async function main() {
    let Playlists = await getFolder();
    let PlayUl = document.getElementById("playlst");

    Playlists.forEach(lst => {
        PlayUl.innerHTML += `
            <div class="card">
                <a href="${lst}"></a>
                <div class="playbtn">
                    <img src="play.svg" alt="">
                </div>
                <img src="https://i.scdn.co/image/ab67616d00001e02aad3f4b601ae8763b3fc4e88" alt="">
                <h3>2024 Hits ad</h3>
                <p>Lorem ipsum dolor, sit amet.</p>
            </div>`;
    });

    await getsonglist(Playlists[0]);

    // Event listeners for playlist selection
    Array.from(document.getElementById("playlst").getElementsByTagName("div")).forEach(e => {
        e.addEventListener("click", async () => {
            const index = Array.from(e.parentNode.children).indexOf(e);
            let chk = Playlists[index];
            curplay = chk.split("/Playlist/")[1];
            await getsonglist(chk);
        });
    });

    // Attach event listener to play songs from the list
    document.querySelector(".songlist").addEventListener("click", function(event) {
        if (event.target.closest("li")) {
            const li = event.target.closest("li");
            playMusic(li.querySelector(".info").firstElementChild.innerHTML);
        }
    });

    // Play/Pause functionality
    play.addEventListener("click", () => {
        if (currSong.paused) {
            currSong.play();
            play.src = "pause.svg";
        } else {
            currSong.pause();
            play.src = "play1.svg";
        }
    });

    // Update song time and progress
    currSong.addEventListener("loadedmetadata", () => {
        let ttlmin = Math.floor(currSong.duration / 60);
        let ttlsec = Math.floor(currSong.duration % 60);
        document.querySelector(".songtime").innerHTML = `00:00 / ${ttlmin < 10 ? '0' : ''}${ttlmin}:${ttlsec < 10 ? '0' : ''}${ttlsec}`;
    });

    currSong.addEventListener("timeupdate", () => {
        let currmin = Math.floor(currSong.currentTime / 60);
        let currsec = Math.floor(currSong.currentTime % 60);
        let ttlmin = Math.floor(currSong.duration / 60);
        let ttlsec = Math.floor(currSong.duration % 60);

        document.querySelector(".songtime").innerHTML = `${currmin < 10 ? '0' : ''}${currmin}:${currsec < 10 ? '0' : ''}${currsec} / ${ttlmin < 10 ? '0' : ''}${ttlmin}:${ttlsec < 10 ? '0' : ''}${ttlsec}`;
        document.querySelector(".circle").style.left = `${Math.floor((currSong.currentTime / currSong.duration) * 100)}%`;
    });

    // Seek bar functionality
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percentplay = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percentplay + "%";
        currSong.currentTime = (currSong.duration * percentplay) / 100;
    });

    // Hamburger menu functionality
    let hamburg = document.querySelector(".hamburger");
    let crss = document.querySelector(".cross");
    let lft = document.getElementsByClassName("left");

    hamburg.addEventListener('click', () => {
        lft[0].style.zIndex = 1;
        lft[0].style.left = '0%';
        crss.style.display = 'block';
        hamburg.style.display = 'none';
    });
    crss.addEventListener('click', () => {
        lft[0].style.zIndex = 0;
        lft[0].style.left = '-100%';
        crss.style.display = 'none';
        hamburg.style.display = 'block';
    });

    // Previous and Next buttons functionality
    const getCurIdx = () => {
        const currentSrc = currSong.src.split("/Playlist/").slice(1).join("/");
        return songs.indexOf(currentSrc);
    };

    document.getElementById('previous').addEventListener('click', () => {
        const curIdx = getCurIdx();
        if (curIdx > 0) {
            playMusic(songs[curIdx - 1].split("/")[1].split(".")[0]);
        }
    });

    document.getElementById('next').addEventListener('click', () => {
        const curIdx = getCurIdx();
        if (curIdx < songs.length - 1) {
            playMusic(songs[curIdx + 1].split("/")[1].split(".")[0]);
        }
    });
}

main();
