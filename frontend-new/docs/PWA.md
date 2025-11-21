# Progressive Web App (PWA) Documentation

FocusHub is configured as a Progressive Web App, providing an app-like experience with offline functionality, installability, and enhanced performance.

## Overview

### What is a PWA?

A Progressive Web App combines the best of web and native apps:
- **Installable**: Can be installed on home screen like a native app
- **Offline-first**: Works without internet connection
- **Fast**: Loads instantly with service worker caching
- **Engaging**: Native app-like experience with smooth animations
- **Safe**: Served over HTTPS with secure caching

### FocusHub PWA Features

✅ **Installable** - Add to home screen on mobile and desktop
✅ **Offline Support** - Continue working without internet
✅ **Background Sync** - Sync timer data when connection restored
✅ **Push Notifications** - Achievement unlocks and timer reminders
✅ **App Shortcuts** - Quick access to timer, achievements, leaderboard
✅ **Share Target** - Share time logs from other apps
✅ **Update Notifications** - Automatic app updates with user prompt

## File Structure

```
public/
├── manifest.json           # PWA manifest configuration
├── sw.js                   # Service worker for caching and offline
├── offline.html            # Offline fallback page
└── icons/                  # App icons (various sizes)

components/pwa/
├── PWAInstallPrompt.tsx           # Install prompt UI
├── ServiceWorkerRegistration.tsx  # SW registration logic
└── index.ts                       # Barrel export

app/
└── layout.tsx              # PWA meta tags and component integration
```

## Configuration Files

### 1. Manifest (`/public/manifest.json`)

The Web App Manifest provides metadata about the application:

```json
{
  "name": "FocusHub - Gamified Time Tracking",
  "short_name": "FocusHub",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#FFFFFF",
  "theme_color": "#1C1C1C",
  "orientation": "portrait-primary"
}
```

**Key Properties:**
- `name` - Full app name (shown in install prompt)
- `short_name` - Short name (shown on home screen)
- `start_url` - URL to open when app launches
- `display: "standalone"` - Hide browser UI for app-like experience
- `theme_color` - Browser theme color
- `icons` - Array of icon sizes for different contexts

### 2. Service Worker (`/public/sw.js`)

The service worker handles offline functionality and caching:

**Caching Strategies:**

1. **Precache (Install)** - Cache shell assets immediately:
   - Static pages: `/`, `/projects`, `/achievements`, etc.
   - Manifest and offline page

2. **Cache First** - Static assets (JS, CSS, images):
   - Check cache first
   - Fetch from network if not cached
   - Cache successful network responses

3. **Network First** - Dynamic content and API calls:
   - Try network first (fresh data)
   - Fall back to cache if offline
   - Cache successful responses for offline use

4. **Offline Fallback** - Navigation requests:
   - Try network for latest content
   - Show cached page if available
   - Display `/offline.html` as last resort

**Cache Names:**
```javascript
const CACHE_NAME = 'focushub-v1';           // Static assets
const RUNTIME_CACHE = 'focushub-runtime-v1'; // Runtime pages
const API_CACHE = 'focushub-api-v1';        // API responses
```

**Background Sync:**
```javascript
// Sync timer data when connection restored
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-timer-data') {
    event.waitUntil(syncTimerData());
  }
});
```

### 3. Offline Page (`/public/offline.html`)

Standalone HTML page shown when:
- User navigates while offline
- Requested page isn't cached
- Network request fails

Features:
- Clean, branded UI matching app design
- Auto-retry connection every 5 seconds
- List of available offline features
- Retry button for manual refresh

## Components

### PWAInstallPrompt

Interactive install prompt shown to users on supporting browsers.

**Features:**
- Detects `beforeinstallprompt` event
- Shows custom UI (not browser default)
- Respects user dismissal (7-day cooldown)
- Auto-hides if already installed
- Highlights app benefits (offline, fast, native feel)

**Location:** Appears as bottom toast on first visit
**Dismissal:** Stored in `localStorage` with timestamp

```typescript
// Usage (already included in layout.tsx)
import { PWAInstallPrompt } from "@/components/pwa";

<PWAInstallPrompt />
```

### ServiceWorkerRegistration

Handles service worker lifecycle and updates.

**Features:**
- Registers service worker in production only
- Checks for updates hourly
- Shows update notification when available
- Handles update installation with page reload
- Skips waiting on user confirmation

**Update Flow:**
1. New service worker detected
2. Show "Update Available" notification
3. User clicks "Update" button
4. Tell waiting worker to skip waiting
5. Reload page with new version

