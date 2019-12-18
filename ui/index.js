const { ipcRenderer } = require('electron')
require('electron').webFrame.setZoomFactor(1)
setInterval(function() {
    require('electron').webFrame.setZoomFactor(1)
},1000)

var contents = document.querySelector("#contents")
var locked   = document.querySelector("#locked")
var passwdBox= document.querySelector("#lockPasswd")

function showLocked() {
    passwdBox.disabled = false
    passwdBox.value = ""
    contents.style.opacity = "0"
    contents.style.display = "none"
    locked.style.display = "block"
    locked.style.opacity = "1"
    locked.style.transform = ""
    document.querySelector("#lockPasswd").focus()
}
showLocked()

function showContents() {
    passwdBox.value = ""
    contents.style.display = "block"
    contents.style.opacity = "1"
    locked.style.opacity = "0"
    locked.style.transform = "scale(2)"
    setTimeout(function() {
        locked.style.display = "none"
    },500)
}

function validatePassword() {
    passwdBox.disabled = true
    ipcRenderer.send("unlock",passwdBox.value)
}

passwdBox.onblur = validatePassword
passwdBox.onkeyup = function(e) {
    if (e.key == "Enter") {
        validatePassword()
    }
    document.querySelector("#passwdIncorrectText").innerText = ""
    document.querySelector("v")
}


ipcRenderer.on('lock',showLocked)
ipcRenderer.on('unlock',showContents)
ipcRenderer.on('wrongPassword',function(e,message) {
    passwdBox.disabled = false
    locked.className = "incorrect"
    document.querySelector("#passwdIncorrectText").innerText = message
})

function copyCode(elem) {
    elem.querySelector("b").innerText = "Copied:"
    document.querySelector("#pasteSFX").play()
    var copyText = document.getElementById("copyInput");
    copyText.value = elem.querySelector("h1").innerText
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    document.execCommand("copy");
}

ipcRenderer.on('gotCodes',function(e,data) {
    var h = ``
    for (var code of data) {
        h += `<div class="code" style="background-color: #${code.code}44"onmousedown="copyCode(this)">
                <b>${code.name}</b>
                <h1>${code.code}</h1>
            </div>`
    }
    contents.innerHTML = h
})
