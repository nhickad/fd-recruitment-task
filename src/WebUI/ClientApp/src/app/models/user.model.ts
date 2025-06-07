export interface User {
    id: string;
    name: string;
    firstName: string;
    lastName?: string;
    email: string;
    avatar?: string;
    createdAt: Date;
    lastLoginAt?: Date;
  }
  
  export interface UserProfile {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    preferences?: UserPreferences;
  }
  
  export interface UserPreferences {
    theme?: 'light' | 'dark';
    defaultTaskColor?: string;
    notifications?: boolean;
    emailUpdates?: boolean;
  }