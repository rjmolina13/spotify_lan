from flask import Flask, render_template, request, redirect, url_for, session
from flask_socketio import SocketIO, emit
import spotipy
from spotipy.oauth2 import SpotifyOAuth
from dotenv import load_dotenv
import os
import threading
import time
import sys

VERSION = "v2.5"

# Check and load environment variables
def check_env_setup():
    env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '.env')
    if not os.path.exists(env_path):
        print("Error: .env file not found!")
        print("Please run 'python setup_env.py' to create the .env file and configure your Spotify credentials.")
        sys.exit(1)
    
    # Load environment variables
    load_dotenv()
    
    # Check if required credentials are set
    required_vars = ['SPOTIPY_CLIENT_ID', 'SPOTIPY_CLIENT_SECRET', 'SPOTIPY_REDIRECT_URI']
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    
    if missing_vars:
        print("Error: Missing required Spotify credentials in .env file:")
        print("\n".join(f"- {var}" for var in missing_vars))
        print("\nPlease update your .env file with the required credentials.")
        sys.exit(1)

# Check environment setup before starting the application
check_env_setup()

# Add this near your other imports if not already present
from flask import Flask, render_template, request, redirect, url_for, session, url_for

# Your app should already be initialized like this
app = Flask(__name__, static_folder='static')
app.config['SECRET_KEY'] = os.urandom(24)
socketio = SocketIO(app)

# Spotify API configuration
SPOTIFY_CLIENT_ID = os.getenv('SPOTIPY_CLIENT_ID')
SPOTIFY_CLIENT_SECRET = os.getenv('SPOTIPY_CLIENT_SECRET')
SPOTIFY_REDIRECT_URI = os.getenv('SPOTIPY_REDIRECT_URI')
# Update the SCOPE to include user profile access
SCOPE = 'user-read-playback-state user-modify-playback-state user-read-currently-playing streaming user-read-private'

# Store connected users
connected_users = {}

# Store host session info
host_token_info = None

@app.route('/')
def index():
    # Check if this is the host machine (localhost)
    is_host = request.remote_addr in ['127.0.0.1', 'localhost', '0.0.0.0']
    
    if is_host:
        global host_token_info
        if not session.get('token_info'):
            return render_template('login.html')
        host_token_info = session.get('token_info')
    
    return render_template('player.html', is_host=is_host)

@app.route('/login')
def login():
    sp_oauth = SpotifyOAuth(
        client_id=SPOTIFY_CLIENT_ID,
        client_secret=SPOTIFY_CLIENT_SECRET,
        redirect_uri=SPOTIFY_REDIRECT_URI,
        scope=SCOPE
    )
    auth_url = sp_oauth.get_authorize_url()
    return redirect(auth_url)

@app.route('/callback')
def callback():
    sp_oauth = SpotifyOAuth(
        client_id=SPOTIFY_CLIENT_ID,
        client_secret=SPOTIFY_CLIENT_SECRET,
        redirect_uri=SPOTIFY_REDIRECT_URI,
        scope=SCOPE
    )
    session.clear()
    code = request.args.get('code')
    sp_oauth.get_access_token(code)
    token_info = sp_oauth.get_cached_token()
    session['token_info'] = token_info
    return redirect(url_for('index'))

@socketio.on('disconnect')
def handle_disconnect():
    user_id = request.sid
    if user_id in connected_users:
        del connected_users[user_id]
        emit('user_list_update', connected_users, broadcast=True)

def update_playback_state():
    while True:
        with app.app_context():
            try:
                global host_token_info
                if not host_token_info:
                    time.sleep(1)
                    continue
                sp = spotipy.Spotify(auth=host_token_info['access_token'])
                playback_state = get_current_playback(sp)
                if playback_state:
                    socketio.emit('playback_update', {'playback': playback_state})
            except Exception as e:
                print(f"Error in playback state update: {e}")
            time.sleep(1)

@socketio.on('connect')
def handle_connect():
    global host_token_info
    user_id = request.sid
    client_ip = request.remote_addr
    is_host = client_ip in ['127.0.0.1', 'localhost', '0.0.0.0']
    
    # Log client connection if it's not the host
    if not is_host:
        print(f"\n\033[32m✓\033[0m Client connected: [{client_ip}]")

    
    # Initialize user with more detailed information
    connected_users[user_id] = {
        'username': 'Anonymous',
        'is_host': is_host,
        'spotify_profile': None
    }
    
    # If host, immediately get their Spotify profile
    if is_host and host_token_info:
        sp = spotipy.Spotify(auth=host_token_info['access_token'])
        try:
            profile = sp.current_user()
            connected_users[user_id]['spotify_profile'] = profile
            connected_users[user_id]['username'] = profile['display_name']
        except Exception as e:
            print(f"Error getting host profile: {e}")
    
    emit('user_list_update', connected_users, broadcast=True)
    emit('connection_established', {
        'user_id': user_id,
        'is_host': is_host
    })
    
    if not host_token_info:
        return
    # Start background thread for playback updates if not already running
    if not hasattr(app, 'update_thread'):
        app.update_thread = threading.Thread(target=update_playback_state, daemon=True)
        app.update_thread.start()
    return {'user_id': user_id}

@socketio.on('set_username')
def handle_username(data):
    user_id = request.sid
    if user_id not in connected_users:
        connected_users[user_id] = {}
    connected_users[user_id]['username'] = data['username']
    emit('user_list_update', connected_users, broadcast=True)

