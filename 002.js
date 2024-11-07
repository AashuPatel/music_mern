document.title = "Udd chaliye"
console.log("Aashu")
let currSong = new Audio();
let fldr;
let linkk;
let songs;
let curplay;

async function getSongs(fldr) {
    let a = await fetch(fldr);
    let response = await a.text();
    // console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    // console.log(div)

    let as = div.getElementsByTagName("a");
    let songss = [];

    for (let i = 0; i < as.length; i++) {
        const element = as[i];

        if (element.href.endsWith(".mp3")) {
            let a = element.href.split("/Playlist/")[1]
            songss.push(a)
        }

    }
    return songss;

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
        Playlist.push(element.href)


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

async function getsonglist(linkk) {
    //get songlist
    songs = await getSongs(linkk)
    console.log("now")
    console.log(songs)


    //show in Library
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    let chk = 0;
    for (const song of songs) {
        if (chk == 0) {
            currSong.src = "/Playlist/" + song
            chk = 1;
            document.querySelector(".songinfo").innerHTML = song.split("/")[1];
            document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
            songUL.innerHTML = ""

        }

        let a = song.replaceAll(".mp3", ""); // .replaceAll("_", " ").replaceAll(".mp3", "").replaceAll("(256k)", "")
        a = a.split("/")[1];
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

}



async function main() {



    // Adding Playlist


    let Playlists = await getFolder();

    let PlayUl = document.getElementById("playlst")

    for (const lst of Playlists) {
        const response = await fetch(`${lst}info.json`)
        const data = await response.json();
        console.log(data)
        PlayUl.innerHTML = PlayUl.innerHTML + `
                    <div class="card">
                        <a href="${lst}"></a>
                        <div class="playbtn">
                            <img src="play.svg" alt="">
                        </div>

                        <img src= ${data.img} alt="">
                        <h3>${data.Title}</h3>
                        <p> ${data.Description}</p>

                    </div>`
    }


    await getsonglist(Playlists[0]);


    //Changing Library wth choosen playlist


    Array.from(document.getElementById("playlst").getElementsByTagName("div")).forEach(e => {
        e.addEventListener("click", async element => {
            console.log(e);
            
            const index = Array.from(e.parentNode.children).indexOf(e);
            let chk = Playlists[index];
            console.log(chk)
            curplay = chk.split("/Playlist/")[1];
            console.log(curplay)
            
            await getsonglist(chk);

            // Reset seekbar
            play.src = "play1.svg"
            document.querySelector(".circle").style.left = 0;

            //bring songbar

            if(window.innerWidth <= 1000){

                lft[0].style.zIndex = 1;
                lft[0].style.left = '0%';
                crss.style.display = 'block';
                hamburg.style.display = 'none';
            }


        })
    });


    //attatch Event Listner to each song

    document.querySelector(".songlist").addEventListener("click", function(event) {
        if (event.target.closest("li")) {
            const li = event.target.closest("li"); // Get the closest <li> if clicked inside
            playMusic(li.querySelector(".info").firstElementChild.innerHTML);
        }
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

    let hamburg = document.querySelector(".hamburger");
    let crss = document.querySelector(".cross");
    let lft = document.getElementsByClassName("left");

    hamburg.addEventListener('click', ()=>{
        lft[0].style.zIndex = 1;
        lft[0].style.left = '0%';
        crss.style.display = 'block';
        hamburg.style.display = 'none';
    })
    crss.addEventListener('click', ()=>{
        lft[0].style.zIndex = 0;
        lft[0].style.left = '-100%';
        crss.style.display = 'none';
        hamburg.style.display = 'block';
    })

    // next prev 


    document.getElementById('previous').addEventListener('click', ()=>{
        console.log("clicked prev")
        let z2 = currSong.src.split("/Playlist/").slice(1)
        let curIdx = songs.indexOf(z2.toString());

        if(curIdx == -1){
            z2 = currSong.src.split("/songs/").slice(1);
            let z3 = `Play1/${z2}`
            curIdx = songs.indexOf(z3.toString());
            console.log(curIdx);
        }
        if(curIdx == -1){
            z2 = currSong.src.split("/songs/").slice(1);
            let z3 = `${curplay}${z2}` 
            curIdx = songs.indexOf(z3.toString());                 
        }
        if(curIdx < songs.length && curIdx > 0){
            console.log(curIdx);
            playMusic(songs[curIdx - 1].split("/")[1].split(".")[0]);
        }
    })


    document.getElementById('next').addEventListener('click', ()=>{
        let z2 = currSong.src.split("/Playlist/").slice(1)
        let curIdx = songs.indexOf(z2.toString());

        if(curIdx == -1){
            z2 = currSong.src.split("/songs/").slice(1);
            let z3 = `Play1/${z2}`
            curIdx = songs.indexOf(z3.toString());
        }
        if(curIdx == -1){
            z2 = currSong.src.split("/songs/").slice(1);
            let z3 = `${curplay}${z2}` 
            curIdx = songs.indexOf(z3.toString());                 
        }
        if(curIdx < songs.length - 1 && curIdx >= 0){
            playMusic(songs[curIdx + 1].split("/")[1].split(".")[0]);
        }
    })




    // console.log(songUL.innerHTML)
    // let audio = new Audio(songs[0]);
    // audio.play();
}

main()

