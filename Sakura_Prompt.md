# 🌸 SAKURA — Cursor AI Толық Трансформация Промпті
### Музыка стриминг стартапын бизнеске айналдыру

---

## 🎯 ЖОБА КОНТЕКСТІ

Менің "Sakura" деп аталатын музыка тыңдау және альбом шолу веб-қызметім бар.

- **GitHub:** https://github.com/sulybelle/Sakura
- **Backend (Render):** https://sakura-backend-z3e9.onrender.com
- **Frontend (Render):** https://sakura-frontend-fbbc.onrender.com

Стек: Node.js + Express (backend), React (frontend), Render-де орналастырылған.

---

## 🚀 НЕГІЗГІ МАҚСАТ

Бұл MVP жобаны **толыққанды коммерциялық стартап өнімге** айналдыр:
1. Мобильді-бірінші (mobile-first) адаптивті дизайн
2. Монетизация механизмдері
3. Пайдаланушыны ұстап тұру (retention) жүйесі
4. Скалабельді архитектура

---

## 📋 CURSOR AI-ГЕ НАҚТЫ ТАПСЫРМАЛАР ТІЗІМІ

---

### БЛОК 1: МОБИЛЬДІ АДАПТАЦИЯ (Mobile-First Redesign)

```
Барлық frontend компоненттерін мобильді-бірінші принципімен қайта жаз.

Талаптар:
- Breakpoints: 320px, 375px, 428px (mobile), 768px (tablet), 1024px+ (desktop)
- Bottom navigation bar мобильде (iOS/Android стилінде)
- Touch-friendly элементтер: барлық кнопкалар min 44x44px
- Swipe gesture: альбомдар арасында swipe, плейлист жылжыту
- Мобильде тіркелу/кіру формасы — full-screen modal
- Музыка ойнатқыш мобильде төменгі sticky bar болсын (mini player)
- Pull-to-refresh барлық feed беттерінде
- Lazy loading барлық суреттер мен контент үшін
- viewport meta тег дұрыс орнатылсын: width=device-width, initial-scale=1

CSS: Tailwind CSS немесе CSS Modules қолдан. Flexbox + CSS Grid арқылы fluid layout жаса.
```

---

### БЛОК 2: UX/UI ДИЗАЙН ЖАҢАРТУ (Premium Design System)

```
Sakura брендіне сай дизайн жүйесін жаса:

Түс палитрасы:
- Primary: #FF6B9D (sakura pink)
- Secondary: #1A1A2E (deep night)
- Accent: #FFD700 (gold)
- Background: #0D0D1A
- Surface: #1E1E30
- Text Primary: #FFFFFF
- Text Secondary: #A0A0B0

Типография:
- Display/Heading: 'Playfair Display' (Google Fonts)
- Body: 'DM Sans'
- Монетизация badge: 'Space Mono'

Компоненттер:
1. AlbumCard — hover анимациясымен, gradient overlay
2. MusicPlayer — glassmorphism стилінде, blur backdrop
3. ArtistCard — circular avatar, follow button
4. PlaylistRow — drag-and-drop мүмкіндігімен
5. PremiumBadge — golden glow эффектімен
6. WaveformVisualizer — SVG анимациялы дыбыс толқыны (CSS animation)

Анимациялар:
- Беттер арасындағы transition: fade + slide (300ms)
- Skeleton loading барлық контент жүктелгенше
- Likes/heart анимациясы: scale + color burst
- Player progress bar: smooth transition
```

---

### БЛОК 3: АУТЕНТИФИКАЦИЯ ЖҮЙЕСІ (Auth System)

```
JWT-негізді толық аутентификация жүйесін жаса:

Backend (Express.js):
- POST /api/auth/register — email + username + password
- POST /api/auth/login — email + password → JWT token қайтар
- POST /api/auth/refresh — refresh token арқылы жаңарт
- POST /api/auth/logout — token blacklist
- GET /api/auth/me — current user профилі
- POST /api/auth/google — Google OAuth2 (passport.js арқылы)

Frontend (React):
- AuthContext + useAuth() hook жаса
- Protected routes — HOC немесе React Router loader арқылы
- Persistent session — localStorage + httpOnly cookie комбинациясы
- Auto-refresh token 5 минут қалғанда

Қауіпсіздік:
- bcrypt (saltRounds: 12) паролді хэштеу
- Rate limiting: 5 attempts / 15 min (express-rate-limit)
- Input validation: express-validator немесе Zod
- CORS дұрыс конфигурациясы
```

