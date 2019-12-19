var vault = new (require("./vaultMgr"))("/Users/thelmgn/Library/Application Support/authbar",{"codes":[],"config":{}})
vault.write({codes: [
    {secret: "M4VEKNKEGJVTONBBNFZCG5BPGM7EWU3VPBTG6T25IN6UQ3REGBJA",name:"Piped Piper",icon:"pied-piper.svg"},
    {secret: "PEUUKRSRPNCSYL3BENWTUVDHNUZXCYZ7O55EQMDOKQVHWJC2PNEQ",name:"Server",icon:"server.svg"}
],config:{}}, " ")
console.log("Configuration reset. New password is a ' ' (one space)")