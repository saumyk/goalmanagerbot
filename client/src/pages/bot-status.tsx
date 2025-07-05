import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Bot, MessageCircle, Target } from "lucide-react";

interface BotStatus {
  status: string;
  message: string;
  timestamp: string;
}

export default function BotStatus() {
  const { data: botStatus, isLoading } = useQuery<BotStatus>({
    queryKey: ["/api/bot/status"],
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-600">Checking bot status...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">GoalBot Status</h1>
          <p className="text-gray-600">Telegram Group Goal Manager Bot</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Bot Status Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bot Status</CardTitle>
              <Bot className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Badge 
                  variant={botStatus?.status === "online" ? "default" : "destructive"}
                  className={botStatus?.status === "online" ? "bg-green-500 hover:bg-green-600" : ""}
                >
                  {botStatus?.status === "online" ? "Online" : "Offline"}
                </Badge>
                {botStatus?.status === "online" && (
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {botStatus?.message || "Status unknown"}
              </p>
            </CardContent>
          </Card>

          {/* Commands Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Commands</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm">
                  <code className="bg-gray-100 px-1 rounded text-xs">/newgoal</code>
                  <span className="text-muted-foreground ml-2">Create goal</span>
                </div>
                <div className="text-sm">
                  <code className="bg-gray-100 px-1 rounded text-xs">/goals</code>
                  <span className="text-muted-foreground ml-2">List goals</span>
                </div>
                <div className="text-sm">
                  <code className="bg-gray-100 px-1 rounded text-xs">/complete</code>
                  <span className="text-muted-foreground ml-2">Mark complete</span>
                </div>
                <div className="text-sm">
                  <code className="bg-gray-100 px-1 rounded text-xs">/help</code>
                  <span className="text-muted-foreground ml-2">Show help</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Features</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Group goal management
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Progress tracking
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Command-based interface
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Error handling
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              How to Use the Bot
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <h3 className="font-medium text-blue-900 mb-2">🤖 Add Bot to Your Group</h3>
                <p className="text-blue-800 text-sm">
                  Add the GoalBot to your Telegram group chat to start managing goals collaboratively.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border rounded-lg p-4">
                  <h4 className="font-medium mb-2">📝 Create Goals</h4>
                  <code className="text-sm bg-gray-100 p-2 rounded block">
                    /newgoal Launch marketing campaign
                  </code>
                </div>
                
                <div className="bg-white border rounded-lg p-4">
                  <h4 className="font-medium mb-2">📋 View Goals</h4>
                  <code className="text-sm bg-gray-100 p-2 rounded block">
                    /goals
                  </code>
                </div>
                
                <div className="bg-white border rounded-lg p-4">
                  <h4 className="font-medium mb-2">✅ Complete Goals</h4>
                  <code className="text-sm bg-gray-100 p-2 rounded block">
                    /complete 2
                  </code>
                </div>
                
                <div className="bg-white border rounded-lg p-4">
                  <h4 className="font-medium mb-2">❓ Get Help</h4>
                  <code className="text-sm bg-gray-100 p-2 rounded block">
                    /help
                  </code>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {botStatus?.timestamp && (
          <div className="text-center mt-6 text-sm text-gray-500">
            Last updated: {new Date(botStatus.timestamp).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
}
