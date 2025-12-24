# 🎬 Ping. Drama Stream

![Ping Banner](https://i.ibb.co.com/bMJGLnXr/file-0000000059747207a0ea1cfc3d217d9f.png)

**Ping.** is a modern, ultra-fast, and minimalist Asian Drama streaming platform designed with **Apple-inspired aesthetics**. Built for vertical drama lovers, it features a cinematic vertical player, infinite scrolling, and a seamless "app-like" experience on the web.

> **Note:** This project is a frontend client that consumes unofficial DramaBox APIs.

---

## ✨ Key Features

- **🎨 Apple-Style Design:** Minimalist UI, monochromatic dark mode, sleek typography (Inter), and glassmorphism elements.
- **📱 Vertical Cinema Mode:** Optimized player for vertical dramas (9:16 aspect ratio) with sticky positioning on desktop.
- **🚀 Blazing Fast:** Powered by **Next.js 14** and **TanStack Query** for instant page transitions and aggressive caching.
- **♾️ Infinite Scrolling:** Browse thousands of dramas without hitting "next page" on Trending, Latest, and Dubbed sections.
- **🔍 Smart Search:** Live search with optimized debounce and fallback cover logic.
- **⏭️ Auto-Play UX:** Auto-next episode, scroll-to-active episode, and quick navigation controls.
- **🇮🇩 Indonesian Dub Support:** Dedicated section for dramas dubbed in Bahasa Indonesia.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **State & Cache:** [TanStack Query](https://tanstack.com/query/latest) (React Query)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Video Player:** [Hls.js](https://github.com/video-dev/hls.js)
- **Font:** [Inter](https://fonts.google.com/specimen/Inter)

---

## 🚀 Getting Started

Follow these steps to run the project locally:

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/ping-drama.git
cd ping-drama/web
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 📂 Project Structure

```
web/
├── public/             # Static assets (logo, favicon)
├── src/
│   ├── app/            # Next.js App Router pages
│   │   ├── dub-indo/   # Dubbed drama page (Infinite scroll)
│   │   ├── latest/     # New releases page
│   │   ├── search/     # Search page
│   │   ├── trending/   # Trending page
│   │   ├── watch/[id]/ # Player page (Vertical Cinema)
│   │   ├── layout.tsx  # Root layout with Capsule Nav
│   │   └── page.tsx    # Home page
│   ├── components/     # Reusable components
│   │   ├── FloatingNav.tsx # Apple-style dock navigation
│   │   └── QueryProvider.tsx # React Query setup
│   └── lib/
│       └── api.ts      # API fetcher functions
├── next.config.ts      # Next.js configuration (Proxy setup)
└── tailwind.config.ts  # Tailwind configuration
```

---

## ⚙️ Configuration

### API Proxy
To avoid CORS issues, this project uses Next.js Rewrites. Check `next.config.ts`:

```typescript
async rewrites() {
  return [
    {
      source: '/api/proxy/:path*',
      destination: 'https://dramabox.sansekai.my.id/api/dramabox/:path*',
    },
  ];
},
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <p>Made with ❤️ for Drama Lovers</p>
</div>