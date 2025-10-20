// import React, { useEffect, useState } from "react";
// import axios from "axios";

// export default function Favorites() {
//   const [favorites, setFavorites] = useState([]);
//   const [songs, setSongs] = useState([]);

//   // Initialize favorites and songs on mount
//   useEffect(() => {
//     const savedFavs = JSON.parse(localStorage.getItem("favorites")) || [];
//     setFavorites(savedFavs);

//     axios
//       .get("http://localhost:5000/api/songs")
//       .then((res) => setSongs(res.data))
//       .catch((err) => console.error("Fetch songs error:", err));
//   }, []);

//   // Listen for changes to localStorage
//   useEffect(() => {
//     const handleStorageChange = () => {
//       const savedFavs = JSON.parse(localStorage.getItem("favorites")) || [];
//       setFavorites(savedFavs);
//     };

//     window.addEventListener("storage", handleStorageChange);

//     // Custom event listener for same-tab updates
//     window.addEventListener("localStorageUpdate", handleStorageChange);

//     return () => {
//       window.removeEventListener("storage", handleStorageChange);
//       window.removeEventListener("localStorageUpdate", handleStorageChange);
//     };
//   }, []);

//   // Filter favorite songs
//   const favoriteSongs = songs.filter((s) => favorites.includes(s.songId));

//   return (
//     <div className="favorites-content">
//       <h2>❤ Your Favorites</h2>
//       {favoriteSongs.length > 0 ? (
//         <ul className="song-list">
//           {favoriteSongs.map((song) => (
//             <li key={song.songId} className="song-item">
//               <h4>{song.title}</h4>
//               <p>
//                 {song.artist} | {song.genre} | Mood: {song.mood}
//                 {song.tempo ? ` [~${Math.round(song.tempo)} BPM]` : ""}
//               </p>
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>No favorite songs yet.</p>
//       )}
//     </div>
//   );
// }
// import React, { useState, useEffect, useRef } from "react";
// import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaHeart } from "react-icons/fa";

// export default function Favorites() {
//   const [favorites, setFavorites] = useState(
//     JSON.parse(localStorage.getItem("favorites") || "[]")
//   );
//   const [songs, setSongs] = useState([]);
//   const [currentSongIndex, setCurrentSongIndex] = useState(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const audioRef = useRef(new Audio());
//   const [currentTime, setCurrentTime] = useState(0);
//   const [duration, setDuration] = useState(0);

//   // Load all songs from localStorage (or get from parent if you pass props)
//   useEffect(() => {
//     const allSongs = JSON.parse(localStorage.getItem("allSongs") || "[]");
//     setSongs(allSongs);
//   }, []);

//   // Listen for favorites updates
//   useEffect(() => {
//     const handleUpdate = () => {
//       setFavorites(JSON.parse(localStorage.getItem("favorites") || "[]"));
//     };
//     window.addEventListener("favoritesUpdated", handleUpdate);
//     return () => window.removeEventListener("favoritesUpdated", handleUpdate);
//   }, []);

//   // Audio time updates
//   useEffect(() => {
//     const audio = audioRef.current;
//     const onTimeUpdate = () => setCurrentTime(audio.currentTime);
//     const onLoadedMetadata = () => setDuration(audio.duration);

//     audio.addEventListener("timeupdate", onTimeUpdate);
//     audio.addEventListener("loadedmetadata", onLoadedMetadata);

//     return () => {
//       audio.removeEventListener("timeupdate", onTimeUpdate);
//       audio.removeEventListener("loadedmetadata", onLoadedMetadata);
//     };
//   }, []);

//   const favoriteSongs = songs.filter((s) => favorites.includes(s.songId));

//   const playSong = async (index) => {
//     const song = favoriteSongs[index];
//     if (!song?.url) return;
//     audioRef.current.src = song.url;
//     await audioRef.current.play();
//     setIsPlaying(true);
//     setCurrentSongIndex(index);
//   };

//   const playPause = () => {
//     if (!audioRef.current.src) return;
//     if (isPlaying) {
//       audioRef.current.pause();
//       setIsPlaying(false);
//     } else {
//       audioRef.current.play().then(() => setIsPlaying(true));
//     }
//   };

//   const nextSong = () => {
//     if (currentSongIndex < favoriteSongs.length - 1) playSong(currentSongIndex + 1);
//   };

//   const previousSong = () => {
//     if (currentSongIndex > 0) playSong(currentSongIndex - 1);
//   };

