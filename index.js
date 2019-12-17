// Modules to control application life and create native browser window
const {app, BrowserWindow,screen} = require('electron')
const path = require('path')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  var bounds = screen.getPrimaryDisplay()
  bounds = bounds.workArea
  mainWindow = new BrowserWindow({
    width: 400,
    height: bounds.height,
    y: bounds.y,
    x: bounds.x + bounds.width - 400,
    movable: false,
    resizable: false,
    maximizable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    fullScreenable: false,
    frame: false,
    titleBarStyle: "customButtonsOnHover",
    vibrancy: "dark"
  })
  app.dock.hide();
  mainWindow.setAlwaysOnTop(true, "screen-saver");
  mainWindow.setVisibleOnAllWorkspaces(true, {visibleOnFullScreen:true});


  // and load the index.html of the app.
  mainWindow.loadFile('ui/index.html')
  mainWindow.on("ready-to-show", function() {
    mainWindow.show()
  })
}
app.on('ready', createWindow)
