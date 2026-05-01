import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import Room from './Room';
import Pomodoro from './Pomodoro';
import Socials from './Socials';
import Sounds from './Sounds';
import './App.css';
import Picker from './Picker';
import TodoList from './TodoList';
import background from './assets/background.png';

import characterPenguin from './assets/characters/character-penguin.png';
import characterDragon from './assets/characters/character-dragon.png';
import characterCat from './assets/characters/character-cat.png';
import characterPanda from './assets/characters/character-panda.png';

import bookBlue from './assets/books/book-blue.png';
import bookGreen from './assets/books/book-green.png';
import bookOrange from './assets/books/book-orange.png';
import bookPurple from './assets/books/book-purple.png';
import bookRed from './assets/books/book-red.png';
import bookYellow from './assets/books/book-yellow.png';

import drinkBoba from './assets/drinks/drink-boba.png';
import drinkCappuccino from './assets/drinks/drink-cappuccino.png';
import drinkChamomile from './assets/drinks/drink-chamomile.png';
import drinkIcedCaramelLatte from './assets/drinks/drink-icedcaramellatte.png';
import drinkLemonade from './assets/drinks/drink-lemonade.png';
import drinkMatcha from './assets/drinks/drink-matcha.png';
import drinkMilkshake from './assets/drinks/drink-milkshake.png';
import drinkStrawberryRefresher from './assets/drinks/drink-strawberryrefresher.png';

const characters = {
  penguin: characterPenguin,
  dragon: characterDragon,
  cat: characterCat,
  panda: characterPanda,
};

const books = {
  blue: bookBlue,
  green: bookGreen,
  orange: bookOrange,
  purple: bookPurple,
  red: bookRed,
  yellow: bookYellow,
};

const drinks = {
  boba: drinkBoba,
  cappuccino: drinkCappuccino,
  chamomile: drinkChamomile,
  icedcaramellatte: drinkIcedCaramelLatte,
  lemonade: drinkLemonade,
  matcha: drinkMatcha,
  milkshake: drinkMilkshake,
  strawberryrefresher: drinkStrawberryRefresher,
};

const seatLeftPositions = ['.5%', '20%', '43%', '68%'];

const animalBottomOffset = {
  penguin: '9.5%',
  dragon: '-.12%',
  cat: '-3.8%',
  panda: '6.5%',
};

const animalSizes = {
  penguin: '55%',
  dragon: '65%',
  cat: '75%',
  panda: '60%',
};

const animalAnimations = {
  penguin: '3s',
  dragon: '3.5s',
  cat: '3.5s',
  panda: '2.8s',
};

const seatDrinkPositions = [
  { left: '7%', bottom: '10%' },
  { left: '27%', bottom: '10%' },
  { left: '50%', bottom: '10%' },
  { left: '75%', bottom: '10%' },
];

const seatBookPositions = [
  { left: '12%', bottom: '6%' },
  { left: '32%', bottom: '6%' },
  { left: '55%', bottom: '6%' },
  { left: '80%', bottom: '6%' },
];

const seatTodoPositions = [
  { left: '8%', bottom: '58%' },
  { left: '28%', bottom: '58%' },
  { left: '50%', bottom: '58%' },
  { left: '72%', bottom: '58%' },
];

const nametagLeft = {
  0: '15%',
  1: '35%',
  2: '63%',
  3: '88%',
};

function Character({ type, position, size, animationDuration }) {
  return (
    <img
      src={characters[type]}
      alt={type}
      className="character"
      style={{
        left: position.left,
        bottom: position.bottom,
        height: size,
        animationDuration: animationDuration,
      }}
    />
  );
}

function DrinkItem({ type, position }) {
  return (
    <img
      src={drinks[type]}
      alt={type}
      className="desk-item"
      style={{ left: position.left, bottom: position.bottom }}
    />
  );
}

function NameTag({ name, seatIndex, instagram, discord }) {
  return (
    <div
      className="nametag"
      style={{
        left: nametagLeft[seatIndex],
        bottom: '52%',
      }}
    >
      <div className="nametag-name">{name}</div>
      {(instagram || discord) && (
        <div className="nametag-socials">
          {instagram && <span>@{instagram}</span>}
          {instagram && discord && <span> · </span>}
          {discord && <span>{discord}</span>}
        </div>
      )}
    </div>
  );
}

