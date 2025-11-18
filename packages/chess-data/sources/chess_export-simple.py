import requests
import pandas as pd
from datetime import datetime

# PUT YOUR CHESS.COM USERNAME HERE
username = "Biskupstunga"

# Headers to avoid being blocked
headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
}

print(f"Downloading games for {username}...")

# Get all your game archives
archives_url = f"https://api.chess.com/pub/player/{username}/games/archives"
response = requests.get(archives_url, headers=headers)

if response.status_code == 404:
    print(f"Error: User '{username}' not found on chess.com")
    print("Make sure you're using your exact chess.com username (not email)")
    exit()
elif response.status_code != 200:
    print(f"Error: Got status code {response.status_code}")
    print(f"Response: {response.text}")
    exit()

try:
    archives = response.json()['archives']
except:
    print(f"Error: Could not get game archives")
    print(f"Response: {response.text}")
    exit()

if not archives:
    print(f"No games found for user {username}")
    exit()

print(f"Found {len(archives)} months of games")

# Download all games
all_games = []
for archive_url in archives:
    games = requests.get(archive_url, headers=headers).json()['games']
    all_games.extend(games)

# Save to CSV
df = pd.DataFrame(all_games)
filename = f"{username}_games.csv"
df.to_csv(filename, index=False)

print(f"Done! Saved {len(all_games)} games to {filename}")