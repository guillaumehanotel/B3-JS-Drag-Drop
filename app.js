const DRAGGABLE_ELEMENTS_WIDTH = 100
const DRAGGABLE_ELEMENTS_HEIGHT = 100

let currentContentWidth = null;
let currentContentHeight = null;

let selectedElement = null;
let boxes = null;

let zIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
    onResize(); // to initialize currentContentWidth / currentContentHeight
    renderDraggableElements();
    boxes = document.querySelectorAll('.draggableBox');
    attachDragEvents();
    initCollision();

});


function attachDragEvents() {

    for (const box of boxes) {
        box.addEventListener('mousedown', onMouseDown)
        box.addEventListener('mouseup', onMouseUp)
    }

    document.addEventListener('mousemove', onMouseMove)

    //-- Exercice principal : Implémentez le drag and drop
    //-- Exercice bonus 1 : la dernière box relachée doit être au dessus des autres
    //-- Exercice bonus 2 : lorsque deux box sont en contact, elles doivent être teintes en rouge
}

function onMouseDown(e) {
    selectedElement = e.srcElement;
    selectedElement.classList.add('selected');
}

function onMouseUp(e) {
    zIndex++;
    e.srcElement.style.zIndex = zIndex;
    e.srcElement.classList.remove('selected');
    selectedElement = null;
}

function onMouseMove(e) {

    checkCollision(e);

}


function checkCollision(e) {

    let mouseX = e.clientX - (DRAGGABLE_ELEMENTS_WIDTH / 2);
    let mouseY = e.clientY - (DRAGGABLE_ELEMENTS_HEIGHT / 2);

    if (selectedElement !== null) {
        initCollision();

        selectedElement.style.left = mouseX + 'px'
        selectedElement.style.top = mouseY + 'px'
    }
}


function initCollision() {
    for (const box1 of boxes) {
        let isIntersect = false;
        for (const box2 of boxes) {
            if (box1 !== box2) {
                if (intersectRect(box1, box2)) {
                    isIntersect = true
                }
            }
        }
        box1.style.backgroundColor = isIntersect ? "red" : "rgba(70, 80, 95, 0.8)";
    }
}


function intersectRect(r1, r2) {
    return !(parseInt(r2.style.left) > parseInt(r1.style.left) + DRAGGABLE_ELEMENTS_WIDTH ||
        parseInt(r2.style.left) + DRAGGABLE_ELEMENTS_WIDTH < parseInt(r1.style.left) ||
        parseInt(r2.style.top) > parseInt(r1.style.top) + DRAGGABLE_ELEMENTS_HEIGHT ||
        parseInt(r2.style.top) + DRAGGABLE_ELEMENTS_HEIGHT < parseInt(r1.style.top));
}


function renderDraggableElements() {
    const contentElement = document.getElementById('content');
    const maxLeft = currentContentWidth - DRAGGABLE_ELEMENTS_WIDTH;
    const maxTop = currentContentHeight - DRAGGABLE_ELEMENTS_HEIGHT;

    for (let i = 0; i <= 10; i++) {
        const divElement = document.createElement('div');
        divElement.className = 'draggableBox';
        divElement.appendChild(document.createTextNode(`Box nº${i}`));
        divElement.style.left = Math.floor(Math.random() * maxLeft) + 'px';
        divElement.style.top = Math.floor(Math.random() * maxTop) + 'px';
        contentElement.appendChild(divElement);
    }
}

//window.addEventListener('optimizeResize', onResize)
window.addEventListener('resize', onResize);

function onResize() {
    const contentElement = document.getElementById('content');

    //-- Exercice Bonus 3: implémenter ici le repositionnement des box lorsque la fenêtre change de taille,
    // les box doivent proportionnellement se retrouver à la même place

    let previousContentWidth = currentContentWidth;
    let previousContentHeight = currentContentHeight;

    currentContentWidth = contentElement.offsetWidth;
    currentContentHeight = contentElement.offsetHeight;

    if (boxes !== null) {
        for (const box of boxes) {

            box.style.left = parseInt(box.style.left) * currentContentWidth / previousContentWidth + 'px'
            box.style.top = parseInt(box.style.top) * currentContentHeight / previousContentHeight + 'px'

        }
        initCollision()

    }


}

// See https://developer.mozilla.org/en-US/docs/Web/Events/resize
(function () {
    var throttle = function (type, name, obj) {
        obj = obj || window;
        var running = false;
        var func = function () {
            if (running) {
                return;
            }
            running = true;
            requestAnimationFrame(function () {
                obj.dispatchEvent(new CustomEvent(name));
                running = false;
            });
        };
        obj.addEventListener(type, func);
    };

    /* init - you can init any event */
    throttle("resize", "optimizedResize");
})();