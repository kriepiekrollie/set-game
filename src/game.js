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

card_objs = [];
card_elements = [];
card_order = [];
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
                if (is_set(card_objs[i], card_objs[j], card_objs[k])) {
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
                if (is_set(card_objs[i], card_objs[j], card_objs[k])) {
                    console.log(card_order[i]);
                    console.log(card_order[j]);
                    console.log(card_order[k]);
                    return;
                }
            }
        }
    }
    return;
}

function add_card(card_obj) {
    const card = document.createElement("div");
    card.setAttribute("class", "card");
    const new_order = mex(orders);
    card.setAttribute("style", "order: " + new_order + ";");

    for (let k = 0; k <= card_obj.number; k++) {
        const shape = document.createElement("div");
        shape.setAttribute("class", 
            ["rhombus ", "oval ", "squiggle "][card_obj.shape] + 
            ["Red ", "Green ", "Blue "][card_obj.color] + 
            ["empty", "half", "full"][card_obj.shading]
        );
        card.append(shape);
    }
    card.addEventListener('click', function (event) {
        const idx = selected.indexOf(card_obj);
        if (idx == -1) {
            selected.push(card_obj);
            card.setAttribute("style", "order: " + new_order + "; background-color: white;");
        } else {
            selected.splice(idx, 1);
            card.setAttribute("style", "order: " + new_order + ";");
        }
        if (selected.length == 3) {
            for (let i = 0; i < 3; i++) {
                const j = card_objs.indexOf(selected[i]);
                card_elements[j].setAttribute("style", "order: " + card_order[j] + ";");
            }
            if (is_set(selected[0], selected[1], selected[2])) {
                console.log("Found a set!!!");
                rem_card(card_objs.indexOf(selected[0]));
                rem_card(card_objs.indexOf(selected[1]));
                rem_card(card_objs.indexOf(selected[2]));
                for (; nxt < 81 && (num_cards_on_board < 12 || no_possible_moves()); nxt++)
                    add_card(int_to_card_obj(deck[nxt]));
            } else {
                console.log("That's not a set :(");
            }
            selected = [];
        }
    });
    orders.add(new_order);
    board.append(card);
    card_elements.push(card);
    card_objs.push(card_obj);
    card_order.push(new_order);
    num_cards_on_board += 1;
}

function rem_card(idx) {
    board.removeChild(card_elements[idx]);
    card_elements.splice(idx, 1);
    card_objs.splice(idx, 1);
    orders.delete(card_order[idx]);
    card_order.splice(idx, 1);
    num_cards_on_board -= 1;
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

nxt = 0
for (; nxt < 12; nxt++)
    add_card(int_to_card_obj(deck[nxt]));
for (; nxt < 81 && no_possible_moves(); nxt++)
    add_card(int_to_card_obj(deck[nxt]));
