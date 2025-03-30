export interface Command {
  name: string;
  icon: string;
  description: string;
  execute: (app: any) => React.ReactNode;
}

export type Commands = Map<string, Command>;

export interface AppState {
  record: {
    command: string;
    output: React.ReactNode;
  }[];
  commands: Commands;
  projectDataLoaded: boolean;
  projectData?: any[];
  userDataLoaded: boolean;
  userData?: any;
  blogData?: BlogPost[];
}

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  slug: string;
  summary: string;
  content: string;
  author: string;
  isMDX?: boolean;
  component?: React.ComponentType;
}

export interface InputManagerState {
  value: string;
  suggestedValue: string;
}

export interface ListElementProps {
  icon: string;
  name: string;
  link?: string;
  description: string;
  help?: boolean;
}
