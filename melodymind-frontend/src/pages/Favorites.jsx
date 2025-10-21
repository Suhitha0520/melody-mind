
// import React, { useState, useEffect, useRef } from "react";
// import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaHeart } from "react-icons/fa";
// import { useSong } from "../context/SongContext.jsx";

// export default function Favorites() {
//   const { uploadedSongs } = useSong(); // Use SongContext to get songs
//   const [favorites, setFavorites] = useState(
//     JSON.parse(localStorage.getItem("favorites") || "[]")
//   );
//   const [songs, setSongs] = useState([]);
//   const [currentSongIndex, setCurrentSongIndex] = useState(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const audioRef = useRef(new Audio());
//   const [currentTime, setCurrentTime] = useState(0);
//   const [duration, setDuration] = useState(0);

//   const API_BASE = "https://melody-mind-2.onrender.com"; // Added to match Home.jsx

//   // Load songs from SongContext instead of localStorage
//   useEffect(() => {
//     if (uploadedSongs.length > 0) {
//       setSongs(uploadedSongs);
//     } else {
//       // Fallback to localStorage if context is empty
//       const allSongs = JSON.parse(localStorage.getItem("allSongs") || "[]");
//       setSongs(allSongs);
//     }
//   }, [uploadedSongs]);

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
//     audioRef.current.src = `${API_BASE}${song.url}`; // Prefix URL with API_BASE
//     try {
//       await audioRef.current.play();
//       setIsPlaying(true);
//       setCurrentSongIndex(index);
//     } catch (err) {
//       console.error("Play song error:", err);
//     }
//   };

//   const playPause = () => {
//     const audio = audioRef.current;
//     if (!audio.src) return;
//     if (isPlaying) {
//       audio.pause();
//       setIsPlaying(false);
//     } else {
//       audio.play().then(() => setIsPlaying(true)).catch((err) => console.error("Play error:", err));
//     }
//   };

//   const nextSong = () => {
//     if (currentSongIndex < favoriteSongs.length - 1) playSong(currentSongIndex + 1);
//   };

//   const previousSong = () => {
//     if (currentSongIndex > 0) playSong(currentSongIndex - 1);
//   };

//   const removeFavorite = (songId) => {
//     const updatedFavorites = favorites.filter((id) => id !== songId);
//     localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
//     window.dispatchEvent(new Event("favoritesUpdated"));
//     // Reset player if current song was unfavorited
//     if (currentSongIndex !== null && favoriteSongs[currentSongIndex]?.songId === songId) {
//       audioRef.current.pause();
//       setIsPlaying(false);
//       setCurrentSongIndex(null);
//       setCurrentTime(0);
//     }
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
//                 <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
//                   <button onClick={() => playSong(index)}>
//                     {isPlaying && currentSongIndex === index ? <FaPause /> : <FaPlay />}
//                   </button>
//                   <FaHeart
//                     style={{ cursor: "pointer", color: "red" }}
//                     onClick={() => removeFavorite(song.songId)}
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
// import React, { useState, useEffect, useRef } from "react";
// import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaHeart } from "react-icons/fa";
// import { useSong } from "../context/SongContext.jsx";

// export default function Favorites() {
//   const { uploadedSongs } = useSong();
//   const [favorites, setFavorites] = useState(
//     JSON.parse(localStorage.getItem("favorites") || "[]")
//   );
//   const [songs, setSongs] = useState([]);
//   const [currentSongIndex, setCurrentSongIndex] = useState(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const audioRef = useRef(new Audio());
//   const [currentTime, setCurrentTime] = useState(0);
//   const [duration, setDuration] = useState(0);

//   const API_BASE = "https://melody-mind-2.onrender.com";

//   // Load songs from SongContext or localStorage
//   useEffect(() => {
//     if (uploadedSongs.length > 0) {
//       setSongs(uploadedSongs);
//     } else {
//       const allSongs = JSON.parse(localStorage.getItem("allSongs") || "[]");
//       setSongs(allSongs);
//     }
//   }, [uploadedSongs]);

//   // Listen for favorites updates
//   useEffect(() => {
//     const handleUpdate = () => {
//       setFavorites(JSON.parse(localStorage.getItem("favorites") || "[]"));
//     };
//     window.addEventListener("favoritesUpdated", handleUpdate);
//     return () => window.removeEventListener("favoritesUpdated", handleUpdate);
//   }, []);

