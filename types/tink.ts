import { BankAccountType } from "@prisma/client";

export type TinkToken = {
  token_type: string;
  expires_in: number;
  access_token: string;
  refresh_token: string;
  scope: string;
  id_hint: string;
};

export type TinkListAccountsResponse = {
  accounts?: TinkAccount[];
  nextPageToken: string;
};

export type TinkAccount = {
  balances?: TinkBalances;
  customerSegment?: TinkCustomerSegment;
  dates: TinkAccountDates;
  financialInstitutionId?: TinkFinancialInstitution;
  id: string;
  identifiers?: TinkIdentifiers;
  name: string;
  type: BankAccountType;
};

export type TinkBalances = {
  available?: TinkBalance;
  booked?: TinkBalance;
};

export type TinkBalance = {
  amount?: TinkCurrencyDenominatedAmount;
};

export type TinkCurrencyDenominatedAmount = {
  currencyCode?: string;
  value?: TinkExactNumber;
};

export type TinkExactNumber = {
  scale?: string;
  unscaledValue?: string;
};

export enum TinkCustomerSegment {
  "UNDEFINED_CUSTOMER_SEGMENT",
  "PERSONAL",
  "BUSINESS",
}

export type TinkAccountDates = {
  lastRefreshed: Date;
};

export type TinkIdentifiers = {
  financialInstitution?: TinkFinancialInstitution;
  iban?: TinkIBAN;
  pan?: TinkPan;
  sortCode?: TinkSortCode;
};

export type TinkFinancialInstitution = {
  accountNumber: string;
  referenceNumbers?: object;
};

export type TinkIBAN = {
  bban: string;
  bic?: string;
  iban: string;
};

export type TinkPan = {
  masked: string;
};

export type TinkSortCode = {
  accountNumber: string;
  code: string;
};

// export enum TinkAccountType {
//   UNDEFINED,
//   CHECKING,
//   SAVINGS,
//   CREDIT_CARD,
// }

export type TinkTransaction = {
  accountId: string;
  amount: TinkCurrencyDenominatedAmount;
  bookedDateTime?: string;
  categories?: TinkCategories;
  counterparties?: TinkCounterparties;
  dates?: TinkTransactionDates;
  descriptions?: TinkTransactionDescription;
  id: string;
  identifiers?: TinkTransactionIdentifiers;
  merchantInformation?: TinkMerchantInformation;
  providerMutability?: TinkMutability;
  reference?: string;
  status: TinkStatus;
  transactionDateTime?: string;
  types: TinkTransactionTypes;
  valueDateTime?: string;
};

export type TinkListTransactionsResponse = {
  transactions?: TinkTransaction[];
  nextPageToken: string;
};

export type TinkCategories = {
  pfm?: TinkPFMCategory;
};

export type TinkPFMCategory = {
  id: string;
  name: string;
};

export type TinkCounterparties = {
  payee?: TinkCounterpartyInformation;
  payer?: TinkCounterpartyInformation;
};

export type TinkCounterpartyInformation = {
  identifiers?: TinkIdentifiers;
  name?: string;
};

export type TinkTransactionDates = {
  booked?: string;
  transaction?: string;
  value?: string;
};

export type TinkTransactionDescription = {
  detailed?: TinkTransactionInformation;
  display: string;
  original: string;
};

export type TinkTransactionInformation = {
  unstructured?: string;
};

export type TinkTransactionIdentifiers = {
  providerTransactionId?: string;
};

export type TinkMerchantInformation = {
  merchantCategoryCode?: string;
  merchantName?: string;
};

export enum TinkMutability {
  "MUTABILITY_UNDEFINED",
  "MUTABLE",
  "IMMUTABLE",
}

export enum TinkStatus {
  "UNDEFINED",
  "PENDING",
  "BOOKED",
}

export type TinkTransactionTypes = {
  financialInstitutionTypeCode?: string;
  type: TinkTransactionType;
};

export enum TinkTransactionType {
  "UNDEFINED",
  "CREDIT_CARD",
  "PAYMENT",
  "WITHDRAWAL",
  "DEFAULT",
  "TRANSFER",
}
