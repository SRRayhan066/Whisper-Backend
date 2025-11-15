import { AuthService } from "@/services/AuthService";

export class AuthController {
  static async signUp({ email, password, name }) {
    return AuthService.signUp({ email, password, name });
  }

  static async logIn({ email, password }) {
    return AuthService.logIn({ email, password });
  }
}
