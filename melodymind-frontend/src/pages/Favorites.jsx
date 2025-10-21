
// import React, { useState, useEffect, useRef } from "react";
// import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaHeart } from "react-icons/fa";
// import { useSong } from "../context/SongContext.jsx";
// import "./Favorites.css"; // add gradient cards, hover, scroll styles

// export default function Favorites() {
//   const { uploadedSongs, setCurrentSong, setCurrentMood } = useSong();
//   const [favorites, setFavorites] = useState(
//     JSON.parse(localStorage.getItem("favorites") || "[]")
//   );
//   const [songs, setSongs] = useState([]);
//   const [currentSongIndex, setCurrentSongIndex] = useState(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [duration, setDuration] = useState(0);
//   const [notes, setNotes] = useState(
//     JSON.parse(localStorage.getItem("favoriteNotes") || "{}")
//   );
//   const [bgColor, setBgColor] = useState("#f2f2f2");

//   const audioRef = useRef(new Audio());
//   const API_BASE = "https://melody-mind-2.onrender.com";

//   // ---------- Load songs ----------
//   useEffect(() => {
//     if (uploadedSongs.length > 0) setSongs(uploadedSongs);
//     else {
//       const allSongs = JSON.parse(localStorage.getItem("allSongs") || "[]");
//       setSongs(allSongs);
//     }
//   }, [uploadedSongs]);

//   // ---------- Listen for favorites updates ----------
//   useEffect(() => {
//     const handleUpdate = () => {
//       setFavorites(JSON.parse(localStorage.getItem("favorites") || "[]"));
//     };
//     window.addEventListener("favoritesUpdated", handleUpdate);
//     return () => window.removeEventListener("favoritesUpdated", handleUpdate);
//   }, []);

//   // ---------- Audio events ----------
//   useEffect(() => {
//     const audio = audioRef.current;
//     if (!audio) return;

//     const onTimeUpdate = () => setCurrentTime(audio.currentTime);
//     const onLoadedMetadata = () => setDuration(audio.duration);
//     const onEnded = () => {
//       if (currentSongIndex < favoriteSongs.length - 1) playSong(currentSongIndex + 1);
//       else setIsPlaying(false);
//     };

//     audio.addEventListener("timeupdate", onTimeUpdate);
//     audio.addEventListener("loadedmetadata", onLoadedMetadata);
//     audio.addEventListener("ended", onEnded);

//     return () => {
//       audio.removeEventListener("timeupdate", onTimeUpdate);
//       audio.removeEventListener("loadedmetadata", onLoadedMetadata);
//       audio.removeEventListener("ended", onEnded);
//     };
//   }, [currentSongIndex]);

//   // ---------- Mood color ----------
//   useEffect(() => {
//     if (currentSongIndex !== null) {
//       const mood = favoriteSongs[currentSongIndex]?.mood;
//       const colors = {
//         Happy: "#fff5e1",
//         Sad: "#dbe8ff",
//         Calm: "#e6fff7",
//         Energetic: "#ffe6f2",
//         Neutral: "#f2e6ff",
//       };
//       setBgColor(colors[mood] || "#f2f2f2");
//     }
//   }, [currentSongIndex]);

//   const favoriteSongs = songs.filter((s) => favorites.includes(s.songId));

//   // ---------- Play song ----------
//   const playSong = async (index) => {
//     const song = favoriteSongs[index];
//     if (!song?.url) return alert("No valid URL for this song");

//     const songUrl = song.url.startsWith("/")
//       ? `${API_BASE}${song.url}`
//       : `${API_BASE}/${song.url}`;

//     audioRef.current.src = songUrl;
//     audioRef.current.load();
//     try {
//       await audioRef.current.play();
//       setIsPlaying(true);
//       setCurrentSongIndex(index);
//       setCurrentSong(song);
//       setCurrentMood(song.mood);
//     } catch (err) {
//       console.error("Play song error:", err);
//       alert("Failed to play song");
//     }
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
//     else alert("No next song");
//   };

//   const previousSong = () => {
//     if (currentSongIndex > 0) playSong(currentSongIndex - 1);
//     else alert("No previous song");
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

//   const saveNote = (songId, text) => {
//     const updated = { ...notes, [songId]: text };
//     setNotes(updated);
//     localStorage.setItem("favoriteNotes", JSON.stringify(updated));
//   };

//   // ---------- Render ----------
//   return (
//     <div
//       className="favorites-page"
//       style={{
//         backgroundColor: bgColor,
//         transition: "0.8s all ease-in-out",
//         minHeight: "100vh",
//         padding: "20px",
//       }}
//     >
//       <h2>❤ Your Favorites</h2>
//       {favoriteSongs.length === 0 && <p>No favorites yet.</p>}

//       <div className="favorites-grid">
//         {favoriteSongs.map((song, index) => (
//           <div key={song.songId} className="song-card">
//             <div className="song-header">
//               <h4>{song.title}</h4>
//               <p>{song.artist} | {song.genre} | Mood: {song.mood}</p>
//             </div>
//             <div className="song-controls">
//               <button onClick={() => playSong(index)}>
//                 {isPlaying && currentSongIndex === index ? <FaPause /> : <FaPlay />}
//               </button>
//               <FaHeart
//                 style={{ color: "red", cursor: "pointer" }}
//                 onClick={() => removeFavorite(song.songId)}
//               />
//             </div>
//             <textarea
//               className="note-area"
//               placeholder="Write your memory or note..."
//               value={notes[song.songId] || ""}
//               onChange={(e) => saveNote(song.songId, e.target.value)}
//             />
//           </div>
//         ))}
//       </div>

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
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaHeart } from "react-icons/fa";
import { useSong } from "../context/SongContext.jsx";

