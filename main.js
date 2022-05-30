//Define difficulty enum 
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
    const v = (r == 1) ? 'a' 
                : (r == 11) ? 'J' 
                : (r == 12) ? 'Q' 
                : (r == 13) ? 'K' 
                : r;
    return v+s;
}

/**
 * 
 * @param {int} cardId (an integer between 1 and 52)
 * @return the corresponding image
 */
function cardIdToImage(cardId) {
    return `deck/Minicard_${cardIdToToken(cardId)}.svg`
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

function getCardsAndSolution(minSolutionCount, maxSolutionCount) {
    console.log("Generating hand with solution between ", minSolutionCount, maxSolutionCount)
    let cards = null;
    let solutions = [];
    while (solutions.length < minSolutionCount || solutions.length > maxSolutionCount) {
        cards = Array.from(drawHand());
        solutions = getSolution(cards)
    }

    return {
        cards: cards,
        solutions: solutions
    }
}

function getCardsAndSolutionByDifficulty(difficulty) {
    let min = 1;
    let max = 1000; 
    switch (difficulty) {
        case "Anything":
            min = 1
            max = 1000
            break;
        case "Easy":
            min = 51
            max = 1000
            break;
        case "Medium":
            min = 11
            max = 50
            break;
        case "Hard":
            min = 2
            max = 10
            break;
        case "Anya":
            min = 1
            max = 1
            break;
    }

    return getCardsAndSolution(min, max);
}

function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
          tmp = item.split("=");
          if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
}

function readDifficulty(str) {
    switch (str) {
        case "Easy":
            return "Easy"
        case "Medium":
            return "Medium"
        case "Hard":
            return "Hard"
        case "Anya":
            return "Anya"
    }
    return "Anything"
}
window.onload = function() {

    //Define help Functionality
    document.getElementById('help').onclick = function() {
        alert("Combine the four cards using addition, subtraction, multiplication, division, and exponentiation such that it totals 24.\n(A=1, J=11, Q=12, K=13)")
    }

    //Read difficulty
    const difficulty = readDifficulty(findGetParameter("difficulty"));
    const diff_select = document.getElementById('difficulty');
    console.log("Selected difficulty: "+ difficulty)

    //Set Difficulty
    diff_select.value = difficulty

    function changeDifficulty() {
        console.log("Chanigng difficulty to:"+diff_select.value)

        var url = new URL(window.location.href);
        var search_params = url.searchParams;

        // new value of "id" is set to "101"
        search_params.set('difficulty', diff_select.value);

        // change the search property of the main url
        url.search = search_params.toString();

        // the new url string
        var new_url = url.toString();

        // output : http://demourl.com/path?id=101&topic=main
        console.log("new_url:", new_url);

        // Simulate an HTTP redirect:
        window.location.replace(new_url);
    }

    diff_select.addEventListener('change', changeDifficulty, false);

    //Generate Cards
    let cardsAndSolutionPair = getCardsAndSolutionByDifficulty(difficulty)
    const cards = cardsAndSolutionPair.cards
    const solutions = cardsAndSolutionPair.solutions

    for(i = 0; i < 4; i ++) {
        console.log("c"+i, cards[i], cardIdToToken(cards[i]));
        const img = document.getElementById("c"+i);
        const src = cardIdToImage(cards[i]);
        setTimeout(function() {
            img.src = src;
        }, 250);          
    } 

    //Deefine Soluton funcitnlaity
    document.getElementById('sol').onclick = function() {
        const l = solutions.length;
        const body = solutions.join('\n')
        if (l == 1 ? confirm(`There is ${1} solution:\n${body}`) 
                    :confirm(`There are ${l} solutions:\n${body}`))
            location.reload();
    }

}

