import os

def setup_env():
    env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '.env')
    
    # Check if .env already exists
    if os.path.exists(env_path):
        print(".env file already exists. Skipping creation.")
        return
    
    # Template for .env file
    env_template = '''# Spotify API Credentials
# 1. Go to https://developer.spotify.com/dashboard
# 2. Create a new application
# 3. Copy your Client ID and Client Secret
# 4. Add http://localhost:8888/callback to your application's Redirect URIs

SPOTIPY_CLIENT_ID=
SPOTIPY_CLIENT_SECRET=
SPOTIPY_REDIRECT_URI=http://localhost:8888/callback
'''
    
    # Create .env file with template
    try:
        with open(env_path, 'w') as f:
            f.write(env_template)
        print(".env file created successfully!")
        print("Please update the file with your Spotify API credentials.")
    except Exception as e:
        print(f"Error creating .env file: {e}")

if __name__ == '__main__':
    setup_env()