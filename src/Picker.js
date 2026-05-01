import React, { useState } from 'react';
import './Picker.css';

import iconPenguin from './assets/icons/icon-penguin.png';
import iconDragon from './assets/icons/icon-dragon.png';
import iconCat from './assets/icons/icon-cat.png';
import iconPanda from './assets/icons/icon-panda.png';

import iconBookBlue from './assets/icons/icon-book-blue.png';
import iconBookGreen from './assets/icons/icon-book-green.png';
import iconBookOrange from './assets/icons/icon-book-orange.png';
import iconBookPurple from './assets/icons/icon-book-purple.png';
import iconBookRed from './assets/icons/icon-book-red.png';
import iconBookYellow from './assets/icons/icon-book-yellow.png';

import drinkBoba from './assets/drinks/drink-boba.png';
import drinkCappuccino from './assets/drinks/drink-cappuccino.png';
import drinkChamomile from './assets/drinks/drink-chamomile.png';
import drinkIcedCaramelLatte from './assets/drinks/drink-icedcaramellatte.png';
import drinkLemonade from './assets/drinks/drink-lemonade.png';
import drinkMatcha from './assets/drinks/drink-matcha.png';
import drinkMilkshake from './assets/drinks/drink-milkshake.png';
import drinkStrawberryRefresher from './assets/drinks/drink-strawberryrefresher.png';

const animals = [
  { id: 'penguin', src: iconPenguin, name: 'Skippy', vibe: 'quiet confidence' },
  { id: 'dragon', src: iconDragon, name: 'Spikes', vibe: 'upbeat and cheerful' },
  { id: 'cat', src: iconCat, name: 'Lola', vibe: 'unbothered studier' },
  { id: 'panda', src: iconPanda, name: 'Mochi', vibe: 'friendly charm' },
];

const drinks = [
  { id: 'boba', src: drinkBoba, name: 'boba', vibe: 'pearly classic' },
  { id: 'cappuccino', src: drinkCappuccino, name: 'cappuccino', vibe: 'caffeine grind' },
  { id: 'chamomile', src: drinkChamomile, name: 'chamomile', vibe: 'calm vibes' },
  { id: 'icedcaramellatte', src: drinkIcedCaramelLatte, name: 'iced caramel latte', vibe: 'flavor bomb' },
  { id: 'lemonade', src: drinkLemonade, name: 'lemonade', vibe: 'bright ideas' },
  { id: 'matcha', src: drinkMatcha, name: 'matcha', vibe: 'soft focus' },
  { id: 'milkshake', src: drinkMilkshake, name: 'milkshake', vibe: 'sweet treat' },
  { id: 'strawberryrefresher', src: drinkStrawberryRefresher, name: 'strawberry refresher', vibe: 'hello summer' },
];

const books = [
  { id: 'red', src: iconBookRed, name: 'red', vibe: 'bold focus' },
  { id: 'orange', src: iconBookOrange, name: 'orange', vibe: 'warm and creative' },
  { id: 'yellow', src: iconBookYellow, name: 'yellow', vibe: 'sunshine brain' },
  { id: 'green', src: iconBookGreen, name: 'green', vibe: 'calm and grounded' },
  { id: 'blue', src: iconBookBlue, name: 'blue', vibe: 'in the zone' },
  { id: 'purple', src: iconBookPurple, name: 'purple', vibe: 'mysterious studier' },
];

function PickerGrid({ items, selected, onSelect, columns, imgClass }) {
  return (
    <div className="picker-grid" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {items.map(item => (
        <div
          key={item.id}
          className={`picker-card ${selected === item.id ? 'selected' : ''}`}
          onClick={() => onSelect(item.id)}
        >
          <div className="card-img-wrap">
        <img src={item.src} alt={item.name} className={imgClass || 'picker-card-img'} />
        </div>
          <div className="picker-card-name">{item.name}</div>
          <div className="picker-card-vibe">{item.vibe}</div>
        </div>
      ))}
    </div>
  );
}

function Summary({ name, animal, drink, book, onConfirm, onBack }) {
  const animalData = animals.find(a => a.id === animal);
  const drinkData = drinks.find(d => d.id === drink);
  const bookData = books.find(b => b.id === book);

  return (
    <div className="summary">
      <h2 className="summary-title">your setup ☕</h2>
      <p className="summary-subtitle">looking good, {name}</p>
      <div className="summary-cards">
        <div className="summary-card">
          <img src={animalData.src} alt={animalData.name} />
          <div className="summary-card-name">{animalData.name}</div>
          <div className="summary-card-vibe">{animalData.vibe}</div>
        </div>
        <div className="summary-card">
          <img src={drinkData.src} alt={drinkData.name} />
          <div className="summary-card-name">{drinkData.name}</div>
          <div className="summary-card-vibe">{drinkData.vibe}</div>
        </div>
        <div className="summary-card">
          <img src={bookData.src} alt={bookData.name} />
          <div className="summary-card-name">{bookData.name}</div>
          <div className="summary-card-vibe">{bookData.vibe}</div>
        </div>
      </div>
      <div className="summary-btns">
        <button className="back-btn" onClick={onBack}>← go back</button>
        <button className="join-btn" onClick={onConfirm}>find a seat →</button>
      </div>
    </div>
  );
}

function Picker({ onDone }) {
  const [name, setName] = useState('');
  const [tab, setTab] = useState('character');
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [selectedDrink, setSelectedDrink] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showSummary, setShowSummary] = useState(false);

  const allPicked = selectedAnimal && selectedDrink && selectedBook && name.trim();

  if (showSummary) {
    return (
      <Summary
        name={name}
        animal={selectedAnimal}
        drink={selectedDrink}
        book={selectedBook}
        onConfirm={() => onDone({ name, animal: selectedAnimal, drink: selectedDrink, book: selectedBook })}
        onBack={() => setShowSummary(false)}
      />
    );
  }

  return (
    <div className="picker">
      <div className="picker-top">
        <h1 className="picker-title">pick your vibe ☕</h1>
        <input
          className="picker-input"
          type="text"
          placeholder="nickname"
          maxLength={20}
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </div>

      <div className="picker-tabs">
        {['character', 'drink', 'book'].map(t => (
          <button
            key={t}
            className={`tab-btn ${tab === t ? 'active' : ''} ${
              t === 'character' && selectedAnimal ? 'done' :
              t === 'drink' && selectedDrink ? 'done' :
              t === 'book' && selectedBook ? 'done' : ''
            }`}
            onClick={() => setTab(t)}
          >
            {t === 'character' && selectedAnimal ? '✓ character' :
             t === 'drink' && selectedDrink ? '✓ drink' :
             t === 'book' && selectedBook ? '✓ book' : t}
          </button>
        ))}
      </div>

      <div className="picker-content">
        {tab === 'character' && (
            <PickerGrid items={animals} selected={selectedAnimal} onSelect={setSelectedAnimal} columns={2} imgClass="character-img" />
        )}
        {tab === 'drink' && (
          <PickerGrid items={drinks} selected={selectedDrink} onSelect={setSelectedDrink} columns={4} />
        )}
        {tab === 'book' && (
          <PickerGrid items={books} selected={selectedBook} onSelect={setSelectedBook} columns={3} />
        )}
      </div>

      <button
        className={`join-btn ${allPicked ? 'active' : ''}`}
        disabled={!allPicked}
        onClick={() => setShowSummary(true)}
      >
        {allPicked ? 'see your setup →' : 'pick a character, drink, book, and enter your nickname to continue'}
      </button>
    </div>
  );
}

export default Picker;