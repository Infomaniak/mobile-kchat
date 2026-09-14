# Expo Router Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace React Native Navigation (RNN) with Expo Router for file-based navigation, following Mattermost's migration pattern exactly.

**Architecture:** File-based routing in `app/routes/` with grouped route segments `(authenticated)`, `(unauthenticated)`, `(modals)`, `(bottom_sheet)`. Navigation adapter in `app/screens/navigation.ts` preserves public function names while using expo-router's `router.push/replace/dismiss` internally. NavigationStore tracks state from expo-router's navigation state instead of RNN listeners.

**Tech Stack:** expo-router v4 (SDK 52 compatible), @react-navigation/native-stack, React Native 0.77.3, Expo SDK 52, React 18.3.1

## Global Constraints

- React Native 0.77.3 / Expo SDK 52 — do NOT bump versions in this migration
- New Architecture stays DISABLED (`RCT_NEW_ARCH_ENABLED=0`)
- `babel-preset-expo` replaces `module:@react-native/babel-preset`
- Screen constants switch from PascalCase to snake_case
- `safeParseJSON` from `@utils/helpers` is used for param deserialization
- kChat uses `Preferences.THEMES.infomaniak` as default light theme (not `denim`)
- kChat does NOT have: playbooks, channel_bookmark, mm_blocks_content, sso, about, agent_chat, agent_threads_list, data_erased
- kChat-specific screens: ik_login, ik_no_teams, ik_evolve, ik_quota_exceeded, ik_reminder, debug_performance, feedback_options, send_feedback

---

### Task 1: Add expo-router dependencies and configuration

**Files:**
- Modify: `package.json`
- Modify: `app.json`
- Modify: `babel.config.js`
- Modify: `metro.config.js`

**Interfaces:**
- Produces: expo-router installed and configured, `babel-preset-expo` active, `unstable_allowRequireContext` enabled, `@routes` alias available

- [ ] **Step 1: Add dependencies to package.json**

Add to `dependencies` in `package.json`:
```json
    "expo-router": "^4.0.22",
    "expo-splash-screen": "~0.28.0",
    "expo-linking": "~7.0.0",
    "expo-constants": "~10.0.0",
    "expo-status-bar": "~2.0.0",
    "@react-navigation/native-stack": "^7.2.10",
    "@react-navigation/drawer": "^7.1.1",
```

Remove from `dependencies`:
```json
    "react-native-navigation": "7.45.0",
    "@react-navigation/stack": "7.2.10",
```

- [ ] **Step 2: Update app.json**

Replace `app.json` with:
```json
{
  "name": "kChat",
  "displayName": "kChat",
  "expo": {
    "scheme": "kchat",
    "plugins": [
      "expo-router"
    ]
  }
}
```

- [ ] **Step 3: Update babel.config.js**

In `babel.config.js`, replace `'module:@react-native/babel-preset'` with `'babel-preset-expo'` in the presets array.

Add to the `alias` in the module-resolver plugin:
```js
                '@routes': './app/routes',
```

- [ ] **Step 4: Update metro.config.js**

In `metro.config.js`, add to the `config` object:
```js
    transformer: {
        unstable_allowRequireContext: true,
        babelTransformerPath: require.resolve('react-native-svg-transformer'),
        getTransformOptions: async () => ({
            transform: {
                experimentalImportSupport: false,
                inlineRequires: true,
            },
        }),
    },
```

Keep existing resolver config. Merge the `unstable_allowRequireContext` into the existing `transformer` object.

- [ ] **Step 5: Install dependencies**

Run: `npm install`
Expected: Dependencies installed without errors.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json app.json babel.config.js metro.config.js
git commit -m "chore: add expo-router dependencies and configuration

Replace react-native-navigation with expo-router. Update babel preset,
metro config, and app.json for expo-router file-based routing."
```

---

### Task 2: Update Screen constants to snake_case

**Files:**
- Modify: `app/constants/screens.ts`
- Modify: `types/screens/navigation.ts`

**Interfaces:**
- Produces: All `Screens.*` constants are now snake_case strings (e.g., `Screens.CHANNEL === 'channel'`). `AvailableScreens` type no longer depends on RNN. New Set constants `UNAUTHENTICATED_SCREENS`, `HOME_TAB_SCREENS`, `MODAL_SCREENS` for route group classification.

- [ ] **Step 1: Rewrite app/constants/screens.ts**

Replace the entire file with snake_case constants. Use Mattermost's file as reference at `/Users/boris/dev/Mattermost/mattermost-mobile/app/constants/screens.ts`. Key changes:

- All constant values change from PascalCase to snake_case (e.g., `CHANNEL = 'channel'` not `CHANNEL = 'Channel'`)
- Add `CHANNEL_LIST = 'channel_list'` (replaces `HOME` for the tab name)
- Add `GENERIC_BOTTOM_SHEET = 'generic_bottom_sheet'`
- Remove kChat-specific: `INFOMANIAK_LOGIN`, `INFOMANIAK_NO_TEAMS`, `INFOMANIAK_QUOTA_EXCEEDED`, `INFOMANIAK_REMINDER`, `INFOMANIAK_EVOLVE` → rename to `IK_LOGIN`, `IK_NO_TEAMS`, `IK_QUOTA_EXCEEDED`, `IK_REMINDER`, `IK_EVOLVE` with snake_case values
- Remove Mattermost-only: `SSO`, `ABOUT`, `CREATE_TEAM`, `TRANSCRIPTION`, `CHANNEL_BANNER`, `GENERIC_OVERLAY`, `DRAFT`, `GLOBAL_DRAFTS_AND_SCHEDULED_POSTS`
- Keep `HOME = '(home)'` for the tab group
- Add these new Sets at the bottom:

```ts
export const MODAL_SCREENS = new Set<string>([
    BROWSE_CHANNELS,
    CHANNEL_INFO,
    CHANNEL_ADD_MEMBERS,
    CREATE_OR_EDIT_CHANNEL,
    CREATE_DIRECT_MESSAGE,
    CUSTOM_STATUS,
    DIALOG_ROUTER,
    EDIT_POST,
    EDIT_PROFILE,
    EDIT_SERVER,
    FIND_CHANNELS,
    INTEGRATION_SELECTOR,
    INVITE,
    MANAGE_CHANNEL_MEMBERS,
    PDF_VIEWER,
    RESCHEDULE_DRAFT,
    JOIN_TEAM,
    SETTINGS,
    FEEDBACK_OPTIONS,
    SEND_FEEDBACK,
    GALLERY,
    REPORT_PROBLEM,
]);

export const SCREENS_AS_BOTTOM_SHEET = new Set<string>([
    GENERIC_BOTTOM_SHEET,
    ATTACHMENT_OPTIONS,
    CALL_PARTICIPANTS,
    CALL_HOST_CONTROLS,
    DRAFT_SCHEDULED_POST_OPTIONS,
    EMOJI_PICKER,
    POST_OPTIONS,
    POST_PRIORITY_PICKER,
    REACTIONS,
    SCHEDULED_POST_OPTIONS,
    TERMS_OF_SERVICE,
    THREAD_OPTIONS,
    USER_PROFILE,
    GROUP_MEMBERS,
    IK_QUOTA_EXCEEDED,
    IK_REMINDER,
    AGENTS_REWRITE_OPTIONS,
]);

