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
  dates: TinkDates;
  financialInstitutionId?: TinkFinancialInstitution;
  id: string;
  identifiers?: TinkIdentifiers;
  name: string;
  type: TinkType;
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

export type TinkDates = {
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

export enum TinkType {
  "UNDEFINED",
  "CHECKING",
  "SAVINGS",
  "CREDIT_CARD",
}
