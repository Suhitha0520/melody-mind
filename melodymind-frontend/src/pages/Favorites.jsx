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
import React, { useState, useEffect, useRef } from "react";
import { FaPlay, FaPause, FaHeart } from "react-icons/fa";

export default function Favorites({ songs, logAndPlaySong, currentSongIndex, isPlaying, setIsPlaying }) {
  const [favorites, setFavorites] = useState([]);
  const [favSongs, setFavSongs] = useState([]);
  const audioRef = useRef(new Audio());

  // Load favorites from localStorage
  useEffect(() => {
    const favIds = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(favIds);
    setFavSongs(songs.filter((s) => favIds.includes(s.songId)));
  }, [songs]);

  // Update favorites on changes
  useEffect(() => {
    const handleFavUpdate = () => {
      const favIds = JSON.parse(localStorage.getItem("favorites") || "[]");
      setFavorites(favIds);
      setFavSongs(songs.filter((s) => favIds.includes(s.songId)));
    };
    window.addEventListener("favoritesUpdated", handleFavUpdate);
    return () => window.removeEventListener("favoritesUpdated", handleFavUpdate);
  }, [songs]);

  const toggleFavorite = (songId) => {
    const updated = favorites.includes(songId)
      ? favorites.filter((id) => id !== songId)
      : [...favorites, songId];
    localStorage.setItem("favorites", JSON.stringify(updated));
    window.dispatchEvent(new Event("favoritesUpdated"));
  };

  const playPause = (song, index) => {
    if (currentSongIndex === index) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    } else {
      logAndPlaySong(index);
      setIsPlaying(true);
    }
  };

  return (
    <div style={{ padding: "20px", background: "#E6E6FA", minHeight: "100vh" }}>
      <h2 style={{ marginBottom: "20px" }}>Your Favorite Songs</h2>
      {favSongs.length === 0 ? (
        <p>No favorite songs yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {favSongs.map((song, index) => (
            <li
              key={song.songId}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#F8F8FF",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "8px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <button
                  onClick={() => playPause(song, index)}
                  style={{
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    fontSize: "18px",
                  }}
                >
                  {isPlaying && currentSongIndex === index ? <FaPause /> : <FaPlay />}
                </button>
                <div>
                  <h4 style={{ margin: 0 }}>{song.title}</h4>
                  <p style={{ margin: 0, fontSize: "12px" }}>{song.artist}</p>
                </div>
              </div>
              <FaHeart
                onClick={() => toggleFavorite(song.songId)}
                style={{
                  color: favorites.includes(song.songId) ? "red" : "grey",
                  cursor: "pointer",
                }}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
