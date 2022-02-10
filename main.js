/**
 * @return a set of four card ids (4 distinct numbers from 1-52)
 */
function drawHand() {
    const cards = new Set();
    while(cards.size !== 4) {
        const c = Math.floor(Math.random() * 52) + 1;
        if (!cards.has(c)) 
            cards.add(c);
    }
    return cards;
}

/**
 * 
 * @param {int} cardId (an integer between 1 and 52)
 * @return the corresponding image token
 */
function cardIdToToken(cardId) {
    const s = ['k','l','p','s'][Math.floor((cardId-1)/13)];
    const r = (cardId % 13) + 1;
    const v = (r == 1) ? 'a' 
                : (r == 11) ? 'j' 
                : (r == 12) ? 'q' 
                : (r == 13) ? 'k' 
                : (r == 13) ? 'k' 
                : r;
    return s+v;
}

/**
 * 
 * @param {int} cardId (an integer between 1 and 52)
 * @return the corresponding image
 */
function cardIdToImage(cardId) {
    return 'cards/'+cardIdToToken(cardId)+'.png.webp'
}

window.onload = function() {
    const cards = Array.from(drawHand());
    for(i = 0; i < 4; i ++) {
        console.log("c"+i, cards[i], cardIdToToken(cards[i]));
        document.getElementById("c"+i).src = cardIdToImage(cards[i]);
    }
}

