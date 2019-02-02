![Speaky MiniPlayer's Logo](https://github.com/fjrd84/speaky-miniplayer/raw/master/resources/icon.png)

# Speaky MiniPlayer

> A robotic mini player for Spotify

Speaky MiniPlayer is a minimalist music controller for Spotify that has an **integrated robotic radio speaker**. This speaker provides information about the music currently being played (such as title, artist, album...) by using a synthetic voice.

![Screenshot 01](https://github.com/fjrd84/speaky-miniplayer/raw/master/resources/screenshots/screenshot-01.png)

The goal is to emulate traditional radio programs where a speaker helps you discover new music by providing some context and additional information.

Nowadays it's easy to discover new music by playing pre-curated lists, but unless we specifically go and look for information about the music being played, chances are we're not going to remember anything about it. This mini app tries to help you learn more about the music you listen to.

Speaky MiniPlayer is a PC desktop app developed with [electron](https://electronjs.org/) and compatible with Windows, MacOS X and Linux.

## Download

A pre-release is available for download. [Click here](https://github.com/fjrd84/speaky-miniplayer/releases) to open the download page and select the appropriate installer for your operating system.

## Features

- Mini **cover of the album** currently being played, always visible by default
- Play, pause, next track and previous **track controls**, only visible when hovering over the album cover (to keep the album cover clean and visible)
- Information about the current track: **title, album and artist**
- Direct link to the **song's lyrics** on [AZLyrics](https://www.azlyrics.com/) (by clicking on the song title)
- Direct link to the **album's review** on [AllMusic](https://www.allmusic.com/) (by clicking on the album's name)
- Direct link to the **artist's information** on [AllMusic](https://www.allmusic.com/) (by clicking on the artist's name)
- **Configuration view** where you can activate/deactivate the following features
  - **Robotic speaker**, by default activated when a new song starts playing
  - **Always on top** so that no window overlaps the current album cover
  - **System notifications** that display information about the current track when the song has changed (similar to the robotic speaker but less intrusive)

## Limitations

The Speaky MiniPlayer is currently only a "remote controller" for Spotify. This means that you cannot use it in order to play music by itself: you still need to have a Spotify client running somewhere.

You can keep the main Spotify player minimized however, since the miniplayer provides the controls you need most of the time. The purpose of the MiniPlayer is to provide a convenient and always-visible minimalist window, with only the information that you need, while keeping the powerful -but otherwise bulky- Spotify player hidden.

## Screenshots

![On Hover](https://github.com/fjrd84/speaky-miniplayer/raw/master/resources/screenshots/screenshot-02.png)

![Configuration View](https://github.com/fjrd84/speaky-miniplayer/raw/master/resources/screenshots/screenshot-03.png)

# Installation

Visit the [releases](https://github.com/fjrd84/speaky-miniplayer/releases) section, download the installer for your system and run it on your machine.

If you're running MacOS X, you might get a message like this: `This app can't be opened because it is from an unidentified developer`. [Follow these instructions](https://truefire.zendesk.com/hc/en-us/articles/200200566-Open-Program-from-Unidentified-Developer-Mac-) to get the Speaky MiniPlayer up and running on your machine.

# Development setup

This project has been bootstrapped with [electron-react-boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate). Refer to their README for more information.

First of all, copy the file `.env.example` to a `.env` file and fill in your `clientId` and `secret`. Visit the [spotify developer dashboard](https://developer.spotify.com/dashboard/applications) for more information.

Install dependencies with `yarn`.

Start development with `yarn dev`.

Run the unit tests with `yarn test`

# Build for production

`yarn package`

# Author

- [**F. Javier R. Donado**](https://www.jdonado.com)

# License

[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://badges.mit-license.org)

- **[MIT license](http://opensource.org/licenses/mit-license.php)**
- Copyright 2019 Â© <a href="https://www.jdonado.com" target="_blank">F. Javier R. Donado</a>.