export default function Favorites() {
  const { uploadedSongs } = useSong();
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favorites") || "[]")
  );
  const [songs, setSongs] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [selectedMoodFilter, setSelectedMoodFilter] = useState("All");
  const [selectedGenreFilter, setSelectedGenreFilter] = useState("All");
  const audioRef = useRef(new Audio());
  const API_BASE = "https://melody-mind-2.onrender.com";

  const moods = ["All", "Happy", "Sad", "Calm", "Energetic", "Neutral"];
  const genres = ["All", "Pop", "Rock", "Jazz", "Classical", "Hip-Hop"];

  // Load songs from context or localStorage
  useEffect(() => {
    if (uploadedSongs.length > 0) {
      setSongs(uploadedSongs);
    } else {
      const allSongs = JSON.parse(localStorage.getItem("allSongs") || "[]");
      setSongs(allSongs);
    }
  }, [uploadedSongs]);

  // Listen for favorites updates
  useEffect(() => {
    const handleUpdate = () => {
      setFavorites(JSON.parse(localStorage.getItem("favorites") || "[]"));
    };
    window.addEventListener("favoritesUpdated", handleUpdate);
    return () => window.removeEventListener("favoritesUpdated", handleUpdate);
  }, []);

  // Audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => nextSong();

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
  }, [currentSongIndex]);

  const favoriteSongs = songs
    .filter((s) => favorites.includes(s.songId))
    .filter((s) => selectedMoodFilter === "All" || s.mood === selectedMoodFilter)
    .filter((s) => selectedGenreFilter === "All" || s.genre === selectedGenreFilter);

  const playSong = async (index) => {
    const song = favoriteSongs[index];
    if (!song?.url) return;
    audioRef.current.src = song.url.startsWith("/")
      ? `${API_BASE}${song.url}`
      : `${API_BASE}/${song.url}`;
    try {
      await audioRef.current.play();
      setIsPlaying(true);
      setCurrentSongIndex(index);
    } catch (err) {
      console.error("Play error:", err);
    }
  };

  const playPause = () => {
    const audio = audioRef.current;
    if (!audio.src) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(console.error);
    }
  };

  const nextSong = () => {
    if (currentSongIndex < favoriteSongs.length - 1) playSong(currentSongIndex + 1);
    else setIsPlaying(false);
  };

  const previousSong = () => {
    if (currentSongIndex > 0) playSong(currentSongIndex - 1);
  };

  const removeFavorite = (songId) => {
    const updatedFavorites = favorites.filter((id) => id !== songId);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    window.dispatchEvent(new Event("favoritesUpdated"));
    if (currentSongIndex !== null && favoriteSongs[currentSongIndex]?.songId === songId) {
      audioRef.current.pause();
      setIsPlaying(false);
      setCurrentSongIndex(null);
      setCurrentTime(0);
    }
  };

  // Dynamic album art background based on mood
  const getAlbumArtStyle = (mood) => {
    const moodColors = {
      Happy: "#ffeb3b",
      Sad: "#2196f3",
      Calm: "#9c27b0",
      Energetic: "#f44336",
      Neutral: "#607d8b",
    };
    return {
      background: moodColors[mood] ? `linear-gradient(135deg, ${moodColors[mood]}, #1db954)` : "linear-gradient(135deg, #1db954, #2ecc71)",
    };
  };

  return (
    <div className="favorites-page">
      <div className="favorites-left">
        <h2>❤ Your Favorites</h2>
        {favoriteSongs.length > 0 ? (
          <ul className="song-list">
            {favoriteSongs.map((song, index) => (
              <li key={song.songId} className="song-card">
                <div className="song-info">
                  <h4>{song.title}</h4>
                  <p>{song.artist} | {song.genre} | Mood: {song.mood}</p>
                </div>
                <div className="song-actions">
                  <button onClick={() => playSong(index)}>
                    {isPlaying && currentSongIndex === index ? <FaPause /> : <FaPlay />}
                  </button>
                  <FaHeart className="heart-icon" onClick={() => removeFavorite(song.songId)} />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No favorite songs yet. ❤️</p>
        )}
      </div>
      <div className="favorites-right">
        <div className="filter-box">
          <h3>Filter by Mood</h3>
          <div className="filter-buttons">
            {moods.map((m) => (
              <button
                key={m}
                className={selectedMoodFilter === m ? "active" : ""}
                onClick={() => setSelectedMoodFilter(m)}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
        <div className="filter-box">
          <h3>Filter by Genre</h3>
          <div className="filter-buttons">
            {genres.map((g) => (
              <button
                key={g}
                className={selectedGenreFilter === g ? "active" : ""}
                onClick={() => setSelectedGenreFilter(g)}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
        {currentSongIndex !== null && (
          <div className="now-playing-box">
            <h3>Now Playing</h3>
            <div
              className="album-art"
              style={getAlbumArtStyle(favoriteSongs[currentSongIndex]?.mood)}
            />
            <h4>{favoriteSongs[currentSongIndex].title}</h4>
            <p>{favoriteSongs[currentSongIndex].artist}</p>
            <div className="progress-bar-container">
              <div
                className="progress-fill"
                style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
              />
            </div>
            <div className="player-controls">
              <button onClick={previousSong}><FaStepBackward /></button>
              <button onClick={playPause}>{isPlaying ? <FaPause /> : <FaPlay />}</button>
              <button onClick={nextSong}><FaStepForward /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