---

### БЛОК 4: МОНЕТИЗАЦИЯ ЖҮЙЕСІ (Revenue System)

```
3 деңгейлі Freemium модель жаса:

ЖОСПАРЛАР:
1. Free — реклама бар, 30 секунд preview, күніне 10 тыңдау
2. Premium (799₸/ай) — рекламасыз, толық тыңдау, офлайн жүктеу
3. Artist Pro (1499₸/ай) — + аналитика, revenue share, промоция

Backend:
- User model-ға subscriptionPlan, subscriptionExpiry, playCount өрістерін қос
- GET /api/user/subscription — жоспар деректері
- POST /api/subscription/upgrade — жоспар өзгерту
- Middleware: checkSubscription(requiredPlan) — route қорғаушы
- Cron job: күн сайын expired subscriptions тексер

Frontend:
- PricingPage компоненті — 3 карточка, highlighted план
- UpgradeModal — premium функционал қолданғанда pop-up
- SubscriptionBanner — free пайдаланушыға ескертпе
- PaymentForm — Kaspi Pay / CloudPayments Kazakhstan интеграция UI

Реклама (Free tier):
- AudioAd компоненті — 15 секунд аудио реклама (Google IMA SDK немесе custom)
- BannerAd — треки арасында display banner
- SkipAd timer — 5 секундтан кейін skip мүмкіндігі
```

---

### БЛОК 5: МУЗЫКА ПЛЕЕР (Advanced Player)

```
Толыққанды HTML5 Audio плеер жаса:

Функционал:
- Play / Pause / Next / Previous
- Shuffle + Repeat (off/one/all)
- Volume control + Mute
- Progress bar — seek мүмкіндігімен
- Duration / Current time display
- Mini player (мобильде sticky bottom)
- Full-screen player (мобильде swipe up)
- Background audio (Media Session API)
- Keyboard shortcuts: Space (play/pause), ←→ (seek), ↑↓ (volume)
- Sleep timer: 15/30/60 минут

React компоненттер:
- useAudioPlayer() custom hook — барлық audio state осында
- AudioContext — global player state
- MiniPlayer компоненті
- FullPlayer компоненті
- QueueDrawer — кезек тізімі

Crossfade: треклер арасында 3 секунд smooth fade (Web Audio API)
Equalizer: Bass/Mid/Treble слайдерлер (Web Audio API BiquadFilter)
```

---

### БЛОК 6: КОНТЕНТ ЖҮЙЕСІ (Content Management)

```
Музыка контентін басқару жүйесін жаса:

Database models (MongoDB/PostgreSQL):
- Track: { id, title, artist, album, duration, audioUrl, coverUrl, genre, playCount, likes, uploadedBy, isPublic }
- Album: { id, title, artist, coverUrl, releaseDate, tracks[], genre, totalDuration }
- Artist: { id, name, bio, avatarUrl, coverUrl, followers[], monthlyListeners, verified }
- Playlist: { id, name, owner, tracks[], isPublic, coverUrl, followers }
- Genre: { id, name, color, icon }

API endpoints:
- GET /api/tracks — барлық треклер (pagination: ?page=1&limit=20)
- GET /api/tracks/:id — бір трек
- GET /api/albums — альбомдар
- GET /api/search?q= — треклер + артистер + альбомдарды іздеу
- GET /api/charts/top — top 50 треклер
- GET /api/recommendations/:userId — personalized ұсыныстар
- POST /api/tracks/:id/play — play count +1 жаз
- POST /api/tracks/:id/like — like/unlike toggle

Search:
- Elasticsearch немесе MongoDB Atlas Search
- Autocomplete — 200ms debounce
- Fuzzy search — орфографиялық қателерді кешіреді
```

---

### БЛОК 7: АРТИСТ DASHBOARD (Creator Platform)