export const UNAUTHENTICATED_SCREENS = new Set<string>([
    ONBOARDING,
    SERVER,
    LOGIN,
    MFA,
    FORGOT_PASSWORD,
    IK_LOGIN,
    IK_NO_TEAMS,
]);

export const HOME_TAB_SCREENS = new Set<string>([
    CHANNEL_LIST,
    SEARCH,
    MENTIONS,
    SAVED_MESSAGES,
    ACCOUNT,
]);
```

Keep `SCREENS_WITH_TRANSPARENT_BACKGROUND`, `SCREENS_WITH_EXTRA_KEYBOARD`, `NOT_READY` sets, updating values to snake_case. Remove `MODAL_SCREENS_WITHOUT_BACK`.

- [ ] **Step 2: Update types/screens/navigation.ts**

Replace the entire file:
```ts
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import type {Screens} from '@constants';

type ScreenKeys = keyof typeof Screens;
export type AvailableScreens = typeof Screens[ScreenKeys] | '(modals)';
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npm run tsc 2>&1 | head -40`
Expected: Many errors will appear because screen names changed. This is expected — subsequent tasks fix them. Note the error count for reference.

- [ ] **Step 4: Commit**

```bash
git add app/constants/screens.ts types/screens/navigation.ts
git commit -m "refactor: rename Screen constants to snake_case for expo-router

All Screen constants now use snake_case to match expo-router file-based
routing conventions. Add UNAUTHENTICATED_SCREENS, HOME_TAB_SCREENS,
MODAL_SCREENS, SCREENS_AS_BOTTOM_SHEET sets for route group classification."
```

---

### Task 3: Add useThemeByAppearanceWithDefault hook

**Files:**
- Modify: `app/context/theme/index.tsx`

**Interfaces:**
- Produces: `useThemeByAppearanceWithDefault(themeProp?: Theme): Theme` hook for unauthenticated screens that need appearance-based theming without a server database.

- [ ] **Step 1: Add the hook to app/context/theme/index.tsx**

Add after the existing `useTheme` function (around line 129):

```tsx
export function useThemeByAppearanceWithDefault(themeProp?: Theme): Theme {
    const [theme, setTheme] = useState<Theme>(() => {
        return themeProp || getDefaultThemeByAppearance();
    });

    useEffect(() => {
        const listener = Appearance.addChangeListener(() => {
            const newTheme = getDefaultThemeByAppearance();
            if (theme !== newTheme) {
                setTheme(newTheme);
            }
        });

        return () => listener.remove();
    }, [theme]);

    return theme;
}
```

- [ ] **Step 2: Commit**

```bash
git add app/context/theme/index.tsx
git commit -m "feat: add useThemeByAppearanceWithDefault hook

Hook for unauthenticated screens that need appearance-based theming
without a server database, used by expo-router route files."
```

---

### Task 4: Add useHasCredentials and usePropsFromParams hooks

**Files:**
- Create: `app/hooks/use_has_credentials.ts`
- Create: `app/hooks/props_from_params.ts`

**Interfaces:**
- Produces: `useHasCredentials(): boolean | null` — returns null while loading, then true/false
- Produces: `usePropsFromParams<T>(): T` — deserializes expo-router params to typed props

- [ ] **Step 1: Create app/hooks/use_has_credentials.ts**

```ts
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {useState} from 'react';

import useDidMount from '@hooks/did_mount';
import {getAllServerCredentials} from '@init/credentials';
import {logError} from '@utils/log';

export function useHasCredentials(): boolean | null {
    const [hasCredentials, setHasCredentials] = useState<boolean | null>(null);

    useDidMount(() => {
        let mounted = true;
        async function checkAuth() {
            try {
                const credentials = await getAllServerCredentials();
                if (mounted) {
                    setHasCredentials(credentials.length > 0);
                }
            } catch (error) {
                logError('[useHasCredentials]', error);
                if (mounted) {
                    setHasCredentials(false);
                }
            }
        }
        checkAuth();
        return () => {
            mounted = false;
        };
    });

    return hasCredentials;
}
```

- [ ] **Step 2: Create app/hooks/props_from_params.ts**

```ts
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {useLocalSearchParams} from 'expo-router';

import {safeParseJSON} from '@utils/helpers';

export function usePropsFromParams<T>(): T {
    const params = useLocalSearchParams();

    const props = {} as T;
    Object.keys(params).forEach((key) => {
        const value = safeParseJSON(params[key]);
        (props as Record<string, unknown>)[key] = value;
    });

    return props;
}
```

- [ ] **Step 3: Commit**

```bash
git add app/hooks/use_has_credentials.ts app/hooks/props_from_params.ts
git commit -m "feat: add useHasCredentials and usePropsFromParams hooks

Hooks needed by expo-router route files for auth checking and
param deserialization."
```

---

### Task 5: Add navigation_header hook

**Files:**
- Create: `app/hooks/navigation_header.tsx`

**Interfaces:**
- Produces: `useNavigationHeader(options)` — configures header based on navigation state
- Produces: `getLoginFlowHeaderOptions(theme): NativeStackNavigationOptions`
- Produces: `getLoginModalHeaderOptions(theme, onClose, testID): NativeStackNavigationOptions`
- Produces: `getHeaderOptions(theme): NativeStackNavigationOptions`
- Produces: `getModalHeaderOptions(theme, onClose, testID): NativeStackNavigationOptions`
- Produces: `getBottomSheetHeaderOptions(): NativeStackNavigationOptions`

- [ ] **Step 1: Create app/hooks/navigation_header.tsx**

Copy from Mattermost at `/Users/boris/dev/Mattermost/mattermost-mobile/app/hooks/navigation_header.tsx`. This file is self-contained and uses:
- `expo-router` (`useNavigation`, `useRouter`)
- `@components/navigation_button` (already exists in kChat)
- `@utils/typography` (already exists in kChat)

The full content is at that path. Copy it verbatim.

- [ ] **Step 2: Commit**

```bash
git add app/hooks/navigation_header.tsx
git commit -m "feat: add navigation_header hook for expo-router

Provides header configuration helpers that replace RNN's topBar
options with NativeStackNavigationOptions."
```

---

### Task 6: Add BottomSheetStore

**Files:**
- Create: `app/store/bottom_sheet_store.ts`

**Interfaces:**
- Produces: `BottomSheetStore` singleton with `setRenderContentCallback`, `getRenderContentCallback`, `setSnapPoints`, `getSnapPoints`, `setFooterComponent`, `getFooterComponent`, `reset`

- [ ] **Step 1: Create app/store/bottom_sheet_store.ts**

Copy from Mattermost at `/Users/boris/dev/Mattermost/mattermost-mobile/app/store/bottom_sheet_store.ts`. It's self-contained with no external dependencies beyond types.

- [ ] **Step 2: Commit**

```bash
git add app/store/bottom_sheet_store.ts
git commit -m "feat: add BottomSheetStore for generic bottom sheet routing

