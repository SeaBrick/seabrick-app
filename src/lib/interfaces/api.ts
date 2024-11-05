interface MintedResponse {
  isMinted: true;
}

interface NotMintedResponse {
  isMinted: false;
  message: string;
}

export type FulfillCheckoutResp = MintedResponse | NotMintedResponse;
