# Deployment Guide

This document provides comprehensive instructions for deploying the Gamified Time Tracker frontend application.

## Prerequisites

- Node.js 18+ and npm
- Docker (optional, for containerized deployment)
- Access to your deployment environment (Vercel, Netlify, AWS, etc.)

## Environment Configuration

### Required Environment Variables

Create a `.env.production` file with the following variables:

```bash
# API Configuration
VITE_API_BASE_URL=https://your-api-domain.com/api
VITE_API_TIMEOUT=10000

# Authentication
VITE_GOOGLE_CLIENT_ID=your-google-client-id

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_AI_FEATURES=true
VITE_ENABLE_COLLABORATION=true
VITE_ENABLE_INTEGRATIONS=true

# Monitoring
VITE_ENABLE_PERFORMANCE_MONITORING=true
VITE_SENTRY_DSN=your-sentry-dsn
VITE_ENABLE_ERROR_REPORTING=true
VITE_ERROR_REPORTING_ENDPOINT=https://your-error-endpoint.com

# Analytics
VITE_GA_TRACKING_ID=your-ga-tracking-id
VITE_HOTJAR_ID=your-hotjar-id

# PWA
VITE_PWA_ENABLED=true
VITE_PWA_CACHE_DURATION=86400000

# Build Information (automatically injected)
VITE_APP_VERSION=1.0.0
VITE_BUILD_TIME=auto-generated
VITE_GIT_COMMIT=auto-generated
```

### Environment Variable Validation

The application validates required environment variables on startup and provides helpful error messages in development mode.

## Build Process

### Local Production Build

```bash
# Install dependencies
npm install

# Run production build
npm run build

# Preview production build locally
npm run preview

# Analyze bundle size
npm run build:analyze
```

### Build Optimization Features

The build process includes:
- **Code Splitting**: Intelligent chunking for optimal loading
- **Tree Shaking**: Unused code elimination
- **Minification**: Terser optimization with console.log removal
- **Asset Optimization**: Image compression and inlining
- **Service Worker**: PWA functionality with offline support
- **Bundle Analysis**: Size optimization and dependency tracking

### Build Output Structure

```
dist/
├── js/
│   ├── vendor-react-[hash].js     # React core
│   ├── vendor-ui-[hash].js        # UI components
│   ├── vendor-utils-[hash].js     # Utilities
│   ├── pages-[hash].js            # Page components
│   └── components-[hash].js       # Shared components
├── css/
│   └── [name]-[hash].css
├── images/
│   └── [name]-[hash].[ext]
├── fonts/
│   └── [name]-[hash].[ext]
└── assets/
    └── [name]-[hash].[ext]
```

## Deployment Options

### 1. Vercel Deployment (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy with environment variables
vercel --prod

# Or use vercel.json configuration
```

Create `vercel.json`:
```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/sw.js",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-cache"
        }
      ]
    }
  ]
}
```

### 2. Netlify Deployment

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

Create `netlify.toml`:
```toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/sw.js"
  [headers.values]
    Cache-Control = "no-cache"
```

### 3. Docker Deployment

The included `Dockerfile` provides multi-stage builds:

```bash
# Build Docker image
docker build -t gamified-time-tracker-frontend .

# Run container
docker run -p 80:80 gamified-time-tracker-frontend

# Or use docker-compose
docker-compose up -d
```

### 4. AWS S3 + CloudFront

```bash
# Build the application
npm run build

# Upload to S3 bucket
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

### 5. GitHub Pages

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts
"deploy": "gh-pages -d dist"

# Deploy
npm run build
npm run deploy
```

## Performance Optimization

### Bundle Analysis

```bash
# Generate detailed bundle analysis
npm run build:analyze

