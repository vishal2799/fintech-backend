export interface LoginInput {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  refreshToken?: string
  user: {
    id: string
    name: string
    role: string
  }
}