```typescript
// Usage (already included in layout.tsx)
import { ServiceWorkerRegistration } from "@/components/pwa";

<ServiceWorkerRegistration />
```

## Installation Instructions

### For Users

#### Desktop (Chrome, Edge, Brave)
1. Visit FocusHub in browser
2. Look for install icon in address bar (⊕)
3. Click "Install FocusHub"
4. App opens in standalone window

#### Mobile (Android)
1. Visit FocusHub in Chrome
2. Tap "Add to Home Screen" from menu
3. Confirm installation
4. App icon appears on home screen

#### Mobile (iOS)
1. Visit FocusHub in Safari
2. Tap Share button (↑)
3. Scroll down and tap "Add to Home Screen"
4. Confirm and name the app

### For Developers

#### Testing PWA Locally

1. **Build for production:**
   ```bash
   bun run build
   bun run start
   ```
   *Service worker only registers in production mode*

2. **Test installation:**
   - Open DevTools → Application → Manifest
   - Check manifest properties
   - Click "Add to home screen" to test

3. **Test service worker:**
   - DevTools → Application → Service Workers
   - Check registration status
   - Test "Update on reload" option
   - Simulate offline mode

4. **Test offline:**
   - DevTools → Network → Offline checkbox
   - Navigate app while offline
   - Verify cached pages load
   - Check offline fallback

#### Chrome DevTools

**Application Panel:**
- **Manifest** - View parsed manifest, test installability
- **Service Workers** - Status, update, unregister
- **Storage** - Cache storage inspection
- **Clear storage** - Reset all PWA data

**Lighthouse:**
- Run PWA audit
- Check installability criteria
- Verify offline functionality
- Review best practices

#### Testing Checklist

- [ ] Manifest validates (no console errors)
- [ ] Service worker registers successfully
- [ ] App is installable (install prompt appears)
- [ ] Offline page displays when offline
- [ ] Cached pages load without network
- [ ] Update notification works
- [ ] Icons display correctly
- [ ] App shortcuts work
- [ ] Theme color applies
- [ ] Splash screen shows (mobile)

## Caching Strategy

### What Gets Cached

**Immediately (on install):**
- Shell: `/`, `/offline`, `/manifest.json`
- Core pages: `/projects`, `/achievements`, `/leaderboard`, `/xp`, `/skills`, `/profile`

**On first visit (runtime):**
- Page content (HTML)
- JavaScript bundles
- CSS stylesheets
- Images and fonts

**On API calls:**
- Timer data
- Projects and tasks
- Achievements and XP
- User profile

### Cache Invalidation

**Automatic:**
- Service worker version change (CACHE_NAME update)
- Old caches deleted on activation

**Manual:**
```javascript
// Clear all caches
navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHE' });
```

**Cache Limits:**
- Chrome: ~60% of device storage
- Firefox: ~50% of device storage
- Oldest entries evicted when full

## Background Sync

Background sync queues actions when offline and executes when connection restored.

**Current Implementation:**
```javascript
// Register sync when starting timer offline
navigator.serviceWorker.ready.then(registration => {
  registration.sync.register('sync-timer-data');
});

// Service worker handles sync
self.addEventListener('sync', async (event) => {
  if (event.tag === 'sync-timer-data') {
    // Send pending timer data to server
    await syncTimerData();
  }
});
```

**Planned Sync Tags:**
- `sync-timer-data` - Timer sessions
- `sync-achievements` - Achievement unlocks
- `sync-profile` - Profile updates

## Push Notifications

Service worker supports push notifications for:
- Achievement unlocks
- Level ups
- Timer reminders
- Daily streak updates

**Setup:**
```javascript
// Request notification permission
const permission = await Notification.requestPermission();

// Subscribe to push notifications
const subscription = await registration.pushManager.subscribe({
  userVisibleOnly: true,
  applicationServerKey: VAPID_PUBLIC_KEY
});

// Send subscription to backend
await fetch('/api/notifications/subscribe', {
  method: 'POST',
  body: JSON.stringify(subscription)
});
```

**Note:** Backend integration required for actual push delivery.

## App Shortcuts

Three quick-action shortcuts configured:

1. **Start Timer** - `/projects?action=start-timer`
2. **View Achievements** - `/achievements`
3. **Leaderboard** - `/leaderboard`

**Access:**
- Android: Long-press app icon
- Windows: Right-click taskbar icon
- macOS: Right-click dock icon

## Share Target

