
export enum InvestmentRisk {
  LOW = 1,
  MEDIUM = 5,
  HIGH = 10
}

export interface SimulationParams {
  initialCapital: number;
  monthlySavings: number;
  duration: number; // years
  expectedReturn: number; // decimal (0.06 = 6%)
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

export interface UserProfile {
  name: string;
  type: 'PME' | 'Particulier' | 'Institutionnel';
  capital: number;
  goals: string[];
  riskScore?: number;
}
