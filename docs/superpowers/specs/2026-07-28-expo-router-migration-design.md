# Design: Migrate kChat from React Native Navigation to Expo Router

**Date:** 2026-07-28
**Author:** Boris (with AI assistance)
**Status:** Approved

## Context

kChat mobile uses React Native Navigation (RNN) v7.45 for navigation. RNN is less maintained and not compatible with React Native's New Architecture. The goal is to migrate to Expo Router, which is better maintained and New Architecture compatible, following the same migration pattern as the Mattermost upstream at `/Users/boris/dev/Mattermost/mattermost-mobile`.

This is step 1 of a larger plan:
1. **Migrate to Expo Router** (this spec) — on current RN 0.77.3 / Expo SDK 52
2. Enable New Architecture
3. Bump React Native version

## Current State

| | kChat (current) | Mattermost (target reference) |
|---|---|---|
| RN version | 0.77.3 | 0.83.9 |
| React | 18.3.1 | 19.2.6 |
| Expo SDK | 52 | 55 |
| Navigation | react-native-navigation 7.45 | expo-router 55.0.14 |
| Entry point | `index.ts` → `Navigation.events().registerAppLaunchedListener` | `index.tsx` → `ExpoRoot` with `require.context('./app/routes')` |
| Routes | `app/screens/` with RNN lazy registration | `app/routes/` file-based with `(authenticated)`, `(unauthenticated)`, `(modals)`, `(bottom_sheet)` groups |
| Screen names | PascalCase (`Channel`, `Server`) | snake_case (`channel`, `server`) |
| Nav helpers | `goToScreen`, `showModal`, `showOverlay` (RNN API) | `navigateToScreen`, `navigateBack` (expo-router `router.push/replace/dismiss`) |
| NavigationStore | RNN command listeners | Expo Router state tracking via `updateFromNavigationState` |
| Launch | `initialLaunch()` → `resetToHome/resetToOnboarding` | `determineInitialExpoRoute()` → returns route + params |
| New Arch | Disabled (`RCT_NEW_ARCH_ENABLED=0`) | Enabled |

**Scale:** ~250 files import from `@screens/navigation`, ~36 files import from `react-native-navigation` directly.

## Decisions

1. **Screen naming:** Switch to snake_case (e.g., `CHANNEL='channel'`) to match expo-router file-based conventions. Larger diff but cleaner long-term.
2. **Migration strategy:** Full RNN removal in one MR. No side-by-side coexistence.
3. **Screen scope:** Migrate ALL kChat screens including kChat-specific ones (ik_login, ik_no_teams, ik_evolve, ik_quota_exceeded, ik_reminder, debug_performance). Skip Mattermost-only screens (playbooks, channel_bookmark, mm_blocks_content, agent_chat, agent_threads_list, data_erased, sso, about).

## Route Structure

```
app/routes/
  _layout.tsx              # Root: providers, init, splash screen
  index.tsx                # Entry: determine initial route via determineInitialExpoRoute()
  +native-intent.ts        # Deep link handler (replaces RNN Linking)

  (unauthenticated)/
    _layout.tsx            # Stack with auth redirect
    onboarding.tsx
    mfa.tsx
    forgot_password.tsx
    ik_login.tsx           # kChat-specific: Infomaniak login
    ik_no_teams.tsx        # kChat-specific: no teams

  (authenticated)/
    _layout.tsx            # withServerDatabase wrapper + auth redirect
    (home)/
      _layout.tsx          # Bottom tabs (channel_list, search, mentions, saved, account)
      channel_list.tsx     # Home tab (was Screens.HOME)
      search.tsx
      mentions.tsx
      saved_messages.tsx
      account.tsx
    channel.tsx
    thread.tsx
    code.tsx
    latex.tsx
    table.tsx
    show_translation.tsx
    global_threads.tsx
    global_drafts.tsx
    select_team.tsx
    permalink.tsx
    call.tsx
    custom_status_clear_after.tsx
    integration_selector.tsx
    ik_evolve.tsx          # kChat-specific
    debug_performance.tsx

  (modals)/
    _layout.tsx            # Modal presentation
    edit_post.tsx
    edit_profile.tsx
    edit_server.tsx
    find_channels.tsx
    create_or_edit_channel.tsx
    create_direct_message.tsx
    invite.tsx
    join_team.tsx
    pdf_viewer.tsx
    reschedule_draft.tsx
    dialog_router.tsx
    apps_form.tsx
    channel_info/          # Nested group
      _layout.tsx
      index.tsx
      channel_add_members.tsx
      channel_files.tsx
      channel_notification_preferences.tsx
      channel_settings.tsx
      convert_gm_to_channel.tsx
      manage_channel_members.tsx
      pinned_messages.tsx
    settings/              # Nested group
      _layout.tsx
      index.tsx
      settings_advanced.tsx
      settings_display.tsx
      settings_display_clock.tsx
      settings_display_crt.tsx
      settings_display_theme.tsx
      settings_display_timezone.tsx
      settings_display_timezone_select.tsx
      settings_notification.tsx
      settings_notification_auto_responder.tsx
      settings_notification_email.tsx
      settings_notification_mention.tsx
      settings_notification_push.tsx
      settings_notification_call.tsx
    custom_status.tsx
    gallery.tsx
    browse_channels.tsx
    feedback_options.tsx
    send_feedback.tsx
    report_problem.tsx

  (bottom_sheet)/
    _layout.tsx            # Transparent modal presentation
    generic_bottom_sheet.tsx
    attachment_options.tsx
    emoji_picker.tsx
    post_options.tsx
    post_priority_picker.tsx
    reactions.tsx
    thread_options.tsx
    user_profile.tsx
    draft_scheduled_post_options.tsx
    scheduled_post_options.tsx
    terms_of_service.tsx
    call_participants.tsx
    call_host_controls.tsx
    group_members.tsx
    agents_rewrite_options.tsx
    ik_quota_exceeded.tsx  # kChat-specific
    ik_reminder.tsx        # kChat-specific
```

