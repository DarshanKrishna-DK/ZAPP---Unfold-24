// @ts-check
import { E } from '@endo/far';
import { AmountMath, makeIssuerKit } from '@agoric/ertp';
import { makeZCFMint } from '@agoric/zoe/src/contractSupport';
import { Far } from '@endo/far';

/**
 * @typedef {{
 *   tokenPrice: Amount;
 * }} TokenMarketplaceTerms
 */

/**
 * @param {ZCF<TokenMarketplaceTerms>} zcf
 */
export const start = async (zcf) => {
  const { tokenPrice } = zcf.getTerms();

  // Create a mint for the token
  const { mint: tokenMint, issuer: tokenIssuer } = makeIssuerKit('Token', 'nat');
  const publicFacet = Far('TokenMarketplacePublicFacet', {
    getTokenIssuer: () => tokenIssuer,
    getTokenPrice: () => tokenPrice,
  });

  /**
   * Function to buy tokens.
   * @param {ZCFSeat} buyerSeat
   * @param {bigint} tokenAmount
   */
  const buyTokens = (buyerSeat, tokenAmount) => {
    const cost = tokenAmount * Number(tokenPrice.value);
    const payment = buyerSeat.getCurrentAllocation().Price;

    // Check if the buyer sent enough payment
    if (AmountMath.isGTE(payment, AmountMath.make(tokenPrice.brand, cost))) {
      // Mint and transfer tokens to the buyer
      const tokens = tokenMint.mintGains({ Tokens: AmountMath.make(tokenAmount) });
      zcf.reallocate(buyerSeat, tokens);
      buyerSeat.exit(true);
      return `Purchased ${tokenAmount} tokens.`;
    } else {
      throw new Error('Insufficient payment sent.');
    }
  };

  // Function to send tokens to another address
  const sendTokens = (senderSeat, recipient, amount) => {
    const senderBalance = AmountMath.make(tokenMint.getIssuer().getAmountOf(senderSeat.getCurrentAllocation().Tokens));
    if (AmountMath.isGTE(senderBalance, AmountMath.make(amount))) {
      // Transfer tokens to the recipient
      zcf.reallocate(senderSeat, { Tokens: AmountMath.make(amount) });
      // Emit event for tokens sent
      return `Sent ${amount} tokens to ${recipient}.`;
    } else {
      throw new Error('Insufficient token balance.');
    }
  };

  // Make the public methods available
  return harden({
    publicFacet,
    buyTokens,
    sendTokens,
  });
};