FocusHub can receive shared content from other apps (Android).

**Accepts:**
- Text (for task descriptions)
- URLs (for project references)

**Configuration:**
```json
"share_target": {
  "action": "/share",
  "method": "POST",
  "enctype": "multipart/form-data",
  "params": {
    "title": "title",
    "text": "text",
    "url": "url"
  }
}
```

**Note:** `/share` route handler needs implementation.

## Troubleshooting

### Install Prompt Doesn't Appear

**Possible causes:**
- Not using HTTPS (required)
- Service worker not registered
- Missing manifest
- App already installed
- Browser doesn't support (Firefox)

**Solutions:**
1. Check console for errors
2. Verify manifest in DevTools
3. Ensure service worker registered
4. Test in Chrome/Edge

### Service Worker Not Updating

**Possible causes:**
- Browser caching service worker file
- Update on reload not enabled

**Solutions:**
1. DevTools → Application → Service Workers → "Update on reload"
2. Hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
3. Unregister and re-register service worker
4. Clear all caches

### Offline Page Not Showing

**Possible causes:**
- Service worker not activated
- Offline page not cached
- Network request not failing

**Solutions:**
1. Check service worker status
2. Verify offline.html in cache
3. Test with DevTools offline mode

### Icons Not Displaying

**Possible causes:**
- Icons not created yet (see `/public/icons/README.md`)
- Wrong file paths in manifest
- Incorrect icon sizes

**Solutions:**
1. Generate all required icon sizes
2. Verify paths match manifest
3. Test with Chrome DevTools Manifest panel

## Performance

### Lighthouse Scores (Target)

- ✅ **Performance:** 90+
- ✅ **Accessibility:** 90+
- ✅ **Best Practices:** 90+
- ✅ **SEO:** 90+
- ✅ **PWA:** All checks passing

### Optimization Tips

1. **Reduce Cache Size:**
   - Only cache essential assets
   - Set max age for API cache
   - Implement cache size limits

2. **Improve Cache Hit Rate:**
   - Precache common routes
   - Use consistent URLs (no query params for cache keys)
   - Version cache names for updates

3. **Speed Up Install:**
   - Minimize precache list
   - Use lazy loading for non-critical assets
   - Implement streaming service worker

## Security

### Best Practices

✅ **HTTPS Only** - Required for service workers
✅ **Content Security Policy** - Restrict inline scripts
✅ **Subresource Integrity** - Verify cached assets
✅ **Scope Restriction** - Service worker scoped to `/`
✅ **Update Mechanism** - Automatic security updates

### Risks to Avoid

❌ Caching sensitive user data
❌ Storing auth tokens in cache
❌ Overly broad cache scope
❌ Missing cache invalidation
❌ Outdated service worker

## Browser Support

| Browser | PWA Install | Service Workers | Offline | Push |
|---------|------------|-----------------|---------|------|
| Chrome  | ✅ Yes     | ✅ Yes          | ✅ Yes  | ✅ Yes |
| Edge    | ✅ Yes     | ✅ Yes          | ✅ Yes  | ✅ Yes |
| Firefox | ❌ No*     | ✅ Yes          | ✅ Yes  | ✅ Yes |
| Safari  | ⚠️ Limited | ✅ Yes          | ✅ Yes  | ❌ No |
| Opera   | ✅ Yes     | ✅ Yes          | ✅ Yes  | ✅ Yes |
| Brave   | ✅ Yes     | ✅ Yes          | ✅ Yes  | ✅ Yes |

*Firefox supports service workers and offline but doesn't show install prompt

## Next Steps

### Immediate
- [ ] Generate PWA icons (see `/public/icons/README.md`)
- [ ] Test PWA installation on multiple devices
- [ ] Verify offline functionality

### Future Enhancements
- [ ] Implement `/share` route for share target
- [ ] Add background sync for all offline actions
- [ ] Implement push notification backend
- [ ] Add periodic background sync for updates
- [ ] Create splash screens for iOS

## Resources

- [MDN: Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [web.dev: PWA Checklist](https://web.dev/pwa-checklist/)
- [PWABuilder](https://www.pwabuilder.com/)
- [Service Worker Cookbook](https://serviceworke.rs/)
- [Workbox (Google)](https://developers.google.com/web/tools/workbox)

## Support

For PWA-related issues:
1. Check browser console for errors
2. Inspect Application panel in DevTools
3. Review service worker status and caches
4. Test in Chrome/Edge for best PWA support
5. File issues on GitHub repository
