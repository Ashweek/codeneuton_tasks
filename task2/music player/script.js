document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const audio = document.getElementById('audio');
    const songList = document.getElementById('song-list');
    const currentTitle = document.getElementById('current-title');
    const currentArtist = document.getElementById('current-artist');
    const currentArtwork = document.getElementById('current-artwork');
    const playBtn = document.getElementById('play');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    const progress = document.getElementById('progress');
    const currentTime = document.getElementById('current-time');
    const duration = document.getElementById('duration');
    const volume = document.getElementById('volume');
    const likeBtn = document.getElementById('like-btn');
    const shuffleBtn = document.getElementById('shuffle');
    const repeatBtn = document.getElementById('repeat');
    const searchInput = document.getElementById('search');
    const searchBtn = document.getElementById('search-btn');
    const menuItems = document.querySelectorAll('.menu li');
    const playlistContainer = document.getElementById('playlist-container');
    const newPlaylistBtn = document.getElementById('new-playlist');
    const viewTitle = document.getElementById('view-title');
    const modal = document.getElementById('playlist-modal');
    const closeModal = document.querySelector('.close');
    const createPlaylistBtn = document.getElementById('create-playlist');

    // Music Library
    const library = [
        {
            id: 1,
            title: "Blinding Lights",
            artist: "The Weeknd",
            album: "After Hours",
            duration: "3:20",
            category: "pop",
            playlist: "default",
            artwork: "assets/images/weeknd.jpg",
            audio: "assets/songs/weeknd.mp3",
            liked: false
        },
        {
            id: 2,
            title: "Bohemian Rhapsody",
            artist: "Queen",
            album: "A Night at the Opera",
            duration: "5:55",
            category: "rock",
            playlist: "default",
            artwork: "assets/images/queen.jpg",
            audio: "assets/songs/queen.mp3",
            liked: false
        },
        {
            id: 3,
            title: "Take Five",
            artist: "Dave Brubeck",
            album: "Time Out",
            duration: "5:24",
            category: "jazz",
            playlist: "default",
            artwork: "assets/images/brubeck.jpg",
            audio: "assets/songs/brubeck.mp3",
            liked: false
        },
        {
            id: 4,
            title: "Moonlight Sonata",
            artist: "Beethoven",
            album: "Classical Masterpieces",
            duration: "6:20",
            category: "classical",
            playlist: "default",
            artwork: "assets/images/beethoven.jpg",
            audio: "assets/songs/beethoven.mp3",
            liked: false
        },
        {
            id: 5,
            title: "Strobe",
            artist: "Deadmau5",
            album: "For Lack of a Better Name",
            duration: "10:37",
            category: "electronic",
            playlist: "default",
            artwork: "assets/images/deadmau5.jpg",
            audio: "assets/songs/deadmau5.mp3",
            liked: false
        },
        {
            id: 6,
            title: "Dusk till dawn",
            artist: "Zayn malik",
            album: "Icarus Falls",
            duration: "5:37",
            category: "electronic",
            playlist: "default",
            artwork: "assets/images/dusk_till_dawn.jpg",
            audio: "assets/songs/dusk_till_dawn.mp3",
            liked: false
        }
    ];

    // App State
    let songs = [...library];
    let currentSongIndex = 0;
    let isPlaying = false;
    let isShuffled = false;
    let isRepeated = false;
    let currentFilter = "all";
    let currentPlaylist = "default";
    let filteredSongs = [...songs];

    // Initialize the app
    function init() {
        renderSongList();
        setupEventListeners();
        loadLikedSongs();
        updatePlayerState();
    }

    // Render song list based on filters
    function renderSongList() {
        songList.innerHTML = '';
        
        if (filteredSongs.length === 0) {
            songList.innerHTML = '<li class="no-songs">No songs found</li>';
            return;
        }
        
        filteredSongs.forEach((song, index) => {
            const li = document.createElement('li');
            li.className = 'song-item';
            if (index === currentSongIndex && isPlaying) {
                li.classList.add('playing');
            }
            
            li.innerHTML = `
                <span class="song-number">${index + 1}</span>
                <span class="song-title">${song.title}</span>
                <span class="song-artist">${song.artist}</span>
                <span class="song-album">${song.album}</span>
                <span class="song-duration">${song.duration}</span>
            `;
            
            li.addEventListener('click', () => playSong(index));
            songList.appendChild(li);
        });
    }

    // Play a specific song
    function playSong(index) {
        if (index < 0 || index >= filteredSongs.length) return;
        
        currentSongIndex = index;
        const song = filteredSongs[currentSongIndex];
        
        audio.src = song.audio;
        currentTitle.textContent = song.title;
        currentArtist.textContent = song.artist;
        currentArtwork.src = song.artwork;
        
        if (song.liked) {
            likeBtn.classList.add('liked');
            likeBtn.innerHTML = '<i class="fas fa-heart"></i>';
        } else {
            likeBtn.classList.remove('liked');
            likeBtn.innerHTML = '<i class="far fa-heart"></i>';
        }
        
        playMusic();
    }

    // Play the music
    function playMusic() {
        audio.play()
            .then(() => {
                isPlaying = true;
                playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                updatePlayingState();
            })
            .catch(error => {
                console.error("Playback failed:", error);
            });
    }

    // Pause the music
    function pauseMusic() {
        audio.pause();
        isPlaying = false;
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        updatePlayingState();
    }

    // Update playing state in UI
    function updatePlayingState() {
        const songItems = document.querySelectorAll('.song-item');
        songItems.forEach((item, index) => {
            if (index === currentSongIndex && isPlaying) {
                item.classList.add('playing');
            } else {
                item.classList.remove('playing');
            }
        });
    }

    // Play next song
    function playNext() {
        if (isShuffled) {
            currentSongIndex = Math.floor(Math.random() * filteredSongs.length);
        } else {
            currentSongIndex = (currentSongIndex + 1) % filteredSongs.length;
        }
        playSong(currentSongIndex);
    }

    // Play previous song
    function playPrev() {
        if (isShuffled) {
            currentSongIndex = Math.floor(Math.random() * filteredSongs.length);
        } else {
            currentSongIndex = (currentSongIndex - 1 + filteredSongs.length) % filteredSongs.length;
        }
        playSong(currentSongIndex);
    }

    // Update progress bar
    function updateProgress() {
        const { currentTime: ct, duration: d } = audio;
        const progressPercent = (ct / d) * 100;
        progress.value = progressPercent;
        
        currentTime.textContent = formatTime(ct);
        if (!isNaN(d)) {
            duration.textContent = formatTime(d);
        }
    }

    // Set progress
    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        audio.currentTime = (clickX / width) * duration;
    }

    // Format time (seconds to MM:SS)
    function formatTime(seconds) {
        if (isNaN(seconds)) return "0:00";
        
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // Set volume
    function setVolume() {
        audio.volume = this.value / 100;
    }

    // Toggle like
    function toggleLike() {
        const currentSong = filteredSongs[currentSongIndex];
        currentSong.liked = !currentSong.liked;
        
        if (currentSong.liked) {
            likeBtn.classList.add('liked');
            likeBtn.innerHTML = '<i class="fas fa-heart"></i>';
        } else {
            likeBtn.classList.remove('liked');
            likeBtn.innerHTML = '<i class="far fa-heart"></i>';
        }
        
        saveLikedSongs();
    }

    // Save liked songs to localStorage
    function saveLikedSongs() {
        const likedSongs = songs.filter(song => song.liked).map(song => song.id);
        localStorage.setItem('likedSongs', JSON.stringify(likedSongs));
    }

    // Load liked songs from localStorage
    function loadLikedSongs() {
        const likedSongs = JSON.parse(localStorage.getItem('likedSongs')) || [];
        songs.forEach(song => {
            song.liked = likedSongs.includes(song.id);
        });
    }

    // Toggle shuffle
    function toggleShuffle() {
        isShuffled = !isShuffled;
        shuffleBtn.style.color = isShuffled ? 'var(--primary)' : 'var(--dark)';
    }

    // Toggle repeat
    function toggleRepeat() {
        isRepeated = !isRepeated;
        repeatBtn.style.color = isRepeated ? 'var(--primary)' : 'var(--dark)';
        audio.loop = isRepeated;
    }

    // Filter songs by search term
    function searchSongs() {
        const term = searchInput.value.toLowerCase();
        filterSongs(term, currentFilter, currentPlaylist);
    }

    // Filter songs by menu selection
    function filterByMenu(filter) {
        currentFilter = filter;
        viewTitle.textContent = filter === 'all' ? 'All Songs' : 
                              filter === 'favorites' ? 'Favorites' : 
                              filter === 'recent' ? 'Recently Played' : filter;
        filterSongs(searchInput.value.toLowerCase(), filter, currentPlaylist);
    }

    // Filter songs by playlist
    function filterByPlaylist(playlist) {
        currentPlaylist = playlist;
        viewTitle.textContent = playlist === 'default' ? 'My Playlist' : playlist;
        filterSongs(searchInput.value.toLowerCase(), currentFilter, playlist);
    }

    // Apply all filters
    function filterSongs(searchTerm, filter, playlist) {
        filteredSongs = songs.filter(song => {
            const matchesSearch = song.title.toLowerCase().includes(searchTerm) || 
                                song.artist.toLowerCase().includes(searchTerm) || 
                                song.album.toLowerCase().includes(searchTerm);
            
            const matchesFilter = filter === 'all' ? true : 
                                filter === 'favorites' ? song.liked : 
                                filter === 'recent' ? true : true;
            
            const matchesPlaylist = playlist === 'default' ? song.playlist === 'default' : true;
            
            return matchesSearch && matchesFilter && matchesPlaylist;
        });
        
        // Reset current song index if needed
        if (currentSongIndex >= filteredSongs.length) {
            currentSongIndex = 0;
            updatePlayerState();
        }
        
        renderSongList();
    }

    // Create new playlist
    function createPlaylist() {
        const name = document.getElementById('playlist-name').value.trim();
        if (name) {
            const li = document.createElement('li');
            li.textContent = name;
            li.dataset.playlist = name.toLowerCase().replace(/\s+/g, '-');
            li.addEventListener('click', () => {
                playlistContainer.querySelectorAll('li').forEach(item => {
                    item.classList.remove('active');
                });
                li.classList.add('active');
                filterByPlaylist(li.dataset.playlist);
            });
            
            playlistContainer.appendChild(li);
            modal.style.display = 'none';
            document.getElementById('playlist-name').value = '';
        }
    }

    // Update player state when filters change
    function updatePlayerState() {
        if (filteredSongs.length === 0) {
            pauseMusic();
            currentTitle.textContent = "No song selected";
            currentArtist.textContent = "Select a song to play";
            currentArtwork.src = "assets/images/default-artwork.jpg";
            likeBtn.classList.remove('liked');
            likeBtn.innerHTML = '<i class="far fa-heart"></i>';
        } else if (currentSongIndex < filteredSongs.length) {
            const song = filteredSongs[currentSongIndex];
            currentTitle.textContent = song.title;
            currentArtist.textContent = song.artist;
            currentArtwork.src = song.artwork;
            
            if (song.liked) {
                likeBtn.classList.add('liked');
                likeBtn.innerHTML = '<i class="fas fa-heart"></i>';
            } else {
                likeBtn.classList.remove('liked');
                likeBtn.innerHTML = '<i class="far fa-heart"></i>';
            }
        }
    }

    // Set up event listeners
    function setupEventListeners() {
        // Player controls
        playBtn.addEventListener('click', () => {
            if (filteredSongs.length === 0) return;
            isPlaying ? pauseMusic() : playMusic();
        });
        
        prevBtn.addEventListener('click', playPrev);
        nextBtn.addEventListener('click', playNext);
        
        // Progress bar
        audio.addEventListener('timeupdate', updateProgress);
        progress.addEventListener('input', function() {
            const seekTime = (this.value / 100) * audio.duration;
            audio.currentTime = seekTime;
        });
        
        // Volume control
        volume.addEventListener('input', setVolume);
        
        // Song controls
        likeBtn.addEventListener('click', toggleLike);
        shuffleBtn.addEventListener('click', toggleShuffle);
        repeatBtn.addEventListener('click', toggleRepeat);
        
        // Song ended
        audio.addEventListener('ended', () => {
            if (!isRepeated) {
                playNext();
            }
        });
        
        // Search
        searchInput.addEventListener('input', searchSongs);
        searchBtn.addEventListener('click', searchSongs);
        
        // Menu items
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                menuItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                filterByMenu(item.dataset.filter);
            });
        });
        
        // Playlist items
        playlistContainer.querySelectorAll('li').forEach(item => {
            item.addEventListener('click', () => {
                playlistContainer.querySelectorAll('li').forEach(i => {
                    i.classList.remove('active');
                });
                item.classList.add('active');
                filterByPlaylist(item.dataset.playlist);
            });
        });
        
        // New playlist
        newPlaylistBtn.addEventListener('click', () => {
            modal.style.display = 'flex';
        });
        
        // Modal controls
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        createPlaylistBtn.addEventListener('click', createPlaylist);
        
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    // Initialize the app
    init();
});