```
Артистерге арналған арнайы dashboard жаса:

Frontend pages:
- /artist/dashboard — негізгі статистика
- /artist/upload — трек/альбом жүктеу
- /artist/analytics — толық аналитика
- /artist/earnings — табыс есебі
- /artist/profile — профильді редакциялау

Статистика виджеттері:
- Plays by day (Line chart — Recharts)
- Geographic distribution (Map chart)
- Top tracks (Bar chart)
- Follower growth (Area chart)
- Revenue breakdown (Pie chart)

Upload функционал:
- Drag & drop аудио файл жүктеу
- Cloudinary немесе AWS S3 интеграция
- Audio waveform preview жүктеу кезінде
- Metadata форма: трек аты, артист, жанр, мәтін (lyrics)
- Cover art жүктеу + crop

Revenue Share:
- Формула: (трек ойнатылымы / барлық ойнатылымдар) × Premium revenue pool × 0.70
- Артист 70%, Платформа 30%
- Ай сайын есептелу + Kaspi Pay арқылы аударым
```

---

### БЛОК 8: ӘЛЕУМЕТТІК ФУНКЦИОНАЛ (Social Features)

```
Пайдаланушыларды байланыстыратын social layer қос:

Features:
- Follow/Unfollow артистер мен пайдаланушылар
- Activity Feed — following-тердің тыңдаған музыкасы
- Collaborative Playlists — бірнеше пайдаланушы редакциялай алады
- Music Sharing — тректі/плейлистті сілтеме арқылы бөлісу
- Comments — трек бетінде пікір жазу (nested)
- Reactions — 5 emoji reaction трекке

Notification жүйесі:
- WebSocket (Socket.io) — real-time хабарламалар
- Notification типтері: new follower, new album from artist, playlist добавлен
- Push notifications: Firebase Cloud Messaging (FCM) интеграция
- Email digest: апта сайын (Nodemailer + HTML template)

Leaderboard:
- Top listeners (осы аптада ең көп тыңдағандар)
- Rising artists (ең көп өсу)
- Trending tracks (24 сағатта ең көп plays)
```

---

### БЛОК 9: PERFORMANCE ОПТИМИЗАЦИЯ

```
Production-grade өнімділікке жет:

Frontend:
- Code splitting: React.lazy() + Suspense барлық route үшін
- Image optimization: WebP формат, srcSet responsive images
- Service Worker: offline режим, asset caching (Workbox)
- PWA manifest.json: иконкалар, splash screen, standalone display mode
- Bundle analysis: webpack-bundle-analyzer, unused code жою
- Virtual scroll: ұзын тізімдер үшін (react-virtual)
- Memoization: React.memo, useMemo, useCallback дұрыс қолдану

Backend:
- Redis caching: популярлы треклер мен albums 10 минут cache
- Database indexing: playCount, releaseDate, artistId өрістеріне
- CDN: аудио файлдар мен суреттер Cloudflare CDN арқылы
- Compression: gzip/brotli (compression middleware)
- Database connection pooling
- API response pagination барлық list endpoints үшін

Monitoring:
- Sentry.io — error tracking (frontend + backend)
- Datadog немесе Render metrics — server monitoring
- Web Vitals tracking: LCP < 2.5s, FID < 100ms, CLS < 0.1
```

---

### БЛОК 10: ДЕПЛОЙМЕНТ ЖАҢАРТУ (Production Setup)

```
Render-дегі конфигурацияны production-ready ет:

Backend (Render Web Service):
- Environment variables: DATABASE_URL, JWT_SECRET, REDIS_URL, CLOUDINARY_URL, STRIPE_KEY
- Health check endpoint: GET /health → { status: "ok", uptime: ... }
- Auto-deploy: GitHub main branch-қа push болғанда
- Render.yaml конфигурация файлы жаса
- Background worker: Render Background Worker (cron jobs үшін)

Frontend (Render Static Site):
- Build command: npm run build
- Publish directory: build/ немесе dist/
- Redirect rules: /* → /index.html (SPA routing)
- Custom domain конфигурация нұсқауы

Database:
- MongoDB Atlas (free tier → M10 paid plan жол картасы)
- Немесе Render PostgreSQL + Prisma ORM

CI/CD Pipeline (GitHub Actions):
name: Deploy Sakura
on:
  push:
    branches: [main]
jobs:
  test:
    - npm test (Jest unit tests)
    - npm run lint (ESLint)
  deploy:
    - Render Deploy Hook trigger

SSL: автоматты (Render-де тегін)
```

---

## 💰 БИЗНЕС МОДЕЛІ — ТОЛЫҚ СИПАТТАМА

