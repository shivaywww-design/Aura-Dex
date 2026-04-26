import {
  Keypair,
  TransactionBuilder,
  Networks,
  Operation,
  Horizon,
} from "@stellar/stellar-sdk";
import { SDKE_ASSET, SDKE_ISSUER_SECRET, CONFIG } from "../config";


const HORIZON_SERVER = new Horizon.Server(CONFIG.HORIZON_URL);

// ─── SAC funding (Since we use SACs, we just fund the Classic account) ────
async function fundClassic(recipientAddress: string): Promise<void> {
  // 1. Send 5000 Classic SDKE from Issuer
  const issuerKeypair = Keypair.fromSecret(SDKE_ISSUER_SECRET);

  const issuerAccount = await HORIZON_SERVER.loadAccount(issuerKeypair.publicKey());
  
  const tx = new TransactionBuilder(issuerAccount, {
    fee: "1000",
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(Operation.payment({
      destination: recipientAddress,
      asset: SDKE_ASSET,
      amount: "5000",

    }))
    .setTimeout(30)
    .build();
    
  tx.sign(issuerKeypair);
  console.log(`[Faucet] Transmitting SDKE to ${recipientAddress}...`);
  const response = await HORIZON_SERVER.submitTransaction(tx);
  if (!response.successful) throw new Error("Classic funding failed");
  console.log("[Faucet] Successfully transmitted SDKE.");
}

// ─── Classic Stellar trustline helpers ────────────────────────────────────
export async function hasTrustline(publicKey: string): Promise<boolean> {
  try {
    const account = await HORIZON_SERVER.loadAccount(publicKey);
    return account.balances.some(
      (b: any) => b.asset_code === "SDKE" && b.asset_issuer === SDKE_ASSET.getIssuer()
    );

  } catch {
    return false;
  }
}

export async function establishTrustline(
  publicKey: string,
  signTransaction: (xdr: string) => Promise<string>
): Promise<void> {
  const account = await HORIZON_SERVER.loadAccount(publicKey);
  const tx = new TransactionBuilder(account, {
    fee: "1000",
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(Operation.changeTrust({ asset: SDKE_ASSET, limit: "1000000" }))

    .setTimeout(30)
    .build();

  const signedXdr = await signTransaction(tx.toXDR());
  const signedTx = TransactionBuilder.fromXDR(signedXdr, Networks.TESTNET);
  const response = await HORIZON_SERVER.submitTransaction(signedTx);
  if (!response.successful) throw new Error("Trustline transaction failed");
}

// ─── Mint both pool tokens (Soroban) + Classic SDKE if trustline exists ───
export async function mintTestTokens(

  recipientAddress: string,
  // @ts-ignore
  signTransaction: (xdr: string) => Promise<string>
): Promise<{ needsTrustline: boolean }> {
  const trusted = await hasTrustline(recipientAddress);
  if (!trusted) return { needsTrustline: true };

  // 1. Fund Classic SDKE (SAC automatically reflects this)
  await fundClassic(recipientAddress);


  return { needsTrustline: false };
}

// ─── Balance helpers ───────────────────────────────────────────────────────
export async function getSdkeBalance(publicKey: string): Promise<string> {

  try {
    const account = await HORIZON_SERVER.loadAccount(publicKey);
    const b = account.balances.find(
      (b: any) => b.asset_code === "SDKE" && b.asset_issuer === SDKE_ASSET.getIssuer()
    );

    return b ? parseFloat(b.balance).toFixed(2) : "0.00";
  } catch { return "0.00"; }
}

export async function getXlmBalance(publicKey: string): Promise<string> {
  try {
    const account = await HORIZON_SERVER.loadAccount(publicKey);
    const b = account.balances.find((b: any) => b.asset_type === "native");
    return b ? parseFloat(b.balance).toFixed(2) : "0.00";
  } catch { return "0.00"; }
}
