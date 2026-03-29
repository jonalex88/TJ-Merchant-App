# Web App Deployment Guide

Your Transpector Merchant Dashboard is now ready to deploy as a web app! You can install it on Android like a native app with offline support and push notifications.

## 🚀 Option 1: Build & Deploy to Vercel (Recommended - Free Tier Available)

Vercel is the fastest way to deploy. It takes 2 minutes.

### Step 1: Build Locally (Optional, verify everything works)

```bash
# Build the production bundle
bun run build

# Test the build locally
bun run preview
# Opens at http://localhost:4173
```

### Step 2: Deploy to Vercel

1. **Create Vercel Account** (if you don't have one)
   - Go to [vercel.com](https://vercel.com)
   - Sign up (use GitHub recommended)

2. **Deploy Your App**
   - Click "Add New..." → "Project"
   - Connect your repository or upload files
   - Vercel auto-detects Vite configuration
   - Click "Deploy"
   - Your app is live in ~2 minutes!

3. **Get Your Live URL**
   - Vercel assigns: `your-app.vercel.app`
   - Share this URL with your team

### Step 3: Install on Android Phone

1. **Visit your Vercel URL on Android phone**
   - Open Chrome browser
   - Go to: `https://your-app.vercel.app`

2. **Install as App**
   - Tap the menu (3 dots)
   - Select "Install app" or "Add to Home screen"
   - Choose "Transpector"
   - Tap "Install"

3. **Result**
   - App icon appears on home screen
   - Launches fullscreen like native app
   - Works offline (cached data)
   - Faster loading than web

---

## 🚀 Option 2: Deploy to Netlify (Also Free)

### Step 1: Build Locally

```bash
bun run build
```

### Step 2: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

### Step 3: Install on Android

Same as Vercel above - visit the URL and "Install app"

---

## 🚀 Option 3: Self-Hosted (VPS/Server)

If you have your own server:

### Step 1: Build the App

```bash
bun run build
# Creates optimized files in ./dist folder
```

### Step 2: Upload to Your Server

```bash
# Copy the dist folder to your web server
scp -r dist/* user@your-server.com:/var/www/transpector/

# Or with SFTP/FTP - just upload the dist folder contents
```

### Step 3: Configure Web Server

**Nginx Example:**
```nginx
server {
    listen 80;
    server_name transpector.yourcompany.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name transpector.yourcompany.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    root /var/www/transpector;
    index index.html;

    # SPA routing - redirect all non-file requests to index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Don't cache HTML
    location ~* \.html$ {
        expires 0;
        add_header Cache-Control "public, must-revalidate";
    }
}
```

**Apache Example:**
Create `.htaccess` in the dist folder:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

---

## 📱 Installing on Android as PWA

Once deployed, users can install on their phones:

### Chrome/Edge on Android:

1. **Visit your deployed URL**
   - Open Chrome
   - Go to: `https://your-domain.com`

2. **Tap Menu (⋮) → Install app**
   - Or wait for install prompt popup
   - Tap "Install"

3. **Result:**
   - ✅ App icon on home screen
   - ✅ Fullscreen experience (no browser bars)
   - ✅ Offline support (cached pages work)
   - ✅ Fast loading
   - ✅ Feels like native app

### Firefox on Android:

1. Visit your URL
2. Tap menu (⋯) → "Add to home screen"
3. Done!

### Samsung Internet:

1. Visit your URL
2. Tap menu (⋯) → "Add page to" → "Home screen"
3. Done!

---

## 🔐 HTTPS is Required

For PWA installation, you **must use HTTPS**:

- ✅ Vercel: Automatic HTTPS
- ✅ Netlify: Automatic HTTPS  
- ⚠️ Self-hosted: Use Let's Encrypt (free)

**Install Let's Encrypt on Linux Server:**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d transpector.yourcompany.com
```

---

## 🌐 Domain Setup (Optional)

Instead of `your-app.vercel.app`, use your own domain:

### For Vercel:
1. Go to Project Settings → Domains
2. Add your domain (e.g., `transpector.transactionjunction.com`)
3. Update DNS records (Vercel shows instructions)

### For Custom Server:
1. Point domain DNS to your server IP
2. Update Nginx/Apache configuration
3. Setup HTTPS cert for that domain

---

## ✅ Deployment Checklist

Before going live:

- [ ] Test login with demo credentials (demo/demo123)
- [ ] Verify dashboard loads metrics
- [ ] Check transaction filtering works
- [ ] Verify terminal list displays
- [ ] Test on mobile phone via Chrome
- [ ] Install as PWA on home screen
- [ ] Test offline mode (turn on airplane mode)
- [ ] Check logo displays on login screen
- [ ] Verify no console errors (F12 → Console tab)

---

## 🚨 Troubleshooting

### "Install app" button doesn't appear
- ✅ Must be HTTPS (not HTTP)
- ✅ Must be on Android/Chrome
- ✅ App might already be installed
- ✅ Try hard refresh (Ctrl+Shift+R)

### App shows blank page after install
- Clear browser cache: Settings → Apps → Chrome → Storage → Clear
- Uninstall and reinstall
- Check browser console for errors (F12)

### Offline mode not working
- ✅ First visit the site online (caches it)
- ✅ Then go offline
- ✅ Cached pages should load

### Login not persisting
- Check phone storage isn't full
- Verify localStorage isn't disabled
- Check browser console for errors

---

## 📊 Monitoring & Analytics

Your app includes Google Analytics (GA_MEASUREMENT_ID: G-KXCB72H0DX).

**View analytics in Google Analytics dashboard:**
1. Go to [analytics.google.com](https://analytics.google.com)
2. Select your property
3. View realtime users, page views, events

---

## 🔄 Updating Your App

To push updates:

1. **Make code changes** in your workspace
2. **Test locally:** `bun run build` + `bun run preview`
3. **Deploy:**
   - **Vercel:** Just push to GitHub or use CLI
   - **Netlify:** Run `netlify deploy --prod` again
   - **Self-hosted:** Re-upload dist folder

4. **Users:** Close/reopen app to get updates (auto-refresh in ~2 days)

---

## 🎯 Next Steps

### Immediate:
1. ✅ Choose deployment platform (Vercel recommended)
2. ✅ Deploy your app
3. ✅ Get live URL
4. ✅ Share with team to install

### Later (Backend Integration):
When API is ready, update `src/lib/sdk.ts` to use real endpoints instead of mocks. Users will automatically get the live data!

---

## 📞 Production Readiness Checklist

- [ ] **Domain:** Custom domain configured
- [ ] **HTTPS:** SSL certificate setup
- [ ] **Analytics:** Tracking enabled and working
- [ ] **Offline:** App works without internet
- [ ] **Performance:** Build size optimized (~2-3MB)
- [ ] **Security:** No secrets/keys in code
- [ ] **Error Handling:** Errors caught and reported
- [ ] **Monitoring:** Setup alerts for errors

---

## Quick Command Reference

```bash
# Install dependencies
bun install

# Development server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview

# Run tests
bun run test

# Format code
bun run format
```

---

**Your app is ready to deploy! 🚀**

Start with Option 1 (Vercel) - it's the fastest path to production.
