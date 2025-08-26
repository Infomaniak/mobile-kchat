# kChat Mobile

kChat is a fork of Mattermost mobile adapted for use within the Infomaniak ecosystem.

- **Minimum Server versions:** Current ESR version (10.5.0+)
- **Supported iOS versions:** 15.1+
- **Supported Android versions:** 7.0+

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

1. Run the command `brew install openjdk@17`
2. Then run those commands to update your PATH :

```
sudo ln -sfn /opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-17.jdk # Create a symlink so that your java wrappers can find this jdk
echo 'export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"' >> ~/.zshrc
export CPPFLAGS="-I/opt/homebrew/opt/openjdk@17/include"
```

## Project installation :

1. Install the right node version using `nvm install` command or `nvm use` if already installed
2. Run the command `npm install` (This will install node_modules & pods)
3. Run `npm run build:ios-sim` to launch your app

## Project launch :

1. To avoid errors related to the Infomaniak font, you can run the shell command `npm run font-download`
2. Run `npm start`

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

## 'git config user.email' matches '.+@.+'

```
git config --global user.email johndoe@example.com
```

### Binary 'watchman' not found

```
brew install watchman
```

### Xcode build binary error >= 13

Open xcode and select `Xcode > Settings > Locations` and make sure that the dropdown "command line tools" is correctly set.

### SSL errors with ruby

Install Ruby by running `PKG_CONFIG_PATH=/opt/homebrew/opt/openssl@1.1/lib/pkgconfig rvm reinstall 3.2.0 --with-openssl-lib=/opt/homebrew/opt/openssl@1.1 --with-openssl-include=/opt/homebrew/opt/openssl@1.1`

## Contribution

If you wish to contribute code to the Mattermost base repository to fix issues or add new features, follow these steps:

### Prerequisites

Before you begin, ensure you have:

- A valid GitHub account.
- Been added to the Infomaniak GitHub group.

### Steps:

1. First, add two remote repositories to your local GitHub folder using the following commands:

   - `git remote add upstream https://github.com/mattermost/mattermost-mobile.git` (used to pull the latest changes from upstream)
   - `git remote add fork https://github.com/Infomaniak/mobile-kchat.git` (used to create the PR onto upstream)

2. Next, pull the main upstream branch to ensure you have the latest changes from upstream.

3. Once you have cloned the upstream branch in your projects, switch to this branch using `git checkout {name of the branch}`.

4. Create your own local branch from the upstream branch using `git checkout -b {name of the branch}`.

5. After applying your changes, push them to the remote fork to create a PR on Mattermost using `git push fork {name of the branch}`.

6. Follow the PR instructions to provide Mattermost with the necessary information to review your code thoroughly.


## Dev

### Get the Android database file

In the android/ folder, you can use something like that to pull the db from the android simulator
and then use any sqlite viewer.
Note: Android App inspector seems to not be able to open the db directly, even if the documentation says so

```bash
# recup l'id de la db, par exemple en log ce path ou en cherchant dans le device
# app/database/manager/index.ts#L172
# ou 
# /files/databases

# Variables
APP_ID="com.infomaniak.chat"
FILENAME="aHR0cHM6Ly9pbmZvbWFuaWFrLmtjaGF0LmluZm9tYW5pYWsuY29t.db"
DEST="./extracted.db"

# Extraction via run-as
adb exec-out run-as $APP_ID cat files/databases/$FILENAME > $DEST
```

### View iOS Database 

1. **Go to simulators folder**
   ```bash
   cd ~/Library/Developer/CoreSimulator/Devices
   ```

2. **Find the booted simulator**
   ```bash
   xcrun simctl list devices | grep Booted
   ```
   → Note the simulator UUID.

3. **Locate the DB file**  
   The database is stored in:
   ```
   ./<SIMULATOR_UDID>/data/Containers/Shared/AppGroup/<APP_GROUP_UUID>/databases/<encoded_url>.db
   ```
   > The name is Base64 URL-safe encoded from the server URL (see `urlSafeBase64Encode(serverUrl)` in `app/database/manager/index.ts`).

4. **Decode to identify the server**
   ```bash
   echo "aHR0cHM6Ly9leGFtcGxlLmNvbQ==" | base64 -d
   # Output: https://example.com
   ```

5. **Copy and open**
   ```bash
   cp "./<path>/databases/<encoded_url>.db" ~/Desktop/db-debug.db
   ```
   Open `db-debug.db` with [DB Browser for SQLite](https://sqlitebrowser.org/).

## Known Issues with Dependencies
### ⚠️ Jitsi SDK: TypeScript Type Errors

The Jitsi SDK is included as raw `.ts`/`.tsx` files in `node_modules`, not pre-compiled. It contains **TypeScript errors** — harmless at runtime but blocking during build.

#### ✅ Automatic Fix via Postinstall Script

We add a script that automatically adds `// @ts-nocheck` to all Jitsi SDK files to disable type checking **only for these files**.

This is executed via:

```json
"postinstall": "patch-package && ./scripts/postinstall.sh && node ./scripts/jitsi-ts-nocheck.js"
```

➡️ Runs **automatically** on `npm install`.  

This workaround stays until Jitsi provides a properly compiled SDK.