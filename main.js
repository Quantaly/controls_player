(function () {
    const openInput = document.querySelector("#open-input");
    const playButton = document.querySelector("#play-button");
    const playerTitle = document.querySelector("#player-title");
    const playerAudio = document.querySelector("audio");
    const playlistList = document.querySelector("#playlist-list");
    const controls = document.querySelector("#controls");

    const controlActions = [
        secs => {
            return {
                label: `-> :${secs}`,
                action: () => playerAudio.currentTime = secs,
            };
        },
        secs => {
            return {
                label: `- :${secs}`,
                action: () => playerAudio.currentTime -= secs,
            };
        },
        secs => {
            return {
                label: `+ :${secs}`,
                action: () => playerAudio.currentTime += secs,
            };
        },
        secs => {
            return {
                label: `:${secs} <-`,
                action: () => {
                    if (playerAudio.duration === playerAudio.duration && playerAudio.duration !== Infinity) {
                        playerAudio.currentTime = playerAudio.duration - secs;
                    }
                },
            };
        },
    ];

    const controlSecses = [15, 30, 45, 60];

    controlSecses.forEach(s => {
        controlActions.forEach(a => {
            const action = a(s);
            const button = document.createElement("button");
            button.textContent = action.label;
            button.addEventListener("click", action.action);
            controls.appendChild(button);
        });
    });

    let playing = false;

    function handlePlay() {
        if (!playing) {
            const src = openInput.value;
            playerAudio.src = src;
            playerTitle.textContent = src;
            playerAudio.play();
            playing = true;
        } else {
            const li = document.createElement("li");
            li.textContent = openInput.value;
            playlistList.appendChild(li);
        }
        openInput.value = "";
    }

    openInput.addEventListener("submit", handlePlay);
    playButton.addEventListener("click", handlePlay);

    function handleEnd() {
        if (playlistList.hasChildNodes()) {
            const li = playlistList.firstChild;
            const src = li.textContent;
            playerAudio.src = src;
            playerTitle.textContent = src;
            li.remove();
            playerAudio.play();
        } else {
            playerAudio.src = "";
            playerTitle.textContent = " "; // non-breaking space (&nbsp;)
            playing = false;
        }
    }

    playerAudio.addEventListener("ended", handleEnd);

    // service worker
    if ("serviceWorker" in navigator && window.location.href.indexOf("localhost") < 0) {
        navigator.serviceWorker.register("sw.js");
    }
})();
