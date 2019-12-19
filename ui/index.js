const { ipcRenderer } = require('electron')
require('electron').webFrame.setZoomFactor(1)
setInterval(function() {
    require('electron').webFrame.setZoomFactor(1)
},1000)

var contents = document.querySelector("#contents")
var locked   = document.querySelector("#locked")
var passwdBox= document.querySelector("#lockPasswd")

function showLocked() {
    //contents.innerHTML = ""
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

function copyText(text) {
    document.querySelector("#pasteSFX").play()
    var copyText = document.getElementById("copyInput");
    copyText.value = text
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    document.execCommand("copy");
}

function copyCode(elem) {
    elem.querySelector("b").innerText = "Copied:"
    copyText(elem.querySelector("h1").innerText)
}

function deleteCode(code) {
    console.log(code)
    copyText(code)
    setTimeout(function(){copyText(code)},100)
    ipcRenderer.send("deleteCode",code)
}

function showQR(code) {
    console.log(code)
    copyText(code)
    setTimeout(function(){copyText(code)},100)
    ipcRenderer.send("showQR",code)
}

ipcRenderer.on('gotCodes',function(e,data) {
    var h = ``
    for (var code of data) {
        var a = document.createElement("div")
        a.innerText = code.name
        h += `<div class="code" style="background-color: #${code.code}44" onmousedown="copyCode(this)">
                <div class="codeImageContainer" style="background-image: url('./img/icons/${code.icon}')"></div>
                <b> ${a.innerHTML}</b>
                <b class="iconsright">
                    <i class="fas fa-trash" onmousedown="deleteCode('${code.secret}')"></i>
                    <i class="fas fa-qrcode" onmousedown="showQR('${code.secret}')"></i>
                </b>
                <h1>${code.code}</h1>
            </div>`
    }
    contents.innerHTML = h
})
