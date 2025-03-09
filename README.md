# TEXPERIA - Technical Symposium Event Platform


## Overview

Texperia is a modern web application for a national-level technical symposium that brings together brilliant minds to showcase innovation, technical prowess, and creative solutions to real-world problems. The platform allows students from educational institutions to explore events, register, and participate in various technical competitions.

## Features

- ✨ Dynamic and interactive UI with animations powered by Framer Motion and GSAP
- 🚀 Event exploration and detailed information for various technical competitions
- 🔐 User authentication and registration system using Supabase
- 📱 Responsive design that works seamlessly on desktop and mobile devices
- ⏱️ Countdown timer to the symposium date
- 🎯 Interactive event cards with hover effects
- 📝 FAQ section with expandable questions and answers
- 👥 User dashboard for registered participants

## Tech Stack

- **Framework**: Next.js (App Router)
- **UI/Styling**: Tailwind CSS
- **Animations**: 
  - GSAP (GreenSock Animation Platform)
  - Framer Motion
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Fonts**: Next/font with Google Fonts (Anta)

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- Supabase account (for authentication and database)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/texperia.git
   cd texperia
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

```
texperia/
├── app/
│   ├── components/
│   │   ├── Auth.tsx
│   │   └── Dashboard.tsx
│   ├── utils/
│   │   └── supabaseClient.ts
│   └── page.tsx
├── public/
│   ├── bg.mp4
│   └── icons/
└── ...configuration files
```

## Deployment

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the Vercel platform.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/yourusername/texperia)

### Alternative Deployment Options

For other deployment options, follow the [Next.js deployment documentation](https://nextjs.org/docs/deployment).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [GSAP](https://greensock.com/gsap/)
- [Framer Motion](https://www.framer.com/motion/)
- [Supabase](https://supabase.io/)

---

Built with ❤️ for the future tech enthusiasts