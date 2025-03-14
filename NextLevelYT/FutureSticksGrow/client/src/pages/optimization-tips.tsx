import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { defaultOptimizationTasks } from "@/lib/ai-utils";
import BaseLayout from "@/components/layout/base-layout";
import { GlassCard } from "@/components/ui/3d-animation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Loader2, Search, ArrowRight, BoltIcon, BarChart2 } from "lucide-react";

interface OptimizationTask {
  id: number;
  userId: number;
  title: string;
  description: string;
  isCompleted: boolean;
  category: string;
}

export default function OptimizationTips() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  
  // For demonstration, we're using a hardcoded userId
  // In a real application, this would come from an auth context
  const userId = 1;
  
  // Fetch optimization tasks
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['/api/optimization-tasks/user', userId],
    queryFn: async () => {
      try {
        const response = await apiRequest('GET', `/api/optimization-tasks/user/${userId}`);
        return response.json();
      } catch (error) {
        console.error("Error fetching tasks:", error);
        return [];
      }
    }
  });
  
  // Toggle task completion status
  const toggleTaskMutation = useMutation({
    mutationFn: async (taskId: number) => {
      const task = tasks.find(t => t.id === taskId);
      if (!task) throw new Error("Task not found");
      
      const response = await apiRequest('PATCH', `/api/optimization-tasks/${taskId}`, {
        isCompleted: !task.isCompleted
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/optimization-tasks/user', userId] });
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Could not update task",
        variant: "destructive"
      });
    }
  });
  
  // Filter tasks by category and search query
  const filterTasks = (tasks: OptimizationTask[], category?: string) => {
    return tasks.filter(task => {
      const matchesCategory = !category || category === 'all' || task.category === category;
      const matchesSearch = !searchQuery || 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        task.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  };
  
  // Calculate completion percentage
  const calculateCompletion = (tasks: OptimizationTask[]) => {
    if (tasks.length === 0) return 0;
    const completedCount = tasks.filter(task => task.isCompleted).length;
    return Math.round((completedCount / tasks.length) * 100);
  };
  
  // Get tasks by category
  const thumbnailTasks = filterTasks(tasks, 'thumbnails');
  const titleTasks = filterTasks(tasks, 'titles');
  const descriptionTasks = filterTasks(tasks, 'descriptions');
  const tagsTasks = filterTasks(tasks, 'tags');
  const endscreenTasks = filterTasks(tasks, 'endscreens');
  const allTasks = filterTasks(tasks);
  
  const completionPercentage = calculateCompletion(tasks);
  
  return (
    <BaseLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="font-orbitron text-4xl font-bold mb-4">Optimization Tips</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Follow our proven optimization strategies to improve your video discoverability, engagement, and overall performance.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <GlassCard className="mb-8">
              <h2 className="font-orbitron text-xl font-semibold mb-4">Overall Progress</h2>
              
              <div className="text-center py-4">
                <div className="inline-block rounded-full bg-gradient-to-r from-primary to-secondary p-[3px] mb-4">
                  <div className="bg-[#121212] rounded-full p-6">
                    <span className="text-4xl font-bold">{completionPercentage}%</span>
                  </div>
                </div>
                <p className="text-gray-400">Optimization Complete</p>
              </div>
              
              <Progress 
                value={completionPercentage} 
                className="h-2 mt-2 bg-dark"
                indicatorClassName="bg-gradient-to-r from-primary to-secondary"
              />
              
              <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">Thumbnails</span>
                  <span className="text-sm">{calculateCompletion(thumbnailTasks)}%</span>
                </div>
                <Progress 
                  value={calculateCompletion(thumbnailTasks)} 
                  className="h-1 mb-4 bg-dark"
                  indicatorClassName="bg-primary"
                />
                
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">Titles</span>
                  <span className="text-sm">{calculateCompletion(titleTasks)}%</span>
                </div>
                <Progress 
                  value={calculateCompletion(titleTasks)} 
                  className="h-1 mb-4 bg-dark"
                  indicatorClassName="bg-secondary"
                />
                
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">Descriptions</span>
                  <span className="text-sm">{calculateCompletion(descriptionTasks)}%</span>
                </div>
                <Progress 
                  value={calculateCompletion(descriptionTasks)} 
                  className="h-1 mb-4 bg-dark"
                  indicatorClassName="bg-accent"
                />
                
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">Tags & Cards</span>
                  <span className="text-sm">{calculateCompletion(tagsTasks)}%</span>
                </div>
                <Progress 
                  value={calculateCompletion(tagsTasks)} 
                  className="h-1 mb-4 bg-dark"
                  indicatorClassName="bg-primary"
                />
                
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">End Screens</span>
                  <span className="text-sm">{calculateCompletion(endscreenTasks)}%</span>
                </div>
                <Progress 
                  value={calculateCompletion(endscreenTasks)} 
                  className="h-1 bg-dark"
                  indicatorClassName="bg-secondary"
                />
              </div>
            </GlassCard>
            
            <GlassCard>
              <div className="flex items-center mb-6 space-x-2">
                <h2 className="font-orbitron text-xl font-semibold">Premium Tools</h2>
                <span className="bg-secondary bg-opacity-20 text-secondary px-3 py-1 rounded-full text-xs">EXCLUSIVE</span>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-dark bg-opacity-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <BoltIcon className="text-secondary mr-2 h-5 w-5" />
                    <h3 className="font-medium">A/B Testing</h3>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">Test different thumbnails and titles to find what works best for your audience.</p>
                  <Button className="w-full bg-secondary bg-opacity-20 hover:bg-opacity-30 text-secondary">
                    Unlock A/B Testing
                  </Button>
                </div>
                
                <div className="p-4 bg-dark bg-opacity-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <BarChart2 className="text-secondary mr-2 h-5 w-5" />
                    <h3 className="font-medium">Competitor Analysis</h3>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">Analyze top-performing videos in your niche to improve your content strategy.</p>
                  <Button className="w-full bg-secondary bg-opacity-20 hover:bg-opacity-30 text-secondary">
                    Unlock Competitor Analysis
                  </Button>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-700 text-center">
                <p className="text-sm text-gray-400 mb-4">Upgrade to premium for advanced optimization tools</p>
                <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                  Upgrade to Premium
                </Button>
              </div>
            </GlassCard>
          </div>
          
          <div className="lg:col-span-3">
            <GlassCard className="mb-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <h2 className="font-orbitron text-xl font-semibold">Optimization Tasks</h2>
                <div className="relative w-full md:w-auto">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Search tasks..." 
                    className="bg-dark bg-opacity-50 border-gray-700 pl-9 w-full md:w-60"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <Tabs defaultValue="all">
                <TabsList className="mb-6 bg-dark bg-opacity-50 w-full justify-start overflow-x-auto">
                  <TabsTrigger value="all">All Tasks</TabsTrigger>
                  <TabsTrigger value="thumbnails">Thumbnails</TabsTrigger>
                  <TabsTrigger value="titles">Titles</TabsTrigger>
                  <TabsTrigger value="descriptions">Descriptions</TabsTrigger>
                  <TabsTrigger value="tags">Tags & Cards</TabsTrigger>
                  <TabsTrigger value="endscreens">End Screens</TabsTrigger>
                </TabsList>
                
                {isLoading ? (
                  <div className="flex justify-center items-center py-10">
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                  </div>
                ) : (
                  <>
                    <TabsContent value="all">
                      <div className="space-y-4">
                        {allTasks.length > 0 ? allTasks.map((task) => (
                          <TaskItem 
                            key={task.id} 
                            task={task} 
                            onToggle={() => toggleTaskMutation.mutate(task.id)} 
                            isPending={toggleTaskMutation.isPending}
                          />
                        )) : (
                          <EmptyTaskState searchQuery={searchQuery} />
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="thumbnails">
                      <div className="space-y-4">
                        {thumbnailTasks.length > 0 ? thumbnailTasks.map((task) => (
                          <TaskItem 
                            key={task.id} 
                            task={task} 
                            onToggle={() => toggleTaskMutation.mutate(task.id)} 
                            isPending={toggleTaskMutation.isPending}
                          />
                        )) : (
                          <EmptyTaskState searchQuery={searchQuery} category="thumbnail" />
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="titles">
                      <div className="space-y-4">
                        {titleTasks.length > 0 ? titleTasks.map((task) => (
                          <TaskItem 
                            key={task.id} 
                            task={task} 
                            onToggle={() => toggleTaskMutation.mutate(task.id)} 
                            isPending={toggleTaskMutation.isPending}
                          />
                        )) : (
                          <EmptyTaskState searchQuery={searchQuery} category="title" />
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="descriptions">
                      <div className="space-y-4">
                        {descriptionTasks.length > 0 ? descriptionTasks.map((task) => (
                          <TaskItem 
                            key={task.id} 
                            task={task} 
                            onToggle={() => toggleTaskMutation.mutate(task.id)} 
                            isPending={toggleTaskMutation.isPending}
                          />
                        )) : (
                          <EmptyTaskState searchQuery={searchQuery} category="description" />
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="tags">
                      <div className="space-y-4">
                        {tagsTasks.length > 0 ? tagsTasks.map((task) => (
                          <TaskItem 
                            key={task.id} 
                            task={task} 
                            onToggle={() => toggleTaskMutation.mutate(task.id)} 
                            isPending={toggleTaskMutation.isPending}
                          />
                        )) : (
                          <EmptyTaskState searchQuery={searchQuery} category="tags and cards" />
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="endscreens">
                      <div className="space-y-4">
                        {endscreenTasks.length > 0 ? endscreenTasks.map((task) => (
                          <TaskItem 
                            key={task.id} 
                            task={task} 
                            onToggle={() => toggleTaskMutation.mutate(task.id)} 
                            isPending={toggleTaskMutation.isPending}
                          />
                        )) : (
                          <EmptyTaskState searchQuery={searchQuery} category="end screens" />
                        )}
                      </div>
                    </TabsContent>
                  </>
                )}
              </Tabs>
            </GlassCard>
            
            <GlassCard>
              <h2 className="font-orbitron text-xl font-semibold mb-6">SEO & Keyword Tools</h2>
              
              <div className="mb-5">
                <label className="block text-sm font-medium mb-2">Research Keywords</label>
                <div className="flex">
                  <Input 
                    placeholder="Enter topic or keyword" 
                    className="flex-grow bg-dark bg-opacity-50 border-gray-700 rounded-r-none" 
                  />
                  <Button className="bg-secondary hover:bg-opacity-90 rounded-l-none px-4">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between p-3 bg-dark bg-opacity-50 rounded-lg">
                  <span>"gaming setup ideas"</span>
                  <div>
                    <span className="text-green-500 mr-1">High</span>
                    <span className="text-xs bg-green-500 bg-opacity-20 text-green-500 px-2 py-1 rounded">135K</span>
                  </div>
                </div>
                <div className="flex justify-between p-3 bg-dark bg-opacity-50 rounded-lg">
                  <span>"budget gaming setup"</span>
                  <div>
                    <span className="text-green-500 mr-1">High</span>
                    <span className="text-xs bg-green-500 bg-opacity-20 text-green-500 px-2 py-1 rounded">89K</span>
                  </div>
                </div>
                <div className="flex justify-between p-3 bg-dark bg-opacity-50 rounded-lg">
                  <span>"gaming desk organization"</span>
                  <div>
                    <span className="text-yellow-500 mr-1">Medium</span>
                    <span className="text-xs bg-yellow-500 bg-opacity-20 text-yellow-500 px-2 py-1 rounded">27K</span>
                  </div>
                </div>
              </div>
              
              <Button className="w-full border border-secondary text-secondary hover:bg-secondary hover:bg-opacity-10">
                View Detailed Keyword Analysis <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </GlassCard>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}

interface TaskItemProps {
  task: OptimizationTask;
  onToggle: () => void;
  isPending: boolean;
}

function TaskItem({ task, onToggle, isPending }: TaskItemProps) {
  return (
    <div className="flex items-start p-4 bg-dark bg-opacity-50 rounded-lg hover:bg-opacity-70 transition-all">
      {isPending ? (
        <div className="mt-1 mr-3 h-4 w-4">
          <Loader2 className="h-4 w-4 animate-spin text-secondary" />
        </div>
      ) : (
        <input 
          type="checkbox" 
          className="mt-1 mr-3 h-4 w-4" 
          style={{ accentColor: "#8A2BE2" }}
          checked={task.isCompleted}
          onChange={onToggle}
        />
      )}
      <div>
        <p className={`font-medium ${task.isCompleted ? 'line-through text-gray-500' : ''}`}>
          {task.title}
        </p>
        <p className={`text-sm ${task.isCompleted ? 'line-through text-gray-600' : 'text-gray-400'}`}>
          {task.description}
        </p>
        <div className="flex mt-2 text-xs text-gray-500">
          <span className={`bg-${getCategoryColor(task.category)} bg-opacity-10 text-${getCategoryColor(task.category)} px-2 py-0.5 rounded`}>
            {formatCategory(task.category)}
          </span>
        </div>
      </div>
    </div>
  );
}

function EmptyTaskState({ searchQuery, category }: { searchQuery: string, category?: string }) {
  let message = "No tasks found";
  
  if (searchQuery) {
    message = `No tasks matching "${searchQuery}"`;
  } else if (category) {
    message = `No ${category} optimization tasks available`;
  }
  
  return (
    <div className="text-center py-8">
      <p className="text-gray-400 mb-2">{message}</p>
      {!searchQuery && (
        <p className="text-sm text-gray-500">Complete existing tasks to unlock more optimization tips</p>
      )}
    </div>
  );
}

function getCategoryColor(category: string): string {
  switch (category) {
    case 'thumbnails': return 'primary';
    case 'titles': return 'secondary';
    case 'descriptions': return 'accent';
    case 'tags': return 'green-500';
    case 'endscreens': return 'yellow-500';
    default: return 'gray-400';
  }
}

function formatCategory(category: string): string {
  return category.charAt(0).toUpperCase() + category.slice(1);
}