In-memory store for bottom sheet content callback, snap points,
and footer component, used by the generic_bottom_sheet route."
```

---

### Task 7: Rewrite NavigationStore for expo-router

**Files:**
- Modify: `app/store/navigation_store.ts`

**Interfaces:**
- Produces: `NavigationStore` singleton with `updateFromNavigationState(navState)`, `getVisibleScreen()`, `getScreensInStack()`, `isScreenInStack()`, `isModalOpen()`, `reset()`, `waitUntilScreenHasLoaded()`, `waitUntilScreenIsTop()`, `waitUntilScreensIsRemoved()`, `isToSOpen()`, `setToSOpen()`
- Produces: `useCurrentScreen(): AvailableScreens | undefined` hook
- Consumes: `AvailableScreens` type from `@typings/screens/navigation`

- [ ] **Step 1: Rewrite app/store/navigation_store.ts**

Copy from Mattermost at `/Users/boris/dev/Mattermost/mattermost-mobile/app/store/navigation_store.ts`. Adapt the import to use kChat's `AvailableScreens` type:

```ts
import type {AvailableScreens} from '@typings/screens/navigation';
```

The full implementation uses `@react-navigation/native` types (`NavigationState`, `NavigationRoute`, `ParamListBase`), `BehaviorSubject` from rxjs, and React hooks. Copy it verbatim from Mattermost.

- [ ] **Step 2: Commit**

```bash
git add app/store/navigation_store.ts
git commit -m "refactor: rewrite NavigationStore for expo-router state tracking

Replace RNN command listeners with updateFromNavigationState()
that extracts screen IDs from expo-router navigation state.
Add useCurrentScreen() hook for observing the current screen."
```

---

### Task 8: Rewrite navigation adapter (app/screens/navigation.ts)

**Files:**
- Modify: `app/screens/navigation.ts`

**Interfaces:**
- Produces: `navigateToScreen(screen, props?, reset?)` — pushes/replaces via router
- Produces: `navigateBack()` — router.back() with delay
- Produces: `navigateToRoot()` — dismissTo channel_list
- Produces: `dismissAllRoutesAndPopToScreen(screenId, passProps?)` — dismissTo target
- Produces: `navigateToHomeTab(params?)` — emits NAVIGATE_TO_TAB event
- Produces: `navigateToSettingsScreen(screen, props?)` — navigates within settings group
- Produces: `navigateToChannelInfoScreen(screen, props?)` — navigates within channel_info group
- Produces: `getExpoRouterPath(screen, props?): string | undefined` — maps screen to route path
- Produces: `propsToParams(props): Record<string, string>` — serializes props to params
- Produces: `updateParams(props)` — updates current route params
- Produces: `bottomSheet(renderContent, snapPoints, footerComponent?)` — shows generic bottom sheet
- Produces: `dismissBottomSheet()` — dismisses generic bottom sheet
- Produces: `navigateToScreenWithBaseRoute(baseRoute, screen, props?, reset?)` — navigates with base route
- Consumes: `Screens`, `UNAUTHENTICATED_SCREENS`, `HOME_TAB_SCREENS`, `SCREENS_AS_BOTTOM_SHEET`, `MODAL_SCREENS` from `@constants/screens`
- Consumes: `BottomSheetStore` from `@store/bottom_sheet_store`
- Consumes: `NavigationStore` from `@store/navigation_store`

- [ ] **Step 1: Rewrite app/screens/navigation.ts**

Copy from Mattermost at `/Users/boris/dev/Mattermost/mattermost-mobile/app/screens/navigation.ts`. Adapt imports:
- kChat uses `import NavigationStore from '@store/navigation_store'` (default import, not named)
- kChat uses `import {Events, Navigation, Screens} from '@constants'` (check kChat's constants/index.ts exports)

The file should export: `propsToParams`, `updateParams`, `getExpoRouterPath`, `navigateToScreen`, `navigateToScreenWithBaseRoute`, `navigateBack`, `navigateToHomeTab`, `dismissToStackRoot`, `bottomSheet`, `dismissBottomSheet`, `navigateToRoot`, `dismissAllRoutesAndPopToScreen`, `navigateToSettingsScreen`, `navigateToChannelInfoScreen`.

- [ ] **Step 2: Delete app/screens/index.tsx**

The lazy component registration file is no longer needed:
```bash
rm app/screens/index.tsx
```

- [ ] **Step 3: Delete app/screens/index.test.tsx**

```bash
rm app/screens/index.test.tsx
```

- [ ] **Step 4: Commit**

```bash
git add app/screens/navigation.ts
git rm app/screens/index.tsx app/screens/index.test.tsx
git commit -m "refactor: rewrite navigation adapter for expo-router

Replace RNN Navigation.push/pop/showModal/showOverlay with expo-router
router.push/replace/dismiss. Add getExpoRouterPath() to map screen
constants to route paths. Remove lazy component registration (no longer
needed with file-based routing)."
```

---

### Task 9: Rewrite app/init/app.ts and app/init/launch.ts

**Files:**
- Modify: `app/init/app.ts`
- Modify: `app/init/launch.ts`

**Interfaces:**
- Produces: `initialize()` — async init of DB, Network, WebSocket (no screen registration)
- Produces: `cleanup()` — cleanup function for unmount
- Produces: `determineInitialExpoRoute(): Promise<ExpoRouterLaunchResult>` — determines initial route + params
- Produces: `ExpoRouterLaunchResult` type: `{route: string, params: Record<string, any>}`

- [ ] **Step 1: Rewrite app/init/app.ts**

Adapt from Mattermost's `app/init/app.ts`. kChat-specific changes:
- Keep `ImageCacheMigration.init()` (kChat has this, Mattermost doesn't)
- Keep `matomo` tracking (kChat-specific)
- Keep `withMinDuration` wrapper (kChat-specific splash screen timing)
- Remove `registerScreens()` and `registerNavigationListeners()` imports/calls
- Add `cleanup()` export
- Remove `start()` function — initialization now happens in root `_layout.tsx`

```ts
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import DatabaseManager from '@database/manager';
import {getAllServerCredentials} from '@init/credentials';
import ImageCacheMigration from '@init/image_cache_migration';
import PushNotifications from '@init/push_notifications';
import GlobalEventHandler from '@managers/global_event_handler';
import {matomo} from '@managers/matomo';
import NetworkManager from '@managers/network_manager';
import SessionManager from '@managers/session_manager';
import WebsocketManager from '@managers/websocket_manager';
import EphemeralStore from '@store/ephemeral_store';
import {NavigationStore} from '@store/navigation_store';

let baseAppInitialized = false;
let serverCredentials: ServerCredential[] = [];

Promise.allSettled = Promise.allSettled || (<T>(promises: Array<Promise<T>>) => Promise.all(
    promises.map((p) => p.
        then((value) => ({status: 'fulfilled', value})).
        catch((reason) => ({status: 'rejected', reason})),
    ),
));

export async function initialize() {
    if (!baseAppInitialized) {
        baseAppInitialized = true;
        serverCredentials = await getAllServerCredentials();
        const serverUrls = serverCredentials.map((credential) => credential.serverUrl);
        await DatabaseManager.init(serverUrls);
        await NetworkManager.init(serverCredentials);
        await ImageCacheMigration.init();
        GlobalEventHandler.init();
        SessionManager.init();
    }

    NavigationStore.reset();
    EphemeralStore.setCurrentThreadId('');
    EphemeralStore.setProcessingNotification('');

    PushNotifications.init(serverCredentials.length > 0);
    await WebsocketManager.init(serverCredentials);

    if (!__DEV__) {
        matomo.trackAppStart({});
    }
}

