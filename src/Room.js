import React, { useState } from 'react';
import { supabase } from './supabase';
import './Room.css';

function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function Room({ user, onJoin }) {
    const [createdCode, setCreatedCode] = useState('');
  const [mode, setMode] = useState(null);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [privateCode, setPrivateCode] = useState('');

  async function findPublicTable() {
    setLoading(true);
    setError('');

    const { data: publicRooms } = await supabase
      .from('seats')
      .select('room_id, seat_index')
      .eq('is_private', false);

    const roomMap = {};
    if (publicRooms) {
      publicRooms.forEach(s => {
        if (!roomMap[s.room_id]) roomMap[s.room_id] = [];
        roomMap[s.room_id].push(s.seat_index);
      });
    }

    let targetRoom = null;
    let nextSeat = null;

    for (const [roomId, takenSeats] of Object.entries(roomMap)) {
      if (takenSeats.length < 4) {
        targetRoom = roomId;
        nextSeat = [0, 1, 2, 3].find(i => !takenSeats.includes(i));
        break;
      }
    }

    if (!targetRoom) {
      targetRoom = generateRoomCode();
      nextSeat = 0;
    }

    const { error: insertError } = await supabase.from('seats').insert({
      room_id: targetRoom,
      seat_index: nextSeat,
      user_name: user.name,
      animal: user.animal,
      drink: user.drink,
      book: user.book,
      is_private: false,
    });

    if (insertError) {
      setError('something went wrong, try again');
    } else {
      onJoin(targetRoom, nextSeat);
    }
    setLoading(false);
  }

    async function createPrivateRoom() {
    setLoading(true);
    const code = generateRoomCode();

    const { error: insertError } = await supabase.from('seats').insert({
        room_id: code,
        seat_index: 0,
        user_name: user.name,
        animal: user.animal,
        drink: user.drink,
        book: user.book,
        is_private: true,
    });

    if (insertError) {
        setError('something went wrong, try again');
        setLoading(false);
    } else {
        setCreatedCode(code);
        setLoading(false);
    }
    }

  async function joinPrivateRoom() {
    setLoading(true);
    setError('');
    const code = input.toUpperCase().trim();

    const { data: existingSeats, error: fetchError } = await supabase
      .from('seats')
      .select('seat_index')
      .eq('room_id', code);

    if (fetchError || !existingSeats || existingSeats.length === 0) {
      setError('room not found!');
      setLoading(false);
      return;
    }

    if (existingSeats.length >= 4) {
      setError('this table is full!');
      setLoading(false);
      return;
    }

    const takenIndices = existingSeats.map(s => s.seat_index);
    const nextSeat = [0, 1, 2, 3].find(i => !takenIndices.includes(i));

    const { error: insertError } = await supabase.from('seats').insert({
      room_id: code,
      seat_index: nextSeat,
      user_name: user.name,
      animal: user.animal,
      drink: user.drink,
      book: user.book,
      is_private: true,
    });

    if (insertError) {
      setError('something went wrong, try again');
    } else {
      onJoin(code, nextSeat);
    }
    setLoading(false);
  }

  return (
    <div className="room">
      <h1 className="room-title">find your table</h1>
      <p className="room-subtitle">sit with strangers or bring your friends</p>

      {!mode && (
        <div className="room-sections">
          <div className="room-card" onClick={findPublicTable}>
            <div className="room-card-icon">☕</div>
            <h2 className="room-card-title">find a table</h2>
            <p className="room-card-desc">join a random table and study with strangers</p>
            <button className="room-btn" disabled={loading}>
              {loading ? 'finding...' : 'find a table →'}
            </button>
          </div>

          <div className="room-card" onClick={() => setMode('private')}>
            <div className="room-card-icon">🔒</div>
            <h2 className="room-card-title">private room</h2>
            <p className="room-card-desc">create or join a room with friends</p>
            <button className="room-btn secondary">private room →</button>
          </div>
        </div>
      )}

      {mode === 'private' && (
        <div className="room-sections">
          <div className="room-card">
            <h2 className="room-card-title">create private room</h2>
            <p className="room-card-desc">start a table and share the code</p>
            <button className="room-btn" onClick={createPrivateRoom} disabled={loading}>
              {loading ? 'creating...' : 'create room →'}
            </button>
          </div>

          {createdCode && (
            <div className="room-code-display">
                <p className="room-code-label">your room code</p>
                <div className="room-code">{createdCode}</div>
                <button className="room-btn" onClick={() => {
                navigator.clipboard.writeText(createdCode);
                }}>copy code</button>
                <button className="room-btn" style={{ marginTop: '6px', background: '#6ab187' }} onClick={() => onJoin(createdCode, 0)}>
                enter room →
                </button>
            </div>
            )}

          <div className="room-divider">or</div>

          <div className="room-card">
            <h2 className="room-card-title">join private room</h2>
            <p className="room-card-desc">enter a code to join your friends</p>
            <input
              className="room-input"
              type="text"
              placeholder="enter room code"
              value={input}
              onChange={e => setInput(e.target.value)}
              maxLength={6}
            />
            <button className="room-btn" onClick={joinPrivateRoom} disabled={loading || !input.trim()}>
              {loading ? 'joining...' : 'join room →'}
            </button>
          </div>

          <button className="room-back" onClick={() => setMode(null)}>← back</button>
        </div>
      )}

      {error && <p className="room-error">{error}</p>}
    </div>
  );
}

export default Room;