**Overlays** (rendered in root `_layout.tsx`, not routes): `InAppNotification`, `ReviewApp`, `ShareFeedback`, `SnackBar`.

## Navigation Adapter

`app/screens/navigation.ts` is rewritten as an expo-router adapter. Public function names are preserved where possible to minimize changes across ~250 importing files.

| RNN function | Expo Router replacement |
|---|---|
| `goToScreen(name, title, passProps, options)` | `navigateToScreen(screen, props, reset)` via `router.push/replace` |
| `showModal(name, title, passProps, options)` | `navigateToScreen(screen, props)` — group `(modals)` handles presentation |
| `showOverlay(name, passProps, options)` | Rendered in root `_layout.tsx` or `navigateToScreen` to `(bottom_sheet)` |
| `popTopScreen()` / `popTo()` / `popToRoot()` | `navigateBack()` via `router.back()` / `router.dismissTo()` |
| `dismissModal()` / `dismissAllModals()` | `router.dismiss()` / `router.dismissAll()` |
| `dismissAllModalsAndPopToScreen()` | `dismissAllRoutesAndPopToScreen()` via `router.dismissTo()` |
| `resetToHome()` / `resetToOnboarding()` | `router.replace()` to determined route |
| `setButtons()` | Handled by `Stack.Screen` options in layouts |
| `bottomSheet()` | `BottomSheetStore` + `navigateToScreen(Screens.GENERIC_BOTTOM_SHEET)` |
| `openAsBottomSheet()` | `navigateToScreen` to `(bottom_sheet)/...` |
| `showReviewOverlay()` / `showShareFeedbackOverlay()` | Conditional rendering in root `_layout.tsx` |

**Parameter serialization:** Complex objects (theme, launch props) are serialized to JSON via `propsToParams()` since expo-router only supports string params.

## Initialization and Launch

### `index.tsx` (replaces `index.ts`)

```tsx
export function App() {
    const ctx = require.context('./app/routes');
    return <ExpoRoot context={ctx} />;
}
AppRegistry.registerComponent('kChat', () => App);
```

### `app/init/app.ts`

- `initialize()` keeps DB/Network/WebSocket logic
- No more `registerScreens()` or `registerNavigationListeners()`
- `start()` removed — init happens in root `_layout.tsx` via `useDidMount`

### `app/init/launch.ts`

- Replaces `initialLaunch()` / `launchApp()` with `determineInitialExpoRoute()` returning `{route, params}`
- `launchToHome()` becomes `determineAuthenticatedRoute()` returning route instead of calling `resetToHome()`
- `index.tsx` route calls `determineInitialExpoRoute()` and does `<Redirect>`

## Native Configuration

### `babel.config.js`

- `babel-preset-expo` replaces `module:@react-native/babel-preset`
- Add alias `@routes` → `./app/routes`

### `metro.config.js`

- Add `unstable_allowRequireContext: true` in `transformer` (required by expo-router for `require.context()`)

### `app.json`

```json
{
  "name": "kChat",
  "displayName": "kChat",
  "expo": {
    "scheme": "kchat",
    "plugins": ["expo-router"]
  }
}
```

### iOS

- Remove RNN from `Podfile`
- Clean up `AppDelegate.mm` (remove `ReactNativeNavigation`)
- `RCT_NEW_ARCH_ENABLED=0` kept for now (New Arch is step 2)

