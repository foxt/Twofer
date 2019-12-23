# Twofer [beta]

Twofer (pronounced too-fer)  is a TOTP code generator for the desktop. Currently, the beta is only available for macOS, however I'm working on bringing it to Linux and Windows soon.

## How to use Twofer:

1. Download and install Twofer

2. The first time the app launches, it will ask you for a password, this is the password you will need to log into Twofer, so make sure you don't forget it!

3. Use `cmd+shift+a` or `ctrl+shift+a` to open/close Twofer.

## Importing/Exporting from Twofer.

Secrets can be exported individually by clicking on the QR button when you hover over a code. To sync the Twofer database, copy the `app_data.encryptedjson` from the path below to the machine you want to sync to. The password must be the same on both machines.

**Windows:** %localappdata%\Twofer
**macOS:** ~/Library/Application Support/Twofer
**Linux:** ~/.config/Twofer
