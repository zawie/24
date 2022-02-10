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
 */
function cardIdToToken(cardId) {
    const s = ['k','l','p','s'][Math.floor(cardId/13)];
    const r = (cardId % 13) + 1;
    const v = (r == 1) ? 'a' 
                : (r == 11) ? 'j' 
                : (r == 12) ? 'q' 
                : (r == 13) ? 'k' 
                : (r == 13) ? 'k' 
                : toString(r);
    return s+v;
}