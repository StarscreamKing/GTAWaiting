// script.js
document.addEventListener("DOMContentLoaded", () => {
  // ----- Countdown -----
  const releaseDate = new Date("May 26, 2026 00:00:00").getTime();

  const timer = setInterval(function () {
    const now = new Date().getTime();
    const distance = releaseDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const el = document.getElementById("countdown");
    if (el) {
      el.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    if (distance < 0) {
      clearInterval(timer);
      if (el) el.textContent = "GTA 6 is out now!";
    }
  }, 1000);

  // ----- Bingo grid -----
  const LABELS = [
    "Epstein files released",
    "EA releases a game without microtransactions",
    "Apple makes a phone you can fix yourself",
    "Shiba Inu hits the moon",
    "Something beat a Jet 2 Holiday",
    "Leo has a girlfriend older than 27",
    "Vince returns to WWE",
    "Land Rover makes a reliable car",
    "North Korea wins Eurovision", // special case
    "New season of Firefly",
    "Netflix adds Are You Still Watching? as a paid feature",
    "Twitter (X) rebrands back to Twitter because no one calls it X",
    "GTA VI released before Half-Life 3",
    "Angela Rayner opens an OnlyFans",
    "Zuckerberg and Musk actually have a cage fight",
    "Elon Musk names his next kid something pronounceable, i.e. Keith",
    "Disney sues itself and wins",
    "FBI admits “X-Files” was actually a documentary",
    "Logan Paul actually becomes a good person",
    "Bonnie Blue identifies as a man...",
    "Linkedin rebrands as EgoHUB",
    "Facebook values privacy",
    "Google admits incognito mode never worked",
    "KFC runs out of chicken...again",
    "Apple releases iPhone with headphone jack “for nostalgia”",
  ];

  // Which boxes trigger a flash (label -> image path)
  const FLASH_IMAGES = {
    "Shiba Inu hits the moon": "./Images/joke7.gif",
    "Land Rover makes a reliable car": "./Images/Landrover.png",
    "Linkedin rebrands as EgoHUB": "./Images/Egohub1.png",
    "Epstein files released": "./Images/julie.gif",
    "KFC runs out of chicken...again": "./Images/kfc.png",
    "Angela Rayner opens an OnlyFans": "./Images/Stampduty.png",
    "Zuckerberg and Musk actually have a cage fight": "./Images/cagegith.png",
    "Leo has a girlfriend older than 27": "./Images/Leo84.png",
    "Netflix adds Are You Still Watching? as a paid feature":
      "./Images/Notflix.png",
    "Elon Musk names his next kid something pronounceable, i.e. Keith":
      "./Images/keith.png",
    "Something beat a Jet 2 Holiday": "./Images/rick.gif",
    "Vince returns to WWE": "./Images/vince.gif",
    "EA releases a game without microtransactions": "./Images/joke1.gif",
    "Apple makes a phone you can fix yourself": "./Images/jobs.gif",
    "New season of Firefly": "./Images/joke2.gif",
    "Logan Paul actually becomes a good person": "./Images/joke3.gif",
    "Disney sues itself and wins": "./Images/disney.gif",
    "Apple releases iPhone with headphone jack “for nostalgia”":
      "./Images/joke4.gif",
    "FBI admits “X-Files” was actually a documentary": "./Images/joke10.gif",
    "Bonnie Blue identifies as a man...": "./Images/joke5.gif",
    "Twitter (X) rebrands back to Twitter because no one calls it X":
      "./Images/joke8.gif",
    "Google admits incognito mode never worked": "./Images/joke6.gif",
    "Facebook values privacy": "./Images/zucker.gif",
    "GTA VI released before Half-Life 3": "./Images/gta.gif",
  };

  const grid = document.getElementById("grid");
  const audio = document.getElementById("bgm");

  if (grid) {
    LABELS.forEach((text) => {
      const div = document.createElement("div");
      div.className = "cell";

      // ADD THIS: strike overlay for the X
      const strike = document.createElement("div");
      strike.className = "strike";
      div.appendChild(strike);

      const btn = document.createElement("button");
      btn.setAttribute("role", "button");
      btn.setAttribute("aria-pressed", "false");

      btn.addEventListener("click", () => handleClick(text, div, btn));
      btn.addEventListener("keydown", (e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          handleClick(text, div, btn);
        }
      });

      const label = document.createElement("div");
      label.className = "label";
      label.textContent = text;

      div.appendChild(btn);
      div.appendChild(label);
      grid.appendChild(div);
    });
  }

  function handleClick(text, cell, btn) {
    // Determine if marking or unmarking
    const marked = !cell.classList.contains("marked");
    cell.classList.toggle("marked", marked);
    btn.setAttribute("aria-pressed", String(marked));

    // Play pencil SFX only when marking
    if (marked) {
      const sfx = document.getElementById("sfx-pencil");
      if (sfx) {
        try {
          sfx.currentTime = 0; // rewind
          sfx.play();
        } catch (e) {
          console.log("Pencil SFX blocked until user interacts:", e);
        }
      }
    }

    // Special flash: only when marking (not when unmarking)
    if (marked && FLASH_IMAGES[text]) {
      showFlash(FLASH_IMAGES[text]);
    }

    if (text === "North Korea wins Eurovision") {
      if (audio) {
        audio.pause();
      }
      window.open("https://www.youtube.com/watch?v=_FkHt3KIqCc", "_blank");
      return;
    }

    // Background music logic
    if (audio && audio.paused) {
      audio.play().catch((err) => {
        console.log("Autoplay blocked until user interacts:", err);
      });
    }
  }

  // Create the overlay once and reuse it
  const flash = createFlashOverlay();

  function createFlashOverlay() {
    const el = document.createElement("div");
    el.className = "image-flash";
    el.setAttribute("aria-hidden", "true");

    const img = document.createElement("img");
    img.alt = ""; // decorative; set a real alt if this is meaningful content
    el.appendChild(img);

    // Click anywhere to dismiss early
    el.addEventListener("click", hideFlash);

    document.body.appendChild(el);
    return el;
  }

  function showFlash(src) {
    const img = flash.querySelector("img");
    img.src = src;
    flash.classList.remove("fadeout");
    flash.classList.add("show");

    // Auto-hide after ~900ms visible
    const VISIBLE_MS = 2000;
    const HIDE_ANIM_MS = 200;

    setTimeout(() => {
      flash.classList.add("fadeout");
      setTimeout(() => hideFlash(), HIDE_ANIM_MS);
    }, VISIBLE_MS);
  }

  function hideFlash() {
    const img = flash.querySelector("img");
    flash.classList.remove("show", "fadeout");
    // Clear src so it unloads if large
    img.src = "";
  }
});
