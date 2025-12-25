# 🚀 RankTime - Unleash Skills Beyond The Clock

RankTime is a full-stack web application designed to help **competitive programmers** track their deliberate practice, analyze progress, and stay motivated through gamification and social features.

---

## ✨ Features

- **Codeforces Integration**  
  Fetch the latest solved problems with ratings and tags using the Codeforces API.

- **Session Tracker**  
  Stopwatch with customizable laps (Reading, Thinking, Implementation, Debugging).

- **Gamification**  
  - Session scoring based on difficulty & time.  
  - League system (Bronze → Silver → Gold → …).  
  - Global leaderboard to compare progress.

- **Dashboard & Analytics**  
  - Rating vs. Time graph.  
  - Score vs Problem Rating.  
  - Daily Progress.

- **Data Export**  
  Export session history ("Tracksheet") as Excel/CSV.

- **Social Reflection**  
  Add comments/reflections to problems before saving.

- **UI/UX**  
  - Responsive design (mobile-friendly).  
  - Dark-mode focused UI inspired by [linear.app](https://linear.app) and [v0.dev](https://v0.dev).  
  - Lucide-react icons for a clean aesthetic.

---

## 🛠 Tech Stack
- **Frontend:** Next.js, Tailwind CSS, Shadcn/UI  
- **Backend:** Next.js API routes, MongoDB Atlas  
- **Auth:** NextAuth.js  
- **Database:** MongoDB Atlas  
- **Icons:** Lucide-react  

---

## 📂 Project Structure
ranktime/ ├── app/ │   ├── page.tsx          # Landing Page │   ├── api/ │   │   ├── auth/         # NextAuth.js setup │   │   └── sessions/     # Session API routes ├── components/           # Reusable UI components ├── lib/ │   ├── mongodb.ts        # MongoDB connection │   └── auth.ts           # NextAuth configuration ├── models/ │   ├── User.ts           # User schema │   └── Session.ts        # Session schema ├── public/               # Static assets ├── styles/               # Tailwind + global styles └── README.md

---

# 🔑 Authentication
- Implemented using **NextAuth.js** with credentials provider (email/password).  
- Future support for OAuth (GitHub, Google) can be added.  

---

# 🌐 Landing Page
- Minimal dark-mode landing page.  
- Login/Register button powered by **NextAuth**.  
- Responsive design with **Tailwind CSS** + **Shadcn/UI** components.  

---

# 🚀 Getting Started

## Prerequisites
- **Node.js 18+**  
- **MongoDB Atlas** account  
- **Codeforces API key** (optional for extended features)

---

# ⚙️ Installation
```bash
git clone https://github.com/your-username/ranktime.git
cd ranktime
npm install
```
---

# 🔧 Environment Variables
Create a `.env.local` file with the following values:
- MONGODB_URI=your_mongodb_connection_string
- NEXTAUTH_SECRET=your_secret_key
- NEXTAUTH_URL=http://localhost:3000
- OPENROUTER_API_KEY=your_openrouter_api_key (required for Rank Buddy AI chat)
- MAILJET_API_KEY=your_mailjet_api_key
- MAILJET_SECRET_KEY=your_mailjet_secret_key
- FROM_EMAIL=noreply@yourdomain.com
- FROM_NAME=RankTime

## 🤖 Rank Buddy AI Setup (Required for AI Chat)

Rank Buddy uses AI to provide coding hints and guidance. You need an OpenRouter API key:

1. **Create OpenRouter Account**:
   - Sign up at [OpenRouter.ai](https://openrouter.ai/)
   - Add credits to your account (minimum $5 recommended)

2. **Get API Key**:
   - Go to [API Keys](https://openrouter.ai/keys)
   - Create a new API key
   - Copy the key (starts with `sk-or-v1-`)

3. **Update `.env.local`**:
   ```
   OPENROUTER_API_KEY=sk-or-v1-your-actual-key-here
   ```

4. **Test the Integration**:
   ```bash
   npm run test-openrouter
   ```

**Note**: Without a valid OpenRouter API key, Rank Buddy will return fallback responses instead of AI-generated guidance.

## 📧 Email Setup (Required for OTP Verification)

RankTime uses email OTP verification for user registration. We recommend using **Mailjet** for reliable email delivery.

### Using Mailjet API (Recommended)

1. **Create a Mailjet Account**:
   - Sign up at [Mailjet](https://www.mailjet.com/)
   - Verify your account and domain

2. **Get API Keys**:
   - Go to [API Keys](https://app.mailjet.com/account/api_keys)
   - Copy your API Key and Secret Key

3. **Update `.env.local`**:
   ```
   MAILJET_API_KEY=your-api-key-here
   MAILJET_SECRET_KEY=your-secret-key-here
   FROM_EMAIL=your-verified-sender@yourdomain.com
   FROM_NAME=RankTime
   ```

4. **Verify Your Domain** (for production):
   - In Mailjet dashboard, go to Sender Addresses
   - Add and verify your domain for better deliverability

**Note**: Without proper email configuration, OTP emails will not be sent, but the registration process will still work (users can register but won't receive verification codes).

### Testing Integrations

#### Email Testing
After configuring your email settings, you can test the integration:

1. **Check email configuration**:
   ```bash
   npm run test-email
   ```

2. **Test actual email sending**:
   ```bash
   npm run test-email-send
   ```
   *Note: Update the email address in `test-email-send.js` to your actual email for testing*

3. **Using the API endpoint** (when server is running):
   ```bash
   curl -X POST http://localhost:3000/api/test-email \
     -H "Content-Type: application/json" \
     -d '{"email":"your-test-email@example.com"}'
   ```

#### AI Testing
Test the Rank Buddy AI integration:

1. **Test OpenRouter API connection**:
   ```bash
   npm run test-openrouter
   ```

2. **Test Rank Buddy chat functionality**:
   ```bash
   npm run test-rankbuddy
   ```

3. **Test Rank Buddy chat** (when server is running):
   - Start the app: `npm run dev`
   - Go to Rank Buddy tab and send a message

4. **Test registration flow**:
   - Start the app: `npm run dev`
   - Try registering a new user
   - Check your email for the OTP

## 🤖 Rank Buddy AI Setup
Rank Buddy uses AI to provide coding hints and guidance. For the best experience:

1. **Get OpenAI API Key** (recommended):
   - Visit [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create a new API key
   - Add it to your `.env.local`: `OPENAI_API_KEY=your_key_here`

2. **Without API Key**:
   - Rank Buddy will use free Hugging Face models
   - Responses may be less intelligent but still helpful
   - No cost, but potentially generic responses

The chat interface will show badges indicating which AI provider is responding:
- 🟢 **GPT**: OpenAI GPT-3.5-turbo (best quality)
- 🔵 **AI**: Hugging Face models
- ⚪ **Basic**: Fallback responses

---

# 📊 Roadmap
- [ ] Codeforces API integration  
- [ ] Stopwatch + Lap tracker  
- [ ] Gamification scoring system  
- [ ] Dashboard analytics graphs  
- [ ] Data export (Excel/CSV)  
- [ ] Global leaderboard  
- [ ] Social reflections/comments  

---

# 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you’d like to change.

---

# 📜 License
MIT License © 2025 RankTime Contributors

