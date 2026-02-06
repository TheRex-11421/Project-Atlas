
export interface UserPreferences {
  branch: string;
  year: string;
  interests: string;
  skillLevel: SkillLevel;
  duration: string;
}

export enum SkillLevel {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced'
}

export interface ProjectSuggestion {
  id: string;
  title: string;
  description: string;
  difficulty: SkillLevel;
  estimatedTime: string;
  techStack: string[];
  learningOutcomes: string[];
  sourceUrls?: string[];
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  duration: string;
  tasks: Task[];
  resources: string[];
}

export interface ProjectRoadmap {
  projectId: string;
  title: string;
  milestones: Milestone[];
  finalAdvice: string;
  overallProgress: number;
}
