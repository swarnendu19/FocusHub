# PWA Icons

This directory should contain the Progressive Web App (PWA) icons for FocusHub.

## Required Icons

The following icon sizes are referenced in `/public/manifest.json`:

### App Icons
- `icon-72x72.png` - 72x72 pixels
- `icon-96x96.png` - 96x96 pixels
- `icon-128x128.png` - 128x128 pixels
- `icon-144x144.png` - 144x144 pixels
- `icon-152x152.png` - 152x152 pixels
- `icon-192x192.png` - 192x192 pixels (standard PWA icon)
- `icon-384x384.png` - 384x384 pixels
- `icon-512x512.png` - 512x512 pixels (standard PWA icon)

### Shortcut Icons
- `timer-96x96.png` - 96x96 pixels (Timer shortcut)
- `achievement-96x96.png` - 96x96 pixels (Achievements shortcut)
- `trophy-96x96.png` - 96x96 pixels (Leaderboard shortcut)

## Design Guidelines

### Brand Colors
- Primary Dark: `#1C1C1C`
- Secondary Gray: `#757373`
- White: `#FFFFFF`
- Light Gray: `#FAFAFA`

### Icon Design
1. **Background**: Use `#1C1C1C` (dark) for light mode icons
2. **Foreground**: Use `#FFFFFF` (white) for icon elements
3. **Style**: Minimalist, clean, modern
4. **Safe Area**: Keep important elements within 80% of icon area (10% padding on all sides)
5. **Format**: PNG with transparency where appropriate

### Maskable Icons
All icons should support the `maskable` purpose, meaning:
- Center the logo/symbol in a safe zone (80% of icon size)
- Provide a full-bleed background color
- Ensure no important elements are cut off when masked

## Generating Icons

You can generate all required icon sizes from a single source file using tools like:

### Online Tools
- [PWA Asset Generator](https://www.pwabuilder.com/imageGenerator)
- [Favicon Generator](https://realfavicongenerator.net/)

### Command Line
```bash
# Using ImageMagick
convert source-icon.png -resize 72x72 icon-72x72.png
convert source-icon.png -resize 96x96 icon-96x96.png
convert source-icon.png -resize 128x128 icon-128x128.png
convert source-icon.png -resize 144x144 icon-144x144.png
convert source-icon.png -resize 152x152 icon-152x152.png
convert source-icon.png -resize 192x192 icon-192x192.png
convert source-icon.png -resize 384x384 icon-384x384.png
convert source-icon.png -resize 512x512 icon-512x512.png
```

### Using npm packages
```bash
# Install pwa-asset-generator
npm install -g pwa-asset-generator

# Generate all icons
pwa-asset-generator source-icon.png ./public/icons --icon-only --favicon
```

## Icon Concept Ideas

Consider these concepts for the FocusHub icon:

1. **Timer Focus**: A stylized timer/stopwatch icon
2. **Gamification**: Trophy, star, or achievement badge
3. **Productivity**: Arrow pointing upward, growth chart
4. **Combination**: Timer with XP bar or level badge

## Testing

After adding icons, test:
1. Icons appear correctly on home screen when installed
2. Splash screen displays properly on app launch
3. Icons are crisp on high-DPI displays
4. Maskable icons don't lose important elements when masked

## Apple Touch Icon

The Apple touch icon is referenced in `/app/layout.tsx`:
```html
<link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
```

This will be used for iOS home screen shortcuts.

## Current Status

⚠️ **Icons are not yet created**. The PWA will work without them, but the install prompt and home screen icon will use default browser icons until custom icons are added.

To complete the PWA setup:
1. Design or source a FocusHub logo/icon (512x512 source recommended)
2. Generate all required sizes
3. Place icons in this directory
4. Test PWA installation on multiple devices
