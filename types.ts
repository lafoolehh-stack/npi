export interface Poll {
  id: string;
  question: string;
  category: 'Approve' | 'Trust' | 'Support' | 'General';
  data: { label: string; value: number; color: string }[];
  totalVotes: number;
}

export interface Indicator {
  id: string;
  title: string;
  score: number; // 0-100
  trend: 'up' | 'down' | 'stable';
  history: { month: string; value: number }[];
}

export interface StateRegion {
  name: string;
  code: string;
}

export interface Report {
  id: string;
  title: string;
  type: 'Weekly' | 'Monthly' | 'Special';
  date: string;
  imageUrl: string;
}