//   // Audio time updates and ended event
//   useEffect(() => {
//     const audio = audioRef.current;
//     const onTimeUpdate = () => setCurrentTime(audio.currentTime);
//     const onLoadedMetadata = () => setDuration(audio.duration);
//     const onEnded = () => {
//       // Play next song when current song ends
//       if (currentSongIndex < favoriteSongs.length - 1) {
//         playSong(currentSongIndex + 1);
//       } else {
//         setIsPlaying(false);
//         setCurrentSongIndex(null);
//         setCurrentTime(0);
//       }
//     };

//     audio.addEventListener("timeupdate", onTimeUpdate);
//     audio.addEventListener("loadedmetadata", onLoadedMetadata);
//     audio.addEventListener("ended", onEnded);

//     return () => {
//       audio.removeEventListener("timeupdate", onTimeUpdate);
//       audio.removeEventListener("loadedmetadata", onLoadedMetadata);
//       audio.removeEventListener("ended", onEnded);
//     };
//   }, [currentSongIndex, favoriteSongs.length]); // Dependencies to update when song changes

//   const favoriteSongs = songs.filter((s) => favorites.includes(s.songId));

//   const playSong = async (index) => {
//     const song = favoriteSongs[index];
//     if (!song?.url) {
//       alert("No valid URL for this song");
//       return;
//     }
//     const songUrl = song.url.startsWith("/") ? `${API_BASE}${song.url}` : `${API_BASE}/${song.url}`;
//     audioRef.current.src = songUrl;
//     try {
//       await audioRef.current.play();
//       setIsPlaying(true);
//       setCurrentSongIndex(index);
//     } catch (err) {
//       console.error("Play song error:", err);
//       alert("Failed to play song. Please try another.");
//     }
//   };

//   const playPause = () => {
//     const audio = audioRef.current;
//     if (!audio.src) {
//       alert("No song selected");
//       return;
//     }
//     if (isPlaying) {
//       audio.pause();
//       setIsPlaying(false);
//     } else {
//       audio.play().then(() => setIsPlaying(true)).catch((err) => {
//         console.error("Play error:", err);
//         alert("Failed to play song. Please try another.");
//       });
//     }
//   };

//   const nextSong = () => {
//     if (currentSongIndex < favoriteSongs.length - 1) {
//       playSong(currentSongIndex + 1);
//     } else {
//       alert("No next song available");
//     }
//   };

//   const previousSong = () => {
//     if (currentSongIndex > 0) {
//       playSong(currentSongIndex - 1);
//     } else {
//       alert("No previous song available");
//     }
//   };

//   const removeFavorite = (songId) => {
//     const updatedFavorites = favorites.filter((id) => id !== songId);
//     localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
//     window.dispatchEvent(new Event("favoritesUpdated"));
//     if (currentSongIndex !== null && favoriteSongs[currentSongIndex]?.songId === songId) {
//       audioRef.current.pause();
//       setIsPlaying(false);
//       setCurrentSongIndex(null);
//       setCurrentTime(0);
//     }
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
//                 <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
//                   <button onClick={() => playSong(index)}>
//                     {isPlaying && currentSongIndex === index ? <FaPause /> : <FaPlay />}
//                   </button>
//                   <FaHeart
//                     style={{ cursor: "pointer", color: "red" }}
//                     onClick={() => removeFavorite(song.songId)}
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
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaHeart, FaStickyNote } from "react-icons/fa";
import { useSong } from "../context/SongContext.jsx";

