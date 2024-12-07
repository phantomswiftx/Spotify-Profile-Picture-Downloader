// Spotify API credentials (replace with your own)
const CLIENT_ID = 'e4895f555bab49a39cb79af715caba78';
const CLIENT_SECRET = 'ec9007346a284750a4a4a1ceb353632a';

// Fetch Spotify API Token
async function getAccessToken() {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${btoa(CLIENT_ID + ':' + CLIENT_SECRET)}`
        },
        body: 'grant_type=client_credentials'
    });
    const data = await response.json();
    return data.access_token;
}

// Fetch Artist Data
async function searchArtist(accessToken, artistName) {
    const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(artistName)}&type=artist`,
        {
            headers: { Authorization: `Bearer ${accessToken}` }
        }
    );
    const data = await response.json();
    return data.artists.items[0]; // Return the first artist found
}

// Handle Form Submission
document.getElementById('search-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const artistName = document.getElementById('artist-name').value;
    const accessToken = await getAccessToken();
    const artist = await searchArtist(accessToken, artistName);

    if (artist) {
        const artistImageUrl = artist.images[0]?.url || '';
        document.getElementById('artist-image').src = artistImageUrl;
        document.getElementById('artist-image').hidden = false;
        document.getElementById('artist-name-display').textContent = artist.name;
        
        // Show download button if an image is available
        const downloadButton = document.getElementById('download-btn');
        if (artistImageUrl) {
            downloadButton.hidden = false;
            downloadButton.addEventListener('click', () => {
                // Create a temporary download link
                const link = document.createElement('a');
                link.href = artistImageUrl;
                link.download = `${artist.name}-profile.jpg`; // Name the downloaded file after the artist
                link.click();
            });
        }
    } else {
        document.getElementById('artist-name-display').textContent = 'Artist not found.';
        document.getElementById('artist-image').hidden = true;
        document.getElementById('download-btn').hidden = true; // Hide download button if no artist found
    }
});

// Theme toggle functionality
document.getElementById('toggle-theme').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');
    document.querySelector('.container').classList.toggle('dark-mode');
    document.querySelector('.container').classList.toggle('light-mode');
    document.getElementById('toggle-theme').textContent = document.body.classList.contains('dark-mode') ? '🌞' : '🌙';
});

// Check system theme on load
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('dark-mode');
    document.querySelector('.container').classList.add('dark-mode');
} else {
    document.body.classList.add('light-mode');
    document.querySelector('.container').classList.add('light-mode');
}
