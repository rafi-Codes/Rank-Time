# 🚀 RankTime - Unleash Skills Beyond The Clock

[![Next.js](https://img.shields.io/badge/Next.js-14+-000000?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8+-47A248?style=flat&logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3+-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

RankTime is a comprehensive **competitive programming tracking platform** designed to help programmers analyze their deliberate practice, track progress through gamification, and gain data-driven insights into their coding journey.

![RankTime Dashboard](https://pub-141831e61e69445289222976a15b6fb3.r2.dev/Image_to_url_V2/Screenshot-2025-12-27-075741-imagetourl.cloud-1766800702579-l6gepy.png)

---

## ✨ Features

### 🎯 Core Functionality
- **🔐 Secure Authentication** - Email/password with OTP verification
- **⏱️ Session Tracking** - Advanced stopwatch with customizable laps (Reading, Thinking, Implementation, Debugging)
- **⏲️ Pomodoro Timer** - Focus/break timer with customizable durations
- **📊 Performance Analytics** - Comprehensive graphs and statistics
- **🏆 Gamification System** - League progression and scoring mechanics
- **📈 Leaderboard** - Global rankings and competitive positioning

### 🤖 AI-Powered Features
- **🧠 Rank Buddy AI** - Intelligent coding assistant powered by OpenRouter API
- **💡 Smart Hints** - Context-aware coding guidance and problem-solving tips
- **📝 Code Analysis** - AI-powered code review and optimization suggestions

### 🔗 Codeforces Integration
- **🔍 Problem Discovery** - Fetch problems directly from Codeforces API
- **📊 User Statistics** - Import Codeforces profile data and submission history
- **🎯 Rating Tracking** - Monitor rating changes and performance metrics
- **🏷️ Problem Tagging** - Automatic categorization and difficulty assessment

### 📱 User Experience
- **🌙 Dark Mode** - Modern dark-first UI inspired by Linear and v0.dev
- **📱 Responsive Design** - Mobile-friendly interface for all devices
- **🎨 Clean Aesthetics** - Lucide React icons and Tailwind CSS styling
- **⚡ Real-time Updates** - Live data synchronization and notifications

### 📊 Data & Analytics
- **📈 Performance Graphs** - Score vs rating, time efficiency, daily progress
- **📋 Session History** - Detailed tracksheet with export capabilities
- **🏅 Achievement System** - Unlock badges and milestones
- **📊 Data Export** - Excel/CSV export for external analysis

### 👥 Social Features
- **👤 User Profiles** - Personalized dashboards with statistics
- **🔗 Social Connections** - Follow other programmers
- **💬 Community Insights** - Shared progress and achievements
- **🏃‍♂️ Streak Tracking** - Daily practice streak monitoring

---

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS with custom animations
- **UI Components**: Radix UI primitives with Shadcn/UI
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React

### Backend
- **Runtime**: Next.js API Routes (Serverless)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js 4.x
- **Email**: Mailjet API for OTP verification
- **AI**: OpenRouter SDK for LLM integration

### External APIs
- **Codeforces API**: Problem data and user statistics
- **OpenRouter API**: AI-powered coding assistance
- **Mailjet API**: Email delivery and OTP verification

### Development Tools
- **Package Manager**: npm
- **Linting**: ESLint with Next.js config
- **Type Checking**: TypeScript strict mode
- **Testing**: Manual integration testing
- **Deployment**: Vercel-ready configuration

---

## 📂 Project Structure

```
ranktime/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── api/                      # API Routes
│   │   │   ├── auth/                 # NextAuth configuration
│   │   │   ├── codeforces/           # Codeforces API integration
│   │   │   ├── leaderboard/          # Global rankings
│   │   │   ├── rankbuddy/            # AI chat endpoints
│   │   │   ├── sessions/             # Session CRUD operations
│   │   │   ├── user/                 # User profile endpoints
│   │   │   └── contact/              # Contact form
│   │   ├── dashboard/                # Main dashboard page
│   │   ├── login/                    # Authentication pages
│   │   ├── register/
│   │   ├── verify-otp/
│   │   ├── forgot-password/
│   │   ├── reset-password/
│   │   ├── contact/                  # Contact/Support page
│   │   ├── privacy/                  # Legal pages
│   │   ├── terms/
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Landing page
│   │   └── globals.css               # Global styles
│   ├── components/                   # Reusable UI components
│   │   ├── ui/                       # Shadcn/UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── progress.tsx
│   │   │   └── select.tsx
│   │   ├── dashboard/                # Dashboard tab components
│   │   │   ├── StopwatchTab.tsx      # Session timer
│   │   │   ├── TimerTab.tsx          # Pomodoro timer
│   │   │   ├── TracksheetTab.tsx     # Session history
│   │   │   ├── ProfileTab.tsx        # User profile
│   │   │   ├── GraphsTab.tsx         # Analytics
│   │   │   ├── LeaderboardTab.tsx    # Rankings
│   │   │   ├── CodeforcesTab.tsx     # CF integration
│   │   │   ├── SocialTab.tsx         # Social features
│   │   │   └── RankBuddyTab.tsx      # AI assistant
│   │   └── mode-toggle.tsx           # Theme switcher
│   ├── lib/                          # Utility libraries
│   │   ├── auth.ts                   # NextAuth configuration
│   │   ├── db.ts                     # Database connection
│   │   └── utils.ts                  # Helper functions
│   ├── models/                       # MongoDB schemas
│   │   ├── User.ts                   # User model
│   │   └── Session.ts                # Session model
│   ├── types/                        # TypeScript definitions
│   │   ├── global.d.ts
│   │   └── next-auth.d.ts
│   └── middleware.ts                 # Next.js middleware
├── public/                           # Static assets
│   ├── logo.svg
│   └── favicon.ico
├── test-*.js                         # Integration test scripts
├── package.json                      # Dependencies and scripts
├── tailwind.config.js               # Tailwind configuration
├── next.config.js                   # Next.js configuration
├── tsconfig.json                    # TypeScript configuration
├── .env.local                        # Environment variables
└── README.md                        # This file
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **MongoDB** - Local instance or [MongoDB Atlas](https://cloud.mongodb.com/) account
- **Git** - [Download here](https://git-scm.com/)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/ranktime.git
   cd ranktime
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start MongoDB** (if using local instance)
   ```bash
   # Using MongoDB Compass or mongod
   mongod --dbpath /path/to/your/db
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## ⚙️ Configuration

### Environment Variables

Create a `.env.local` file in the root directory with the following variables (copy from `.env.example`):

```env
# MongoDB Atlas connection
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority

# NextAuth
NEXTAUTH_SECRET=c3b0c932c566ce67af5631648cd281b
NEXTAUTH_URL=https://rank-time.vercel.app/

# Mailjet API (required for OTP emails)
MAILJET_API_KEY=your-mailjet-api-key
MAILJET_SECRET_KEY=your-mailjet-secret-key
FROM_EMAIL=noreply@yourdomain.com
FROM_NAME=RankTime

# Optional providers
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_ID=
GITHUB_SECRET=

# OpenAI API (for enhanced Rank Buddy AI chat - get your API key from https://platform.openai.com/api-keys)
# Without this, Rank Buddy will use free Hugging Face models
OPENAI_API_KEY=
```

### Database Setup

#### Option 1: Local MongoDB (Windows)
1. Run the automated setup script:
   ```bash
   setup-mongodb.bat
   ```
   This script will:
   - Check if MongoDB is installed
   - Create the data directory (`C:\data\db`)
   - Start MongoDB on port 27017
   - Test the connection

2. To stop MongoDB later:
   ```bash
   taskkill /f /im mongod.exe
   ```

#### Option 2: MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a new cluster
3. Get connection string from Atlas dashboard
4. Update `MONGODB_URI` in `.env.local`

#### Option 3: Manual Local Setup
1. Install MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service: `mongod --dbpath "C:\data\db"`
3. Use connection string: `mongodb://localhost:27017/ranktime`

### Testing Database Connection

```bash
npm run test-db
```

This will verify your MongoDB connection and show available collections.

---

## 🤖 AI Integration Setup

### Rank Buddy AI Assistant

RankTime includes an AI-powered coding assistant that provides contextual help and guidance.

#### OpenRouter API Setup

1. **Create OpenRouter Account**
   - Visit [OpenRouter.ai](https://openrouter.ai/)
   - Sign up for an account
   - Add credits (minimum $5 recommended)

2. **Generate API Key**
   - Go to [API Keys](https://openrouter.ai/keys)
   - Create a new API key
   - Copy the key (starts with `sk-or-v1-`)

3. **Configure Environment**
   ```env
   OPENROUTER_API_KEY=sk-or-v1-your-actual-key-here
   ```

4. **Optional: Enhanced AI with OpenAI**
   - Get OpenAI API key from [platform.openai.com](https://platform.openai.com/api-keys)
   - Add to environment: `OPENAI_API_KEY=sk-your-openai-key`
   - Without OpenAI key, Rank Buddy uses free Hugging Face models

5. **Test Integration**
   ```bash
   npm run test-openrouter
   npm run test-rankbuddy
   ```

#### AI Features
- **💡 Smart Hints**: Context-aware coding suggestions
- **🔍 Problem Analysis**: Difficulty assessment and approach guidance
- **📈 Progress Insights**: Personalized improvement recommendations
- **💬 Interactive Chat**: Natural language coding assistance

---

## 📧 Email Integration Setup

### OTP Verification System

RankTime uses email-based OTP verification for secure user registration.

#### Mailjet Setup (Recommended)

1. **Create Mailjet Account**
   - Sign up at [Mailjet](https://www.mailjet.com/)
   - Verify your email and account

2. **Get API Credentials**
   - Navigate to [API Keys](https://app.mailjet.com/account/api_keys)
   - Copy your API Key and Secret Key

3. **Configure Environment**
   ```env
   MAILJET_API_KEY=your-api-key-here
   MAILJET_SECRET_KEY=your-secret-key-here
   FROM_EMAIL=your-verified-sender@yourdomain.com
   FROM_NAME=RankTime
   ```

4. **Domain Verification** (Production)
   - Add and verify your domain in Mailjet
   - Set up SPF/DKIM records for better deliverability

#### Testing Email Integration

```bash
# Test configuration
npm run test-email

# Test actual email sending
npm run test-email-send
```

---

## 🔗 Codeforces Integration

### Connecting Your Account

1. **Create Codeforces Account**
   - Visit [Codeforces.com](https://codeforces.com/)
   - Register and verify your account

2. **Link in RankTime**
   - Go to Dashboard → Codeforces tab
   - Enter your Codeforces handle
   - Authorize the connection

### Features Available

- **📊 Profile Statistics**: Rating, rank, contribution, solved problems
- **📈 Rating History**: Track rating changes over time
- **🎯 Problem Library**: Access to Codeforces problem database
- **🏷️ Tag Analysis**: Understand problem categories and strengths
- **📋 Submission History**: Import solved problems automatically

### API Endpoints

- `GET /api/codeforces/user/:handle` - User profile data
- `GET /api/codeforces/submissions/:handle` - Submission history
- `GET /api/codeforces/problems` - Problem database
- `POST /api/codeforces/sync` - Sync user data

---

## 🎮 Gamification System

### League Progression

RankTime features a 7-tier league system:

| League | Threshold | Color |
|--------|-----------|-------|
| 🥉 Bronze | 0 points | Orange |
| 🥈 Silver | 1,000 points | Gray |
| 🥇 Gold | 2,500 points | Yellow |
| 💎 Platinum | 5,000 points | Cyan |
| 💍 Diamond | 10,000 points | Blue |
| 👑 Master | 20,000 points | Purple |
| 🏆 Grandmaster | 50,000 points | Red |

### Scoring Mechanics

- **Base Score**: Calculated from problem rating and solve time
- **Streak Bonus**: Extra points for consecutive daily practice
- **Time Efficiency**: Bonus for solving problems quickly
- **Difficulty Multiplier**: Higher-rated problems yield more points

### Achievement System

- **First Problem**: Solve your first problem
- **Week Warrior**: 7-day solving streak
- **Score Master**: Reach 1,000+ total points
- **Rating Expert**: Solve problems rated 1,500+
- **Time Lord**: Efficient problem-solving
- **Social Butterfly**: Connect with other users

---

## 📊 Dashboard Features

### Stopwatch Tab
- Customizable lap names (Reading, Thinking, Implementation, Debugging)
- Real-time timing with pause/resume functionality
- Problem metadata input (name, rating, tags)
- Session notes and reflections

### Timer Tab
- Pomodoro-style focus timer (25-minute work sessions)
- Customizable work/break durations
- Session tracking and statistics
- Break reminders and notifications

### Tracksheet Tab
- Complete session history with filtering
- Detailed lap breakdowns
- Performance metrics and trends
- Export to Excel/CSV functionality

### Profile Tab
- Personal statistics and achievements
- League progress visualization
- Streak tracking and badges
- Performance insights

### Graphs Tab
- Score vs Problem Rating scatter plot
- Time vs Rating efficiency analysis
- Daily progress line charts
- Performance insights and recommendations

### Leaderboard Tab
- Global user rankings
- Sortable by various metrics
- Time-range filtering (week/month/all-time)
- Competitive positioning

### Codeforces Tab
- Profile integration and statistics
- Problem discovery and filtering
- Rating history visualization
- Submission analysis

### Social Tab
- User discovery and following
- Community activity feed
- Shared achievements and milestones
- Collaborative features

### Rank Buddy Tab
- AI-powered coding assistant
- Context-aware problem hints
- Code analysis and optimization
- Interactive chat interface

---

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint

# Testing
npm run test-db         # Test database connection
npm run test-email      # Test email configuration
npm run test-openrouter # Test AI integration
npm run test-rankbuddy  # Test Rank Buddy functionality
```

### Code Quality

- **TypeScript**: Strict type checking enabled
- **ESLint**: Next.js recommended configuration
- **Prettier**: Code formatting (via VS Code)
- **Husky**: Pre-commit hooks (planned)

### Database Schema

#### User Model
```typescript
interface IUser {
  name: string;
  email: string;
  codeforcesHandle?: string;
  usertag: string; // Unique identifier
  following: ObjectId[];
  totalScore: number;
  currentStreak: number;
  maxStreak: number;
  league: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'master' | 'grandmaster';
  rank: number;
  totalSessions: number;
}
```

#### Session Model
```typescript
interface ISession {
  user: ObjectId;
  problemId: string;
  problemName: string;
  problemRating: number;
  problemTags: string[];
  laps: ILap[];
  totalTime: number;
  score: number;
  streakBonus: number;
  notes?: string;
  comments?: string;
}
```

---

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**
   - Import project to Vercel
   - Connect GitHub repository

2. **Environment Variables**
   - Add all required environment variables
   - Configure MongoDB Atlas connection

3. **Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Node Version: 18.x

4. **Domain Configuration**
   - Set custom domain (optional)
   - Configure DNS settings

### Manual Deployment

1. **Build Application**
   ```bash
   npm run build
   npm run start
   ```

2. **Environment Setup**
   - Ensure all environment variables are set
   - Configure reverse proxy (nginx/Caddy)
   - Set up SSL certificates

3. **Process Management**
   - Use PM2 for production process management
   - Configure log rotation and monitoring

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run tests and linting**
   ```bash
   npm run lint
   npm run test-db
   ```
5. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use meaningful commit messages
- Update documentation for new features
- Test your changes thoroughly
- Maintain code quality standards

---

## � Deployment

### Vercel Deployment

RankTime is optimized for deployment on Vercel with the following configuration:

#### Environment Variables Setup

1. **Open Vercel Dashboard**
   - Go to your project settings → Environment Variables
   - Add the following variables for Production environment:

```env
NEXTAUTH_URL=https://rank-time.vercel.app/
NEXTAUTH_SECRET=<secure-random-string>
MONGODB_URI=<your-production-mongodb-connection-string>
MAILJET_API_KEY=<your-mailjet-api-key>
MAILJET_SECRET_KEY=<your-mailjet-secret-key>
FROM_EMAIL=noreply@yourdomain.com
FROM_NAME=RankTime
OPENROUTER_API_KEY=<your-openrouter-api-key>
```

2. **Generate NEXTAUTH_SECRET**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. **Preview Deployments**
   - For preview branches, set `NEXTAUTH_URL` to the Vercel preview URL
   - Example: `https://rank-time-git-feature-branch.vercel.app`

#### Deployment Steps

1. **Connect Repository**
   - Import your GitHub repository to Vercel
   - Vercel will automatically detect Next.js settings

2. **Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `.next` (automatic)
   - Node Version: 18.x or later

3. **Domain Configuration**
   - Update `NEXTAUTH_URL` to match your custom domain
   - Configure DNS if using custom domain

#### Troubleshooting Deployment

- **Authentication Issues**: Ensure `NEXTAUTH_URL` matches your deployment URL exactly
- **Database Connection**: Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- **Email Service**: Test Mailjet credentials with `npm run test-email`
- **Debug Logging**: Temporarily set `DEBUG_AUTH=true` for extra logs

#### Testing Deployed Application

```bash
# Test authentication flow
curl -X POST https://your-domain.vercel.app/api/debug/status

# Check database connection (if DEBUG_AUTH=true)
# Monitor Vercel function logs for any errors
```

### Alternative Deployment Options

- **Railway**: Similar to Vercel, supports MongoDB and Next.js
- **Netlify**: Requires additional configuration for API routes
- **Docker**: Use included Dockerfile for containerized deployment

---

## �📊 API Documentation

### Authentication Endpoints

- `POST /api/auth/[...nextauth]` - NextAuth.js handler
- `POST /api/auth/signup` - User registration with OTP
- `POST /api/auth/verify-otp` - OTP verification

### Session Management

- `GET /api/sessions` - Get user sessions
- `POST /api/sessions` - Create new session
- `GET /api/sessions/graph` - Get graph data

### User Management

- `GET /api/user/stats` - Get user statistics
- `GET /api/leaderboard` - Get global rankings

### Codeforces Integration

- `GET /api/codeforces/user/:handle` - Get user profile
- `GET /api/codeforces/submissions/:handle` - Get submissions
- `GET /api/codeforces/problems` - Get problem database

### AI Features

- `POST /api/rankbuddy/chat` - AI chat endpoint
- `GET /api/rankbuddy/suggestions` - Get coding suggestions

---

## 🐛 Troubleshooting

### Common Issues

**Database Connection Failed**
```bash
# Check MongoDB status
npm run test-db

# Verify connection string in .env.local
# Ensure MongoDB is running (local) or Atlas IP whitelist is configured
```

**Email Not Sending**
```bash
# Test email configuration
npm run test-email

# Check Mailjet API keys
# Verify domain verification in Mailjet dashboard
```

**AI Features Not Working**
```bash
# Test OpenRouter connection
npm run test-openrouter

# Verify API key format (should start with sk-or-v1-)
# Check OpenRouter account credits
```

**Build Errors**
```bash
# Clear Next.js cache
rm -rf .next
npm run build

# Check TypeScript errors
npx tsc --noEmit
```

### Debug Mode

Enable debug logging by setting:
```env
DEBUG=true
NEXTAUTH_DEBUG=true
```

---

## 📈 Roadmap

### Phase 1 (Current) ✅
- [x] User authentication with OTP
- [x] Session tracking (stopwatch + timer)
- [x] Basic dashboard with analytics
- [x] Codeforces API integration
- [x] Gamification system
- [x] AI-powered Rank Buddy

### Phase 2 (Next) 🚧
- [ ] Mobile app development
- [ ] Advanced analytics and ML insights
- [ ] Team collaboration features
- [ ] Contest prediction algorithms
- [ ] Integration with other platforms (LeetCode, AtCoder)

### Phase 3 (Future) 📋
- [ ] Real-time multiplayer contests
- [ ] Advanced AI tutoring system
- [ ] Educational content platform
- [ ] Job matching and career insights
- [ ] Global programming events

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Codeforces** for their excellent API and platform
- **OpenRouter** for AI model access
- **Vercel** for hosting and deployment
- **MongoDB** for database services
- **Next.js** team for the amazing framework
- **Shadcn/UI** for beautiful component primitives

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/rafi-Codes/Rank-Time/issues)
- **Discussions**: [GitHub Discussions](https://github.com/rafi-Codes/Rank-Time/discussions)
- **Email**: rafi27hasan@gmail.com

---

## 🎯 Mission

RankTime aims to revolutionize how competitive programmers track and improve their skills by combining data-driven insights with AI-powered guidance. We believe that deliberate practice, when properly measured and analyzed, leads to accelerated learning and mastery.

**Join us in building the future of competitive programming education! 🚀**

