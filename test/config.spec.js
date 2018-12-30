import config from '../app/config';

describe('config', () => {
  it('should load the configuration data', () => {
    expect(typeof config.spotify.clientId).toEqual('string');
    expect(typeof config.spotify.spotifyClientSecret).toEqual('string');
    expect(typeof config.spotify.redirectUri).toEqual('string');
  });
});
