const APP_VERSION = 'v2.5';

// Theme management
document.addEventListener('DOMContentLoaded', () => {
    // Set version in header and footer
    document.getElementById('headerVersion').textContent = APP_VERSION;

    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const savedTheme = localStorage.getItem('theme') || 'dark';

    // Initialize theme
    body.setAttribute('data-theme', savedTheme);
    themeToggle.checked = savedTheme === 'light';

    // Ensure all elements are properly initialized with correct theme classes
    requestAnimationFrame(() => {
        applyTheme(savedTheme);
    });

    themeToggle.addEventListener('change', () => {
        const newTheme = themeToggle.checked ? 'light' : 'dark';
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
        
        // Animate the toggle switch and icons
        const toggleLabel = themeToggle.nextElementSibling;
        const toggleSwitch = toggleLabel.querySelector('span');
        const sunIcon = toggleLabel.querySelector('svg:first-of-type');
        const moonIcon = toggleLabel.querySelector('svg:last-of-type');
        
        if (newTheme === 'light') {
            toggleSwitch.style.transform = 'translateX(1.5rem)';
            sunIcon.style.transform = 'translateX(0)';
            sunIcon.style.opacity = '1';
            moonIcon.style.transform = 'translateX(-1.5rem)';
            moonIcon.style.opacity = '0';
        } else {
            toggleSwitch.style.transform = 'translateX(0)';
            sunIcon.style.transform = 'translateX(1.5rem)';
            sunIcon.style.opacity = '0';
            moonIcon.style.transform = 'translateX(0)';
            moonIcon.style.opacity = '1';
        }
    });

    // Handle dynamic content updates
    const observer = new MutationObserver(() => {
        requestAnimationFrame(() => {
            applyTheme(body.getAttribute('data-theme'));
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});

function applyTheme(theme) {
    const body = document.body;
    const isLight = theme === 'light';
    const queueContainer = document.getElementById('queue');
    const userList = document.getElementById('userList');
    const footer = document.querySelector('footer');
    const footerLinks = document.querySelectorAll('footer a');
    const footerTexts = document.querySelectorAll('footer .text-gray-400');
    const footerTooltip = document.querySelector('footer .group div[class*="bg-gray"]');
    const tooltipTriangle = document.querySelector('footer .group div[class*="bg-gray"] .transform.rotate-45');
    const searchResults = document.querySelectorAll('.search-result');

    // Base theme classes
    body.classList.toggle('bg-black', !isLight);
    body.classList.toggle('bg-gray-100', isLight);
    body.classList.toggle('text-white', !isLight);
    body.classList.toggle('text-gray-900', isLight);

    // Update search results theme
    searchResults.forEach(result => {
        // Background colors
        result.classList.remove('bg-gray-800', 'bg-gray-200');
        result.classList.add(isLight ? 'bg-gray-200' : 'bg-gray-800');
        
        // Hover states
        result.classList.remove('hover:bg-gray-700', 'hover:bg-gray-300');
        result.classList.add(isLight ? 'hover:bg-gray-300' : 'hover:bg-gray-700');
        
        // Text colors
        result.classList.remove('text-white', 'text-gray-900');
        result.classList.add(isLight ? 'text-gray-900' : 'text-white');
    });

    // Background colors
    document.querySelectorAll('.bg-gray-900, .bg-white').forEach(el => {
        el.classList.toggle('bg-gray-900', !isLight);
        el.classList.toggle('bg-white', isLight);
    });

    document.querySelectorAll('.bg-gray-800, .bg-gray-200').forEach(el => {
        el.classList.toggle('bg-gray-800', !isLight);
        el.classList.toggle('bg-gray-200', isLight);
    });

    // Interactive elements hover states
    document.querySelectorAll('[data-theme-bg], button:not([data-theme-preserve]), #userProfileButton').forEach(el => {
        // Dark theme hover classes
        el.classList.toggle('hover:bg-gray-700', !isLight);
        el.classList.toggle('bg-gray-800', !isLight);
        
        // Light theme hover classes
        el.classList.toggle('hover:bg-gray-300', isLight);
        el.classList.toggle('bg-gray-200', isLight);
    });

    // Update user profile button specific styles
    const userProfileButton = document.getElementById('userProfileButton');
    if (userProfileButton) {
        userProfileButton.classList.toggle('bg-gray-900', !isLight);
        userProfileButton.classList.toggle('hover:bg-gray-800', !isLight);
        userProfileButton.classList.toggle('bg-white', isLight);
        userProfileButton.classList.toggle('hover:bg-gray-100', isLight);
    }

    // Text colors
    document.querySelectorAll('.text-gray-400, .text-gray-500').forEach(el => {
        el.classList.toggle('text-gray-400', !isLight);
        el.classList.toggle('text-gray-500', isLight);
    });

    // Search results and interactive elements
    document.querySelectorAll('.search-result').forEach(el => {
        el.classList.toggle('hover:bg-gray-800', !isLight);
        el.classList.toggle('hover:bg-gray-300', isLight);
    });

    // Menu items hover states
    document.querySelectorAll('.menu-item').forEach(el => {
        el.classList.toggle('hover:bg-gray-800', !isLight);
        el.classList.toggle('hover:bg-gray-100', isLight);
    });

    // Footer theme
    if (footer) {
        footer.classList.toggle('bg-gray-900', !isLight);
        footer.classList.toggle('bg-white', isLight);
    }

    // Footer links and text
    footerLinks.forEach(link => {
        link.classList.toggle('text-gray-400', !isLight);
        link.classList.toggle('text-gray-500', isLight);
        link.classList.toggle('hover:text-white', !isLight);
        link.classList.toggle('hover:text-gray-900', isLight);
    });

    footerTexts.forEach(text => {
        text.classList.toggle('text-gray-400', !isLight);
        text.classList.toggle('text-gray-500', isLight);
    });

    // Footer tooltip and triangle
    if (footerTooltip) {
        footerTooltip.classList.toggle('bg-gray-800', !isLight);
        footerTooltip.classList.toggle('bg-white', isLight);
        footerTooltip.classList.toggle('text-white', !isLight);
        footerTooltip.classList.toggle('text-gray-900', isLight);
    }

    if (tooltipTriangle) {
        tooltipTriangle.classList.toggle('bg-gray-800', !isLight);
        tooltipTriangle.classList.toggle('bg-white', isLight);
    }

    if (isLight) {
        // Update search results hover states
        document.querySelectorAll('.search-result').forEach(el => {
            el.classList.remove('hover:bg-gray-800');
            el.classList.add('hover:bg-gray-300');
        });

        document.querySelectorAll('.text-white').forEach(el => {
            el.classList.remove('text-white');
            el.classList.add('text-gray-900');
        });

        // Update text colors with null checks
        document.querySelectorAll('.text-gray-400').forEach(el => {
            if (el) {
                el.classList.remove('text-gray-400');
                el.classList.add('text-gray-500');
            }
        });

        // Update queue and user list backgrounds with null checks
        if (queueContainer) {
            queueContainer.classList.remove('bg-gray-900');
            queueContainer.classList.add('bg-white');
        }
        if (userList) {
            userList.classList.remove('bg-gray-900');
            userList.classList.add('bg-white');
        }
    } else {
        body.classList.remove('bg-gray-100', 'text-gray-900');
        body.classList.add('bg-black', 'text-white');
        document.querySelectorAll('.bg-white').forEach(el => {
            if (el) {
                el.classList.remove('bg-white');
                el.classList.add('bg-gray-900');
            }
        });
        document.querySelectorAll('.bg-gray-200').forEach(el => {
            if (el) {
                el.classList.remove('bg-gray-200');
                el.classList.add('bg-gray-800');
            }
        });
        document.querySelectorAll('.text-gray-900').forEach(el => {
            if (el) {
                el.classList.remove('text-gray-900');
                el.classList.add('text-white');
            }
        });
        document.querySelectorAll('.text-gray-500').forEach(el => {
            if (el) {
                el.classList.remove('text-gray-500');
                el.classList.add('text-gray-400');
            }
        });
    }
}

const socket = io();
let isHost = false;
let spotifyProfile = null;
const savedUsername = localStorage.getItem('username');

// Set version in header and footer
document.addEventListener('DOMContentLoaded', () => {
    const headerVersion = document.getElementById('headerVersion');
    const footerVersionText = document.getElementById('footerVersionText');
    
    if (headerVersion) headerVersion.textContent = APP_VERSION;
    if (footerVersionText) footerVersionText.textContent = `spotify_lan ${APP_VERSION}`;
});

// User Profile Button functionality
const userProfileButton = document.getElementById('userProfileButton');
const userMenu = document.getElementById('userMenu');
const logoutButton = document.getElementById('logoutButton');
const changeUsernameButton = document.getElementById('changeUsernameButton');
const displayUsername = document.getElementById('displayUsername');
const menuDisplayUsername = document.getElementById('menuDisplayUsername');
const spotifyAvatar = document.getElementById('spotifyAvatar');
const menuSpotifyAvatar = document.getElementById('menuSpotifyAvatar');
const userInitial = document.getElementById('userInitial');
const menuUserInitial = document.getElementById('menuUserInitial');

// Toggle menu
userProfileButton.addEventListener('click', (e) => {
    e.stopPropagation();
    userMenu.classList.toggle('hidden');
});

// Close menu when clicking outside
document.addEventListener('click', () => {
    userMenu.classList.add('hidden');
});

userMenu.addEventListener('click', (e) => {
    e.stopPropagation();
});

// Menu button handlers
logoutButton.addEventListener('click', () => {
    localStorage.removeItem('spotify_token');
    localStorage.removeItem('username');
    window.location.href = '/';
});

changeUsernameButton.addEventListener('click', () => {
    document.getElementById('changeUsernameModal').style.display = 'flex';
    userMenu.classList.add('hidden');
});

document.getElementById('updateUsernameButton').addEventListener('click', () => {
    const newUsername = document.getElementById('newUsernameInput').value.trim();
    if (newUsername) {
        localStorage.setItem('username', newUsername);
        socket.emit('set_username', { username: newUsername });
        document.getElementById('changeUsernameModal').style.display = 'none';
        
        // Update both button and menu
        displayUsername.textContent = newUsername;
        menuDisplayUsername.textContent = newUsername;
        const initial = newUsername.charAt(0).toUpperCase();
        userInitial.textContent = initial;
        menuUserInitial.textContent = initial;
        
        // Show initials, hide avatars
        userInitial.classList.remove('hidden');
        menuUserInitial.classList.remove('hidden');
        spotifyAvatar.classList.add('hidden');
        menuSpotifyAvatar.classList.add('hidden');
    }
});

// Handle initial connection
socket.on('connection_established', (data) => {
    console.log('Connected with ID:', data.user_id);
    isHost = data.is_host;
    
    if (isHost) {
        // Host: Show Spotify profile
        logoutButton.classList.remove('hidden');
        changeUsernameButton.classList.add('hidden');
        document.getElementById('menuUserRole').textContent = 'Host';
        socket.emit('get_spotify_profile');
        document.getElementById('usernameModal').style.display = 'none'; // Ensure modal is hidden for host
    } else {
        // Client: Show username and placeholder
        logoutButton.classList.add('hidden');
        changeUsernameButton.classList.remove('hidden');
        document.getElementById('menuUserRole').textContent = 'Guest';
        
        if (savedUsername) {
            const username = savedUsername;
            const initial = username.charAt(0).toUpperCase();
            
            // Update both button and menu
            displayUsername.textContent = username;
            menuDisplayUsername.textContent = username;
            userInitial.textContent = initial;
            menuUserInitial.textContent = initial;
            
            // Show initials, hide Spotify avatar
            userInitial.classList.remove('hidden');
            menuUserInitial.classList.remove('hidden');
            spotifyAvatar.classList.add('hidden');
            menuSpotifyAvatar.classList.add('hidden');
        } else {
            document.getElementById('usernameModal').style.display = 'flex';
        }
    }
});

// Handle Spotify profile data
socket.on('spotify_profile', (profile) => {
    if (isHost && profile) {
        spotifyProfile = profile;
        const displayName = profile.display_name;
        
        // Update both button and menu
        displayUsername.textContent = displayName;
        menuDisplayUsername.textContent = displayName;
        document.getElementById('menuUserRole').textContent = 'Host';
        
        if (profile.images && profile.images.length > 0) {
            const avatarUrl = profile.images[0].url;
            
            // Update both button and menu avatars
            spotifyAvatar.src = avatarUrl;
            menuSpotifyAvatar.src = avatarUrl;
            
            // Show avatars, hide initials
            spotifyAvatar.classList.remove('hidden');
            menuSpotifyAvatar.classList.remove('hidden');
            userInitial.classList.add('hidden');
            menuUserInitial.classList.add('hidden');
        } else {
            const initial = displayName.charAt(0).toUpperCase();
            
            // Update both button and menu initials
            userInitial.textContent = initial;
            menuUserInitial.textContent = initial;
            
            // Show initials, hide avatars
            userInitial.classList.remove('hidden');
            menuUserInitial.classList.remove('hidden');
            spotifyAvatar.classList.add('hidden');
            menuSpotifyAvatar.classList.add('hidden');
        }

        // Show logout button for host
        logoutButton.classList.remove('hidden');
        changeUsernameButton.classList.add('hidden');
    }
});

// Username handling
function setUsername() {
    const username = document.getElementById('usernameInput').value.trim();
    if (username) {
        localStorage.setItem('username', username);
        socket.emit('set_username', { username: username });
        document.getElementById('usernameModal').style.display = 'none';
        
        // Update both button and menu
        displayUsername.textContent = username;
        menuDisplayUsername.textContent = username;
        const initial = username.charAt(0).toUpperCase();
        userInitial.textContent = initial;
        menuUserInitial.textContent = initial;
        
        // Show initials, hide avatars
        userInitial.classList.remove('hidden');
        menuUserInitial.classList.remove('hidden');
        spotifyAvatar.classList.add('hidden');
        menuSpotifyAvatar.classList.add('hidden');
        
        // Set role
        document.getElementById('menuUserRole').textContent = 'Guest';
    }
}

// Initial connection setup
socket.on('connect', () => {
    if (!isHost && !savedUsername) {
        // Only show username modal for non-host users without a saved username
        document.getElementById('usernameModal').style.display = 'flex';
    } else {
        document.getElementById('usernameModal').style.display = 'none';
        if (!isHost && savedUsername) {
            socket.emit('set_username', { username: savedUsername });
        }
    }
    socket.emit('get_playback_state');
});

// Update user list when changes occur
socket.on('user_list_update', (users) => {
    const userList = document.getElementById('userList');
    userList.innerHTML = '';
    Object.values(users).forEach(user => {
        const userElement = document.createElement('div');
        userElement.className = 'p-2 bg-gray-800 rounded';
        if (user.is_host && user.spotify_profile) {
            userElement.textContent = `${user.spotify_profile.display_name} (host)`;
        } else {
            userElement.textContent = user.username || 'Anonymous';
        }
        userList.appendChild(userElement);
    });
});

// Search functionality
const searchInput = document.getElementById('searchInput');
let searchTimeout;

// Add this to your existing JavaScript section
searchInput.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    const clearButton = document.getElementById('clearSearch');
    if (searchInput.value) {
        clearButton.classList.remove('hidden');
    } else {
        clearButton.classList.add('hidden');
    }
    searchTimeout = setTimeout(() => {
        const query = searchInput.value.trim();
        if (query) {
            socket.emit('search', { query: query });
        }
    }, 300);
});

document.getElementById('clearSearch').addEventListener('click', () => {
    searchInput.value = '';
    document.getElementById('clearSearch').classList.add('hidden');
    document.getElementById('searchResults').innerHTML = '';
    searchInput.focus();
});

socket.on('search_results', (data) => {
    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = '';
    
    if (data.tracks && data.tracks.items) {
        data.tracks.items.forEach(track => {
            const trackElement = document.createElement('div');
            trackElement.className = 'p-2 rounded mb-2 cursor-pointer relative group search-result';
            trackElement.innerHTML = `
                <div class="flex justify-between items-center">
                    <div class="flex-grow">
                        <div class="font-bold">${track.name}</div>
                        <div class="text-sm text-gray-400">${track.artists[0].name}</div>
                    </div>
                    <button class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center space-x-1 px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-300">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                        <span>Queue</span>
                    </button>
                </div>
            `;
            // Apply initial theme
            applyTheme(document.body.getAttribute('data-theme'));
            
            // Add click handler for the entire track element
            const queueButton = trackElement.querySelector('button');
            queueButton.onclick = (e) => {
                e.stopPropagation(); // Prevent event bubbling
                socket.emit('queue_track', {
                    track_uri: track.uri,
                    track_name: track.name
                });
            };
            
            searchResults.appendChild(trackElement);
        });
    }
});

socket.on('track_queued', (data) => {
    console.log(`${data.user} added ${data.track} to the queue`);
});

function control(action) {
    socket.emit('playback_control', { action: action });
}

// Add event listeners for playback control buttons
document.getElementById('previousTrack').addEventListener('click', () => control('previous'));
document.getElementById('playTrack').addEventListener('click', () => control('play'));
document.getElementById('pauseTrack').addEventListener('click', () => control('pause'));
document.getElementById('nextTrack').addEventListener('click', () => control('next'));

socket.on('playback_update', (data) => {
    const nowPlaying = document.getElementById('nowPlaying');
    const queue = document.getElementById('queue');
    queue.innerHTML = '';

    if (data.playback && data.playback.track) {
        // Update album art
        const albumArt = document.getElementById('albumArt');
        const albumArtPlaceholder = document.getElementById('albumArtPlaceholder');

        if (data.playback.track.album_art) {
            albumArt.src = data.playback.track.album_art;
            albumArt.classList.remove('hidden');
            albumArtPlaceholder.classList.add('hidden');
        } else {
            albumArt.classList.add('hidden');
            albumArtPlaceholder.classList.remove('hidden');
        }

        nowPlaying.innerHTML = `
            <div class="font-bold">${data.playback.track.name}</div>
            <div class="text-sm text-gray-400">${data.playback.track.artist}</div>
        `;
        
        if (data.playback.is_playing) {
            document.getElementById('playTrack').classList.add('hidden');
            document.getElementById('pauseTrack').classList.remove('hidden');
        } else {
            document.getElementById('playTrack').classList.remove('hidden');
            document.getElementById('pauseTrack').classList.add('hidden');
        }
    } else {
        nowPlaying.innerHTML = '<p class="text-gray-400">No track playing</p>';
    }

    if (data.playback && data.playback.queue) {
        data.playback.queue.forEach((track, index) => {
            const trackElement = document.createElement('div');
            trackElement.className = 'p-2 bg-gray-800 rounded mb-2';
            trackElement.innerHTML = `
                <div>
                    <div class="font-bold">${track.name}</div>
                    <div class="text-sm text-gray-400">${track.artist}</div>
                </div>
            `;
            queue.appendChild(trackElement);
        });
    }
});

socket.on('playback_error', (data) => {
    console.error('Playback error:', data.error);
});

// Handle Enter key in username input
document.getElementById('usernameInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        setUsername();
    }
});