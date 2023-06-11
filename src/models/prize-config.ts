export interface PrizeConfig {
  companyName: string;
  prizes: Prize[];
}

export interface Prize {
  name: string;
  numberOfPrize: number;
  prizeInfo: PrizeInfo;
}

interface PrizeInfo {
  name: string;
  image: string;
}