export function cleanup() {
    GlobalEventHandler.cleanup();
    SessionManager.cleanup();
}
```

Note: Remove `import {registerScreens}` and `import {registerNavigationListeners}`. Remove the `start()` function entirely. The `initialLaunch()` call is also removed — it's replaced by `determineInitialExpoRoute()` called from the root route's `index.tsx`.

- [ ] **Step 2: Rewrite app/init/launch.ts**

Adapt from Mattermost's `app/init/launch.ts`. kChat-specific changes:
- Use `IK_LOGIN` instead of `SERVER` for the default unauthenticated route (kChat uses Infomaniak login, not server selection)
- Use `IK_NO_TEAMS` for the no-teams case
- Keep `upgradeEntry` logic (kChat has v1 migration)
- Keep `removeServerCredentials` in the upgrade error path
- The function `determineInitialExpoRoute()` returns `{route, params}` instead of calling `resetToHome()`

Key structure:
```ts
export type ExpoRouterLaunchResult = {
    route: string;
    params: Record<string, any>;
};

export async function determineInitialExpoRoute(): Promise<ExpoRouterLaunchResult> {
    // Check for deep link
    const deepLinkUrl = await Linking.getInitialURL();
    if (deepLinkUrl) {
        return determineRouteFromDeeplink(deepLinkUrl);
    }

    // Check for notification
    const notification = await Notifications.getInitialNotification();
    let tapped = Platform.select({android: true, ios: false})!;
    if (Platform.OS === 'ios' && notification) {
        const delivered = await Notifications.ios.getDeliveredNotifications();
        tapped = delivered.find((d) => (d as unknown as NotificationData).ack_id === notification?.payload.ack_id) == null;
    }
    if (initialNotificationTypes.includes(notification?.payload?.type) && tapped) {
        const notificationData = convertToNotificationData(notification!);
        EphemeralStore.setProcessingNotification(notificationData.identifier);
        return determineRouteFromNotification(notificationData);
    }

    // Normal launch
    const coldStart = notification ? (tapped || AppState.currentState === 'active') : true;
    return determineRoute({launchType: Launch.Normal, coldStart});
}
```

The `determineRouteFromLaunchProps` function returns routes like `'/(unauthenticated)/ik_login'` instead of `'/(unauthenticated)/server'` (since kChat uses Infomaniak login as the default entry). For authenticated routes, return `'/(authenticated)/(home)'`.

Use `getExpoRouterPath(Screens.IK_LOGIN)` or hardcode the route strings. Import `getExpoRouterPath` from `@screens/navigation`.

- [ ] **Step 3: Commit**

```bash
git add app/init/app.ts app/init/launch.ts
git commit -m "refactor: rewrite init/app.ts and init/launch.ts for expo-router

Remove registerScreens() and registerNavigationListeners(). Replace
initialLaunch() with determineInitialExpoRoute() that returns route+
params instead of calling RNN setRoot. Add cleanup() for root layout."
```

---

### Task 10: Create root layout and entry routes

**Files:**
- Create: `app/routes/_layout.tsx`
- Create: `app/routes/index.tsx`
- Create: `app/routes/+native-intent.ts`
- Modify: `index.ts` → rename to `index.tsx`

**Interfaces:**
- Produces: Root layout with providers (Intl, GestureHandler, SafeArea, Keyboard, Portal), init via useDidMount, splash screen, Stack with route groups
- Produces: Root index that calls `determineInitialExpoRoute()` and redirects
- Produces: Deep link handler for expo-router

- [ ] **Step 1: Create app/routes/_layout.tsx**

Adapt from Mattermost's `app/routes/_layout.tsx` at `/Users/boris/dev/Mattermost/mattermost-mobile/app/routes/_layout.tsx`. kChat-specific changes:
- Remove `EMMProvider` (kChat doesn't have `@mattermost/react-native-emm`)
- Remove `WatermarkContainer` (kChat doesn't have watermark screen)
- Remove `@mattermost/react-native-emm` import
- Use `import NavigationStore from '@store/navigation_store'` (default import, not named)
- Keep `InAppNotificationContainer`, `ReviewAppContainer`, `ShareFeedbackContainer`, `SnackBarContainer`
- Keep `SplashScreen` config
- Keep the same Stack structure with `(unauthenticated)`, `(authenticated)`, `index`, `(modals)`, `(bottom_sheet)`

- [ ] **Step 2: Create app/routes/index.tsx**

```tsx
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Redirect, type Href} from 'expo-router';
import {useEffect, useState} from 'react';

import {determineInitialExpoRoute, type ExpoRouterLaunchResult} from '@init/launch';

export default function RootIndex() {
    const [launchResult, setLaunchResult] = useState<ExpoRouterLaunchResult | null>(null);

    useEffect(() => {
        async function initializeLaunch() {
            const result = await determineInitialExpoRoute();
            setLaunchResult(result);
        }

        initializeLaunch();
    }, []);

    if (!launchResult) {
        return null;
    }

    const href: Href = {pathname: launchResult.route, params: launchResult.params};
    return <Redirect href={href}/>;
}
```

- [ ] **Step 3: Create app/routes/+native-intent.ts**

Adapt from Mattermost's `app/routes/+native-intent.ts`. kChat-specific changes:
- kChat doesn't have `Sso` constants — remove SSO redirect URL checks (or keep them if kChat has SSO redirect handling elsewhere; check `@constants` for Sso exports)
- Import `getIntlShape` from `@utils/general` (check if it exists in kChat)
- Import `alertInvalidDeepLink`, `parseAndHandleDeepLink` from `@utils/deep_link`

- [ ] **Step 4: Rewrite index.tsx (rename from index.ts)**

```tsx
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {RUNNING_E2E} from '@env';
import TurboLogger from '@mattermost/react-native-turbo-log';
import {ExpoRoot} from 'expo-router';
import React from 'react';
import {Alert, AlertButton, AlertOptions, AppRegistry, LogBox, Platform, UIManager} from 'react-native';

import {logInfo} from './app/utils/log';
import setFontFamily from './app/utils/font_family';

declare const global: { HermesInternal: null | {} };

export function installAlertSpy() {
    const originalAlert = Alert.alert;
    Alert.alert = ((title: string, message?: string, buttons?: AlertButton[], options?: AlertOptions) => {
        // eslint-disable-next-line no-console
        console.log('[Alert.alert] called', {title, message, buttons, options});
        return (originalAlert as any)(title, message, buttons, options);
    }) as typeof Alert.alert;
}

import ViewReactNativeStyleAttributes from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes';
ViewReactNativeStyleAttributes.scaleY = true;

TurboLogger.configure({
    dailyRolling: false,
    logToFile: !__DEV__,
    maximumFileSize: 1024 * 1024,
    maximumNumberOfFiles: 2,
});

if (__DEV__) {
    LogBox.ignoreLogs(['new NativeEventEmitter']);
    const isRunningE2e = RUNNING_E2E === 'true';
    logInfo(`RUNNING_E2E: ${RUNNING_E2E}, isRunningE2e: ${isRunningE2e}`);
    if (isRunningE2e) {
        LogBox.ignoreAllLogs(true);
    }
}

setFontFamily();
installAlertSpy();

if (global.HermesInternal) {
    require('@formatjs/intl-getcanonicallocales/polyfill-force');
    require('@formatjs/intl-locale/polyfill-force');
    require('@formatjs/intl-pluralrules/polyfill-force');
    require('@formatjs/intl-numberformat/polyfill-force');
    require('@formatjs/intl-datetimeformat/polyfill-force');
    require('@formatjs/intl-datetimeformat/add-all-tz');
    require('@formatjs/intl-listformat/polyfill-force');
    require('@formatjs/intl-relativetimeformat/polyfill-force');
    require('@formatjs/intl-displaynames/polyfill-force');
}

