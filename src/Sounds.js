import React, { useState, useRef } from 'react';
import './Sounds.css';

import cafeSound from './assets/sounds/cafe.mp3';
import rainSound from './assets/sounds/rain.mp3';
import lofiSound from './assets/sounds/lofi.mp3';
import fireplaceSound from './assets/sounds/fireplace.mp3';
import forestSound from './assets/sounds/forest.mp3';
import wavesSound from './assets/sounds/waves.mp3';

function Sounds() {
  const soundOptions = [
    { id: 'cafe', emoji: '☕', label: 'café', src: cafeSound },
    { id: 'rain', emoji: '🌧️', label: 'rain', src: rainSound },
    { id: 'lofi', emoji: '🎵', label: 'lo-fi', src: lofiSound },
    { id: 'fire', emoji: '🔥', label: 'fireplace', src: fireplaceSound },
    { id: 'forest', emoji: '🌿', label: 'forest', src: forestSound },
    { id: 'waves', emoji: '🌊', label: 'waves', src: wavesSound },
  ];

  const [active, setActive] = useState(null);
  const audioRef = useRef(null);

  function handleSelect(sound) {
    if (active === sound.id) {
      audioRef.current.pause();
      setActive(null);
      return;
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
    audioRef.current = new Audio(sound.src);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.4;
    audioRef.current.play();
    setActive(sound.id);
  }

  return (
    <div className="sounds">
      <div className="sounds-label">ambiance</div>
      <div className="sounds-row">
        {soundOptions.map(sound => (
          <div
            key={sound.id}
            className={`sound-card ${active === sound.id ? 'active' : ''}`}
            onClick={() => handleSelect(sound)}
          >
            <span className="sound-emoji">{sound.emoji}</span>
            <span className="sound-name">{sound.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sounds;