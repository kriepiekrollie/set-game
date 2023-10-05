import React from 'react';
import { useState } from 'react';
import "./App.css"

function Card({shape, color, number, shading, order, selected, onCardClick}) {
  const shape_elements = Array(number + 1).fill(0).map(
    (_, index) => (
      <div 
        key={index} className={`${["rhombus", "oval", "squiggle"][shape]} ${["Red", "Green", "Blue"][color]} ${["empty", "half", "full"][shading]}`}
      ></div>
    )
  );
  const styles = (selected ? {backgroundColor : "#FFFFFF", order:order} : {order:order});
  return (
    <div className="card" onClick={onCardClick} style={styles}> {shape_elements} </div>
  );
}

function shuffle_array(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function is_set(c1, c2, c3) {
  const colors = new Set([c1.color, c2.color, c3.color]);
  const shapes = new Set([c1.shape, c2.shape, c3.shape]);
  const numbers = new Set([c1.number, c2.number, c3.number]);
  const shadings = new Set([c1.shading, c2.shading, c3.shading]);
  return !(colors.size === 2 || shapes.size === 2 || numbers.size === 2 || shadings.size === 2);
}

function no_sets(cards) {
  for (let i = 0; i < cards.length - 2; i++) {
    for (let j = i + 1; j < cards.length - 1; j++) {
      for (let k = j + 1; k < cards.length; k++) {
        if (is_set(cards[i], cards[j], cards[k])) {
          return false;
        }
      }
    }
  }
  return true;
}

function mex(s) {
  for (let i = 0; ; i++) {
    if (!s.has(i)) {
      return i;
    }
  }
  return -1;
}

function int_to_card(x) {
  const colo = x % 3;
  x = Math.floor(x / 3);
  const shap = x % 3;
  x = Math.floor(x / 3);
  const numb = x % 3;
  x = Math.floor(x / 3);
  const shad = x % 3;
  return {color : colo, shape : shap, number : numb, shading : shad, order : 0};
}

function generate_deck() {
  let deck = [];
  for (let i = 0; i < 81; i++)
    deck.push(i);
  shuffle_array(deck);
  return deck;
}
const deck = generate_deck();

function randrange(lo, hi) {
  return Math.floor(Math.random() * (hi - lo)) + lo;
}

function App() {
  const [cards, setCards] = useState([]);
  const [nxt, setNxt] = useState(0);
  const [selected, setSelected] = useState(new Set());
  const [orders, setOrders] = useState(new Set());

  function addUntilSet() {
    let newNxt = nxt;
    let newCards = cards;
    let newOrders = orders;

    for (; newNxt < 81 && (newCards.length < 12 || no_sets(newCards)); newNxt++) {
      let card = int_to_card(deck[newNxt]);
      card.order = mex(newOrders);
      newOrders.add(card.order);
      newCards.push(card);
    }

    setCards(newCards);
    setOrders(newOrders);
    setNxt(newNxt);
  }

  if (no_sets(cards)) {
    addUntilSet();
  }

  function handleCardClick(idx) {
    let newSelected = new Set(selected);
    if (newSelected.has(idx)) {
      newSelected.delete(idx);
    } else {
      newSelected.add(idx);
    }

    if (newSelected.size == 3) {
      let [a, b, c] = newSelected;
      if (is_set(cards[a], cards[b], cards[c])) {

        if (a > b) {[a, b] = [b, a];}
        if (a > c) {[a, c] = [c, a];}
        if (b > c) {[b, c] = [c, b];}

        let newNxt = nxt;
        let newOrders = new Set(orders);
        let newCards = cards.slice();

        if (newNxt < 81 && newCards[c].order < 12) {
          const Order = newCards[c].order;
          newCards[c] = int_to_card(deck[newNxt]);
          newCards[c].order = Order;
          newNxt++;
        } else {
          newCards.splice(c, 1);
        }

        if (newNxt < 81 && newCards[b].order < 12) {
          const Order = newCards[b].order;
          newCards[b] = int_to_card(deck[newNxt]);
          newCards[b].order = Order;
          newNxt++;
        } else {
          newCards.splice(b, 1);
        }

        if (newNxt < 81 && newCards[a].order < 12) {
          const Order = newCards[a].order;
          newCards[a] = int_to_card(deck[newNxt]);
          newCards[a].order = Order;
          newNxt++;
        } else {
          newCards.splice(a, 1);
        }

        setOrders(newOrders);
        setCards(newCards);
        setNxt(newNxt);

        console.log("Found a set!");
      } else {
        console.log("That's not a set :(");
      }
      newSelected = new Set();
    }
    setSelected(newSelected);
  }

  const card_elements = cards.map(
    (card, index) => {
      return (
        <Card 
          key={index}
          shape={card.shape} 
          color={card.color} 
          number={card.number} 
          shading={card.shading} 
          order={card.order}
          selected={selected.has(index)}
          onCardClick={() => handleCardClick(index)}
        />
      );
    }
  );
  return (
    <div className="board"> 
      {card_elements} 
      <div className="help-button">
        <p> ? </p>
      </div>
    </div>
  );
}

export default App;