if (Platform.OS === 'android') {
    const ShareExtension = require('./share_extension/index.tsx').default;
    AppRegistry.registerComponent('MattermostShare', () => ShareExtension);
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

// eslint-disable-next-line no-process-env
process.env.EXPO_OS = Platform.OS;

export function App() {
    const ctx = require.context('./app/routes');
    return <ExpoRoot context={ctx}/>;
}

AppRegistry.registerComponent('kChat', () => App);
```

Remove the old `index.ts` file.

- [ ] **Step 5: Commit**

```bash
git rm index.ts
git add index.tsx app/routes/_layout.tsx app/routes/index.tsx app/routes/+native-intent.ts
git commit -m "feat: create root layout, entry route, and deep link handler

Root layout provides all global providers and initializes the app.
Index route determines initial destination via determineInitialExpoRoute.
+native-intent handles deep links replacing RNN's Linking listener."
```

---

### Task 11: Create group layouts

**Files:**
- Create: `app/routes/(unauthenticated)/_layout.tsx`
- Create: `app/routes/(authenticated)/_layout.tsx`
- Create: `app/routes/(modals)/_layout.tsx`
- Create: `app/routes/(bottom_sheet)/_layout.tsx`
- Create: `app/routes/(authenticated)/(home)/_layout.tsx`

- [ ] **Step 1: Create (unauthenticated)/_layout.tsx**

Adapt from Mattermost. kChat changes:
- Use `IK_LOGIN` instead of `SERVER` as the first screen
- No `SSO` screen
- Redirect to `'/(authenticated)/(home)'` when authenticated

- [ ] **Step 2: Create (authenticated)/_layout.tsx**

Copy from Mattermost at `/Users/boris/dev/Mattermost/mattermost-mobile/app/routes/(authenticated)/_layout.tsx`. kChat changes:
- Remove `GlobalClassificationBannerContainer` (kChat doesn't have it)
- Use `import NavigationStore from '@store/navigation_store'` (default import)
- Use `withServerDatabase` from `@database/components` (already exists in kChat)
- Redirect to `'/(unauthenticated)'` when no credentials

- [ ] **Step 3: Create (modals)/_layout.tsx**

Copy from Mattermost verbatim.

- [ ] **Step 4: Create (bottom_sheet)/_layout.tsx**

Copy from Mattermost verbatim.

- [ ] **Step 5: Create (authenticated)/(home)/_layout.tsx**

Adapt from Mattermost's `(home)/_layout.tsx`. kChat changes:
- Import `TabBar` from `@screens/home/tab_bar` (kChat has this)
- Use `Screens` from `@constants`
- kChat tab names: `CHANNEL_LIST`, `SEARCH`, `MENTIONS`, `SAVED_MESSAGES`, `ACCOUNT`
- The `channel_list` tab shows `href: '/(authenticated)/(home)'`

- [ ] **Step 6: Commit**

```bash
git add app/routes/(unauthenticated)/_layout.tsx app/routes/(authenticated)/_layout.tsx app/routes/(modals)/_layout.tsx app/routes/(bottom_sheet)/_layout.tsx app/routes/(authenticated)/(home)/_layout.tsx
git commit -m "feat: create group layouts for expo-router route segments

- (unauthenticated): auth redirect, login flow screens
- (authenticated): withServerDatabase wrapper, auth guard
- (modals): modal presentation stack
- (bottom_sheet): transparent modal stack
- (home): bottom tabs with channel_list, search, mentions, saved, account"
```

---

### Task 12: Create route files for unauthenticated screens

**Files:**
- Create: `app/routes/(unauthenticated)/onboarding.tsx`
- Create: `app/routes/(unauthenticated)/mfa.tsx`
- Create: `app/routes/(unauthenticated)/forgot_password.tsx`
- Create: `app/routes/(unauthenticated)/ik_login.tsx`
- Create: `app/routes/(unauthenticated)/ik_no_teams.tsx`

- [ ] **Step 1: Create route files**

Each route file follows the pattern: import the screen component from `@screens/...`, use `usePropsFromParams` to deserialize params, pass props to the screen component.

For `onboarding.tsx`:
```tsx
export {default} from '@screens/onboarding';
```

For `mfa.tsx` and `forgot_password.tsx`: use the `usePropsFromParams` + `useThemeByAppearanceWithDefault` pattern from Mattermost's `server.tsx`.

For `ik_login.tsx` and `ik_no_teams.tsx`: similar pattern, import from `@screens/ik_login` and `@screens/ik_no_teams/index`.

- [ ] **Step 2: Commit**

```bash
git add app/routes/(unauthenticated)/
git commit -m "feat: add unauthenticated route files

Routes for onboarding, mfa, forgot_password, ik_login, ik_no_teams."
```

---

### Task 13: Create route files for home tabs

**Files:**
- Create: `app/routes/(authenticated)/(home)/channel_list.tsx`
- Create: `app/routes/(authenticated)/(home)/search.tsx`
- Create: `app/routes/(authenticated)/(home)/mentions.tsx`
- Create: `app/routes/(authenticated)/(home)/saved_messages.tsx`
- Create: `app/routes/(authenticated)/(home)/account.tsx`

- [ ] **Step 1: Create route files**

For `channel_list.tsx`: import from `@screens/home/channel_list`, use `usePropsFromParams`, and run home screen effects (deep link handling, timezone update, event listeners). Create a `useHomeScreenEffects` hook at `app/screens/home/hooks/use_home_effects.ts` adapted from Mattermost.

For `search.tsx`, `mentions.tsx`, `saved_messages.tsx`, `account.tsx`: simple re-exports:
```tsx
export {default} from '@screens/home/search';
```

- [ ] **Step 2: Create app/screens/home/hooks/use_home_effects.ts**

Adapt from Mattermost's `app/screens/home/hooks/use_home_effects.ts`. kChat changes:
- Use `navigateToScreen`, `navigateToRoot` from `@screens/navigation`
- Use `NavigationStore` from `@store/navigation_store` (default import)
- Remove `SecurityManager` (kChat doesn't have it)
- Keep `autoUpdateTimezone`, `getAllServers`, `parseAndHandleDeepLink`, event listeners

- [ ] **Step 3: Delete app/screens/home/index.tsx**

The HomeScreen component with its NavigationContainer and Tab.Navigator is replaced by the `(home)/_layout.tsx` Tabs layout.

```bash
git rm app/screens/home/index.tsx
```

- [ ] **Step 4: Commit**

```bash
git add app/routes/(authenticated)/(home)/ app/screens/home/hooks/
git rm app/screens/home/index.tsx
git commit -m "feat: add home tab route files and useHomeScreenEffects

Move tab logic from home/index.tsx to (home)/_layout.tsx Tabs.
Create channel_list, search, mentions, saved_messages, account routes.
Extract home effects to useHomeScreenEffects hook."
```

---

### Task 14: Create route files for authenticated screens

**Files:**
- Create: `app/routes/(authenticated)/channel.tsx`
- Create: `app/routes/(authenticated)/thread.tsx`
- Create: `app/routes/(authenticated)/code.tsx`
- Create: `app/routes/(authenticated)/latex.tsx`
- Create: `app/routes/(authenticated)/table.tsx`
- Create: `app/routes/(authenticated)/show_translation.tsx`
- Create: `app/routes/(authenticated)/global_threads.tsx`
- Create: `app/routes/(authenticated)/global_drafts.tsx`
- Create: `app/routes/(authenticated)/select_team.tsx`
- Create: `app/routes/(authenticated)/permalink.tsx`
- Create: `app/routes/(authenticated)/call.tsx`
- Create: `app/routes/(authenticated)/custom_status_clear_after.tsx`
- Create: `app/routes/(authenticated)/integration_selector.tsx`
- Create: `app/routes/(authenticated)/ik_evolve.tsx`
- Create: `app/routes/(authenticated)/debug_performance.tsx`

- [ ] **Step 1: Create simple re-export routes**

For screens that don't need header configuration or param extraction, use simple re-export:
```tsx
export {default} from '@screens/code';
```

Apply to: `code.tsx`, `latex.tsx`, `table.tsx`, `show_translation.tsx`, `debug_performance.tsx`, `ik_evolve.tsx`.

- [ ] **Step 2: Create routes with param extraction**

For `channel.tsx`: import from `@screens/channel`, use `usePropsFromParams` to get `channelId`, `displayName`, etc.

For `thread.tsx`: adapt from Mattermost's `thread.tsx` route — uses `useLocalSearchParams` for `rootId`, `channelName`, `title`.

For `permalink.tsx`: import from `@screens/permalink`, extract `permalinkUrl` from params.

For `call.tsx`: import from `@calls/screens/call_screen`, extract `serverUrl`, `channelId` from params.

For `select_team.tsx`: import from `@screens/select_team`, extract props from params.

For `global_threads.tsx`, `global_drafts.tsx`: simple re-exports.

For `custom_status_clear_after.tsx`: import from `@screens/custom_status_clear_after`, extract props.

For `integration_selector.tsx`: import from `@screens/integration_selector`, extract props.

- [ ] **Step 3: Commit**

```bash
git add app/routes/(authenticated)/
git commit -m "feat: add authenticated route files

Routes for channel, thread, code, latex, table, show_translation,
global_threads, global_drafts, select_team, permalink, call,
custom_status_clear_after, integration_selector, ik_evolve,
debug_performance."
```

---

### Task 15: Create route files for modals

**Files:**
- Create: `app/routes/(modals)/edit_post.tsx`
- Create: `app/routes/(modals)/edit_profile.tsx`
- Create: `app/routes/(modals)/edit_server.tsx`
- Create: `app/routes/(modals)/find_channels.tsx`
- Create: `app/routes/(modals)/create_or_edit_channel.tsx`
- Create: `app/routes/(modals)/create_direct_message.tsx`
- Create: `app/routes/(modals)/invite.tsx`
- Create: `app/routes/(modals)/join_team.tsx`
- Create: `app/routes/(modals)/pdf_viewer.tsx`
- Create: `app/routes/(modals)/reschedule_draft.tsx`
- Create: `app/routes/(modals)/dialog_router.tsx`
- Create: `app/routes/(modals)/apps_form.tsx`
- Create: `app/routes/(modals)/custom_status.tsx`
- Create: `app/routes/(modals)/gallery.tsx`
- Create: `app/routes/(modals)/browse_channels.tsx`
- Create: `app/routes/(modals)/feedback_options.tsx`
- Create: `app/routes/(modals)/send_feedback.tsx`
- Create: `app/routes/(modals)/report_problem.tsx`
- Create: `app/routes/(modals)/channel_info/_layout.tsx`
- Create: `app/routes/(modals)/channel_info/index.tsx`
- Create: `app/routes/(modals)/channel_info/channel_add_members.tsx`
- Create: `app/routes/(modals)/channel_info/channel_files.tsx`
- Create: `app/routes/(modals)/channel_info/channel_notification_preferences.tsx`
- Create: `app/routes/(modals)/channel_info/channel_settings.tsx`
- Create: `app/routes/(modals)/channel_info/convert_gm_to_channel.tsx`
- Create: `app/routes/(modals)/channel_info/manage_channel_members.tsx`
- Create: `app/routes/(modals)/channel_info/pinned_messages.tsx`
- Create: `app/routes/(modals)/settings/_layout.tsx`
- Create: `app/routes/(modals)/settings/index.tsx`
- Create: `app/routes/(modals)/settings/settings_advanced.tsx`
- Create: `app/routes/(modals)/settings/settings_display.tsx`
- Create: `app/routes/(modals)/settings/settings_display_clock.tsx`
- Create: `app/routes/(modals)/settings/settings_display_crt.tsx`
- Create: `app/routes/(modals)/settings/settings_display_theme.tsx`
- Create: `app/routes/(modals)/settings/settings_display_timezone.tsx`
- Create: `app/routes/(modals)/settings/settings_display_timezone_select.tsx`
- Create: `app/routes/(modals)/settings/settings_notification.tsx`
- Create: `app/routes/(modals)/settings/settings_notification_auto_responder.tsx`
- Create: `app/routes/(modals)/settings/settings_notification_email.tsx`
- Create: `app/routes/(modals)/settings/settings_notification_mention.tsx`
- Create: `app/routes/(modals)/settings/settings_notification_push.tsx`
- Create: `app/routes/(modals)/settings/settings_notification_call.tsx`

- [ ] **Step 1: Create channel_info group layout**

`channel_info/_layout.tsx`:
```tsx
import {Stack} from 'expo-router';
import {withServerDatabase} from '@database/components';

function ChannelInfoLayout() {
    return <Stack screenOptions={{headerShown: true, headerBackButtonMenuEnabled: false}}/>;
}

export default withServerDatabase(ChannelInfoLayout);
```

- [ ] **Step 2: Create settings group layout**

`settings/_layout.tsx`: same pattern as channel_info.

- [ ] **Step 3: Create channel_info route files**

Each follows the pattern from Mattermost's `(channel_info)/index.tsx`. Use `usePropsFromParams`, `useNavigationHeader` with `getModalHeaderOptions`.

For `index.tsx`: import from `@screens/channel_info`, extract `title`, `channelId`, `groupCallsAllowed`.

For sub-screens (`channel_add_members`, `channel_files`, etc.): import from `@screens/channel_add_members`, `@screens/channel_files`, etc. Extract relevant props from params.

- [ ] **Step 4: Create settings route files**

Each follows the pattern from Mattermost's `(settings)/settings_display.tsx`. Use `useNavigationHeader` with `getHeaderOptions`.

For `index.tsx`: import from `@screens/settings`, use `getModalHeaderOptions`.

For sub-screens: import from `@screens/settings/advanced`, `@screens/settings/display`, etc.

- [ ] **Step 5: Create standalone modal routes**

For `edit_post.tsx`: adapt from Mattermost — uses `usePropsFromParams`, `useNavigationHeader` with `getModalHeaderOptions`.

For `edit_profile.tsx`, `edit_server.tsx`, `find_channels.tsx`, `create_or_edit_channel.tsx`, `create_direct_message.tsx`, `invite.tsx`, `join_team.tsx`, `pdf_viewer.tsx`, `reschedule_draft.tsx`, `dialog_router.tsx`, `apps_form.tsx`, `custom_status.tsx`, `gallery.tsx`, `browse_channels.tsx`, `feedback_options.tsx`, `send_feedback.tsx`, `report_problem.tsx`: each uses `usePropsFromParams` to extract props and passes them to the imported screen component.

- [ ] **Step 6: Commit**

```bash
git add app/routes/(modals)/
git commit -m "feat: add modal route files

Routes for edit_post, edit_profile, edit_server, find_channels,
create_or_edit_channel, create_direct_message, invite, join_team,
pdf_viewer, reschedule_draft, dialog_router, apps_form, custom_status,
gallery, browse_channels, feedback_options, send_feedback,
report_problem. Nested groups for channel_info and settings."
```

---

### Task 16: Create route files for bottom_sheet screens

**Files:**
- Create: `app/routes/(bottom_sheet)/generic_bottom_sheet.tsx`
- Create: `app/routes/(bottom_sheet)/attachment_options.tsx`
- Create: `app/routes/(bottom_sheet)/emoji_picker.tsx`
- Create: `app/routes/(bottom_sheet)/post_options.tsx`
- Create: `app/routes/(bottom_sheet)/post_priority_picker.tsx`
- Create: `app/routes/(bottom_sheet)/reactions.tsx`
- Create: `app/routes/(bottom_sheet)/thread_options.tsx`
- Create: `app/routes/(bottom_sheet)/user_profile.tsx`
- Create: `app/routes/(bottom_sheet)/draft_scheduled_post_options.tsx`
- Create: `app/routes/(bottom_sheet)/scheduled_post_options.tsx`
- Create: `app/routes/(bottom_sheet)/terms_of_service.tsx`
- Create: `app/routes/(bottom_sheet)/call_participants.tsx`
- Create: `app/routes/(bottom_sheet)/call_host_controls.tsx`
- Create: `app/routes/(bottom_sheet)/group_members.tsx`
- Create: `app/routes/(bottom_sheet)/agents_rewrite_options.tsx`
- Create: `app/routes/(bottom_sheet)/ik_quota_exceeded.tsx`
- Create: `app/routes/(bottom_sheet)/ik_reminder.tsx`

- [ ] **Step 1: Create generic_bottom_sheet.tsx**

Adapt from Mattermost's `generic_bottom_sheet.tsx`. kChat-specific:
- Import `BottomSheet` from `@screens/bottom_sheet`
- Import `BottomSheetStore` from `@store/bottom_sheet_store`
- Import `Screens` from `@constants`
- Check if kChat has `isEdgeToEdge` in `@constants/device` — if not, use a constant
- Check if kChat has `NOT_EDGE_TO_EDGE_BOTTOM_SHEET_MARGIN` in `@constants/view` — if not, use `0`

- [ ] **Step 2: Create other bottom_sheet routes**

Each uses `usePropsFromParams` to extract props and passes them to the imported screen:

For `post_options.tsx`:
```tsx
import {usePropsFromParams} from '@hooks/props_from_params';
import PostOptionsScreen, {type PostOptionsProps} from '@screens/post_options';

export default function PostOptionsRoute() {
    const props = usePropsFromParams<PostOptionsProps>();
    return <PostOptionsScreen {...props}/>;
}
```

Apply similar pattern to all other bottom_sheet routes, importing from the corresponding `@screens/...` path.

For `call_participants.tsx` and `call_host_controls.tsx`: import from `@calls/screens/...`.
For `agents_rewrite_options.tsx`: import from `@agents/screens/rewrite_options`.
For `ik_quota_exceeded.tsx`: import from `@screens/ik_quota_exceeded`.
For `ik_reminder.tsx`: import from `@screens/ik_reminder`.

- [ ] **Step 3: Commit**

```bash
git add app/routes/(bottom_sheet)/
git commit -m "feat: add bottom_sheet route files

Routes for generic_bottom_sheet, attachment_options, emoji_picker,
post_options, post_priority_picker, reactions, thread_options,
user_profile, draft_scheduled_post_options, scheduled_post_options,
terms_of_service, call_participants, call_host_controls, group_members,
agents_rewrite_options, ik_quota_exceeded, ik_reminder."
```

---

### Task 17: Update constants/navigation.ts

**Files:**
- Modify: `app/constants/navigation.ts`

- [ ] **Step 1: Add TAB_PRESSED event**

```ts
import keyMirror from '@utils/key_mirror';

const Navigation = keyMirror({
    NAVIGATE_TO_TAB: null,
    NAVIGATION_HOME: null,
    TAB_PRESSED: null,
});

export default Navigation;
```

Remove `NAVIGATION_SHOW_OVERLAY` (no longer needed without RNN overlays).

- [ ] **Step 2: Commit**

```bash
git add app/constants/navigation.ts
git commit -m "refactor: update navigation constants for expo-router

Add TAB_PRESSED event, remove NAVIGATION_SHOW_OVERLAY (no RNN overlays)."
```

---

### Task 18: Update tests

**Files:**
- Delete: `app/screens/navigation.test.ts` (RNN-specific tests)
- Modify: `app/screens/navigation.test.ts` (rewrite for expo-router)
- Delete: `app/screens/index.test.tsx` (already removed in Task 8)

- [ ] **Step 1: Rewrite navigation.test.ts**

The old test file mocks RNN's `Navigation.showModal`, `Navigation.push`, etc. Rewrite to test expo-router functions. Mock `expo-router`'s `router` object:

```ts
const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    dismissAll: jest.fn(),
    dismissTo: jest.fn(),
    canGoBack: jest.fn().mockReturnValue(true),
    canDismiss: jest.fn().mockReturnValue(true),
    setParams: jest.fn(),
};

