# Telegram Goal Manager Bot

Simple Telegram bot for managing group goals with persistent PostgreSQL storage.

## 🚀 Deploy to Railway (Free)

1. Upload project to GitHub repository
2. Go to [Railway.app](https://railway.app) 
3. "Deploy from GitHub repo"
4. Add PostgreSQL database 
5. Set `TELEGRAM_BOT_TOKEN` environment variable
6. Bot deploys automatically

## 🤖 Bot Commands

- `/newgoal <title>` - Create group goal
- `/goals` - List active goals  
- `/complete <id>` - Mark goal complete
- `/help` - Show commands

## 📱 Usage

1. Get bot token from [@BotFather](https://t.me/BotFather)
2. Add bot to Telegram group
3. Create goals and track progress
4. All data saved to PostgreSQL database

## 🛠️ Tech Stack

- Node.js + Express
- PostgreSQL + Drizzle ORM  
- Telegram Bot API
- React monitoring dashboard

Built for Railway deployment with zero configuration required.