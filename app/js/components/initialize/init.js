//Initialize script
//Sets some constants and clears the session storage when the app first starts

//For launching apps
const childProcess = require('child_process');
//File system
const fs = require('fs');
//Jquery
const $ = require('jquery');
//Puppeteer for webscraping
const puppeteer = require('puppeteer');
//Extract for extracting zip files
const extract = require('extract-zip');
//Electron built in downloader wrapper
const electronDL = require('electron-dl');
//Path for directory stuff
const path = require('path');
//rimraf for deleting folders
const rimraf = require('rimraf');
//Shell for shell commands
const shell = require('electron').shell;
//For executing files
const exec = require('child_process').exec;
//For creating desktop shortcuts
const createDesktopShortcut = require('../libraries/create-desktop-shortcuts');
//If development
const isDev = require('electron-is-dev');

//Electron stuff
const {dialog, BrowserWindow, ipcMain, process, Notification, app} = require('electron').remote;
const {ipcRenderer, remote} = require('electron');
const win = require('electron').remote.getCurrentWindow();

const appDataPath = path.resolve(app.getPath('userData'));
//Clear Sesion Storage
sessionStorage.clear();
//Localstorage values
const downloadDir = localStorage.getItem('downloadDir');
const darkMode = localStorage.getItem('darkMode');
const optBeta = localStorage.getItem('beta');

//Set default download location
//Using path resolve to convert for windows
if (!downloadDir) localStorage.setItem('downloadDir', path.join(appDataPath, 'Games'));

//Darkmode by default
if (!darkMode) localStorage.setItem('darkMode', true);

//Set beta in/opt out by default
if (!optBeta) {
    if (app.getVersion().includes('beta')) {
        localStorage.setItem('beta', true);
    } else {
        localStorage.setItem('beta', false);
    }
}

//If library json file doesnt exist make it (and make the folder if it doesnt exist)
var file = path.join(appDataPath, 'Json/library.json');
fs.readFile(file, 'utf-8', (err, data) => {
    if (err) {
        fs.mkdir(path.join(appDataPath, 'Json'), {recursive: true}, (err) => {
            if (err) throw err;
            fs.appendFile(file, '', function (err) {
                if (err) throw err;
            });
        });
        return;
    }
});

//Check if json file exists, if not then make it
fs.readFile(file, 'utf-8', (err, data) => {
    var array;
    try {
        array = JSON.parse(data);
    } catch (e) {
        array = {list: []};
        fs.writeFile(file, JSON.stringify(array), function (err) {
            if (err) throw err;
            if (isDev) console.log('Saved!');
        });
    }

});

if (isDev) console.log('Hi Developer')