jest.mock('expo-router', () => ({
    router: mockRouter,
}));
```

Test `navigateToScreen`, `navigateBack`, `navigateToRoot`, `getExpoRouterPath` with the new snake_case screen constants.

- [ ] **Step 2: Update NavigationStore tests**

The NavigationStore test needs to use `updateFromNavigationState` instead of RNN command listeners. Mock navigation state objects with routes and indices.

- [ ] **Step 3: Commit**

```bash
git add app/screens/navigation.test.ts app/store/navigation_store.test.ts
git commit -m "test: update navigation and NavigationStore tests for expo-router

Mock expo-router router instead of RNN Navigation. Test
updateFromNavigationState instead of RNN command listeners."
```

---

### Task 19: Remove RNN from native configuration

**Files:**
- Modify: `ios/Podfile` (remove RNN pod)
- Modify: `ios/Mattermost/AppDelegate.mm` (remove RNN setup)
- Modify: `android/app/build.gradle` (remove RNN dependency)
- Modify: `android/app/src/main/java/.../MainActivity.java` or `kt` (remove RNN)
- Modify: `react-native.config.js` (already minimal, just verify)

**Note:** This task requires a native rebuild (10-30 minutes). Do NOT attempt to run the app until this is complete.

- [ ] **Step 1: Remove RNN from iOS Podfile**

In `ios/Podfile`, remove any line referencing `ReactNativeNavigation`. The pod is auto-linked via autolinking, so removing it from `package.json` (Task 1) should handle this, but verify the Podfile doesn't have manual references.

- [ ] **Step 2: Clean up iOS AppDelegate**

In `ios/Mattermost/AppDelegate.mm` (or `.m`), remove any `ReactNativeNavigation` imports and setup calls. The app should use standard `AppRegistry.registerComponent` (already done in `index.tsx`).

Look for and remove:
- `#import <ReactNativeNavigation/ReactNativeNavigation.h>`
- `[ReactNativeNavigation bootstrap...` calls
- Any RNN-specific launch options

