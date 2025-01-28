const marqueeContentDivs = [...document.querySelectorAll(".marquee-content")];
const marqueeContentText = slideShow.marqueeContentText;

marqueeContentDivs.forEach((div) => {
  div.innerHTML = marqueeContentText;
});

let extraStyles = "";

const slidesContainer = document.querySelector("#slides");

for (let i = 0; i < slideShow.slides.length; i++) {
  const currentSlide = slideShow.slides[i];
  const slideEl = document.createElement("div");
  slideEl.id = `slide-${i}`;
  slideEl.innerHTML = `
    <h1>${currentSlide.title}</h1>
    <p class="subtitle">${currentSlide.subtitle}</p>
    <div class="content">${currentSlide.content}</div>
  `;

  extraStyles += `
    #slide-${i}::before {
      background-image: url(${currentSlide.bgImage});
    }

    #slide-${i} {
      ${currentSlide.extraStyles}
    }
  `;

  slideEl.classList.add("slide");
  slidesContainer.appendChild(slideEl);
}

const styleEl = document.createElement("style");
styleEl.innerHTML = extraStyles;
document.head.appendChild(styleEl);

const timePerSlide = 15000;
const allSlides = document.querySelectorAll("#slides > div");
const numberOfSlides = allSlides.length;
let playing = false;

currentIndex = -1;

function incIndex() {
  if (currentIndex >= allSlides.length - 1) {
    currentIndex = 0;
  } else {
    currentIndex = currentIndex + 1;
  }
}

function nextSlide() {
  for (let i = 0; i < allSlides.length; i++) {
    allSlides[i].style.height = "0%";
  }

  incIndex();

  const nextSlideEl = document.querySelector(`#slide-${currentIndex}`);
  nextSlideEl.style.height = "100%";
}

nextSlide();
setInterval(nextSlide, timePerSlide);

function startCountdown() {
  // Set the date we're counting down to
  var countDownDate = new Date(slideShow.kickOffTime).getTime();

  // Update the count down every 1 second
  setInterval(function () {
    // Get today's date and time
    var now = new Date().getTime();

    // Find the distance between now and the count down date
    var distance = countDownDate - now;

    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Output the result in an element with id="demo"
    document.getElementById("timer").innerHTML =
      days + "d " + hours + "h " + minutes + "m " + seconds + "s ";

    if (!playing && distance < 11000) {
      var audio = new Audio(
        "https://cdn.glitch.global/23f1db32-983a-489f-907b-ffcb91116341/countdown.mp3?v=1726260637234"
      );
      audio.play();
      playing = true;
      document.getElementById("kickoff-countdown").classList.add("time-up");
    }

    // If the count down is over, write some text
    if (distance < 0) {
      document.getElementById("timer").innerHTML = "TIME IS UP!";
    }
  }, 1000);
}

document.addEventListener("keydown", (e) => {
  if (e.keyCode === 39) {
    nextSlide();
  }
});
