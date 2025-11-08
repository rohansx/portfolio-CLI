import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BlogPost } from '../typings';
import commands from '../commands/commands';
import { projects, github_username } from '../config';
import blogPostsModule from '../blogs';

export interface CommandRecord {
  command: string;
  output: React.ReactNode;
}

export interface AppSettings {
  typewriterSpeed: number; // characters per second
  typewriterEnabled: boolean;
  theme: 'default' | 'matrix' | 'retro' | 'hacker';
  soundEnabled: boolean;
}

interface AppContextType {
  // Command state
  record: CommandRecord[];
  addToRecord: (command: string, output: React.ReactNode) => void;
  clearRecord: () => void;

  // Command history (for up/down arrows)
  commandHistory: string[];
  addToHistory: (command: string) => void;

  // GitHub data
  userData: any;
  projectData: any[];
  userDataLoaded: boolean;
  projectDataLoaded: boolean;

  // Blog data
  blogPosts: BlogPost[];
  blogPostsLoaded: boolean;

  // Settings
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;

  // Analytics
  analytics: {
    commandCounts: Record<string, number>;
    totalCommands: number;
  };
  trackCommand: (command: string) => void;

  // Commands map
  commands: typeof commands;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const HISTORY_KEY = 'terminal_command_history';
const ANALYTICS_KEY = 'terminal_analytics';
const SETTINGS_KEY = 'terminal_settings';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [record, setRecord] = useState<CommandRecord[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [userData, setUserData] = useState<any>(null);
  const [projectData, setProjectData] = useState<any[]>([]);
  const [userDataLoaded, setUserDataLoaded] = useState(false);
  const [projectDataLoaded, setProjectDataLoaded] = useState(false);

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [blogPostsLoaded, setBlogPostsLoaded] = useState(false);

  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      return saved ? JSON.parse(saved) : {
        typewriterSpeed: 50,
        typewriterEnabled: true,
        theme: 'default',
        soundEnabled: false,
      };
    } catch {
      return {
        typewriterSpeed: 50,
        typewriterEnabled: true,
        theme: 'default',
        soundEnabled: false,
      };
    }
  });

  const [analytics, setAnalytics] = useState<{
    commandCounts: Record<string, number>;
    totalCommands: number;
  }>(() => {
    try {
      const saved = localStorage.getItem(ANALYTICS_KEY);
      return saved ? JSON.parse(saved) : { commandCounts: {}, totalCommands: 0 };
    } catch {
      return { commandCounts: {}, totalCommands: 0 };
    }
  });

  // Load GitHub data on mount
  useEffect(() => {
    const loadGitHubData = async () => {
      try {
        // Fetch project data
        const promises = projects.map((project) =>
          fetch(`https://api.github.com/repos/${project}`).then((res) => res.json())
        );
        const projectResults = await Promise.all(promises);
        setProjectData(projectResults);
        setProjectDataLoaded(true);

        // Fetch user data
        const userResult = await fetch(
          `https://api.github.com/users/${github_username}`
        ).then((res) => res.json());
        setUserData(userResult);
        setUserDataLoaded(true);
      } catch (error) {
        console.error('Error loading GitHub data:', error);
        setProjectDataLoaded(true);
        setUserDataLoaded(true);
      }
    };

    loadGitHubData();
  }, []);

  // Load blog posts on mount
  useEffect(() => {
    const loadBlogPosts = async () => {
      try {
        const posts = await blogPostsModule.getBlogPosts();
        setBlogPosts(posts);
        setBlogPostsLoaded(true);
      } catch (error) {
        console.error('Error loading blog posts:', error);
        setBlogPostsLoaded(true);
      }
    };

    loadBlogPosts();
  }, []);

  // Persist command history
  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(commandHistory.slice(-100))); // Keep last 100
  }, [commandHistory]);

  // Persist settings
  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  // Persist analytics
  useEffect(() => {
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(analytics));
  }, [analytics]);

  const addToRecord = (command: string, output: React.ReactNode) => {
    setRecord((prev) => [...prev, { command, output }]);
  };

  const clearRecord = () => {
    setRecord([]);
  };

  const addToHistory = (command: string) => {
    if (command.trim()) {
      setCommandHistory((prev) => {
        // Don't add duplicate consecutive commands
        if (prev[prev.length - 1] === command) return prev;
        return [...prev, command];
      });
    }
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const trackCommand = (command: string) => {
    setAnalytics((prev) => ({
      commandCounts: {
        ...prev.commandCounts,
        [command]: (prev.commandCounts[command] || 0) + 1,
      },
      totalCommands: prev.totalCommands + 1,
    }));
  };

  const value: AppContextType = {
    record,
    addToRecord,
    clearRecord,
    commandHistory,
    addToHistory,
    userData,
    projectData,
    userDataLoaded,
    projectDataLoaded,
    blogPosts,
    blogPostsLoaded,
    settings,
    updateSettings,
    analytics,
    trackCommand,
    commands,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
