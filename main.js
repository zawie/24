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
function cardIdToValue(cardId) {
    return ((cardId-1) % 13) + 1;
}

/**
 * 
 * @param {int} cardId (an integer between 1 and 52)
 * @return the corresponding image token
 */
function cardIdToToken(cardId) {
    const s = ['k','l','p','s'][Math.floor((cardId-1)/13)];
    const r = cardIdToValue(cardId);
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

const permutator = (inputArr) => {
    let result = [];
  
    const permute = (arr, m = []) => {
      if (arr.length === 0) {
        result.push(m)
      } else {
        for (let i = 0; i < arr.length; i++) {
          let curr = arr.slice();
          let next = curr.splice(i, 1);
          permute(curr.slice(), m.concat(next))
       }
     }
   }
  
   permute(inputArr)
  
   return result;
  }
  
function getSolution(cards) {
    const ops = ["+", "-", "*", "/", "^"];
    var solutions = [];

    function f(a, o, b) {
        if (a == NaN || b == NaN)
            return NaN;
        if (o == "+") 
            return a+b;
        if (o == "-") 
            return a-b;
        if (o == "*") 
            return a*b;
        if (o == "/")
            return (a % b) == 0 ? a/b : NaN; //Exclude fractions
        if (o == "^") 
            return Math.pow(a,b);
    }

    const permutations = permutator(cards);
    for(l in permutations) { //4!
        p = permutations[l];
        for(i = 0; i < 4; i ++) {
            p[i] = cardIdToValue(p[i]);
        }
        for(i in ops) { //5
            for(j in ops) { //5
                for(k in ops) {//5
                    const op0 = ops[i];
                    const op1 = ops[j];
                    const op2 = ops[k];
                    const v = f(p[0], op0, f(p[1], op1, f(p[2], op2, p[3])));
                    const s = `${p[0]} ${op0} (${p[1]} ${op1} (${p[2]} ${op2} ${p[3]}))`
                    if (v == 24) {
                        solutions.push(s);
                    }
                }
            }
        }
    }
    return solutions;
}


window.onload = function() {
    let cards = null;
    let solutions = [];
    while (solutions.length < 1) {
        cards = Array.from(drawHand());
        solutions = getSolution(cards)
    }

    for(i = 0; i < 4; i ++) {
        console.log("c"+i, cards[i], cardIdToToken(cards[i]));
        const img = document.getElementById("c"+i);
        const src = cardIdToImage(cards[i]);
        setTimeout(function() {
            img.src = src;
        }, 250);          
    } 

    document.getElementById('sol').onclick = function() {
        const l = solutions.length;
        const body = solutions.join('\n')
        if (l == 1 ? confirm(`There is ${1} solution:\n${body}`) 
                    :confirm(`There are ${l} solutions:\n${body}`))
            location.reload();
    }
}

