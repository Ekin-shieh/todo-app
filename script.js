const model = document.getElementById('change-model');
const container = document.getElementsByClassName('container')[0];

model.addEventListener('click', ()=>{
    if (model.src.includes('./images/incon-sun.svg')) {
        model.src = './images/icon-moon.svg';
    } else {
        model.src = './images/icon-sun.svg';
    };
    container.classList.toggle('night');
});