export default function Favorites() {
  const { uploadedSongs, detectedMood } = useSong(); // optional mood context
  const [favorites, setFavorites] = useState(JSON.parse(localStorage.getItem("favorites") || "[]"));
  const [songs, setSongs] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [notes, setNotes] = useState(JSON.parse(localStorage.getItem("songNotes") || "{}"));
  const audioRef = useRef(new Audio());
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const API_BASE = "https://melody-mind-2.onrender.com";

  // Load songs
  useEffect(() => {
    if (uploadedSongs.length > 0) setSongs(uploadedSongs);
    else setSongs(JSON.parse(localStorage.getItem("allSongs") || "[]"));
  }, [uploadedSongs]);

  // Listen for favorites updates
  useEffect(() => {
    const handleUpdate = () => setFavorites(JSON.parse(localStorage.getItem("favorites") || "[]"));
    window.addEventListener("favoritesUpdated", handleUpdate);
    return () => window.removeEventListener("favoritesUpdated", handleUpdate);
  }, []);

  // Audio events
  useEffect(() => {
    const audio = audioRef.current;
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => {
      if (currentSongIndex < favoriteSongs.length - 1) playSong(currentSongIndex + 1);
      else setIsPlaying(false);
    };
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
  }, [currentSongIndex]);

  const favoriteSongs = songs.filter((s) => favorites.includes(s.songId));

  const playSong = async (index) => {
    const song = favoriteSongs[index];
    if (!song?.url) return alert("No valid URL for this song");
    audioRef.current.src = song.url.startsWith("/") ? `${API_BASE}${song.url}` : `${API_BASE}/${song.url}`;
    try {
      await audioRef.current.play();
      setIsPlaying(true);
      setCurrentSongIndex(index);
    } catch {
      alert("Failed to play song. Please try another.");
    }
  };

  const playPause = () => {
    if (!audioRef.current.src) return alert("No song selected");
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play().catch(() => alert("Failed to play song."));
    setIsPlaying(!isPlaying);
  };

  const nextSong = () => currentSongIndex < favoriteSongs.length - 1 && playSong(currentSongIndex + 1);
  const previousSong = () => currentSongIndex > 0 && playSong(currentSongIndex - 1);

  const removeFavorite = (songId) => {
    const updated = favorites.filter((id) => id !== songId);
    localStorage.setItem("favorites", JSON.stringify(updated));
    window.dispatchEvent(new Event("favoritesUpdated"));
    if (currentSongIndex !== null && favoriteSongs[currentSongIndex]?.songId === songId) {
      audioRef.current.pause();
      setIsPlaying(false);
      setCurrentSongIndex(null);
      setCurrentTime(0);
    }
  };

  // ================= Notes per song =================
  const handleNoteChange = (songId, text) => {
    const updatedNotes = { ...notes, [songId]: text };
    setNotes(updatedNotes);
    localStorage.setItem("songNotes", JSON.stringify(updatedNotes));
  };

  // ================= UI =================
  return (
    <div
      className="favorites-content"
      style={{
        padding: "20px",
        background: detectedMood ? "rgba(255,255,255,0.9)" : "#f2f2f2",
        minHeight: "100vh",
        transition: "0.8s ease-in-out",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>❤ Your Favorites</h2>

      {favoriteSongs.length > 0 ? (
        <div className="song-grid" style={{ display: "grid", gap: "15px", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))" }}>
          {favoriteSongs.map((song, index) => (
            <div key={song.songId} className="song-card" style={{ padding: "15px", borderRadius: "10px", boxShadow: "0 3px 8px rgba(0,0,0,0.1)", background: "#fff" }}>
              <h4>{song.title}</h4>
              <p style={{ fontSize: "0.85rem", color: "#555" }}>{song.artist} | {song.genre} | Mood: {song.mood}</p>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
                <button onClick={() => playSong(index)} style={{ fontSize: "1.2rem" }}>
                  {isPlaying && currentSongIndex === index ? <FaPause /> : <FaPlay />}
                </button>
                <FaHeart style={{ cursor: "pointer", color: "red" }} onClick={() => removeFavorite(song.songId)} />
              </div>

              {/* ========== Notes / Favorite Moments ========== */}
              <div style={{ marginTop: "10px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "0.9rem" }}>
                  <FaStickyNote /> Your Note:
                </label>
                <textarea
                  value={notes[song.songId] || ""}
                  onChange={(e) => handleNoteChange(song.songId, e.target.value)}
                  placeholder="Write a memory or feeling..."
                  rows="3"
                  style={{ width: "100%", borderRadius: "5px", padding: "5px", fontSize: "0.85rem" }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ textAlign: "center", marginTop: "50px" }}>No favorite songs yet.</p>
      )}

      {/* ================= Player Bar ================= */}
      {currentSongIndex !== null && (
        <div className="playerbar" style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", padding: "10px 20px", display: "flex", alignItems: "center", gap: "15px", boxShadow: "0 -3px 10px rgba(0,0,0,0.1)" }}>
          <div style={{ flex: 1 }}>
            <h4>{favoriteSongs[currentSongIndex].title}</h4>
            <p style={{ fontSize: "0.85rem", color: "#555" }}>{favoriteSongs[currentSongIndex].artist}</p>
          </div>

          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={(e) => {
              audioRef.current.currentTime = e.target.value;
              setCurrentTime(e.target.value);
            }}
            style={{ flex: 2 }}
          />

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button onClick={previousSong}><FaStepBackward /></button>
            <button onClick={playPause}>{isPlaying ? <FaPause /> : <FaPlay />}</button>
            <button onClick={nextSong}><FaStepForward /></button>
          </div>
        </div>
      )}
    </div>
  );
}
