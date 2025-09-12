# Daniyal Ahmad Portfolio - Frontend

> **🚧 PROJECT STATUS: IN DEVELOPMENT**  
> This project is currently under development and will be available for testing and codebase review in the next week. The live deployment is not yet ready.

A modern, interactive portfolio website built with Next.js, featuring AI-powered chat functionality, 3D avatar, and dynamic content management.

## 🚀 Features

- **Interactive 3D Avatar** - Three.js powered avatar with hover interactions
- **AI Chat Integration** - Chat with CV using RAG-powered AI responses
- **Dynamic Content** - Projects, tools, and blog posts managed via admin panel
- **Responsive Design** - Mobile-first design with Tailwind CSS
- **Modern Animations** - Framer Motion for smooth transitions
- **SEO Optimized** - Meta tags, Open Graph, and Twitter cards
- **Admin Dashboard** - Secure content management system

## 🛠️ Tech Stack

- **Framework**: Next.js 15.4.6
- **Styling**: Tailwind CSS 3.4.17
- **Animations**: Framer Motion 12.23.12
- **3D Graphics**: Three.js, React Three Fiber, Drei
- **State Management**: SWR for data fetching
- **Markdown**: React Markdown for content rendering
- **Deployment**: Vercel-ready configuration

## 📁 Project Structure

```
frontend/
├── components/           # Reusable UI components
│   ├── About.jsx       # About section
│   ├── BlogSection.jsx # Blog posts display
│   ├── ChatWidget.jsx  # AI chat interface
│   ├── CVChatSection.jsx # CV chat functionality
│   ├── Footer.jsx      # Site footer
│   ├── Hero.jsx        # Landing hero section
│   ├── Navbar.jsx      # Navigation component
│   ├── P5Background.jsx # Interactive background
│   ├── ProjectCard.jsx # Project display card
│   ├── ProjectsSection.jsx # Projects grid
│   ├── Section.jsx    # Reusable section wrapper
│   ├── ThreeAvatar.jsx # 3D avatar component
│   ├── ToolsSection.jsx # AI tools display
│   └── WorkExperience.jsx # Work experience section
├── pages/              # Next.js pages
│   ├── admin/          # Admin dashboard pages
│   ├── api/           # API route handlers
│   ├── blog/          # Blog page
│   ├── chat/          # CV chat page
│   ├── contact/       # Contact page
│   ├── tools/         # AI tools page
│   ├── _app.js        # App wrapper
│   ├── _document.js    # Document configuration
│   └── index.js       # Homepage
├── lib/               # Utility libraries
│   └── api.js         # API client
├── public/            # Static assets
│   └── avatar.glb     # 3D avatar model
├── styles/            # Global styles
│   └── globals.css    # Tailwind CSS imports
├── middleware.js      # Route protection
├── next.config.mjs   # Next.js configuration
├── tailwind.config.js # Tailwind configuration
└── package.json      # Dependencies
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running (see backend README)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd DanPortfolio/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your backend API URL:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Build & Deployment

### Local Build

```bash
npm run build
npm start
```

### Vercel Deployment

1. **Connect to Vercel**
   - Import your GitHub repository
   - Select the `frontend` folder as root directory

2. **Environment Variables**
   Set in Vercel dashboard:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-domain.com
   ```

3. **Deploy**
   - Vercel will automatically build and deploy
   - Custom domain can be configured in project settings

### Build Configuration

The project is configured for optimal Vercel deployment:
- `output: 'standalone'` for serverless functions
- Image optimization enabled
- Compression enabled
- API rewrites configured

## 🎨 Customization

### Styling

- **Colors**: Update `tailwind.config.js` for brand colors
- **Fonts**: Modify `_document.js` for custom fonts
- **Components**: All components use Tailwind utility classes

### Content

- **Projects**: Manage via admin dashboard at `/admin`
- **Blog Posts**: Auto-synced from RSS feeds
- **AI Tools**: Managed via admin panel
- **CV Data**: Update `backend/data/cv_data.json`

### 3D Avatar

- **Model**: Replace `public/avatar.glb` with your model
- **Positioning**: Adjust in `ThreeAvatar.jsx`
- **Interactions**: Modify hover effects and animations

## 🔧 Configuration

### API Integration

The frontend communicates with the backend via:
- **Base URL**: `NEXT_PUBLIC_API_URL` environment variable
- **Endpoints**: Defined in `lib/api.js`
- **Error Handling**: Automatic retry and fallback

### Admin Access

- **URL**: `/admin`
- **Authentication**: Password-based authentication (no hard-coded credentials)
- **Features**: Add/edit projects, tools, blog posts
- **Security**: All admin credentials are server-side only

### SEO & Meta Tags

Configured in `_document.js`:
- Open Graph tags
- Twitter cards
- Meta descriptions
- Keywords

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Verify `NEXT_PUBLIC_API_URL` is correct
   - Check backend is running
   - Ensure CORS is configured

2. **3D Avatar Not Loading**
   - Check `public/avatar.glb` exists
   - Verify Three.js dependencies
   - Check browser console for errors

3. **Build Failures**
   - Run `npm run lint` to check for errors
   - Verify all imports are correct
   - Check for unused dependencies

4. **Admin Access Issues**
   - Verify secret key in middleware
   - Check URL parameters
   - Ensure backend authentication

### Performance Optimization

- **Images**: Optimize avatar model size
- **Bundle**: Use dynamic imports for heavy components
- **Caching**: Configure SWR cache settings
- **CDN**: Use Vercel's edge network

## 📝 Scripts

```bash
npm run dev      # Development server with Turbopack
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint checking
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🔗 Links

- **Live Site**: [daniyalareeb.me](https://daniyalareeb.me)
- **Backend**: See `../backend/README.md`
- **Admin**: `/admin` (password-protected)

## 📞 Support

For issues or questions:
- **Email**: daniyalareeb123@gmail.com
- **LinkedIn**: [daniyalareeb](https://linkedin.com/in/daniyalareeb)
- **GitHub**: [daniyalareeb](https://github.com/daniyalareeb)

---

Built with ❤️ by Daniyal Ahmad (daniyalareeb)