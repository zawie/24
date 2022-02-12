const OPERATOR = Symbol("operator");
const OPERAND = Symbol("operand");
const HEAD = Symbol("head");

const OPS = ["+", "-", "*", "/", "^"];

const f = (a, o, b) => {
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

/**
 * Sets all the card images accordingly
 * @param {string[]} tokenArray an array of tokens such that the i-th element corresponds to the i-th token
 */
function render(displaySettingsArray) {
    displaySettingsArray.forEach((stngs, i) => {
            const element = document.getElementById("c"+i);
            //Set carrd image
            if (stngs.isIntermediate) {
                element.type = "button";
                element.value = "  "+stngs.value+"  ";
                element.style.backgroundColor = "white";
                element.style.color = (stngs.value % 2) == 0 ? 'red' : 'black';
            } else {
                element.type = "image";
                element.src = tokenToImage(stngs.token);
                element.alt = stngs.token; 
                element.style.backgroundColor = "";
            }  
            //Other visual effects:
            element.style.height = stngs.isSelected ? "98%" : "90%";
            element.style.opacity = stngs.isTransluscent ? 0.5 : 1;
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
    var solutions = [];

    const permutations = permutator(cards);
    for(l in permutations) { //4!
        p = permutations[l];
        for(i = 0; i < 4; i ++) {
            p[i] = cardIdToValue(p[i]);
        }
        for(i in OPS) { //5
            for(j in OPS) { //5
                for(k in OPS) {//5
                    const a = p[0];
                    const b = p[1];
                    const c = p[2];
                    const d = p[3];

                    const x = OPS[i];
                    const y = OPS[j];
                    const z = OPS[k];

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

    const display = cards.map(cardId => {
        return {
            isIntermediate: false,
            token: cardIdToToken(cardId),
            value: cardIdToValue(cardId),
            isSelected: false,
            isVisible: true,
            isTransluscent: false,
        }
    });

    render(display);

    for(i = 0; i < 4; i ++) {
        const elementId = i;
        const cardId = cards[i];
        document.getElementById("c"+elementId).onclick = function() {
            const last = stack[stack.length - 1];
            if (((stack.length+1) % 3) != 0) { //Ops should be every third.
                const thisNode = {
                    type: OPERAND, 
                    elementId, 
                    cardId, 
                    displaySettings: display[elementId]
                }
                stack.push(thisNode);

                if (last.type == OPERATOR) {
                    //Un-select first operand
                    const firstOperand = stack[stack.length - 3];
                    display[firstOperand.elementId].isSelected = false;
                    display[firstOperand.elementId].isTransluscent = true;

                    //Modify currrent card to reflect new value
                    const a = display[stack[stack.length - 3].elementId].value;
                    const o = stack[stack.length - 2].op;
                    const b = display[stack[stack.length - 1].elementId].value;
                    thisNode.value = f(a,o,b);

                    display[elementId].isIntermediate = true;
                    display[elementId].value = thisNode.value;
                } else {
                    display[elementId].isSelected = true;
                }
                render(display);
            }
            console.log(stack);
        }
    } 

    document.getElementById("undo").onclick = function() {
        const last = stack[stack.length - 1];
   
        let resetCard = (poppedCardNode)=> {
            const elementId = poppedCardNode.elementId;
            for(i = stack.length - 1; i > 1; i--) {
                const node = stack[i];
                if (node.elementId == elementId) {
                    display[elementId] = node.displaySettings;
                    display[elementId].isTransluscent = false;
                    render(display);
                    return;
                }
            }
            display[elementId] = {
                isIntermediate: false,
                token: cardIdToToken(poppedCardNode.cardId),
                value: cardIdToValue(poppedCardNode.cardId),
                isSelected: false,
                isVisible: true,
                isTransluscent: false
            };
            render(display);
        }

        if (last.type == OPERATOR) {
            stack.pop();
            resetCard(stack.pop());
            display[last.elementId].isSelected = false;
            render(display);
        }

        if(last.type == OPERAND) {
            if ( ((stack.length-1) % 3) == 0) {
                resetCard(stack.pop()); //pop OPERAND
                stack.pop();            //pop OPERATOR
                resetCard(stack.pop()); //pop OPERAND
            } else if (((stack.length-1) % 3) == 1) {
                resetCard(stack.pop()); //pop OPERAND
            } else if (((stack.length-1) % 3) == 2) {
                stack.pop();            //pop op
                resetCard(stack.pop()); //pop OPERAND
            }
        }

        console.log(stack);
    }

    OPS.forEach(op => {
        document.getElementById("op"+op).onclick = function() {
            const last = stack[stack.length - 1];
            if (((stack.length+1) % 3) == 0) {
                stack.push({type: OPERATOR, op});
            }
            console.log(stack);
        }
    })

}

