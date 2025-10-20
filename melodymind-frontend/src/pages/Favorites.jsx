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
import React, { useEffect, useState } from "react";
import { FaPlay, FaPause, FaHeart, FaEllipsisH } from "react-icons/fa";
import { useSong } from "../context/SongContext.jsx";

export default function Favorites() {
  const {
    songs,
    favorites,
    toggleFavorite,
    playSong,
    isPlaying,
    currentSong,
  } = useSong();

  const [menuOpen, setMenuOpen] = useState(null);
  const [favSongs, setFavSongs] = useState([]);

  // Update favorite songs whenever favorites or all songs change
  useEffect(() => {
    setFavSongs(songs.filter((s) => favorites.includes(s.songId)));
  }, [songs, favorites]);

  return (
    <div
      className="favorites-root"
      style={{
        backgroundColor: "lavender",
        color: "#333",
        minHeight: "100vh",
        padding: "20px",
        fontFamily: "sans-serif",
      }}
    >
      <h1>Your Favorites</h1>
      {favSongs.length === 0 ? (
        <p>No favorite songs yet!</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {favSongs.map((song, index) => (
            <li
              key={song.songId}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px",
                marginBottom: "10px",
                backgroundColor: "#f9f4ff",
                borderRadius: "8px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    fontSize: "18px",
                  }}
                  onClick={() => playSong(song)}
                >
                  {isPlaying && currentSong?.songId === song.songId ? <FaPause /> : <FaPlay />}
                </button>
                <div>
                  <h4 style={{ margin: 0 }}>{song.title}</h4>
                  <p style={{ margin: 0, fontSize: "0.9rem" }}>{song.artist}</p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <FaHeart
                  style={{
                    color: favorites.includes(song.songId) ? "red" : "#999",
                    cursor: "pointer",
                  }}
                  onClick={() => toggleFavorite(song.songId)}
                />
                <div
                  style={{ position: "relative", cursor: "pointer" }}
                  onClick={() => setMenuOpen(menuOpen === index ? null : index)}
                >
                  <FaEllipsisH />
                  {menuOpen === index && (
                    <div
                      style={{
                        position: "absolute",
                        top: "20px",
                        right: 0,
                        background: "#fff",
                        border: "1px solid #ccc",
                        borderRadius: "6px",
                        boxShadow: "0 0 10px rgba(0,0,0,0.2)",
                        zIndex: 10,
                      }}
                    >
                      <button
                        style={{
                          border: "none",
                          background: "transparent",
                          padding: "8px 12px",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          alert("Remove feature can be added here if needed");
                        }}
                      >
                        🗑 Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
