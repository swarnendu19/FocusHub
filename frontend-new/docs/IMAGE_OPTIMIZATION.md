# Image Optimization Guide

This guide covers best practices for using images in FocusHub with Next.js Image component for optimal performance.

## Table of Contents

- [Why Optimize Images?](#why-optimize-images)
- [Next.js Image Component](#nextjs-image-component)
- [Custom Image Components](#custom-image-components)
- [Image Formats](#image-formats)
- [Sizing and Responsive Images](#sizing-and-responsive-images)
- [Loading Strategies](#loading-strategies)
- [Best Practices](#best-practices)
- [Common Patterns](#common-patterns)

## Why Optimize Images?

Images are often the heaviest assets on a webpage. Proper optimization provides:

✅ **Faster Load Times** - Smaller files download quicker
✅ **Better Core Web Vitals** - Improved LCP (Largest Contentful Paint)
✅ **Reduced Bandwidth** - Lower hosting costs and data usage
✅ **Improved SEO** - Better performance scores
✅ **Better UX** - Smoother experience, especially on mobile

## Next.js Image Component

Next.js provides an optimized `Image` component with automatic optimization:

### Basic Usage

```tsx
import Image from "next/image";

export function MyComponent() {
  return (
    <Image
      src="/hero-image.jpg"
      alt="Description of image"
      width={800}
      height={600}
      priority
    />
  );
}
```

### Key Features

1. **Automatic Optimization**
   - Converts to modern formats (WebP, AVIF)
   - Lazy loads by default
   - Responsive image srcset
   - Prevents layout shift

2. **Size Optimization**
   - Generates multiple sizes
   - Serves appropriate size per device
   - Reduces file size by 30-80%

3. **Performance**
   - Only loads when in viewport
   - Prioritizes above-the-fold images
   - Caches optimized images

## Custom Image Components

FocusHub provides specialized image components in `/components/ui/OptimizedImage.tsx`:

### OptimizedImage

Full-featured image component with loading states and error handling.

```tsx
import { OptimizedImage } from "@/components/ui";

<OptimizedImage
  src="/achievement-badge.png"
  alt="First Timer Achievement"
  width={200}
  height={200}
  aspectRatio="square"
  objectFit="cover"
  fallbackSrc="/default-achievement.png"
/>
```

**Props:**
- `alt` (required) - Accessibility text
- `src` (required) - Image source
- `width` / `height` - Dimensions
- `aspectRatio` - square | video | portrait | landscape
- `objectFit` - contain | cover | fill | none
- `fallbackSrc` - Fallback if image fails to load
- `priority` - Load image immediately (for above-the-fold)
- `quality` - 1-100, default 85

**Features:**
- Loading spinner while image loads
- Error fallback UI
- Blur placeholder
- Smooth fade-in transition

### AvatarImage

Specialized for user avatars with initials fallback.

```tsx
import { AvatarImage } from "@/components/ui";

<AvatarImage
  src={user?.avatarUrl}
  alt={user?.name || "User"}
  fallbackInitials="JD"
  size="lg"
/>
```

**Sizes:**
- `sm` - 32x32px (8rem)
- `md` - 48x48px (12rem) - default
- `lg` - 64x64px (16rem)
- `xl` - 96x96px (24rem)

**Fallback:**
- Shows gradient circle with initials
- Uses first letter of alt text if no initials provided
- Matches FocusHub color scheme

### LogoImage

Optimized for logos and brand images.

```tsx
import { LogoImage } from "@/components/ui";

<LogoImage
  src="/focushub-logo.svg"
  alt="FocusHub"
  width={120}
  height={40}
  priority
/>
```

**Features:**
- SVG unoptimized (served as-is)
- High quality (100)
- Maintains aspect ratio
- Priority loading for header logos

## Image Formats

### Recommended Formats

| Use Case | Format | When to Use |
|----------|--------|-------------|
| Photos | JPG/WebP | Photographs, gradients, complex images |
| Graphics | PNG/WebP | Transparency needed, sharp edges |
| Logos | SVG | Scalable, small file size, crisp at any size |
| Icons | SVG | UI icons, always sharp |
| Screenshots | PNG/WebP | Text clarity important |

### Next.js Automatic Conversion

Next.js automatically converts images to modern formats:
- **WebP** - 25-35% smaller than JPG/PNG, supported everywhere
- **AVIF** - 50% smaller than JPG, limited support

Configured in `next.config.ts`:
```typescript
images: {
  formats: ['image/webp', 'image/avif'],
}
```

## Sizing and Responsive Images

### Fixed Size Images

When you know exact dimensions:

```tsx
<Image
  src="/icon.png"
  alt="Timer icon"
  width={48}
  height={48}
/>
```

### Responsive Images (fill)

For images that fill their container:

```tsx
<div className="relative w-full h-64">
  <Image
    src="/banner.jpg"
    alt="Dashboard banner"
    fill
    className="object-cover"
    sizes="100vw"
  />
</div>
```

**Important:** Parent must have `position: relative` and defined dimensions.

### Responsive Sizes

Tell Next.js what sizes to generate:

```tsx
<Image
  src="/responsive.jpg"
  alt="Responsive image"
  width={1200}
  height={800}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

**Sizes Syntax:**
- `(max-width: 768px) 100vw` - Mobile: full width
- `(max-width: 1200px) 50vw` - Tablet: half width
- `33vw` - Desktop: one-third width

## Loading Strategies

### Priority (Above the Fold)

Load immediately, don't lazy load:

```tsx
<Image
  src="/hero.jpg"
  alt="Hero image"
  width={1920}
  height={1080}
  priority
/>
```

**Use for:**
- Hero images
- Logo in header
- LCP (Largest Contentful Paint) image

### Lazy Loading (Default)

Load when scrolled into view:

```tsx
<Image
  src="/below-fold.jpg"
  alt="Content image"
  width={800}
  height={600}
  // loading="lazy" is default
/>
```

**Use for:**
- Below-the-fold content
- Gallery images
- List items

### Blur Placeholder

Show blurred version while loading:

```tsx
<Image
  src="/photo.jpg"
  alt="Photo"
  width={800}
  height={600}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..."
/>
```

**Generate blur data URL:**
```bash
# Using sharp
const sharp = require('sharp');
const buffer = await sharp('image.jpg')
  .resize(10)
  .blur()
  .toBuffer();
const base64 = buffer.toString('base64');
```

### External Images

Configure allowed domains in `next.config.ts`:

```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'images.example.com',
      port: '',
      pathname: '/uploads/**',
    },
  ],
}
```

## Best Practices

### ✅ Do's

1. **Always provide `alt` text**
   ```tsx
   <Image src="..." alt="User completing a timer session" />
   ```

2. **Use `priority` for above-the-fold images**
   ```tsx
   <Image src="/hero.jpg" alt="..." priority />
   ```

3. **Specify width and height**
   ```tsx
   <Image src="..." alt="..." width={800} height={600} />
   ```

4. **Use appropriate formats**
   - Photos: JPG/WebP
   - Graphics with transparency: PNG/WebP
   - Logos/icons: SVG

5. **Optimize source images**
   - Resize to max needed dimensions
   - Compress before upload
   - Remove metadata

6. **Use `sizes` for responsive images**
   ```tsx
   <Image src="..." sizes="(max-width: 768px) 100vw, 50vw" />
   ```

### ❌ Don'ts

1. **Don't use regular `<img>` tags**
   - Always use Next.js `Image` component

2. **Don't skip `alt` attribute**
   - Required for accessibility
   - Improves SEO

3. **Don't use oversized images**
   - 4K image for 200px thumbnail = waste

4. **Don't lazy load hero images**
   - Use `priority` for above-the-fold

5. **Don't use `unoptimized` unless necessary**
   - Only for SVGs or specific cases

6. **Don't forget to test on mobile**
   - Check loading performance
   - Verify responsive sizes

## Common Patterns

### Achievement Badges

```tsx
<OptimizedImage
  src={`/achievements/${achievement.id}.png`}
  alt={achievement.name}
  width={120}
  height={120}
  aspectRatio="square"
  objectFit="contain"
  className="rounded-xl"
/>
```

### User Avatars

```tsx
<AvatarImage
  src={user.avatarUrl}
  alt={user.name}
  fallbackInitials={user.name?.slice(0, 2)}
  size="md"
/>
```

### Project Thumbnails

```tsx
<div className="relative aspect-video w-full overflow-hidden rounded-lg">
  <Image
    src={project.thumbnailUrl}
    alt={project.name}
    fill
    className="object-cover transition-transform hover:scale-105"
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  />
</div>
```

### Hero Section

```tsx
<div className="relative h-[500px] w-full">
  <Image
    src="/hero-background.jpg"
    alt="FocusHub Dashboard"
    fill
    className="object-cover"
    sizes="100vw"
    priority
    quality={90}
  />
  <div className="absolute inset-0 bg-black/40" />
  {/* Content overlay */}
</div>
```

### Gallery/Grid

```tsx
<div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
  {images.map((image, index) => (
    <OptimizedImage
      key={image.id}
      src={image.url}
      alt={image.description}
      width={300}
      height={300}
      aspectRatio="square"
      className="rounded-lg"
      priority={index < 4} // First 4 images priority
    />
  ))}
</div>
```

### Icons (SVG)

```tsx
// For local SVG icons
<Image
  src="/icons/timer.svg"
  alt=""
  width={24}
  height={24}
  unoptimized // Don't process SVGs
/>

// Or better, inline SVG
<svg className="h-6 w-6" viewBox="0 0 24 24">
  <path d="..." />
</svg>
```

## Performance Checklist

Before deploying images, verify:

- [ ] All images use Next.js `Image` component (no `<img>` tags)
- [ ] Above-the-fold images have `priority` prop
- [ ] All images have descriptive `alt` text
- [ ] Width and height specified for all images
- [ ] Large images compressed (< 200KB for photos)
- [ ] Responsive `sizes` configured for varying widths
- [ ] External images domains configured in next.config.ts
- [ ] SVGs used for icons and logos where appropriate
- [ ] Blur placeholders for important images
- [ ] Images tested on mobile devices

## Testing Performance

### Lighthouse Audit

```bash
# Run Lighthouse
npm run lighthouse

# Or use Chrome DevTools:
# 1. Open DevTools (F12)
# 2. Go to Lighthouse tab
# 3. Run audit
```

**Check:**
- Performance score > 90
- Properly sized images
- Efficient image formats
- Offscreen images lazy loaded

### Core Web Vitals

Monitor these metrics:
- **LCP** (Largest Contentful Paint) < 2.5s
- **CLS** (Cumulative Layout Shift) < 0.1
- **FID** (First Input Delay) < 100ms

## Troubleshooting

### Images Not Loading

**Problem:** Images show broken icon
**Solutions:**
1. Check file path is correct
2. Verify image exists in public folder or configured remote domain
3. Check console for errors
4. Ensure external domains configured in next.config.ts

### Layout Shift

**Problem:** Page jumps when images load
**Solutions:**
1. Always specify width and height
2. Use aspect ratio classes
3. Add placeholder

### Slow Loading

**Problem:** Images take too long to load
**Solutions:**
1. Compress source images
2. Use appropriate format (WebP/AVIF)
3. Implement lazy loading
4. Check image size matches usage (don't use 4K for thumbnails)

### Blurry Images

**Problem:** Images look low quality
**Solutions:**
1. Increase quality prop (default 75, try 85-90)
2. Use larger source image
3. Check if format conversion causing issues

## Resources

- [Next.js Image Documentation](https://nextjs.org/docs/api-reference/next/image)
- [Image Optimization Best Practices](https://web.dev/fast/#optimize-your-images)
- [WebP Format](https://developers.google.com/speed/webp)
- [AVIF Format](https://jakearchibald.com/2020/avif-has-landed/)
- [Responsive Images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)

---

For FocusHub-specific image usage questions, consult the components in `/components/ui/OptimizedImage.tsx` or refer to existing implementations in dashboard pages.
