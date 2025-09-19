export interface User {
    id: number;
    name: string;
    email: string;
  }
  
  export type LoginCredentials = Omit<User, "id" | "name"> & { password?: string };