// last visit animation calculations, so to not re-show animation
const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const lastVisit = localStorage.getItem('lastVisitTime');
const visitedForPage = sessionStorage.getItem('visitedForPage');
const now = Date.now();
let showIntro = true;
if (lastVisit) {
    if (visitedForPage) {
        showIntro = false;
    } else {
        const minElapsed = Math.ceil((now - parseInt(lastVisit)) / (1000 * 60))
        // default replay on every new page session
        let introReplayExpiration = {{ cond (isset .Site.Params "introreplayexpiration") .Site.Params.introReplayExpiration 0 }}
        showIntro = (!isReducedMotion && minElapsed > introReplayExpiration) ? true : false;
    }
}
document.documentElement.setAttribute('showIntro', showIntro.toString());
localStorage.setItem('lastVisitTime', `${now}`);
sessionStorage.setItem('visitedForPage', 'true');

let revealElementIds = ["header-container", "main-container", "footer-container"];
function revealElements() {
    revealElementIds.forEach(id => {
        const el = document.getElementById(id);
        if (el !== null) {
            el.removeAttribute("hidden");
        }
    })
}
function fadeInElements() {
    revealElementIds.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el !== null) {
            el.classList.add("delay");
            el.classList.add("t-" + i);
        }
    })
}

window.addEventListener("DOMContentLoaded", event => {
    // if just return, remove the hidden attribute in the containers
    if (!showIntro) {
        revealElements();
        return;
    }
    if (typeof anime === 'function') {
        const numLetters = document.querySelectorAll('#intro .letter').length;
        // staggering delay of each letter
        const delayStepMilli = {{ default 25 .Site.Params.letterDelay }};
        const duration = numLetters * delayStepMilli;
        const lingerDelay = {{ default 300 .Site.Params.completeLingerDelay }};
        const fadeOutDuration = {{ default 300 .Site.Params.completeFadeOutDuration }};

        // unable to chain finished/completed callback on the whole anime.timeline sequence
        // breaking them into separate animations
        const introAnimation = anime({
            targets: '#intro .letter',
            opacity: [0, 1],
            easing: "easeInOutQuad",
            duration: duration,
            delay: (el, i) => delayStepMilli * (i+1)
        });
        introAnimation.finished.then(() => {
                const outroAnimation = anime({
                    targets: '#intro',
                    opacity: 0,
                    duration: fadeOutDuration,
                    easing: "easeInOutQuad",
                    delay: lingerDelay
                });
                outroAnimation.finished.then(() => {
                    revealElements()
                    fadeInElements()
                });
        });
    }
}, {once: true});