@socketio.on('search')
def handle_search(data):
    global host_token_info
    if not host_token_info:
        return
    sp = spotipy.Spotify(auth=host_token_info['access_token'])
    results = sp.search(q=data['query'], type='track', limit=10)
    emit('search_results', results)

@socketio.on('queue_track')
def handle_queue_track(data):
    global host_token_info
    if not host_token_info:
        return
    sp = spotipy.Spotify(auth=host_token_info['access_token'])
    try:
        sp.add_to_queue(uri=data['track_uri'])
        emit('track_queued', {
            'track': data['track_name'],
            'user': connected_users[request.sid]['username']
        }, broadcast=True)
    except Exception as e:
        emit('queue_error', {'error': str(e)})

@socketio.on('get_spotify_profile')
def handle_get_spotify_profile():
    global host_token_info
    if not host_token_info:
        emit('spotify_profile', None)
        return
    
    sp = spotipy.Spotify(auth=host_token_info['access_token'])
    try:
        profile = sp.current_user()
        # Store profile in connected_users for the host
        user_id = request.sid
        if user_id in connected_users and connected_users[user_id]['is_host']:
            connected_users[user_id]['spotify_profile'] = profile
            emit('user_list_update', connected_users, broadcast=True)
        emit('spotify_profile', profile)
    except spotipy.SpotifyException as e:
        print(f"Spotify API error: {e}")
        emit('spotify_profile', None)
    except Exception as e:
        print(f"Error getting Spotify profile: {e}")
        emit('spotify_profile', None)


@socketio.on('playback_control')
def handle_playback_control(data):
    global host_token_info
    if not host_token_info:
        return
    sp = spotipy.Spotify(auth=host_token_info['access_token'])
    action = data['action']
    try:
        if action == 'play':
            sp.start_playback()
        elif action == 'pause':
            sp.pause_playback()
        elif action == 'next':
            sp.next_track()
        elif action == 'previous':
            sp.previous_track()
        
        # Get and broadcast current playback state
        playback_state = get_current_playback(sp)
        if playback_state:
            emit('playback_update', {'status': 'success', 'action': action, 'playback': playback_state}, broadcast=True)
        else:
            emit('playback_update', {'status': 'success', 'action': action}, broadcast=True)
    except Exception as e:
        emit('playback_error', {'error': str(e)})

def get_current_playback(sp):
    try:
        playback = sp.current_playback()
        queue = sp.queue()
        current_state = {}
        
        if playback and playback['item']:
            current_state['track'] = {
                'name': playback['item']['name'],
                'artist': playback['item']['artists'][0]['name'],
                'uri': playback['item']['uri'],
                'album_art': playback['item']['album']['images'][0]['url'] if playback['item']['album']['images'] else None
            }
            current_state['is_playing'] = playback['is_playing']
        
        if queue and queue['queue']:
            current_state['queue'] = [{
                'name': track['name'],
                'artist': track['artists'][0]['name'],
                'uri': track['uri']
            } for track in queue['queue']]
        
        return current_state if current_state else None
    except Exception as e:
        print(f"Error getting playback state: {e}")
        return None

@socketio.on('get_playback_state')
def handle_get_playback_state():
    global host_token_info
    if not host_token_info:
        return
    sp = spotipy.Spotify(auth=host_token_info['access_token'])
    playback_state = get_current_playback(sp)
    if playback_state:
        emit('playback_update', {'playback': playback_state}, broadcast=True)

def print_header():
    header = f'''
\033[36m   _____             _   _  __         _               _   _   _____           _
  / ____|           | | (_)/ _|       | |        /\\   | \\ | | |  __ \\         | |
 | (___  _ __   ___ | |_ _| |_ _   _  | |       /  \\  |  \\| | | |__) |_ _ _ __| |_ _   _
  \\___ \\| '_ \\ / _ \\| __| |  _| | | | | |      / /\\ \\ | . ` | |  ___/ _` | '__| __| | | |
  ____) | |_) | (_) | |_| | | |_| | | | |_____/ ____ \\| |\\  | | |  | (_| | |  | |_| |_| |
 |_____/| .__/ \\___/ \\__|_|_|  \\__, | |______/_/    \\_\\_| \\_| |_|   \\__,_|_|   \\__|\\__, |
        | |                     __/ |                                               __/ |            
        |_|                    |___/                                               |___/             
\033[0m
\033[1;35m=================================================================================================\033[0m
                \033[1;32mspotify_lan\033[0m \033[1;36m{VERSION}\033[0m  \033[1;33m(c) 2025\033[0m | \033[1;34m@rjmolina13\033[0m
\033[1;35m--------------------------------------------------------------------------------------------------\033[0m
'''
    print(header)
    
    # Check .env file status
    env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '.env')
    if os.path.exists(env_path):
        print("\n\033[32m✓\033[0m .env file detected \033[90m(checking configuration...)\033[0m")
    else:
        print("\n\033[31m✗\033[0m .env file not found")
    
    # Get machine's IP address
    import socket
    hostname = socket.gethostname()
    try:
        ip_address = socket.gethostbyname(hostname)
        print("\n\033[1;32m✓\033[0m Server available at:\033[0m")
        print("  \033[1m•\033[32m http://localhost:8888")
        print("  \033[1m•\033[32m http://" + ip_address + ":8888")
    except:
        print("\n\033[31m✗\033[0m Could not determine IP address")

if __name__ == '__main__':
    import logging
    log = logging.getLogger('werkzeug')
    log.setLevel(logging.ERROR)
    cli = sys.modules['flask.cli']
    cli.show_server_banner = lambda *x: None
    print_header()
    socketio.run(app, host='0.0.0.0', port=8888, debug=False, log_output=False)