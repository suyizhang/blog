# Personal Website

A modern, responsive personal website built with React, TypeScript, and Tailwind CSS, featuring GitHub OAuth authentication and a clean, professional design.

## 🚀 Features

- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Theme**: Toggle between dark and light modes
- **GitHub OAuth**: Secure authentication using GitHub
- **Modern UI**: Clean, professional design with smooth animations
- **Performance Optimized**: Fast loading with code splitting and lazy loading
- **SEO Friendly**: Optimized meta tags and structured data
- **TypeScript**: Full type safety throughout the application

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **React Router** - Client-side routing
- **Zustand** - Lightweight state management
- **React Query** - Data fetching and caching
- **React Hook Form** - Form handling with validation
- **Zod** - Schema validation

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type-safe server code
- **Passport.js** - Authentication middleware
- **JWT** - JSON Web Tokens for auth
- **GitHub OAuth** - Social authentication

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- GitHub OAuth App (for authentication)

### Frontend Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd personal-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_GITHUB_CLIENT_ID=your_github_client_id
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update `backend/.env` with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   GITHUB_CALLBACK_URL=http://localhost:5000/api/auth/github/callback
   JWT_SECRET=your_super_secret_jwt_key
   SESSION_SECRET=your_session_secret
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🔧 GitHub OAuth Setup

1. **Create GitHub OAuth App**
   - Go to GitHub Settings > Developer settings > OAuth Apps
   - Click "New OAuth App"
   - Fill in the details:
     - Application name: Your Website Name
     - Homepage URL: http://localhost:3000 (for development)
     - Authorization callback URL: http://localhost:5000/api/auth/github/callback

2. **Get Client ID and Secret**
   - Copy the Client ID and Client Secret
   - Add them to your `.env` files

## 📁 Project Structure

```
personal-website/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Basic UI components
│   │   ├── layout/         # Layout components
│   │   └── features/       # Feature-specific components
│   ├── pages/              # Page components
│   │   ├── Home/           # Homepage
│   │   ├── About/          # About page
│   │   ├── Projects/       # Projects showcase
│   │   ├── Contact/        # Contact form
│   │   └── Dashboard/      # User dashboard
│   ├── hooks/              # Custom React hooks
│   ├── store/              # State management
│   ├── services/           # API services
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript type definitions
│   └── styles/             # Global styles
├── backend/
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── config/         # Configuration files
│   │   ├── middleware/     # Custom middleware
│   │   └── controllers/    # Route controllers
│   └── package.json
├── public/                 # Static assets
└── package.json
```

## 🎨 Customization

### Colors and Theming
- Edit `tailwind.config.js` to customize colors, fonts, and spacing
- Modify `src/styles/globals.css` for global styles
- Update theme colors in the primary color palette

### Content
- Update personal information in page components
- Replace placeholder images with your own
- Modify social media links in the footer and header
- Add your projects to the Projects page

### Features
- Add new pages by creating components in `src/pages/`
- Extend the API by adding routes in `backend/src/routes/`
- Add new UI components in `src/components/`

## 🚀 Deployment

### Frontend (Vercel/Netlify)

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel**
   ```bash
   npm install -g vercel
   vercel --prod
   ```

3. **Environment Variables**
   - Add your environment variables in the deployment platform
   - Update `VITE_API_URL` to your backend URL

### Backend (Railway/Render/DigitalOcean)

1. **Build the project**
   ```bash
   cd backend
   npm run build
   ```

2. **Deploy to Railway**
   - Connect your GitHub repository
   - Set environment variables
   - Deploy automatically on push

3. **Environment Variables**
   - Set all required environment variables
   - Update `FRONTEND_URL` to your frontend URL
   - Update `GITHUB_CALLBACK_URL` to your production callback URL

## 📱 Performance

- **Lighthouse Score**: 90+ across all metrics
- **Core Web Vitals**: Optimized for excellent user experience
- **Bundle Size**: Optimized with code splitting and tree shaking
- **Images**: Lazy loading and modern formats (WebP)
- **Caching**: Aggressive caching strategies for static assets

## 🔒 Security

- **HTTPS**: Enforced in production
- **CORS**: Properly configured for cross-origin requests
- **Rate Limiting**: API rate limiting to prevent abuse
- **Input Validation**: All user inputs are validated and sanitized
- **JWT**: Secure token-based authentication
- **Environment Variables**: Sensitive data stored securely

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 📄 Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run type-check` - Run TypeScript type checking

### Backend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - The web framework used
- [Tailwind CSS](https://tailwindcss.com/) - For the amazing utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) - For smooth animations
- [Lucide React](https://lucide.dev/) - For beautiful icons
- [Vercel](https://vercel.com/) - For easy deployment

## 📞 Support

If you have any questions or need help with setup, please open an issue or contact me at [your.email@example.com](mailto:your.email@example.com).

---

**Made with ❤️ using React, TypeScript, and Tailwind CSS**