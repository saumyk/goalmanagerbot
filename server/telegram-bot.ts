import TelegramBot from 'node-telegram-bot-api';
import { storage } from './storage';
import type { InsertGoal } from '@shared/schema';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || process.env.BOT_TOKEN || "";

export class GoalBot {
  private bot: TelegramBot | null = null;
  private isActive = false;

  constructor() {
    if (!BOT_TOKEN) {
      console.log("⚠️ Bot not initialized - missing TELEGRAM_BOT_TOKEN");
      return;
    }

    try {
      this.bot = new TelegramBot(BOT_TOKEN, { polling: true });
      this.isActive = true;
      this.setupCommands();
      this.setupErrorHandling();
    } catch (error) {
      console.error('❌ Failed to initialize bot:', error);
      this.isActive = false;
    }
  }

  private setupCommands() {
    if (!this.bot || !this.isActive) return;

    // Help command
    this.bot.onText(/\/help(@\w+)?/, async (msg) => {
      const chatId = msg.chat.id;
      const helpMessage = `📋 GoalBot Commands:

/newgoal <title> - Create a new group goal
/goals - List all active goals
/complete <id> - Mark goal as complete
/help - Show this help message

Example:
/newgoal Launch marketing campaign
/complete 2`;

      await this.bot!.sendMessage(chatId, helpMessage);
    });

    // New goal command
    this.bot.onText(/\/newgoal(@\w+)?\s+(.+)/, async (msg, match) => {
      console.log('🎯 /newgoal command received');
      const chatId = msg.chat.id.toString();
      const title = match?.[2]?.trim();
      const username = msg.from?.username || msg.from?.first_name || 'Unknown';

      if (!title) {
        await this.bot!.sendMessage(msg.chat.id, "❌ Please provide a goal title.\nExample: /newgoal Launch marketing campaign");
        return;
      }

      try {
        const goalData: InsertGoal = {
          title,
          chatId,
          createdBy: username
        };

        const newGoal = await storage.createGoal(goalData);
        
        const successMessage = `✅ Goal Created!

🎯 Goal #${newGoal.id}: ${newGoal.title}
👤 Created by @${username}
💬 Chat: ${msg.chat.title || 'Group Chat'}

Use /complete ${newGoal.id} when finished!`;

        await this.bot!.sendMessage(msg.chat.id, successMessage);
      } catch (error) {
        console.error('Error creating goal:', error);
        await this.bot!.sendMessage(msg.chat.id, "❌ Error creating goal. Please try again.");
      }
    });

    // List goals command
    this.bot.onText(/\/goals(@\w+)?/, async (msg) => {
      console.log('📋 /goals command received');
      const chatId = msg.chat.id.toString();

      try {
        const goals = await storage.getActiveGoalsByChat(chatId);
        
        if (goals.length === 0) {
          await this.bot!.sendMessage(msg.chat.id, "📭 No active goals in this chat.\n\nCreate one with: /newgoal <title>");
          return;
        }

        let message = `📋 Active Goals (${goals.length}):\n\n`;
        
        goals.forEach((goal, index) => {
          const timeAgo = this.getTimeAgo(new Date(goal.createdAt));
          message += `${index + 1}. Goal #${goal.id}: ${goal.title}\n`;
          message += `   👤 Created by @${goal.createdBy} ${timeAgo}\n`;
          message += `   ✅ Complete with: /complete ${goal.id}\n\n`;
        });

        await this.bot!.sendMessage(msg.chat.id, message);
      } catch (error) {
        console.error('Error fetching goals:', error);
        await this.bot!.sendMessage(msg.chat.id, "❌ Error fetching goals. Please try again.");
      }
    });

    // Complete goal command
    this.bot.onText(/\/complete(@\w+)?\s+(\d+)/, async (msg, match) => {
      console.log('✅ /complete command received');
      const goalId = parseInt(match?.[2] || '0');
      const username = msg.from?.username || msg.from?.first_name || 'Unknown';

      if (!goalId) {
        await this.bot!.sendMessage(msg.chat.id, "❌ Please provide a valid goal ID.\nExample: /complete 2");
        return;
      }

      try {
        const existingGoal = await storage.getGoal(goalId);
        
        if (!existingGoal) {
          await this.bot!.sendMessage(msg.chat.id, "❌ Goal not found. Use /goals to see available goals.");
          return;
        }

        if (existingGoal.chatId !== msg.chat.id.toString()) {
          await this.bot!.sendMessage(msg.chat.id, "❌ Goal not found in this chat.");
          return;
        }

        if (existingGoal.status === 'completed') {
          await this.bot!.sendMessage(msg.chat.id, `✅ Goal #${goalId} is already completed by @${existingGoal.completedBy}!`);
          return;
        }

        const completedGoal = await storage.completeGoal(goalId, username);
        
        if (completedGoal) {
          const successMessage = `🎉 Goal Completed!

✅ Goal #${goalId}: ${completedGoal.title}
Completed by @${username}
🎊 Great work team!

Goal has been marked as complete in the database.`;

          await this.bot!.sendMessage(msg.chat.id, successMessage);
        } else {
          await this.bot!.sendMessage(msg.chat.id, "❌ Error completing goal. Please try again.");
        }
      } catch (error) {
        await this.bot!.sendMessage(msg.chat.id, "❌ Error completing goal. Please try again.");
      }
    });

    // Handle unknown commands
    this.bot.on('message', async (msg) => {
      if (msg.text?.startsWith('/') && !msg.text.match(/\/(help|newgoal|goals|complete)(@\w+)?/)) {
        await this.bot!.sendMessage(msg.chat.id, "❓ Unknown command. Use /help to see available commands.");
      }
    });
  }

  private setupErrorHandling() {
    if (!this.bot || !this.isActive) return;

    this.bot.on('error', (error) => {
      console.error('❌ Bot error:', error);
    });

    this.bot.on('polling_error', (error) => {
      console.error('❌ Polling error:', error);
    });
  }

  private getTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  }

  public async start() {
    if (!BOT_TOKEN) {
      console.log('⚠️ Bot not started - missing TELEGRAM_BOT_TOKEN');
      console.log('💡 Set TELEGRAM_BOT_TOKEN environment variable to enable bot');
      return;
    }

    if (!this.bot || !this.isActive) {
      console.log('⚠️ Bot not active - initialization failed');
      return;
    }
    
    try {
      const me = await this.bot.getMe();
      console.log('🤖 GoalBot started successfully!');
      console.log(`📞 Connected as: @${me.username} (${me.first_name})`);
      console.log('Bot is listening for commands...');
    } catch (error) {
      console.error('❌ Failed to start bot:', error);
      console.log('💡 This is normal if TELEGRAM_BOT_TOKEN is not set');
      this.isActive = false;
    }
  }
}