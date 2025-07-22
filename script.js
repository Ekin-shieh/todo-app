const model = document.getElementById('change-model');
const container = document.getElementsByClassName('container')[0];
const list = document.getElementById('todo-list');

model.addEventListener('click', ()=>{
    if (model.src.includes('./images/incon-sun.svg')) {
        model.src = './images/icon-moon.svg';
    } else {
        model.src = './images/icon-sun.svg';
    };
    container.classList.toggle('night');
});

list.addEventListener('click', (e)=>{
    const target = e.target;
    const deleteBtn = target.closest(".delete");
    const completeBtn = target.closest(".circle");
    if(completeBtn) {
        const item =target.closest('.todo-item');
        const text = item.querySelector('.text');
        const img =item.querySelector('.circle-img');
        text.classList.toggle('completed');
        img.classList.toggle('completed');
    }
})