# kChat Mobile

kChat is a fork of Mattermost mobile adapted for use within the Infomaniak ecosystem.

While the mobile app is a fork of Mattermost, the back-end is custom made and entierely developped by Infomaniak.

The kChat app requires an Infomaniak account with kSuite. It enables you to communicate live with your teams and organise your projects within a unified communication platform.

## Prerequisite :

- Install brew on your machine
- Install open jdk (see instructions in the following section)
- Install a ruby version manager such as rbenv (https://formulae.brew.sh/formula/rbenv) or rvm (https://rvm.io/)
- Make sure that xcode & xcode command line tools is installed and up to date.
- Android studio must be installed & configured
- Make sure to install cocoapods package installed using `brew install cocoapods`
- Whitelist this path `/Users/{username}/Library/Developer/Xcode/DerivedData` within your simulator to avoid simulator errors

## Install open jdk

1. Run the command `brew install openjdk@11`
2. Then run those commands to update your PATH :

```
sudo ln -sfn /opt/homebrew/opt/openjdk@11/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-11.jdk # Create a symlink so that your java wrappers can find this jdk
echo 'export PATH="/opt/homebrew/opt/openjdk@11/bin:$PATH"' >> ~/.zshrc
export CPPFLAGS="-I/opt/homebrew/opt/openjdk@11/include"
```

## Project installation :

1. Install the right node version using `nvm install` command or `nvm use` if already installed
2. Run the command `npm install` (This will install node_modules & pods)
3. Run `npm run build:ios-sim` to launch your app

## Common errors

### Binary emulator not found

If this error occur, make sure that android studio has been completely installed and that those following lines are set within your `.zprofile` :

```
export ANDROID_HOME="/Users/<username>/Library/Android/sdk"
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/emulator
```

### Xcode build binary error >= 13

Open xcode and select `Xcode > Settings > Locations` and make sure that the dropdown "command line tools" is correctly set.

### SSL errors with ruby

Add this line within your `.zprofile` : `PKG_CONFIG_PATH=/opt/homebrew/opt/openssl@1.1/lib/pkgconfig rvm reinstall 3.0.6 --with-openssl-lib=/opt/homebrew/opt/openssl@1.1 --with-openssl-include=/opt/homebrew/opt/openssl@1.1`