Replace with standard React Native app delegate setup.

- [ ] **Step 3: Remove RNN from Android**

In `android/app/build.gradle`, remove any RNN-specific dependencies if manually added.

In `android/app/src/main/java/.../MainActivity.java` or `MainActivity.kt`, remove RNN-specific code:
- Remove `import com.reactnativenavigation.NavigationActivity;`
- Change class to extend `ReactActivity` instead of `NavigationActivity`
- Remove any RNN-specific overrides

- [ ] **Step 4: Reinstall pods**

Run: `cd ios && RCT_NEW_ARCH_ENABLED=0 pod install`
Expected: Pods installed without RNN.

- [ ] **Step 5: Commit**

```bash
git add ios/ android/
git commit -m "chore: remove React Native Navigation from native configuration

Remove RNN from Podfile, AppDelegate, and MainActivity. App now uses
standard AppRegistry with expo-router."
```

---

### Task 20: Fix TypeScript errors across the codebase

**Files:**
- Various (run `npm run tsc` to find all errors)

**Note:** This task fixes the cascade of type errors from the screen constant rename and navigation adapter rewrite. ~250 files import from `@screens/navigation` and may need updates.

- [ ] **Step 1: Run TypeScript check**

Run: `npm run tsc 2>&1 | head -100`
Expected: Many errors from renamed screen constants and removed RNN functions.

