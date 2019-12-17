const CryptoJS = require("crypto-js")
const fs = require("fs")
const path = require("path")

class EncryptedDataStore {
    constructor(filelocation,defaults) {
        this.defaults = defaults
        this.filelocation = filelocation
        var filePath = this.filePath = path.join(filelocation, "app_data.encryptedjson")
        if (!fs.existsSync(filelocation) || !fs.statSync(filelocation).isDirectory()) {
            throw new Error(filelocation + " does not exist, or is not a directory.")
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
            return { success: true, fileExists: false, data: this.defaults }
        }
        var text = ""
        try {
            text = fs.readFileSync(this.filePath).toString()
        } catch(e) {
            return {success: false, fileExists: false, reason: "The file failed to read." + e.toString()}
        }

        var decrypted = CryptoJS.AES.decrypt(text, keyphrase);
        if (decrypted.sigBytes < 0) {
            return {success: false, fileExists: true, reason: "The password entered was incorrect. (" + decrypted.sigBytes + "sigBytes)"}
        }
        var dString = decrypted.toString(CryptoJS.enc.Utf8);
        console.log(dString)
        var json = {}
        try {
            json = JSON.parse(dString)
        } catch(e) {
            return { success: false, fileExists: true, reason: "There was an issue decoding the data." }
        }
        this.data = json
        this.isLoaded = true
        return { success: true, data: json}
    }
    write(keyphrase, data) {
        this.data = data 
        try {
            if (!fs.existsSync(this.filelocation) || !fs.statSync(this.filelocation).isDirectory()) {
                throw new Error(this.filelocation + " does not exist, or is not a directory.")
            }
            if (fs.existsSync(this.filePath) && !fs.statSync(this.filePath).isFile()) {
                throw new Error(this.filePath + " exists, but is not a file")
            }
            var encrypted = CryptoJS.AES.encrypt(JSON.stringify(this.data), keyphrase);
            fs.writeFileSync(this.filePath, encrypted.toString(), {encoding: "utf8"})
            return {success: true}
        } catch(e) {
            console.error(e)
            return this.write(keyphrase,data)   
        }
    }
    destroy() {
        this.isLoaded = false
        this.data = {}
    }
    
}

module.exports = EncryptedDataStore