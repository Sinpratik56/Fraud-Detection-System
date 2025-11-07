
import { Transaction, TransactionStatus, EngineeredFeature, AnalystAction, Case } from '../types';

const NAMES = ['Alice', 'Bob', 'Charlie', 'Diana', 'Edward', 'Fiona'];
const MERCHANTS = [
  { name: 'ElectroMart', category: 'Electronics' },
  { name: 'Quick Eats', category: 'Food & Dining' },
  { name: 'Global Flights', category: 'Travel' },
  { name: 'StyleNow', category: 'Apparel' },
  { name: 'DataStream Inc.', category: 'Software' },
  { name: 'Luxury Gems', category: 'Jewelry' },
  { name: 'PixelPlay Games', category: 'Entertainment' },
];
const COUNTRIES = [
  { name: 'USA', city: 'New York' },
  { name: 'UK', city: 'London' },
  { name: 'Germany', city: 'Berlin' },
  { name: 'Japan', city: 'Tokyo' },
  { name: 'Brazil', city: 'São Paulo' },
  { name: 'Australia', city: 'Sydney' },
];
const REASONS = [
  {
    summary: 'High transaction amount from a new merchant.',
    features: [
      { name: 'Transaction Amount', value: '$2,500.00', description: 'Significantly higher than user average ($150).' },
      { name: 'Merchant Familiarity', value: 'New', description: 'User has no prior history with this merchant.' },
    ],
  },
  {
    summary: 'Rapid transactions in different geographical locations.',
    features: [
      { name: 'Geographical Proximity', value: '5,000 miles', description: 'Previous transaction was 30 mins ago in a different continent.' },
      { name: 'Transaction Velocity (1hr)', value: 8, description: 'High frequency of transactions in a short period.' },
    ],
  },
  {
    summary: 'Unusual time of day and high-risk merchant category.',
    features: [
      { name: 'Time of Day', value: '3:15 AM (User Local)', description: 'User typically transacts between 9 AM - 10 PM.' },
      { name: 'Merchant Category Risk', value: 'High', description: 'Category is frequently associated with fraudulent activities.' },
    ],
  },
];

let cases: Case[] = [];

const random = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomNum = (min: number, max: number, decimals: number = 0) =>
  parseFloat((Math.random() * (max - min) + min).toFixed(decimals));

const createRandomTransaction = (): Transaction => {
  const merchantInfo = random(MERCHANTS);
  const countryInfo = random(COUNTRIES);
  const amount = randomNum(5, 5000, 2);
  const reason = random(REASONS);
  const riskScore = randomNum(40, 99);
  
  if (reason.summary.includes('High transaction amount')) {
    reason.features[0].value = `$${amount.toFixed(2)}`;
  }

  return {
    id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    accountId: `acct_${randomNum(1000, 2000)}`,
    cardNumber: `**** **** **** ${randomNum(1000, 9999)}`,
    amount,
    currency: 'USD',
    timestamp: Date.now() - randomNum(0, 1000 * 60 * 60),
    status: 'Pending',
    merchant: {
      id: `merch_${randomNum(100, 999)}`,
      name: merchantInfo.name,
      category: merchantInfo.category,
      country: countryInfo.name,
    },
    location: {
      ipAddress: `${randomNum(1, 255)}.${randomNum(1, 255)}.${randomNum(1, 255)}.${randomNum(1, 255)}`,
      country: countryInfo.name,
      city: countryInfo.city,
      latitude: randomNum(-90, 90, 6),
      longitude: randomNum(-180, 180, 6),
    },
    device: {
      os: random(['Windows', 'MacOS', 'iOS', 'Android']),
      browser: random(['Chrome', 'Safari', 'Firefox', 'Edge']),
      isMobile: Math.random() > 0.5,
    },
    riskScore,
    reason: {
      summary: reason.summary,
      contributingFeatures: reason.features.map(f => ({ ...f, value: f.name.includes('Amount') ? `$${amount.toFixed(2)}` : f.value })),
    },
    analystActions: [],
  };
};

export const generateInitialTransactions = (count: number = 20): Transaction[] => {
  return Array.from({ length: count }, createRandomTransaction).sort((a, b) => b.timestamp - a.timestamp);
};

export const generateNewTransaction = (): Transaction => {
  return createRandomTransaction();
};

export const getTransactionsForAccount = (allTransactions: Transaction[], accountId: string): Transaction[] => {
  return allTransactions
    .filter(tx => tx.accountId === accountId)
    .sort((a, b) => b.timestamp - a.timestamp);
};

export const createAnalystAction = (action: TransactionStatus, comment: string): AnalystAction => {
    const analystId = `analyst_${randomNum(1, 5)}`;
    const analystName = random(NAMES);
    return {
        analystId,
        analystName,
        timestamp: Date.now(),
        action,
        comment,
    }
}

export const getCases = (): Case[] => cases;

export const createCase = (transactionId: string): Case => {
    const newCase: Case = {
        id: `case_${Date.now()}`,
        name: `Case ${cases.length + 1}`,
        analystId: `analyst_${randomNum(1, 5)}`,
        createdAt: Date.now(),
        status: 'Open',
        transactionIds: [transactionId]
    };
    cases.push(newCase);
    return newCase;
};

export const addTransactionToCase = (transactionId: string, caseId: string): Case | undefined => {
    const foundCase = cases.find(c => c.id === caseId);
    if (foundCase && !foundCase.transactionIds.includes(transactionId)) {
        foundCase.transactionIds.push(transactionId);
    }
    return foundCase;
};

export const getOtherAnalysts = (): string[] => {
    // Filter out 'Diana' who is the user
    return NAMES.filter(name => name !== 'Diana');
}
