# Makerverse

[![Build Status](https://travis-ci.com/makermadecnc/makerverse.svg?branch=master)](https://travis-ci.com/makermadecnc/makerverse)

A full-featured web-based controller platform for CNC & 3DP machines.

## Getting Started

You can always find the latest versions on the [Releases page](https://github.com/makermadecnc/makerverse/releases/).

![screenshot](https://raw.githubusercontent.com/makermadecnc/makerverse/master/screenshot.png)

There are several ways to run Makerverse.

### Stand-Alone Application

In the Release, find the appropriate file, beginning with `makerverse-app-` and ending with...

- **Windows**: `.exe`
- **MacOS**: `.pkg`
- **Linux**: _various_

After installing, these applications run a UI (app), which is really a dedicated web browser (called Electron). Connect your machine directly to the computer via the USB port, and you're ready to go.

When installing on Windows & MacOS, you will need to bypass/accept the security systems because the app is not yet "signed." Basically this means we're working on making it AppStore compatible.

### Web Server

With this approach, you can connect to the Makerverse app from any web browser on the same network. Choose from the below installation options, given your hardware and knowledge.

_Note: for security reasons, you can only access the Makerverse app from a browser on the same device by default. To enable access from other machines, enable the `allowRemoteAccess` flag (see Configuration). Be sure that you understand the security implications of this decision._

#### Docker Image

_If you are experienced with Docker already_, pull from `makerverse/core:latest` (multi-arch image, including `amd64`, `armv7`, and `arm64`). The application is launched from the `/home/node` directory, where the root of this repository resides. Consider mounting a `~/.cncrc` file into `/home/node/.cncrc`, or widgets into `/home/node/widgets`, for example.

_If you're new to Docker_, start by installing it. Just like with Node.js, it is recommended to use the Windows / MacOS [installers](https://www.docker.com/products/docker-desktop), when applicable. On Linux/Raspberry Pi, there's a one-line installer available:

```
curl -sSL https://get.docker.com | sh
```

Then, run the container. For example:
```
docker run --privileged --rm -p 8000:8000 makerverse/core:latest
```

Note: if you get a permission error, use `sudo docker ...`.

Example: persist your settings onto your Raspberry Pi:
```
touch /home/pi/.cncrc
docker run --privileged --rm -v /home/pi/.cncrc:/home/node/.cncrc -p 8000:8000 makerverse/core:latest
```

See the `bin/makerverse-docker.service` to run the Docker image automatically at boot. First, tweak the command arguments (volumes and ports) to your liking. Then, copy it to `/etc/systemd/system/` on the device. Finally, use `sudo systemctl enable makerverse-docker.service` and `sudo systemctl start makerverse-docker.service`.

#### Pre-Built Raspberry Pi Image

_Coming soon._

#### Build from Source

This is the fallback option to run Makerverse as a Web Server. If none of the above work for you, it is always possible to run Makerverse as a **node.js** application.

You will need `node` (**Node.js**) version `12.xx.y`. Downloads for Windows, Mac, and Linux can be [found here](https://nodejs.org/en/download/) (including [via package managers](https://nodejs.org/en/download/package-manager/)). On a Raspberry Pi or Debian Linux system, use the following:

```
curl -sL https://deb.nodesource.com/setup_12.x | sudo bash -
sudo apt-get install -y nodejs
```

Next, either `git clone` this repository (preferred), or download and unzip the Source Code from the Release. Enter the source code directory from the command line and run:

```
chmod +x ./bin/launch
bash ./bin/launch
```

The first time you run, this will take a while. This "run" script is doing the necessary installs and updates. Once it starts, open `http://localhost:8000` **on the same device**. You should find the web application. If you'd like to access it from a different device, see the Configuration section.

To update the application, first acquire the new source code (`git pull` or download the latest release and unzip on top of the existing directory). Then, just run the `./bin/launch` script again to launch the application.

#### Start at Boot (Service)

On a Raspberry Pi, Ubuntu, or other Debian Linux machine you can use systemd to run Makerverse as a service. From the makerverse directory:

```
mkdir -p ~/.config/systemd/user/
cp ./bin/makerverse.service ~/.config/systemd/user/
systemctl --user enable makerverse.service
systemctl --user start makerverse.service
```

To view logs, use `journalctl -xe`.

## Configuration

### The Settings File

Settings are loaded from the `$HOME/.cncrc` file (e.g., `/home/pi/.cncrc`); a [sample file is located here](https://github.com/makermadecnc/makerverse/blob/master/examples/.cncrc).

### Supported Controllers

- [Maslow Mega](https://github.com/WebControlCNC/Firmware/tree/release/holey) - aka "Maslow Classic" ([Holey v51.28 or later](https://github.com/WebControlCNC/Firmware/tree/release/holey))
- [Maslow Due](https://github.com/makermadecnc/MaslowDue) - aka "M2" ([v20200811 or later](https://github.com/makermadecnc/MaslowDue))
- [Grbl](https://github.com/gnea/grbl) ([Download](https://github.com/gnea/grbl/releases))
- [Grbl-Mega](https://github.com/gnea/grbl-Mega) ([Download](https://github.com/gnea/grbl-Mega/releases))
- [Marlin](https://github.com/MarlinFirmware/Marlin) ([Download](http://marlinfw.org/meta/download/))

### Core Features

* 6-axis digital readout (DRO)
* Tool path 3D visualization
* Simultaneously communicate with multiple clients
* Customizable workspace
* Custom MDI (Multiple Document Interface) command buttons (since 1.9.13)
* My Account
* Commands
* Events
* [Keyboard Shortcuts](https://cnc.js.org/docs/user-guide/#keyboard-shortcuts)
* [Contour ShuttleXpress](https://cnc.js.org/docs/user-guide/#contour-shuttlexpress)
* Multi-Language Support
* Watch Directory
* Laser
* [Tool Change](https://github.com/cncjs/cncjs/wiki/Tool-Change) (since 1.9.11)
* Z-Probe

### Custom Widgets

* [cncjs-widget-boilerplate](https://github.com/cncjs/cncjs-widget-boilerplate) - Boilerplate for custom widgets in Makerverse.

### Existing Pendants

* [cncjs-pendant-keyboard](https://github.com/cncjs/cncjs-pendant-keyboard) - A simple pendant (using wireless keyboard or usb) to CNCJS.
* [cncjs-pendant-lcd](https://github.com/cncjs/cncjs-pendant-lcd) - CNCjs Web Kiosk for Raspberry Pi Touch Displays.
* [cncjs-pendant-ps3](https://github.com/cncjs/cncjs-pendant-ps3) - Dual Shock / PS3 Bluetooth Remote Pendant for CNCjs.
* [cncjs-pendant-raspi-gpio](https://github.com/cncjs/cncjs-pendant-raspi-gpio) - Simple Raspberry Pi GPIO Pendant control for CNCjs.
* Responsive view for small screen display with device width less than 720px
    - <i>Safari on an iPhone 5S</i> [\[1\]](https://cloud.githubusercontent.com/assets/447801/15633749/b817cd4a-25e7-11e6-9beb-600c65ea1324.PNG) [\[2\]](https://cloud.githubusercontent.com/assets/447801/15633750/b819b5f6-25e7-11e6-8bfe-d3e6247e443b.PNG)

### Tablet UI

* [cncjs-pendant-tinyweb](https://github.com/cncjs/cncjs-pendant-tinyweb) - A tiny web console for small 320x240 LCD display.<br>
    ![cncjs-pendant-tinyweb](https://raw.githubusercontent.com/cncjs/cncjs/master/media/tinyweb-axes.png)
* [cncjs-shopfloor-tablet](https://github.com/cncjs/cncjs-shopfloor-tablet) - A simplified UI for cncjs optimized for tablet computers in a production (shop floor) environment.<br>
    ![cncjs-shopfloor-tablet](https://user-images.githubusercontent.com/4861133/33970662-4a8244b2-e018-11e7-92ab-5a379e3de461.PNG)

### Command-Line Usage

For help, type `./bin/makerverse --help`:
```
Usage: app [options]

Options:
  -V, --version                       output the version number
  -p, --port <port>                   Set listen port (default: 8000) (default: 8000)
  -H, --host <host>                   Set listen address or hostname (default: 0.0.0.0) (default: "0.0.0.0")
  -b, --backlog <backlog>             Set listen backlog (default: 511) (default: 511)
  -c, --config <filename>             Set config file (default: ~/.cncrc)
  -v, --verbose                       Increase the verbosity level (-v, -vv, -vvv)
  -m, --mount <route-path>:<target>   Add a mount point for serving static files (default: [])
  -w, --watch-directory <path>        Watch a directory for changes
  --access-token-lifetime <lifetime>  Access token lifetime in seconds or a time span string (default: 30d)
  --allow-remote-access               Allow remote access to the server (default: false)
  -h, --help                          output usage information
```

### Troubleshooting Node.js

Node.js 12 is recommended. You can install [Node Version Manager](https://github.com/creationix/nvm) to manage multiple Node.js versions. If you have `git` installed, just clone the `nvm` repo, and check out the latest version:
```
git clone https://github.com/creationix/nvm.git ~/.nvm
cd ~/.nvm
git checkout `git describe --abbrev=0 --tags`
cd ..
. ~/.nvm/nvm.sh
```

Add these lines to your `~/.bash_profile`, `~/.bashrc`, or `~/.profile` file to have it automatically sourced upon login:
```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" # This loads nvm
```

Once installed, you can select Node.js versions with:
```
nvm install 10
nvm use 10
```

It's also recommended that you upgrade npm to the latest version. To upgrade, run:
```
npm install npm@latest -g
```


## Browser Support

![Chrome](https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png)<br>Chrome | ![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png)<br>Edge | ![Firefox](https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png)<br>Firefox | ![IE](https://raw.github.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png)<br>IE | ![Opera](https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png)<br>Opera | ![Safari](https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png)<br>Safari
--- | --- | --- | --- | --- | --- |
 Yes | Yes | Yes| Not supported | Yes | Yes |

## Supported Node.js Versions

 Version | Supported Level
:------- |:---------------
 4       | Dropped support
 6       | Supported
 8       | Supported
 10      | Recommended
 12      | Recommended


## About

This is a fork of the [CNCjs project](https://github.com/cncjs/cncjs) which spawned from the Maslow CNC ecosystem. Several members of the Maslow community worked together to make the Maslow and M2 (Due) firmware compatible with CNCjs. At the same time, the CNCjs project development was paused due to extenuating circumstances. As a result, Makerverse evolved its own vision of an application which supports a wide variety of CNC & 3DP hardware with a clean interface and powerful widgets.

@zaneclaes
@skilescm

Original CNCjs contributors: <a href="graphs/contributors"><img src="https://opencollective.com/cncjs/contributors.svg?width=890&button=false" /></a>


## Contributions

Use [GitHub issues](https://github.com/cncjs/cncjs/issues) for requests.

Pull requests welcome! Learn how to [contribute](CONTRIBUTING.md).

## Localization

You can help translate resource files in both of [app](https://github.com/cncjs/cncjs/tree/master/src/app/i18n) and [web](https://github.com/cncjs/cncjs/tree/master/src/web/i18n) directories from English to other languages. Check out [Localization guide](https://github.com/cncjs/cncjs/blob/master/CONTRIBUTING.md#localization) to learn how to get started. If you are not familiar with GitHub development, you can [open an issue](https://github.com/cncjs/cncjs/issues) or send your translations to cheton@gmail.com.

Locale | Language | Status | Contributors
:----- | :------- | :----- | :-----------
[cs](https://github.com/cncjs/cncjs/tree/master/src/web/i18n/cs) | Čeština (Czech) | ✔ | [Miroslav Zuzelka](https://github.com/dronecz)
[de](https://github.com/cncjs/cncjs/tree/master/src/web/i18n/de) | Deutsch (German) | ✔ | [Thorsten Godau](https://github.com/dl9sec), [Max B.](https://github.com/mbs38)
[es](https://github.com/cncjs/cncjs/tree/master/src/web/i18n/es) | Español (Spanish) | ✔ | [Juan Biondi](https://github.com/yeyeto2788)
[fr](https://github.com/cncjs/cncjs/tree/master/src/web/i18n/fr) | Français (French) | ✔ | [Simon Maillard](https://github.com/maisim), [CorentinBrulé](https://github.com/CorentinBrule)
[hu](https://github.com/cncjs/cncjs/tree/master/src/web/i18n/hu) | Magyar (Hungarian) | ✔ | Sipos Péter
[it](https://github.com/cncjs/cncjs/tree/master/src/web/i18n/it) | Italiano (Italian) | ✔ | [vince87](https://github.com/vince87)
[ja](https://github.com/cncjs/cncjs/tree/master/src/web/i18n/ja) | 日本語 (Japanese) | ✔ | [Naoki Okamoto](https://github.com/toonaoki)
[nl](https://github.com/cncjs/cncjs/tree/master/src/web/i18n/nl) | Nederlands (Netherlands) | ✔ | [dutchpatriot](https://github.com/dutchpatriot)
[pt-br](https://github.com/cncjs/cncjs/tree/master/src/web/i18n/pt-br) | Português (Brasil) | ✔ | [cmsteinBR](https://github.com/cmsteinBR)
[ru](https://github.com/cncjs/cncjs/tree/master/src/web/i18n/ru) | Ру́сский (Russian) | ✔ | [Denis Yusupov](https://github.com/minithc)
[tr](https://github.com/cncjs/cncjs/tree/master/src/web/i18n/tr) | Türkçe (Turkish) | ✔ | Ali GÜNDOĞDU
[zh-cn](https://github.com/cncjs/cncjs/tree/master/src/web/i18n/zh-cn) | 简体中文 (Simplified Chinese) | ✔ | [Mandy Chien](https://github.com/MandyChien), [Terry Lee](https://github.com/TerryShampoo)
[zh-tw](https://github.com/cncjs/cncjs/tree/master/src/web/i18n/zh-tw) | 繁體中文 (Traditional Chinese) | ✔ | [Cheton Wu](https://github.com/cheton)

## License

Licensed under the [MIT License](https://raw.githubusercontent.com/cncjs/cncjs/master/LICENSE).

