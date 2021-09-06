const slider = document.querySelector(".testimonials");
let isDown = false;
let startX;
let scrollLeft;

const slides = Array.from(document.querySelectorAll(".ts"));
const dots = Array.from(document.querySelectorAll(".dots span"));
// set up our state
let isDragging = false,
  startPos = 0,
  currentTranslate = 0,
  prevTranslate = 0,
  animationID,
  currentIndex = 0;

let mediaQuery = window.matchMedia("(max-width: 568px)");
let mediaQueryNavCheck = window.matchMedia("(min-width: 768px)");

window.onresize = function () {
  if (mediaQueryNavCheck.matches) {
    navWrapper.classList.remove("active");
    document.querySelector("body").classList.remove("active-nav");
  }
};

mediaQuery.matches &&
  slides.forEach((slide, index) => {
    // touch events
    slide.addEventListener("touchstart", touchStart(index));
    slide.addEventListener("touchend", touchEnd);
    slide.addEventListener("touchmove", touchMove);
  });

function getPositionX(event) {
  return event.type.includes("mouse") ? event.pageX : event.touches[0].clientX;
}

// use a HOF so we have index in a closure
function touchStart(index) {
  return function (event) {
    currentIndex = index;
    startPos = getPositionX(event);
    isDragging = true;
    animationID = requestAnimationFrame(animation);
    slider.classList.add("grabbing");
  };
}

function touchMove(event) {
  if (isDragging) {
    const currentPosition = getPositionX(event);
    currentTranslate = prevTranslate + currentPosition - startPos;
  }
}

function touchEnd() {
  cancelAnimationFrame(animationID);
  isDragging = false;
  const movedBy = currentTranslate - prevTranslate;

  // if moved enough negative then snap to next slide if there is one
  if (movedBy < -100 && currentIndex < slides.length - 1) {
    currentIndex += 1;
    updateDots(currentIndex);
  }
  // if moved enough positive then snap to previous slide if there is one
  if (movedBy > 100 && currentIndex > 0) {
    currentIndex -= 1;
    updateDots(currentIndex);
  }

  setPositionByIndex();

  slider.classList.remove("grabbing");
}

function animation() {
  setSliderPosition();
  if (isDragging) requestAnimationFrame(animation);
}

function setPositionByIndex() {
  currentTranslate = currentIndex * -window.innerWidth;
  prevTranslate = currentTranslate;
  setSliderPosition();
}

function setSliderPosition() {
  slider.style.transform = `translateX(${currentTranslate}px)`;
}
function updateDots(i) {
  dots.forEach((dot) => dot.classList.remove("active"));
  dots[i].classList.add("active");
}
slider.addEventListener("mousedown", (e) => {
  isDown = true;
  slider.classList.add("active");
  startX = e.pageX - slider.offsetLeft;
  scrollLeft = slider.scrollLeft;
});
slider.addEventListener("mouseleave", () => {
  isDown = false;
  slider.classList.remove("active");
});
slider.addEventListener("mouseup", () => {
  isDown = false;
  slider.classList.remove("active");
});
slider.addEventListener("mousemove", (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - slider.offsetLeft;
  const walk = (x - startX) * 1; //scroll-fast
  slider.scrollLeft = scrollLeft - walk;
});

// Toggle nav bar on mobile view

const navBtn = document.querySelector(".menu");
const navWrapper = document.querySelector(".wrapper");

navBtn.addEventListener("click", function (e) {
  e.preventDefault();
  navWrapper.classList.toggle("active");
  document.querySelector("body").classList.toggle("active-nav");
});

/* validate email newsletter */

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
const form = document.querySelector("#newsletter-form");
const formInput = form.querySelector("input");
form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (formInput.value.trim().length == 0) {
    form.classList.add("error");
  } else {
    if (validateEmail(formInput.value.trim())) {
      form.classList.remove("error");
      form.classList.add("valid");
      formInput.value = "";
      setTimeout(() => form.classList.remove("valid"), 5000);
    } else {
      form.classList.add("error");
    }
  }
});
