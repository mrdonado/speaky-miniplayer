import * as dotenv from 'dotenv';

dotenv.config();

export default {
  spotify: {
    clientId: process.env.SPOTIFY_CLIENT_ID || 'edit-your-dot-env-file',
    spotifyClientSecret:
      process.env.SPOTIFY_CLIENT_SECRET || 'edit-your-dot-env-file',
    redirectUri: process.env.REDIRECT_URI || 'http://localhost/tokencallback',
    scopes:
      'user-read-playback-state user-modify-playback-state playlist-read-collaborative playlist-read-private playlist-modify-public playlist-modify-private user-library-modify'
  }
};