//   return (
//     <div className="favorites-content">
//       <h2>❤ Your Favorites</h2>
//       {favoriteSongs.length > 0 ? (
//         <ul className="song-list">
//           {favoriteSongs.map((song, index) => (
//             <li key={song.songId} className="song-item">
//               <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
//                 <div>
//                   <h4>{song.title}</h4>
//                   <p>{song.artist} | {song.genre} | Mood: {song.mood}</p>
//                 </div>
//                 <div style={{ display: "flex", gap: "10px" }}>
//                   <button onClick={() => playSong(index)}>
//                     {isPlaying && currentSongIndex === index ? <FaPause /> : <FaPlay />}
//                   </button>
//                   <FaHeart
//                     style={{ cursor: "pointer", color: "red" }}
//                   />
//                 </div>
//               </div>
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>No favorite songs yet.</p>
//       )}

//       {currentSongIndex !== null && (
//         <div className="playerbar">
//           <div className="playerbar-info">
//             <h4>{favoriteSongs[currentSongIndex].title}</h4>
//             <p>{favoriteSongs[currentSongIndex].artist}</p>
//           </div>

//           <div className="progress-container">
//             <div
//               className="progress-fill"
//               style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
//             ></div>
//             <input
//               type="range"
//               min="0"
//               max={duration || 0}
//               value={currentTime}
//               onChange={(e) => {
//                 audioRef.current.currentTime = e.target.value;
//                 setCurrentTime(e.target.value);
//               }}
//             />
//           </div>

//           <div className="playerbar-controls">
//             <button onClick={previousSong}><FaStepBackward /></button>
//             <button onClick={playPause}>{isPlaying ? <FaPause /> : <FaPlay />}</button>
//             <button onClick={nextSong}><FaStepForward /></button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import { useSong } from "../context/SongContext.jsx";
import { FaPlay, FaPause, FaHeart } from "react-icons/fa";

export default function Favorites() {
  const { uploadedSongs, currentSong, setCurrentSong, setCurrentMood, audioRef, isPlaying, setIsPlaying } = useSong();
  const [favorites, setFavorites] = useState([]);

  // Load favorites
  useEffect(() => {
    const favIds = JSON.parse(localStorage.getItem("favorites") || "[]");
    const favSongs = uploadedSongs.filter((s) => favIds.includes(s.songId));
    setFavorites(favSongs);
  }, [uploadedSongs]);

  // Update favorites on toggle
  useEffect(() => {
    const handler = () => {
      const favIds = JSON.parse(localStorage.getItem("favorites") || "[]");
      const favSongs = uploadedSongs.filter((s) => favIds.includes(s.songId));
      setFavorites(favSongs);
    };
    window.addEventListener("favoritesUpdated", handler);
    return () => window.removeEventListener("favoritesUpdated", handler);
  }, [uploadedSongs]);

  const playSong = (song) => {
    if (!song?.url) return alert("No URL found");
    // Use same backend path as Home.jsx
    const url = song.url.startsWith("http")
      ? song.url
      : `https://melody-mind-2.onrender.com${song.url}`;
    audioRef.current.src = url;
    audioRef.current
      .play()
      .then(() => {
        setCurrentSong(song);
        setCurrentMood(song.mood);
        setIsPlaying(true);
      })
      .catch((err) => console.error("Play song error:", err));
  };

  return (
    <div className="favorites-root">
      <style>{`
        .favorites-root {
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
          background: #f9f9f9;
          color: #333;
          border-radius: 12px;
        }
        .favorites-root h2 {
          margin-bottom: 20px;
          color: #444;
        }
        .favorites-list {
          list-style: none;
          padding: 0;
        }
        .favorite-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #fff;
          padding: 12px 16px;
          margin-bottom: 10px;
          border-radius: 8px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .favorite-item button {
          background: none;
          border: none;
          color: #007bff;
          font-size: 18px;
          margin-right: 10px;
          cursor: pointer;
        }
        .heart-icon {
          cursor: pointer;
          color: #f44336;
          font-size: 18px;
        }
      `}</style>

      <h2>❤ Your Favorites</h2>
      {favorites.length === 0 && <p>No favorite songs yet.</p>}
      <ul className="favorites-list">
        {favorites.map((song) => (
          <li key={song.songId} className="favorite-item">
            <button onClick={() => playSong(song)}>
              {isPlaying && currentSong?.songId === song.songId ? <FaPause /> : <FaPlay />}
            </button>
            <span>{song.title} ({song.artist})</span>
            <FaHeart
              className="heart-icon favorited"
              onClick={() => {
                let favIds = JSON.parse(localStorage.getItem("favorites") || "[]");
                favIds = favIds.filter((id) => id !== song.songId);
                localStorage.setItem("favorites", JSON.stringify(favIds));
                window.dispatchEvent(new Event("favoritesUpdated"));
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
