console.clear()
const {app, ipcMain,globalShortcut} = require('electron')
const path =    require('path')
const fs =      require("fs")
const vaultMgr= require("./vaultMgr")
const speakeasy=require("speakeasy")

let mainWindow
let vault = new vaultMgr(app.getPath("userData"), {
  codes: [],
  config: {}
})

function lock() {
  mainWindow.hide()
  mainWindow.webContents.send("lock")
}

function generateCodes() {
  if (!vault.isLoaded) { return }
  var codes = []
  for (var code of vault.data.codes) {
    codes.push({
      name: code.name,
      icon: code.icon,
      code: speakeasy.totp({
        secret: code.secret,
        encoding: 'base32'
      })
    })
  }
  mainWindow.webContents.send("gotCodes", codes)
}

const createWindow = require("./createWindow")
app.on('ready', function() {
  mainWindow = createWindow()
  mainWindow.on("blur", function() {
    mainWindow.hide()
    lock()
  })
  setInterval(generateCodes,1000)
  globalShortcut.register('CommandOrControl+Shift+A', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide()
      lock()
    } else {
      mainWindow.show()
    }
  })
})


ipcMain.on("unlock",function(e,password) {
  var result = vault.load(password)
  if (result.success) {
    generateCodes()
    mainWindow.webContents.send("unlock")
    vault.write()
  } else {
    mainWindow.webContents.send("wrongPassword", result.reason)
  }
})


// debug reload
function killProcess(event, filename) {
  console.log(event,filename)
  if (event == "change" && (filename.endsWith(".js") || filename.endsWith(".css") || filename.endsWith(".html")))  {
    process.exit()
  }
}
fs.watch('.', killProcess);
fs.watch('./ui', killProcess);