# This opens an interactive visualization showing:
# - Bundle sizes and dependencies
# - Chunk optimization opportunities
# - Duplicate dependency detection
```

### Performance Monitoring

The application includes comprehensive performance tracking:

- **Core Web Vitals**: LCP, FID, CLS monitoring
- **Custom Metrics**: Component render times, API response times
- **Real User Monitoring**: Performance data from actual users
- **Error Tracking**: Automatic error reporting and stack traces

### Optimization Checklist

- ✅ Code splitting implemented
- ✅ Lazy loading for routes
- ✅ Image optimization and lazy loading
- ✅ Service worker for caching
- ✅ Gzip/Brotli compression
- ✅ CDN integration ready
- ✅ Performance monitoring
- ✅ Bundle size optimization

## Security Configuration

### Content Security Policy

Add these headers to your deployment:

```
Content-Security-Policy: default-src 'self'; 
  script-src 'self' 'unsafe-inline' https://www.google-analytics.com https://www.googletagmanager.com; 
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
  font-src 'self' https://fonts.gstatic.com; 
  img-src 'self' data: https: blob:; 
  connect-src 'self' https://api.yourdomain.com https://www.google-analytics.com;
  frame-src 'none';
  object-src 'none';
  base-uri 'self';
```

### Security Headers

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

### Environment Security

- ✅ Never commit `.env` files to version control
- ✅ Use deployment platform's environment variable management
- ✅ Rotate API keys and secrets regularly
- ✅ Use HTTPS in production
- ✅ Validate and sanitize all inputs

## Health Checks and Monitoring

### Health Check Endpoints

The application provides system health endpoints:

- **`/health`**: Application health status with API connectivity
- **`/build-info`**: Build version, environment, and system information

Example health check response:
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "buildTime": "2023-07-01T12:00:00Z",
  "environment": "production",
  "uptime": 3600,
  "apiStatus": "connected",
  "features": {
    "analytics": true,
    "aiFeatures": true,
    "collaboration": true,
    "integrations": true,
    "pwa": true,
    "errorReporting": true
  }
}
```

### Monitoring Integration

#### Sentry Error Tracking
```javascript
// Automatic error tracking with context
// Performance monitoring
// Release tracking
// User feedback collection
```

#### Google Analytics
```javascript
// Page view tracking
// Custom event tracking
// User behavior analysis
// Conversion tracking
```

#### Custom Metrics
```javascript
// Component performance
// API response times
// User interaction tracking
// Feature usage analytics
```

## CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build application
        run: npm run build
        env:
          VITE_API_BASE_URL: ${{ secrets.API_BASE_URL }}
          VITE_GOOGLE_CLIENT_ID: ${{ secrets.GOOGLE_CLIENT_ID }}
          VITE_SENTRY_DSN: ${{ secrets.SENTRY_DSN }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## Troubleshooting

### Common Issues

#### 1. Build Failures
```bash
# Check Node.js version
node --version  # Should be 18+

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check environment variables
npm run build:debug
```

#### 2. Runtime Errors
```bash
# Enable debug mode
VITE_ENABLE_DEBUG_MODE=true

# Check browser console
# Verify API endpoints
# Test network connectivity
```

#### 3. Performance Issues
```bash
# Use performance debugger
# Check bundle analysis
# Monitor Core Web Vitals
# Review network requests
```

#### 4. PWA Issues
```bash
# Check service worker registration
# Verify manifest.json
# Test offline functionality
# Check cache strategies
```

### Debug Tools

#### Development Debug Panel
- Build information display
- Feature flag status
- Performance metrics
- System information

#### Performance Debugger
- Real-time FPS monitoring
- Memory usage tracking
- Resource loading analysis
- Performance timing metrics

## Maintenance

### Regular Updates

1. **Dependencies**: Update monthly, test thoroughly
2. **Security**: Monitor vulnerability reports
3. **Performance**: Regular bundle size audits
4. **Monitoring**: Review error rates and performance metrics

### Backup Procedures

- ✅ Environment configurations backed up
- ✅ Deployment procedures documented
- ✅ Rollback procedures tested
- ✅ Database backup strategies (if applicable)

### Release Process

1. **Development**: Feature development and testing
2. **Staging**: Deploy to staging environment
3. **Testing**: Automated and manual testing
4. **Production**: Deploy with monitoring
5. **Verification**: Health checks and smoke tests
6. **Monitoring**: Watch metrics for issues

### Support and Monitoring

- **Error Tracking**: Sentry dashboard monitoring
- **Performance**: Core Web Vitals tracking
- **Analytics**: User behavior analysis
- **Health Checks**: Automated monitoring alerts
- **Logs**: Centralized logging and analysis