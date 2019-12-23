const CryptoJS = require("crypto-js")
const fs = require("fs")
const path = require("path")

class EncryptedDataStore {
    constructor(filelocation,defaults) {
        console.log("[VaultMgr] Creating config object at location " + filelocation)
        this.defaults = defaults
        this.filelocation = filelocation
        var filePath = this.filePath = path.join(filelocation, "app_data.encryptedjson")
        if (!fs.existsSync(filelocation)) {
            console.log("[VaultMgr] Trying to create folder at '"+ filelocation + "'")
            fs.mkdirSync(filelocation)
        }
        if (!fs.statSync(filelocation).isDirectory()) {
            throw new Error(filelocation + " is not a directory.")
        }
        if (fs.existsSync(filePath) && !fs.statSync(filePath).isFile()) {
            throw new Error(filePath + " exists, but is not a file")
        }
        this.fileExists = !fs.existsSync(this.filelocation)
        this.isLoaded = false
        this.data = defaults
    }
    load(keyphrase) {
        if (!fs.existsSync(this.filelocation) || !fs.statSync(this.filelocation).isDirectory()) {
            throw new Error(this.filelocation + " does not exist, or is not a directory.")
        }
        if (fs.existsSync(this.filePath) && !fs.statSync(this.filePath).isFile()) {
            throw new Error(this.filePath + " exists, but is not a file")
        }
        if (!fs.existsSync(this.filePath)) {
            this.data = this.defaults
            this.isLoaded =true
            this.keyphrase = keyphrase
            return { success: true, fileExists: false, data: this.defaults }
        }
        var text = ""
        try {
            text = fs.readFileSync(this.filePath).toString()
        } catch(e) {
            return {success: false, fileExists: false, reason: "The file failed to read." + e.toString()}
        }
        try {
            var decrypted = CryptoJS.AES.decrypt(text, keyphrase);
        } catch(e) {
            return {success: false, fileExists: true, reason: "The password entered was incorrect. (" + e.message + ")"}
        }
        if (decrypted.sigBytes < 0) {
            return {success: false, fileExists: true, reason: "The password entered was incorrect. (" + decrypted.sigBytes + "sigBytes)"}
        }
        
        try {
            var dString = decrypted.toString(CryptoJS.enc.Utf8);
        } catch(e) {
            return {success: false, fileExists: true, reason: "The password entered was incorrect. (" + e.message + ")"}
        }
        var json = {}
        try {
            json = JSON.parse(dString)
        } catch(e) {
            return { success: false, fileExists: true, reason: "There was an issue decoding the data." }
        }
        this.data = json
        this.isLoaded = true
        this.keyphrase = keyphrase
        return { success: true, data: json}
    }
    write(data,keyphrase) {
        this.data = data || this.data
        this.keyphrase = keyphrase || this.keyphrase
        try {
            if (!fs.existsSync(this.filelocation) || !fs.statSync(this.filelocation).isDirectory()) {
                throw new Error(this.filelocation + " does not exist, or is not a directory.")
            }
            if (fs.existsSync(this.filePath) && !fs.statSync(this.filePath).isFile()) {
                throw new Error(this.filePath + " exists, but is not a file")
            }
            var encrypted = CryptoJS.AES.encrypt(JSON.stringify(this.data), this.keyphrase);
            fs.writeFileSync(this.filePath, encrypted.toString(), {encoding: "utf8"})
            return {success: true}
        } catch(e) {
            console.error(e)
            return this.write(this.keyphrase,this.data)   
        }
    }
    destroy() {
        this.isLoaded = false
        this.data = {}
    }
    
}

module.exports = EncryptedDataStore