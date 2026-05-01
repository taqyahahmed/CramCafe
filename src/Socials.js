import React, { useState } from 'react';
import { supabase } from './supabase';
import './Socials.css';

function Socials({ roomId, seatIndex }) {
  const [instagram, setInstagram] = useState('');
  const [discord, setDiscord] = useState('');
  const [saved, setSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  async function handleSave() {
    await supabase
      .from('seats')
      .update({ instagram, discord })
      .eq('room_id', roomId)
      .eq('seat_index', seatIndex);
    setSaved(true);
    setIsEditing(false);
  }

  return (
    <div className="socials">
      <div className="socials-header" onClick={() => setIsEditing(!isEditing)}>
        <span className="socials-title">share your socials </span>
        <span className="socials-toggle">{isEditing ? '▲' : '▼'}</span>
      </div>

      {isEditing && (
        <div className="socials-body">
          <div className="socials-row">
            <span className="socials-icon">📸</span>
            <input
              className="socials-input"
              type="text"
              placeholder="instagram"
              value={instagram}
              onChange={e => setInstagram(e.target.value)}
              maxLength={30}
            />
          </div>
          <div className="socials-row">
            <span className="socials-icon">🎮</span>
            <input
              className="socials-input"
              type="text"
              placeholder="discord"
              value={discord}
              onChange={e => setDiscord(e.target.value)}
              maxLength={30}
            />
          </div>
          <button className="socials-save" onClick={handleSave}>save</button>
        </div>
      )}

      {saved && !isEditing && (
        <div className="socials-saved">
          {instagram && <div className="socials-chip">📸 @{instagram}</div>}
          {discord && <div className="socials-chip">🎮 {discord}</div>}
          <button className="socials-edit" onClick={() => setIsEditing(true)}>edit</button>
        </div>
      )}
    </div>
  );
}

export default Socials;