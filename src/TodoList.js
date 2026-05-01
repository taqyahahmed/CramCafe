import React, { useState } from 'react';
import { supabase } from './supabase';
import './TodoList.css';

function TodoList({ position, isOwner, onClose, roomId, seatIndex, initialItems, name }) {
  const [items, setItems] = useState(initialItems || []);
  const [input, setInput] = useState('');

  async function addItem() {
    if (input.trim() === '' || items.length >= 5) return;
    const newItems = [...items, { id: Date.now(), text: input.trim(), done: false }];
    setItems(newItems);
    setInput('');
    await supabase
      .from('seats')
      .update({ todo_items: newItems })
      .eq('room_id', roomId)
      .eq('seat_index', seatIndex);
  }

  async function toggleItem(id) {
    const newItems = items.map(item => item.id === id ? { ...item, done: !item.done } : item);
    setItems(newItems);
    await supabase
      .from('seats')
      .update({ todo_items: newItems })
      .eq('room_id', roomId)
      .eq('seat_index', seatIndex);
  }

  async function deleteItem(id) {
    const newItems = items.filter(item => item.id !== id);
    setItems(newItems);
    await supabase
      .from('seats')
      .update({ todo_items: newItems })
      .eq('room_id', roomId)
      .eq('seat_index', seatIndex);
  }

  return (
    <div className="todo-bubble" style={{ left: position.left, bottom: position.bottom }}>
      <div className="todo-header">
        <span className="todo-title">{isOwner ? 'my tasks' : `${name}\u2019s tasks`}</span>
        <button className="todo-close" onClick={onClose}>✕</button>
      </div>

      <ul className="todo-items">
        {items.length === 0 && (
          <li className="todo-empty">nothing here yet...</li>
        )}
        {items.map(item => (
          <li key={item.id} className={`todo-item ${item.done ? 'done' : ''}`}>
            <div className="todo-check" onClick={() => isOwner && toggleItem(item.id)}>
              {item.done && <span className="todo-checkmark">✓</span>}
            </div>
            <span className="todo-text">{item.text}</span>
            {isOwner && (
              <button className="todo-delete" onClick={() => deleteItem(item.id)}>✕</button>
            )}
          </li>
        ))}
      </ul>

      {isOwner && (
        <div className="todo-input-row">
          <input
            className="todo-input"
            type="text"
            placeholder={items.length >= 5 ? 'max 5 items' : 'add a task...'}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addItem()}
            disabled={items.length >= 5}
            maxLength={40}
          />
          <button className="todo-add" onClick={addItem} disabled={items.length >= 5}>+</button>
        </div>
      )}

      <div className="todo-tail" />
    </div>
  );
}

export default TodoList;