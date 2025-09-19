import axios from "axios";
import type { User, LoginCredentials } from "../types/User";

const api = axios.create({
  baseURL: "http://localhost:3001"
});

export const authService = {
  login: async (credentials: LoginCredentials): Promise<User | null> => {
    // Simula uma busca na API por um usuário com o email e senha fornecidos
    const { data: users } = await api.get<User[]>("/users", {
      params: {
        email: credentials.email,
        password: credentials.password,
      },
    });
    
    if (users.length > 0) {
      return users[0]; // Retorna o primeiro usuário encontrado
    }
    
    return null; // Retorna nulo se nenhum usuário corresponder
  },
};