- [ ] **Step 2: Fix screen constant references**

Search and replace PascalCase screen names with snake_case across the codebase. For example:
- `Screens.CHANNEL` still works (the constant name is the same, only the value changed)
- `Screens.HOME` → `Screens.HOME` (value is now `'(home)'`)
- `Screens.INFOMANIAK_LOGIN` → `Screens.IK_LOGIN`
- `Screens.INFOMANIAK_NO_TEAMS` → `Screens.IK_NO_TEAMS`
- `Screens.INFOMANIAK_QUOTA_EXCEEDED` → `Screens.IK_QUOTA_EXCEEDED`
- `Screens.INFOMANIAK_REMINDER` → `Screens.IK_REMINDER`
- `Screens.INFOMANIAK_EVOLVE` → `Screens.IK_EVOLVE`

Use search and replace for the renamed constants.

- [ ] **Step 3: Fix navigation function calls**

Update files that call removed RNN functions:
- `goToScreen(name, title, props, options)` → `navigateToScreen(name, props)`
- `showModal(name, title, props, options)` → `navigateToScreen(name, props)`
- `showOverlay(name, props, options)` → varies (use `navigateToScreen` for bottom_sheet, or conditional rendering for overlays)
- `popTopScreen()` → `navigateBack()`
- `popToRoot()` → `navigateToRoot()`
- `dismissModal()` → `navigateBack()`
- `dismissAllModals()` → `navigateToRoot()`
- `resetToHome(props)` → `navigateToScreen(Screens.HOME, props, true)` (with `reset=true` for replace)
- `resetToOnboarding(props)` → `navigateToScreen(Screens.ONBOARDING, props, true)`
- `resetToInfomaniakLogin(props)` → `navigateToScreen(Screens.IK_LOGIN, props, true)`
- `resetToInfomaniakNoTeams()` → `navigateToScreen(Screens.IK_NO_TEAMS, {}, true)`
- `resetToTeams()` → `navigateToScreen(Screens.SELECT_TEAM, {}, true)`
- `setButtons(componentId, buttons)` → handled by route file header options
- `openToS()` → `navigateToScreen(Screens.TERMS_OF_SERVICE)`
- `showReviewOverlay()` → handled by root layout
- `showShareFeedbackOverlay()` → handled by root layout
- `findChannels(title, theme)` → `navigateToScreen(Screens.FIND_CHANNELS, {closeButtonId: 'close-find-channels'})`
- `openAttachmentOptions(...)` → `navigateToScreen(Screens.ATTACHMENT_OPTIONS, props)`
- `showAppForm(form, context)` → `navigateToScreen(Screens.APPS_FORM, {form, context})`
- `openUserProfileModal(...)` → `navigateToScreen(Screens.USER_PROFILE, props)`

- [ ] **Step 4: Fix RNN imports**

Remove `import {Navigation} from 'react-native-navigation'` from all files. Files that need navigation should import from `@screens/navigation` instead.

Check files that import RNN types (`Options`, `OptionsModalPresentationStyle`, `ComponentWillAppearEvent`, etc.) and replace with expo-router equivalents or remove.

- [ ] **Step 5: Run lint and fix**

Run: `npm run fix`
Expected: Auto-fixable lint issues resolved.

- [ ] **Step 6: Run TypeScript check again**

Run: `npm run tsc 2>&1 | head -40`
Expected: No errors (or very few remaining that need manual fixes).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "fix: update all imports and navigation calls for expo-router

Fix ~250 files that imported from @screens/navigation. Replace RNN
Navigation API calls with expo-router navigateToScreen/navigateBack.
Remove react-native-navigation imports. Update screen constant names
from PascalCase to snake_case values."
```

---

### Task 21: Build and test on iOS

**Files:**
- N/A (verification task)

- [ ] **Step 1: Start Metro bundler**

Run: `npm start`
Expected: Metro starts without errors.

- [ ] **Step 2: Build and run iOS**

Run: `npm run ios`
Expected: App builds and launches in simulator.

- [ ] **Step 3: Verify basic navigation flows**

Test these flows:
1. App launches and shows either login or home (depending on credentials)
2. Login flow works (ik_login screen)
3. Home screen shows with bottom tabs
4. Tapping a channel navigates to channel screen
5. Tapping a thread navigates to thread screen
6. Back navigation works (swipe back on iOS)
7. Modals open and close correctly
8. Bottom sheets open and close correctly

- [ ] **Step 4: Fix any runtime errors**

Address any runtime errors that come up. Common issues:
- Missing route files (add them)
- Param serialization issues (check `propsToParams` / `usePropsFromParams`)
- Missing providers in layout (add to root `_layout.tsx`)
- Theme not propagating (check `withServerDatabase` HOC)

- [ ] **Step 5: Commit any fixes**

```bash
git add -A
git commit -m "fix: resolve runtime issues from expo-router migration

Fix missing route files, param serialization, and provider setup."
```

---

### Task 22: Build and test on Android

**Files:**
- N/A (verification task)

- [ ] **Step 1: Build and run Android**

Run: `npm run android`
Expected: App builds and launches in emulator.

- [ ] **Step 2: Verify same navigation flows as iOS**

Test the same flows as Task 21 Step 3.

- [ ] **Step 3: Fix any Android-specific issues**

Common Android issues:
- Edge-to-edge behavior differences
- Status bar color setting
- Back button handling (hardware back button)

- [ ] **Step 4: Commit any fixes**

```bash
git add -A
git commit -m "fix: resolve Android-specific expo-router issues"
```

---

### Task 23: Test with Mobile MCP

**Files:**
- N/A (verification task)

- [ ] **Step 1: Launch app on simulator**

Use mobile MCP tools to:
1. List available devices
2. Launch the app
3. Take a screenshot to verify it launched correctly
4. Navigate through the main flows (login, home, channel, thread)
5. Test deep links
6. Test modal/bottom sheet presentation

- [ ] **Step 2: Verify all critical user flows**

1. App starts → shows login or home
2. Login → enters credentials → reaches home
3. Home → tap channel → channel screen opens
4. Channel → tap message → thread opens
5. Channel → more options → bottom sheet opens
6. Settings → opens as modal
7. Back navigation works
8. Tab switching works

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "test: verify expo-router migration with mobile MCP

All critical user flows verified: login, home, channel, thread,
modals, bottom sheets, tab switching, back navigation."
```
