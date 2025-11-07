
export type TransactionStatus = 'Pending' | 'Approved' | 'Blocked' | 'Escalated';

export interface Merchant {
  id: string;
  name: string;
  category: string;
  country: string;
}

export interface Location {
  ipAddress: string;
  country: string;
  city: string;
  latitude: number;
  longitude: number;
}

export interface Device {
  os: string;
  browser: string;
  isMobile: boolean;
}

export interface EngineeredFeature {
  name: string;
  value: string | number;
  description: string;
}

export interface AnalystAction {
  analystId: string;
  analystName: string;
  timestamp: number;
  action: TransactionStatus;
  comment: string;
}

export interface Case {
    id: string;
    name: string;
    analystId: string;
    createdAt: number;
    status: 'Open' | 'Closed';
    transactionIds: string[];
}

export interface Transaction {
  id: string;
  accountId: string;
  cardNumber: string; // Masked
  amount: number;
  currency: string;
  timestamp: number;
  status: TransactionStatus;
  merchant: Merchant;
  location: Location;
  device: Device;
  riskScore: number;
  reason: {
    summary: string;
    contributingFeatures: EngineeredFeature[];
  };
  analystActions: AnalystAction[];
  caseId?: string;
}