### Android

- Remove RNN from `android/app/build.gradle`
- Clean up `MainActivity.java`/`kt`
- `react-native.config.js` — remove RNN config

## NavigationStore

The current `NavigationStore` uses RNN listeners (`registerCommandListener`, `registerScreenPoppedListener`, etc.). The new version uses `updateFromNavigationState(navState)` called from the root `_layout.tsx` which listens to expo-router state changes and extracts screen IDs from route keys (same pattern as Mattermost).

Adds `useCurrentScreen()` hook for components to observe the current screen.

## Dependencies

### Add

- `expo-router@^4.0.22` (compatible with Expo SDK 52 / RN 0.77)
- `expo-splash-screen` (SDK 52 compatible)
- `expo-linking` (SDK 52 compatible)
- `expo-constants` (SDK 52 compatible)
- `@react-navigation/native-stack`
- `@react-navigation/drawer`

### Remove

- `react-native-navigation` 7.45
- `@react-navigation/stack` (replaced by native-stack)

## Files to Modify

1. **`index.ts`** → becomes `index.tsx` with `ExpoRoot` + `AppRegistry.registerComponent`
2. **`app/screens/navigation.ts`** → rewritten with expo-router functions
3. **`app/screens/index.tsx`** → deleted (lazy registration no longer needed)
4. **`app/init/app.ts`** → `initialize()` only, no `registerScreens()`/`registerNavigationListeners()`
5. **`app/init/launch.ts`** → rewritten with `determineInitialExpoRoute()`
6. **`app/store/navigation_store.ts`** → rewritten with `updateFromNavigationState()`
7. **`app/constants/screens.ts`** → snake_case + new Set constants
8. **`types/screens/navigation.ts`** → remove RNN import, add `| '(modals)'`
9. **`app.json`** → add expo scheme + plugins
10. **`babel.config.js`** → `babel-preset-expo`, add `@routes` alias
11. **`metro.config.js`** → add `unstable_allowRequireContext: true`
12. **`app/screens/home/index.tsx`** → logic moves to `(home)/_layout.tsx` with `Tabs`

## Home Screen Migration

- `app/screens/home/index.tsx` → deleted (tab logic goes to `(authenticated)/(home)/_layout.tsx`)
- `app/screens/home/channel_list/` → imported by `channel_list.tsx` route
- `app/screens/home/account/` → imported by `account.tsx` route
- `app/screens/home/search/` → imported by `search.tsx` route
- `app/screens/home/recent_mentions/` → imported by `mentions.tsx` route
- `app/screens/home/saved_messages/` → imported by `saved_messages.tsx` route

## Tests

- Delete `app/screens/index.test.tsx` (lazy registration test)
- Rewrite `app/screens/navigation.test.ts` for expo-router functions
- Rewrite `app/store/navigation_store` tests for new store
- Adapt `app/screens/navigation.test.ts`

## Risks

1. **expo-router v4 vs v55:** Mattermost uses expo-router v55 (SDK 55, RN 0.83). We use v4 (SDK 52, RN 0.77). API is mostly the same; minor differences handled case by case.
2. **Parameter serialization:** `propsToParams()` serializes everything to string (JSON.stringify for objects). Route params are strings only.
3. **Overlays:** RNN overlays (ReviewApp, ShareFeedback, InAppNotification, SnackBar) become components rendered in root `_layout.tsx`.
4. **`enableScreens(false)` iOS:** kChat currently disables native screens on iOS due to RNN/react-navigation conflict. With expo-router only, this should no longer be necessary, but needs testing.
5. **~250 files** import `@screens/navigation` — public function names are preserved, so most files won't need changes.

## kChat-Specific Screens (not in Mattermost)

- `ik_login` → `(unauthenticated)/ik_login.tsx`
- `ik_no_teams` → `(unauthenticated)/ik_no_teams.tsx`
- `ik_evolve` → `(authenticated)/ik_evolve.tsx`
- `ik_quota_exceeded` → `(bottom_sheet)/ik_quota_exceeded.tsx`
- `ik_reminder` → `(bottom_sheet)/ik_reminder.tsx`
- `debug_performance` → `(authenticated)/debug_performance.tsx`
- `feedback_options` → `(modals)/feedback_options.tsx`
- `send_feedback` → `(modals)/send_feedback.tsx`

## Mattermost-Only Screens (skipped)

- All playbooks screens (playbook_run, playbook_runs, etc.)
- `channel_bookmark`
- `mm_blocks_content`
- `agent_chat`, `agent_threads_list`
- `data_erased`
- `sso` (kChat uses ik_login instead)
- `about`
