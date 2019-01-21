# electron-print-to-pdf

This is a sample app to test out printing to PDF from `<webview>` components.

Basically when you launch the app, you have the option to use your own image files (JPEGs, PNGs, SVGs) or use supplied sample images (by clicking on "Load sample files" button).

## How it works?

1. First you need to generate webview components from provided images. So drag'n'drop your images to rectangular drop area or click "Load sample files". You can definitely use multiple images.
2. Now click "Generate Webviews" button, if you have option "Webviews visible" checked, the images should be displayed inside the app.
3. Click "Generate PDF" and all webviews should be converted to PDF to default directory (marked by "Folder" input).

## The problem

There are certain source images that output the PDF with multiple pages, even though the PDF should always stretch out to image dimensions. It seems like some images are affected by this, usually when they're big. For example, some images with width bigger than 2100px end up on two pages, yet if I crop the same image to smaller width (like 2000px), the output is correct.

You have an image called `bad.png` in the root of the repository with which you can reproduce this behaviour.

# electron-quick-start

**Clone and run for a quick way to see Electron in action.**

This is a minimal Electron application based on the [Quick Start Guide](https://electronjs.org/docs/tutorial/quick-start) within the Electron documentation.

**Use this app along with the [Electron API Demos](https://electronjs.org/#get-started) app for API code examples to help you get started.**

A basic Electron application needs just these files:

- `package.json` - Points to the app's main file and lists its details and dependencies.
- `main.js` - Starts the app and creates a browser window to render HTML. This is the app's **main process**.
- `index.html` - A web page to render. This is the app's **renderer process**.

You can learn more about each of these components within the [Quick Start Guide](https://electronjs.org/docs/tutorial/quick-start).

## To Use

To clone and run this repository you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
git clone https://github.com/electron/electron-quick-start
# Go into the repository
cd electron-quick-start
# Install dependencies
npm install
# Run the app
npm start
```

Note: If you're using Linux Bash for Windows, [see this guide](https://www.howtogeek.com/261575/how-to-run-graphical-linux-desktop-applications-from-windows-10s-bash-shell/) or use `node` from the command prompt.

## Resources for Learning Electron

- [electronjs.org/docs](https://electronjs.org/docs) - all of Electron's documentation
- [electronjs.org/community#boilerplates](https://electronjs.org/community#boilerplates) - sample starter apps created by the community
- [electron/electron-quick-start](https://github.com/electron/electron-quick-start) - a very basic starter Electron app
- [electron/simple-samples](https://github.com/electron/simple-samples) - small applications with ideas for taking them further
- [electron/electron-api-demos](https://github.com/electron/electron-api-demos) - an Electron app that teaches you how to use Electron
- [hokein/electron-sample-apps](https://github.com/hokein/electron-sample-apps) - small demo apps for the various Electron APIs

## License

[CC0 1.0 (Public Domain)](LICENSE.md)