```
Sakura үшін мынадай табыс ағындарын іске асыр:

1. FREEMIUM SUBSCRIPTION
   - Free: жарнамалы, шектеулі
   - Premium: 799₸/ай немесе 7,990₸/жыл (2 ай тегін)
   - Мақсат: 3 айда 1,000 Premium пайдаланушы = 799,000₸/ай

2. ARTIST PRO ЖОСПАРЫ
   - 1,499₸/ай — артистерге арналған
   - Мақсат: 200 артист = 299,800₸/ай

3. ЖАРНАМА ТАБЫСЫ (Free tier)
   - Audio ads: Google AdSense Audio немесе direct brand deals
   - CPM бағасы: ~$1-3 per 1000 impressions
   - Мақсат: 50,000 free пайдаланушы × 20 ads/ай = потенциал

4. B2B ЛИЦЕНЗИЯЛАУ
   - Кафе/ресторан/дүкен үшін фондық музыка лицензиясы
   - 2,999₸/ай/орын

5. EVENT ПРОМОЦИЯ
   - Артистерге концерт/шара промоциясы үшін featured placement
   - 25,000-50,000₸ per campaign

БӘСЕКЕЛЕСТІК АРТЫҚШЫЛЫҚ:
- Қазақстандық музыканттарды қолдау (локальды артистер платформасы)
- Қазақ тілі интерфейсі (KZ/RU/EN)
- Kaspi Pay интеграция (казахстандықтарға ыңғайлы)
- Тегін артист аккаунттары (Spotify-да жоқ)
```

---

## 📱 PWA КОНФИГУРАЦИЯ

```json
// public/manifest.json
{
  "name": "Sakura Music",
  "short_name": "Sakura",
  "description": "Қазақстандық музыка платформасы",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0D0D1A",
  "theme_color": "#FF6B9D",
  "orientation": "portrait",
  "icons": [
    { "src": "/icons/icon-72x72.png", "sizes": "72x72", "type": "image/png" },
    { "src": "/icons/icon-192x192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512x512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ],
  "categories": ["music", "entertainment"]
}
```

---

## 🗺️ ДАМУ ЖОЛ КАРТАСЫ (Roadmap)

```
ФАЗА 1 — MVP+ (1-2 апта):
✅ Mobile-first redesign
✅ JWT Auth
✅ Premium subscription UI
✅ Advanced player
✅ PWA setup

ФАЗА 2 — Growth (3-4 апта):
□ Kaspi Pay интеграция
□ Artist dashboard + upload
□ Search + recommendations
□ Social features (follow, share)
□ Push notifications

ФАЗА 3 — Scale (5-8 апта):
□ React Native мобильді қосымша
□ AI music recommendations (collaborative filtering)
□ Podcast support
□ Live radio/stream
□ B2B dashboard (кафе/ресторан)

ФАЗА 4 — Monetization (2-3 ай):
□ Audio advertising SDK
□ Artist revenue payout system
□ Analytics platform
□ API for third-party integrations
```

---

## ⚙️ ТЕХНОЛОГИЯ СТЕК (Final)

```
Frontend:
- React 18 + TypeScript
- React Router v6
- Tailwind CSS + shadcn/ui
- Zustand (global state)
- React Query (server state + caching)
- Recharts (аналитика графиктер)
- Framer Motion (анимациялар)
- Workbox (PWA/Service Worker)

Backend:
- Node.js 20 + Express.js
- MongoDB Atlas + Mongoose (немесе PostgreSQL + Prisma)
- Redis (caching)
- Socket.io (real-time)
- Cloudinary (медиа файлдар)
- Nodemailer (email)
- Passport.js (OAuth)

DevOps:
- Render (hosting)
- GitHub Actions (CI/CD)
- Sentry (error tracking)
- Cloudflare (CDN + DNS)
```

---

## 📌 CURSOR-ГА БІРІНШІ БЕРІЛЕТІН КОМАНДА

```
Cursor AI-де жаңа чат ашып, мына командаларды бер:

1. "Read the entire codebase and give me a full technical audit"
2. "Implement mobile-first responsive design for all components"
3. "Add JWT authentication with refresh tokens"
4. "Create a Freemium subscription system with 3 tiers"
5. "Build an advanced HTML5 audio player with queue management"
6. "Set up PWA with offline support and push notifications"
```

---

*Sakura — Қазақстандық музыканттарға арналған платформа 🌸*
*Бұл промпт арқылы MVP-тен толық стартап өнімге дейін жету мүмкін*
