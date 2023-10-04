body = document.getElementsByTagName("body")[0];

board = document.getElementsByClassName("board")[0];

function randrange(lo, hi) {
    return Math.floor(Math.random() * (hi - lo) + lo);
}

cards = []

function int_to_card_obj(x) {
    Colo = x % 3;
    x = Math.floor(x / 3);
    Shap = x % 3;
    x = Math.floor(x / 3);
    Numb = x % 3;
    x = Math.floor(x / 3);
    Shad = x % 3;
    return {color : Colo, shape : Shap, number : Numb, shading : Shad, element : null, order : -1};
}

cards = [];
orders = new Set();
num_cards_on_board = 0;
selected = [];

function mex(s) {
    for (let i = 0; ; i++) {
        if (!s.has(i)) {
            return i;
        }
    }
}

function is_set(c1, c2, c3) {
    const colors = new Set([c1.color, c2.color, c3.color]);
    const shapes = new Set([c1.shape, c2.shape, c3.shape]);
    const numbers = new Set([c1.number, c2.number, c3.number]);
    const shades = new Set([c1.shading, c2.shading, c3.shading]);
    return !(colors.size == 2 || shapes.size == 2 || numbers.size == 2 || shades.size == 2);
}

function no_possible_moves() {
    for (let i = 0; i < num_cards_on_board - 2; i++) {
        for (let j = i + 1; j < num_cards_on_board - 1; j++) {
            for (let k = j + 1; k < num_cards_on_board; k++) {
                if (is_set(cards[i], cards[j], cards[k])) {
                    return false;
                }
            }
        }
    }
    return true;
}

function find_set() {
    for (let i = 0; i < num_cards_on_board - 2; i++) {
        for (let j = i + 1; j < num_cards_on_board - 1; j++) {
            for (let k = j + 1; k < num_cards_on_board; k++) {
                if (is_set(cards[i], cards[j], cards[k])) {
                    console.log(cards[i].order);
                    console.log(cards[j].order);
                    console.log(cards[k].order);
                    return;
                }
            }
        }
    }
    return;
}

function add_card(card) {
    card.element = document.createElement("div");
    card.element.setAttribute("class", "card");
    card.order = mex(orders);
    card.element.setAttribute("style", "order: " + card.order + ";");

    for (let k = 0; k <= card.number; k++) {
        const shape = document.createElement("div");
        shape.setAttribute("class", 
            ["rhombus ", "oval ", "squiggle "][card.shape] + 
            ["Red ", "Green ", "Blue "][card.color] + 
            ["empty", "half", "full"][card.shading]
        );
        card.element.append(shape);
    }

    card.element.addEventListener('click', function (event) {
        const idx = selected.indexOf(card);
        if (idx == -1) {
            selected.push(card);
            card.element.setAttribute("style", "order: " + card.order + "; background-color: white;");
        } else {
            selected.splice(idx, 1);
            card.element.setAttribute("style", "order: " + card.order + ";");
        }
        if (selected.length == 3) {
            for (let i = 0; i < 3; i++) {
                const j = cards.indexOf(selected[i]);
                cards[j].element.setAttribute("style", "order: " + cards[j].order + ";");
            }
            if (is_set(selected[0], selected[1], selected[2])) {
                console.log("Found a set!!!");
                rem_card(cards.indexOf(selected[0]));
                rem_card(cards.indexOf(selected[1]));
                rem_card(cards.indexOf(selected[2]));
                add_cards_until_set();
            } else {
                console.log("That's not a set :(");
            }
            selected = [];
        }
    });
    orders.add(card.order);
    board.append(card.element);
    cards.push(card);
    num_cards_on_board += 1;
}

function add_cards_until_set() {
    const old_num_cards_on_board = num_cards_on_board;

    for (; nxt < 81 && (num_cards_on_board < 12 || no_possible_moves()); nxt++)
        add_card(int_to_card_obj(deck[nxt]));

    for (let i = old_num_cards_on_board; i < num_cards_on_board; i++) {
        const j = randrange(i, num_cards_on_board);
        [cards[i].order, cards[j].order] = [cards[j].order, cards[i].order];
    }

    for (let i = old_num_cards_on_board; i < num_cards_on_board; i++)
        cards[i].element.setAttribute("style", "order: " + cards[i].order + ";");
}

function rem_card(idx) {
    board.removeChild(cards[idx].element);
    orders.delete(cards[idx].order);
    cards.splice(idx, 1);
    num_cards_on_board -= 1;
}

const shuffle_array = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

nxt = 0
deck = [];
for (let i = 0; i < 81; i++)
    deck.push(i);

shuffle_array(deck);

add_cards_until_set();
