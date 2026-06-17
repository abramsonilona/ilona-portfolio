# אילונה אברמסון — Portfolio Website

A Hebrew RTL portfolio website for a verbal branding strategist, built with Next.js 15, TypeScript, Tailwind CSS, and Framer Motion.

## Stack
- **Next.js 15** (App Router, TypeScript)
- **Tailwind CSS** (utility layer + custom CSS vars)
- **Framer Motion** (page transitions, scroll animations)
- **Google Fonts** — Frank Ruhl Libre (display) + Heebo + Assistant (body/UI)

## Pages
| Route | Description |
|-------|-------------|
| `/` | Homepage — hero, services, featured & all projects, CTA |
| `/about` | About — bio, experience timeline, clients, philosophy |
| `/projects/[slug]` | Dynamic project pages — hero, challenge/solution, video, sidebar |

## Project Structure
```
app/
  layout.tsx         # Root layout (RTL, fonts, nav/footer)
  page.tsx           # Homepage
  about/page.tsx     # About page
  projects/[slug]/
    page.tsx         # Server component + generateStaticParams
    ProjectPageClient.tsx  # Client component
  globals.css        # CSS variables, typography, RTL

components/
  layout/
    Navigation.tsx   # Fixed top nav with scroll behaviour
    Footer.tsx
  ui/
    PageTransition.tsx   # AnimatePresence wrapper
    ScrollReveal.tsx     # useInView scroll animation
    ProjectCard.tsx      # Card used in project grids
    VideoPlayer.tsx      # MP4 player with play/mute controls

lib/
  projects.ts        # Project data + helper functions
```

## Adding Projects
Edit `lib/projects.ts` — add an object to the `projects` array. Each project has:
- `slug` — URL segment
- `title`, `subtitle`, `category`, `year`
- `description`, `challenge`, `solution`
- `deliverables[]`, `tags[]`
- `videoUrl` — optional: place `.mp4` in `/public/videos/` and set path like `/videos/my-film.mp4`
- `coverImage` — optional: `/projects/my-image.jpg`
- `featured` — boolean: shows in homepage featured grid
- `color` — hex: hero background color for project page

## Adding Videos
Place `.mp4` files in `/public/videos/`. Reference in project data:
```ts
videoUrl: "/videos/shapira-beer.mp4"
```
The `VideoPlayer` component handles play/pause and mute toggling natively.

## Design System (CSS Variables)
```css
--ink: #1a1612         /* Near-black — primary text */
--parchment: #f5f2ec   /* Off-white — section backgrounds */
--warm-white: #faf9f6  /* Page background */
--gold: #c8a96e        /* Accent — rules, hover, highlights */
--gold-muted: #e8d9bc  /* Scrollbar, subtle accents */
--ash: #8a8480         /* Secondary text */
--rule: #d4cfc8        /* Borders */
```

## Development
```bash
npm run dev     # localhost:3000
npm run build   # production build
npm run start   # serve production build
```

## Deployment
Works out of the box on **Vercel** — connect repo and deploy.
For Netlify: add `@netlify/plugin-nextjs` and set output to `standalone`.
