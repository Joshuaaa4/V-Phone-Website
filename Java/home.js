const navbarNav = document.querySelector('.navbar-nav');
const hamburger = document.querySelector('#hamburger-menu');

hamburger.onclick = (e) => {
    navbarNav.classList.toggle('active');
    e.preventDefault();
};

document.addEventListener('click', function(e) {
    if (!hamburger.contains(e.target) && !navbarNav.contains(e.target)) {
        navbarNav.classList.remove('active');
    }
});

const slides = document.querySelectorAll('input[name="slider"]');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const totalSlides = slides.length;
let currentSlideIndex = 0;
let slideInterval;

function goToSlide(index) {
    slides[index].checked = true;
    currentSlideIndex = index;
}

function nextSlide() {
    let nextIndex = (currentSlideIndex + 1) % totalSlides;
    goToSlide(nextIndex);
}

function prevSlide() {
    let prevIndex = (currentSlideIndex - 1 + totalSlides) % totalSlides;
    goToSlide(prevIndex);
}

function startAutoPlay() {
    slideInterval = setInterval(nextSlide, 5000);
}

function resetAutoPlay() {
    clearInterval(slideInterval);
    startAutoPlay();
}

nextBtn.addEventListener('click', () => { nextSlide(); resetAutoPlay(); });
prevBtn.addEventListener('click', () => { prevSlide(); resetAutoPlay(); });

slides.forEach((slide, index) => {
    slide.addEventListener('change', () => {
        currentSlideIndex = index;
        resetAutoPlay();
    });
});

startAutoPlay();