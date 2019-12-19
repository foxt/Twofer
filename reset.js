var vault = new (require("./vaultMgr"))("/Users/thelmgn/Library/Application Support/authbar",{"codes":[],"config":{}})

var codes = []
var i = 0
while (i < 1) {
    codes.push({secret: "M4VEKNKEGJVTONBBNFZCG5BPGM7EWU3VPBTG6T25IN6UQ3REGBJA",name:"Piped Piper #" + (i+1),icon:"pied-piper.svg"})
    //codes.push({secret: "M4VEKNKEGJVTONBBNFZCG5BPGM7EWU3VPBTG6T25IN6UQ3REGBJA",name:"Aviato #" + (i+1),icon:"aviato.svg"})
    //codes.push({secret: "PEUUKRSRPNCSYL3BENWTUVDHNUZXCYZ7O55EQMDOKQVHWJC2PNEQ",name:"Server #" + (i+1),icon:"server.svg"})
    //codes.push({secret: "HY6DEI3MPJCDE5LUNEQTQSTOKRBDEZT3HEYC6MJYGFNXIZCKMJVQ",name:"Buy-N-Large #" + (i+1),icon:"buy-n-large.svg"})
    i += 1;
}

vault.write({codes,config:{}}, " ")
console.log("Configuration reset. New password is a ' ' (one space)")