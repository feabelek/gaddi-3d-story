# Pastoralism Atlas

An interactive visual story about the seasonal migration of Gaddi pastoralists from Bharmour to Darcha in Himachal Pradesh.

This guide explains how to open the project on your own computer. You do not need to understand the code to follow it. The currently selected version is the MapLibre atlas from `src/main.js`.

## What You Will See

The atlas opens on a map of India. Select the Himachal Pradesh case study, then scroll through the story to follow the route through Bharmour, Kugti, Tandi, and Darcha.

## Before You Begin

You will need:

- A computer connected to the internet
- A modern web browser such as Chrome, Firefox, Safari, or Edge
- Node.js, which lets the project run on your computer

### Install Node.js

1. Go to [nodejs.org](https://nodejs.org/).
2. Download the **LTS** version.
3. Install it using the default options.
4. Close and reopen your Terminal (macOS/Linux) or PowerShell (Windows).

The project needs Node.js `20.19` or newer, or Node.js `22.12` or newer. The current LTS download from the Node.js website should satisfy this requirement.

## Open the Project

### 1. Download the project

Open the project page on GitHub:

<https://github.com/feabelek/gaddi-3d-story>

Choose **Code**, then **Download ZIP**. Unzip the downloaded file somewhere easy to find, such as your Desktop.

### 2. Open a command window in the project folder

Open the Terminal application on macOS/Linux, or PowerShell on Windows.

Move into the unzipped project folder. For example, if it is on your Desktop:

```bash
cd ~/Desktop/gaddi-3d-story
```

On Windows PowerShell, the equivalent is usually:

```powershell
cd "$HOME\Desktop\gaddi-3d-story"
```

If the folder has a different name or location, replace the path with the actual location of your folder.

### 3. Install the project’s supporting files

Run this command once:

```bash
npm install
```

Wait for it to finish. This creates a `node_modules` folder containing the libraries the atlas needs. You do not need to open or edit this folder.

### 4. Start the atlas

Run:

```bash
npm run dev
```

The Terminal will display a local web address, usually similar to:

```text
http://localhost:5173/
```

Open that address in your web browser. Keep the command window open while using the atlas.

### 5. Explore the story

1. Select the **Himachal Pradesh** marker on the map.
2. Scroll down to move through the story.
3. Use the **Atlas** button to return to the India overview.

The map uses online satellite and terrain imagery, so the internet connection must remain active while viewing it.

### Refine Camera Views (Development Tool)

To compose more accurate map angles for the story chapters, add `?composer=1` to the local address:

```text
http://localhost:5173/?composer=1
```

The **Camera Composer** lets you choose a story stop, move or zoom the map, and capture the current `center`, `zoom`, `pitch`, and `bearing` values. Use **Capture stop** for the selected chapter, then **Copy all** to export the refined camera presets. The composer is hidden during normal use.

### 6. Stop the atlas

Return to the Terminal or PowerShell window and press:

```text
Ctrl + C
```

## If Something Goes Wrong

### The `npm` command cannot be found

Node.js is not installed correctly, or the Terminal was open during installation. Install the LTS version from [nodejs.org](https://nodejs.org/), close the command window, open a new one, and try again.

### The project folder cannot be found

The `cd` command must point to the unzipped `gaddi-3d-story` folder. Locate that folder on your computer and use its full path after `cd`.

### The map is blank or imagery is missing

Check your internet connection and refresh the browser. The atlas downloads its satellite and terrain imagery from online services.

### The browser address does not open

Make sure `npm run dev` is still running. If the Terminal shows an error, stop the command with `Ctrl + C` and run `npm run dev` again.

## For Future Updates

After changing the project files, stop and restart the development server if necessary. The browser normally refreshes automatically when files are saved.

To create a production version of the atlas, run:

```bash
npm run build
```

The finished files will be placed in a `dist` folder. To preview that version on your computer, run:

```bash
npm run preview
```
