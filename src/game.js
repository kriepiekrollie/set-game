body = document.getElementsByTagName("body")[0];

board = document.getElementsByClassName("board")[0];

cards = []

function int_to_card_obj(x) {
    Colo = x % 3;
    x = Math.floor(x / 3);
    Shap = x % 3;
    x = Math.floor(x / 3);
    Numb = x % 3;
    x = Math.floor(x / 3);
    Shad = x % 3;
    return {color : Colo, shape : Shap, number : Numb, shading : Shad};
}

function possible_move() {
}

function add_card(card_obj) {
    const card = document.createElement("div");
    card.setAttribute("class", "card");

    for (let k = 0; k <= card_obj.number; k++) {
        const shape = document.createElement("div");
        shape.setAttribute("class", 
            ["rhombus ", "oval ", "squiggle "][card_obj.shape] + 
            ["Red ", "Green ", "Blue "][card_obj.color] + 
            ["empty", "half", "full"][card_obj.shading]
        );
        card.append(shape);
    }
    board.append(card);
    return card;
}

const shuffle_array = array => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

deck = [];
for (let i = 0; i < 81; i++)
    deck.push(i);
shuffle_array(deck);
console.log(deck);
for (let i = 0; i < 12; i++)
    add_card(int_to_card_obj(deck[i]));
