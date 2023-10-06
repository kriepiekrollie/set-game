import React from 'react';
import { useState } from 'react';
import "./App.css"

function Card({shape, color, number, shading, order, selected, highlighted, onCardClick}) {
  const shape_elements = Array(number + 1).fill(0).map(
    (_, index) => (
      <div 
        key={index} className={`${["rhombus", "oval", "squiggle"][shape]} ${["Red", "Green", "Blue"][color]} ${["empty", "half", "full"][shading]}`}
      ></div>
    )
  );
  let styles = {order: order};
  if (selected) {
    styles.backgroundColor = "#FFFFFF";
  }
  if (highlighted) {
    styles.transform = "translate(0px, -10px)";
    styles.boxShadow = "10px 10px 20px rgba(0, 0, 0, .9)";
  }
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
  if (c1 === null || c2 === null || c3 === null) {
    return false;
  }
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
  return {color : colo, shape : shap, number : numb, shading : shad};
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
  // Returns a random integer in the range [lo, hi).
  return Math.floor(Math.random() * (hi - lo)) + lo;
}

function App() {
  const [cards, setCards] = useState([]);
  const [nxt, setNxt] = useState(0);
  const [selected, setSelected] = useState(new Set());
  const [highlight, setHighlight] = useState(new Set());
  const [gameover, setGameover] = useState(false);

  function addUntilSet() {
    let newNxt = nxt;
    let newCards = cards.slice();

    for (; newNxt < 81 && (newCards.length < 12 || no_sets(newCards)); newNxt++) {
      let card = int_to_card(deck[newNxt]);
      newCards.push(card);
    }

    for (let i = cards.length; i < newCards.length; i++) {
      const j = randrange(i, newCards.length);
      [newCards[i], newCards[j]] = [newCards[j], newCards[i]];
    }

    setCards(newCards);
    setNxt(newNxt);
  }

  if (no_sets(cards)) {
    if (nxt < 81) {
      addUntilSet();
    } else if (!gameover) {
      setGameover(true);
    }
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
        let newCards = cards.slice();
        let newIndices = [];

        newCards.splice(c, 1);
        newCards.splice(b, 1);
        newCards.splice(a, 1);

        for (let i of [a, b, c]) {
          if (!(newNxt < 81 && (newCards.length < 12 || no_sets(newCards)))) {
            break;
          }
          const card = int_to_card(deck[newNxt]);
          newCards.splice(i, 0, card);
          newIndices.push(i);
          newNxt++;
        }

        for (; newNxt < 81 && (newCards.length < 12 || no_sets(newCards)); newNxt++) {
          const card = int_to_card(deck[newNxt]);
          newIndices.push(newCards.length);
          newCards.push(card);
        }

        // we want to permute the new cards randomly.
        for (let i = 0; i < newIndices.length; i++) {
          const j = randrange(i, newIndices.length);
          const x = newIndices[i];
          const y = newIndices[j];
          [newCards[x], newCards[y]] = [newCards[y], newCards[x]];
        }

        setHighlight(new Set());
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

  function showSet() {
    for (let i = 0; i < cards.length - 2; i++) {
      for (let j = i + 1; j < cards.length - 1; j++) {
        for (let k = j + 1; k < cards.length; k++) {
          if (is_set(cards[i], cards[j], cards[k])) {
            let newHighlight = new Set();
            newHighlight.add(i);
            newHighlight.add(j);
            newHighlight.add(k);
            setHighlight(newHighlight);
            return;
          }
        }
      }
    }
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
          order={index}
          selected={selected.has(index)}
          highlighted={highlight.has(index)}
          onCardClick={() => handleCardClick(index)}
        />
      );
    }
  );
  return (
    <div className="board"> 

      <div className="help-button" onClick={showSet}>
        <p> ? </p>
      </div>

      {card_elements} 

      <div className="gameover-popup" style={gameover ? {} : {display : "none"}}>
        <h1> You found all the sets! </h1>
        <p> Refresh the page to play again :) </p>
      </div>

    </div>
  );
}

export default App;
