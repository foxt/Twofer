const {app, BrowserWindow,screen,globalShortcut} = require('electron')
module.exports = function  () {
    // Create the browser window.
    var bounds = screen.getPrimaryDisplay()
    bounds = bounds.workArea
    mainWindow = new BrowserWindow({
      width: 400,
      height: bounds.height,
      y: bounds.y,
      x: bounds.x + bounds.width - 400,
      webPreferences: {
        nodeIntegration: true
      },
      movable: false,
      resizable: false,
      maximizable: false,
      alwaysOnTop: true,
      skipTaskbar: true,
      fullScreenable: false,
      frame: false,
      darkTheme:true,
      titleBarStyle: "customButtonsOnHover",
      vibrancy: "sheet",
      //show: false
    })
    app.dock.hide();
    mainWindow.setAlwaysOnTop(true, "screen-saver");
    mainWindow.setVisibleOnAllWorkspaces(true, {visibleOnFullScreen:true});
  
  
    // and load the index.html of the app.
    mainWindow.loadFile('ui/index.html')
    return mainWindow
  
    
  }