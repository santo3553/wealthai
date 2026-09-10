export interface Settings {
  currency: string;
  notificationsEnabled: boolean;
  darkMode: boolean;
  twoFactorAuth: boolean;
  biometricLogin: boolean;
  linkedAccounts: string[];
  apiKey?: string;
  userName: string;
  userEmail: string;
}
