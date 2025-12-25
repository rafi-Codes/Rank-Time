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
- OPENAI_API_KEY=your_openai_api_key (optional - for enhanced Rank Buddy AI chat)

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

