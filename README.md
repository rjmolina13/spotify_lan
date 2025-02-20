# 🎵 Spotify LAN Party v2.5

A collaborative Spotify controller that lets everyone in your local network control the music. Perfect for offices, parties, or any group setting where you want shared music control!

## ✨ Features

- 🎮 Shared playback controls
- 🔍 Group song search
- 📝 Dynamic queue management
- 👥 Real-time user presence
- 🌓 Dark/Light mode support
- 🎨 Modern, responsive UI

## 💡 Use Case

- Only requires one Spotify Premium account (connected to main speaker)
- Alternative to Spotify Jam - no need for guests to have Spotify accounts
- Anyone in the local network can control music through web interface
- Perfect for:
  - Office music control
  - Party DJ collaboration
  - Group listening sessions

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- Spotify Premium account
- Spotify Developer credentials
- Local network connection

### 🔑 Spotify Setup

1. Visit [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new application
3. Copy your Client ID and Client Secret
4. Add `http://localhost:8888/callback` to your application's Redirect URIs

### ⚙️ Installation

1. Clone the repository
```bash
git clone https://github.com/rjmolina13/spotify_lan.git
```
2. Install dependencies
```bash
cd spotify_lan
pip install -r requirements.txt
 ```
3. Set up environment variables
```bash
python setup_env.py
 ```
4. Edit the .env file with your Spotify credentials
```text
SPOTIPY_CLIENT_ID=your_client_id
SPOTIPY_CLIENT_SECRET=your_client_secret
SPOTIPY_REDIRECT_URI=http://localhost:8888/callback
```