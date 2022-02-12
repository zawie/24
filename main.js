const OP = Symbol("op");
const CARD = Symbol("card");
const INTER = Symbol("inter");
const HEAD = Symbol("head");

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
    const s = ['C','D','S','H'][Math.floor((cardId-1)/13)];
    const r = cardIdToValue(cardId);
    const v = (r == 1) ? 'A' 
                : (r == 11) ? 'J' 
                : (r == 12) ? 'Q' 
                : (r == 13) ? 'K' 
                : r;
    return v+s;
}

/**
 * 
 * @param {int} cardId (an integer between 1 and 52)
 * @return the corresponding image token
 */
function cardIdToSuitelessToken(cardId) {
    const r = cardIdToValue(cardId);
    const v = (r == 1) ? 'A' 
                : (r == 11) ? 'J' 
                : (r == 12) ? 'Q' 
                : (r == 13) ? 'K' 
                : r;
    return v+"u";
}

/**
 * 
 * @param {int} cardId (an integer between 1 and 52)
 * @return the corresponding image
 */
function tokenToImage(token) {
    return `deck/Minicard_${token}.svg`;
}

/**
 * 
 * @param {int} cardId (an integer between 1 and 52)
 * @return the corresponding image
 */
function cardIdToImage(cardId) {
    return tokenToImage(cardIdToToken(cardId));
}

function setCardImage(inputId, token) {
    const element = document.getElementById("c"+inputId);
    element.src = tokenToImage(token);
    element.alt = token;         
}

/**
 * Sets all the card images accordingly
 * @param {string[]} tokenArray an array of tokens such that the i-th element corresponds to the i-th token
 */
function render(tokenArray) {
    tokenArray.forEach((token, i) => {
            setCardImage(i, token)   
    })
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
                    const a = p[0];
                    const b = p[1];
                    const c = p[2];
                    const d = p[3];

                    const x = ops[i];
                    const y = ops[j];
                    const z = ops[k];

                    //a.(b.(c.d))
                    const v0 = f(a, x, f(b, y, f(c, z, d)));
                    const s0 = `${a} ${x} (${b} ${y} (${c} ${z} ${d}))`
                    //((a.b).c).d
                    const v1 = f(f(f(a, x, b), y, c), z, d);
                    const s1 = `((${a} ${x} ${b}) ${y} ${c}) ${z} ${d}`
                    //(a.b).(c.d)
                    const v2 = f(f(a,x, b), y, f(c, z, d));
                    const s2 = `(${a} ${x} ${b}) ${y} (${c} ${z} ${d})`
                    //(a.(b.c)).d
                    const v3 = f(f(a, x, f(b, y, c), z, d));
                    const s3 = `(${a} ${x} (${b} ${y} ${c})) ${z} ${d}`
                    //a.((b.c).d)
                    const v4 = f(a, x, f(f(b, y, c), z, d));
                    const s4 = `${a} ${x} ((${b} ${y} ${c}) ${z} ${d})`

                    if (v0 == 24) 
                        solutions.push(s0);
                    if (v1 == 24) 
                        solutions.push(s1);
                    if (v2 == 24) 
                        solutions.push(s2);
                    if (v3 == 24) 
                        solutions.push(s3);
                    if (v4 == 24) 
                        solutions.push(s4);
                }
            }
        }
    }
    return solutions;
}

window.onload = function() {

    const stack = [];
    stack.push({type: HEAD});

    let cards = null;
    let solutions = [];
    while (solutions.length < 1) {
        cards = Array.from(drawHand());
        solutions = getSolution(cards)
    }

    const display = cards.map(cardId => cardIdToToken(cardId));

    render(display);

    for(i = 0; i < 4; i ++) {
        const elementId = i;
        const cardId = cards[i];
        document.getElementById("c"+elementId).onclick = function() {
            const last = stack[stack.length - 1];
            if (!(last.type == CARD || last.type == INTER)  ) {
                stack.push({type: CARD, elementId, cardId});
                display[elementId] = cardIdToSuitelessToken(cardId);
                render(display);
            }
        }
    } 

    document.getElementById("undo").onclick = function() {
        const last = stack[stack.length - 1];
        if  (!(last.type == HEAD))
            stack.pop();
        if (last.type == CARD) {
            display[last.elementId] = cardIdToToken(last.cardId);
            render(display);
        }
    }

}