function BookItem({ type, position, onClick }) {
  return (
    <>
      <img
        src={books[type]}
        alt={type}
        className="desk-item"
        onClick={onClick}
        style={{ left: position.left, bottom: position.bottom, cursor: 'pointer' }}
      />
      <div
        className="book-hint"
        onClick={onClick}
        style={{
          left: `calc(${position.left} + 9%)`,
          bottom: `calc(${position.bottom} + 12%)`,
          fontSize: '24px',
        }}
      >
        💭
      </div>
    </>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [seatIndex, setSeatIndex] = useState(null);
  const [todoOpen, setTodoOpen] = useState(false);
  const [viewTodoSeat, setViewTodoSeat] = useState(null);
  const [seats, setSeats] = useState([]);

  useEffect(() => {
    if (!roomId) return;

    async function loadSeats() {
      await supabase
        .from('seats')
        .delete()
        .lt('last_seen', new Date(Date.now() - 45000).toISOString());

      const { data } = await supabase
        .from('seats')
        .select('*')
        .eq('room_id', roomId);

      if (data) setSeats(data);
    }

    loadSeats();

    const channel = supabase
      .channel('room:' + roomId)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'seats',
        filter: `room_id=eq.${roomId}`,
      }, () => {
        loadSeats();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  useEffect(() => {
    if (!roomId || seatIndex === null) return;

    async function cleanup() {
      await supabase
        .from('seats')
        .delete()
        .eq('room_id', roomId)
        .eq('seat_index', seatIndex);
    }

    window.addEventListener('beforeunload', cleanup);

    const heartbeat = setInterval(async () => {
      await supabase
        .from('seats')
        .update({ last_seen: new Date().toISOString() })
        .eq('room_id', roomId)
        .eq('seat_index', seatIndex);
    }, 20000);

    return () => {
      clearInterval(heartbeat);
      cleanup();
      window.removeEventListener('beforeunload', cleanup);
    };
  }, [roomId, seatIndex]);

  if (!user) return <Picker onDone={setUser} />;
  if (!roomId) return <Room user={user} onJoin={(code, seat) => { setRoomId(code); setSeatIndex(seat); }} />;

  return (
    <div className="app">
      <div className="scene">
        <img src={background} alt="cafe background" className="background" />

        {seats.map(seat => (
          <Character
            key={seat.seat_index}
            type={seat.animal}
            position={{ left: seatLeftPositions[seat.seat_index], bottom: animalBottomOffset[seat.animal] }}
            size={animalSizes[seat.animal]}
            animationDuration={animalAnimations[seat.animal]}
          />
        ))}

        {seats.map(seat => (
          <NameTag
            key={'name-' + seat.seat_index}
            name={seat.user_name}
            seatIndex={seat.seat_index}
            instagram={seat.instagram}
            discord={seat.discord}
          />
        ))}

        {seats.map(seat => (
          <DrinkItem
            key={'drink-' + seat.seat_index}
            type={seat.drink}
            position={seatDrinkPositions[seat.seat_index]}
          />
        ))}

        {seats.map(seat => (
          <BookItem
            key={'book-' + seat.seat_index}
            type={seat.book}
            position={seatBookPositions[seat.seat_index]}
            onClick={() => {
              if (seat.seat_index === seatIndex) {
                setViewTodoSeat(null);
                setTodoOpen(!todoOpen);
              } else {
                setTodoOpen(false);
                setViewTodoSeat(seat.seat_index === viewTodoSeat ? null : seat.seat_index);
              }
            }}
          />
        ))}

        {todoOpen && (
          <TodoList
            position={seatTodoPositions[seatIndex]}
            isOwner={true}
            onClose={() => setTodoOpen(false)}
            roomId={roomId}
            seatIndex={seatIndex}
            initialItems={seats.find(s => s.seat_index === seatIndex)?.todo_items || []}
          />
        )}

        {viewTodoSeat !== null && (
          <TodoList
            position={seatTodoPositions[viewTodoSeat]}
            isOwner={false}
            onClose={() => setViewTodoSeat(null)}
            roomId={roomId}
            seatIndex={viewTodoSeat}
            initialItems={seats.find(s => s.seat_index === viewTodoSeat)?.todo_items || []}
            name={seats.find(s => s.seat_index === viewTodoSeat)?.user_name || ''}
          />
        )}

        <div className="panels-wrap">
          <Sounds />
          <div className="side-panel">
            <Pomodoro />
            <Socials roomId={roomId} seatIndex={seatIndex} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;