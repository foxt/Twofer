console.clear()
const {app, ipcMain,globalShortcut, BrowserWindow} = require('electron')
const path =    require('path')
const fs =      require("fs")
const vaultMgr= require("./vaultMgr")
const speakeasy=require("./speakeasy")
const qr =      require("qrcode")

let mainWindow
let vault = new vaultMgr(app.getPath("userData"), {
  codes: [],
  config: {}
})

function lock() {
  mainWindow.hide()
  mainWindow.webContents.send("lock")
  vault.destroy()
}

function generateCodes() {
  if (!vault.isLoaded) { return }
  if (mainWindow.webContents.isDevToolsOpened()) { 
    mainWindow.webContents.executeJavaScript("console.warn('%cHey you!','font-size:300%');console.warn('Don't paste anything here, it may give hackers access to every account added to Twofer(!!).\n\nAlso, code generation and hide on unfocus is disabled while devtools are opened')")
    return
  }
  var codes = []
  for (var code of vault.data.codes) {
    try {
      codes.push({
        name: code.name,
        icon: code.icon,
        secret: code.secret,
        code: speakeasy.totp({
          secret: code.secret,
          encoding: 'base32',
        })
      })
    } catch(e) {
      console.error("Failed to generate code")
    }
  }
  mainWindow.webContents.send("gotCodes", codes)
}

const createWindow = require("./createWindow")
app.on('ready', function() {
  mainWindow = createWindow()
  mainWindow.on("blur", function() {
    if (mainWindow.webContents.isDevToolsOpened()) { return }
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

ipcMain.on("deleteCode",function(e,secret) {
  var newArray = []
  if (!vault.isLoaded) { return }
  for (var arr of vault.data.codes) {
    if (arr.secret != secret) {
      newArray.push(arr)
    }
  }
  vault.data.codes = newArray
  vault.write(vault.data)
})


ipcMain.on("showQR",function(e,secret) {
  if (!vault.isLoaded) { return }
  for (var arr of vault.data.codes) {
    if (arr.secret == secret) {
      var url = `otpauth://totp/${encodeURIComponent(arr.name)}?secret=${arr.secret}&algorithm=SHA1&digits=6&period=30`
      qr.toDataURL(url, function (err, url) {
        new BrowserWindow({
          width: 196,
          height: 196,
          title: arr.name,
          resizable: false,
          maximizable: false,
          fullScreenable: false,
        }).loadURL(url)
      })
    }
  }
})

var icons = []

ipcMain.on('iconSearch', (event, arg) => {
  if (icons.length < 1) {
    console.log("[IconSrc] Loading icon list...")
    icons = fs.readdirSync("./ui/img/icons")
    console.log("[IconSrc]",icons.length,"icons")
  }
  var returnValue = []
  for (var ico of icons) {
    if (ico.endsWith(".svg") && ico.toLowerCase().replace(/-/g,"").startsWith(arg.replace(/-/g,"").replace(/_/g,"").replace(/ /g,""))) {
      returnValue.push(ico)
      if (returnValue.length > 247) { // prevent thread from running too long
        event.returnValue = returnValue
        return event.returnValue
      }
    }
  }
  event.returnValue = returnValue
  return event.returnValue
})

ipcMain.on("addCode",function(e,data) {
  if (!vault.isLoaded) {return}
  vault.data.codes.push(data)
  vault.write(vault.data)
})

// debug reload
try {
  function killProcess(event, filename) {
    if (event == "change" && (filename.endsWith(".js") || filename.endsWith(".css") || filename.endsWith(".html")))  {
      process.exit()
    }
  }
  fs.watch('.', killProcess);
  fs.watch('./ui', killProcess);
} catch(e) {
  console.error("Failed to watch development files, assuming we're in production")
}
