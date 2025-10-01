const images = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'k'];
let cards = [];
let firstCard = null;
let secondCard = null;
let lock = false;

const board = document.getElementById('game-board');
const congrats = document.getElementById('congrats');

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function createCards() {
    const doubledImages = [...images, ...images]; // 16 كرت (كل صورة مرتين)
    shuffle(doubledImages);

    cards = doubledImages.map((name, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.image = name;
        card.dataset.index = index;

        const inner = document.createElement('div');
        inner.className = 'card-inner';

        const front = document.createElement('div');
        front.className = 'card-front';
        const img = document.createElement('img');
        img.src = `images/${name}.png`;
        front.appendChild(img);

        const back = document.createElement('div');
        back.className = 'card-back';

        inner.appendChild(front);
        inner.appendChild(back);
        card.appendChild(inner);

        card.addEventListener('click', handleFlip);
        board.appendChild(card);

        return card;
    });
}

function handleFlip() {
    if (lock || this.classList.contains('flipped')) return;

    this.classList.add('flipped');
    if (!firstCard) {
        firstCard = this;
    } else {
        secondCard = this;
        checkMatch();
    }
}

function checkMatch() {
    const match = firstCard.dataset.image === secondCard.dataset.image;

    if (match) {
        disableMatched();
    } else {
        lock = true;
        setTimeout(() => {
            unflipCards();
            swapRandomCard();
            lock = false;
        }, 1000);
    }
}

function disableMatched() {
    firstCard.removeEventListener('click', handleFlip);
    secondCard.removeEventListener('click', handleFlip);
    resetTurn();

    // check for win
    if (document.querySelectorAll('.flipped').length === cards.length) {
        congrats.classList.remove('hidden');
    }
}

function unflipCards() {
    firstCard.classList.remove('flipped');
    secondCard.classList.remove('flipped');
    resetTurn();
}

function resetTurn() {
    [firstCard, secondCard] = [null, null];
}

function swapRandomCard() {
    const unflipped = cards.filter(card => !card.classList.contains('flipped'));

    if (unflipped.length < 2) return;

    const i = Math.floor(Math.random() * unflipped.length);
    const j = Math.floor(Math.random() * unflipped.length);

    if (i === j) return;

    // Swap dataset.image
    const temp = unflipped[i].dataset.image;
    unflipped[i].dataset.image = unflipped[j].dataset.image;
    unflipped[j].dataset.image = temp;

    // Swap img src
    const img1 = unflipped[i].querySelector('img');
    const img2 = unflipped[j].querySelector('img');
    const tempSrc = img1.src;
    img1.src = img2.src;
    img2.src = tempSrc;
}

createCards();
