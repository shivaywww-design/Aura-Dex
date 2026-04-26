import { Asset } from "@stellar/stellar-sdk";

// ─── Original token contract IDs (used by the deployed pool) ──────────────
// These MUST match what the pool contract was initialized with.
// Do not change without redeploying the pool.
export const ORIGINAL_TOKEN_A_ID = "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC";
export const ORIGINAL_TOKEN_B_ID = "CDTMHS477DKY2GZG6PQL5U7KGBST4B3IAVRBQMOXTP3VUNV4JZLHPF6P";

// ─── SDKE Issuer for Classic Asset (wallet visibility only) ───────────────
// This is separate from the pool tokens. Used by the Faucet to send
// a Classic SDKE asset that shows up in Freighter.
export const SDKE_ISSUER_SECRET = "SCK6O7B6ZBGBKIFNWA5BTRRF7SO23MIZSEFQRBQV5OV5LOVCO5HO4JUD";
export const SDKE_ISSUER_PUBLIC = "GBZOLFASCCGMZHWKMF5GVEDEXTV2HD2W3BKW6SP5D5CPKQ3T75T36I5G";
// Alias for use in balance hooks
export const SDKE_ISSUER = SDKE_ISSUER_PUBLIC;

// ─── Classic Stellar Assets (for Freighter wallet visibility) ─────────────
export const XLM_ASSET = Asset.native();
export const SDKE_ASSET = new Asset("SDKE", SDKE_ISSUER_PUBLIC);


export const CONFIG = {
  FACTORY_CONTRACT_ID: "CC6XX5QZTRPAHY2NU23LE6RKJUAQIQVHJURLU2VRKMV43XZWPOA7CGTT",
  POOL_CONTRACT_ID: "CAW3SDKUYBQTMCSH4UWLPG27BQYQGWHQU32MOWP7PG6KRTO7CYKPDYOC",
  // Pool tokens — must match what pool was initialized with
  TOKEN_A_ID: ORIGINAL_TOKEN_A_ID,
  TOKEN_B_ID: ORIGINAL_TOKEN_B_ID,
  LP_TOKEN_ID: "CBFJJZXDFRUB66WI65J7QYUVASB63IX2JMNPJRFTGGYWZNQ6JJASW6R4",
  SOROBAN_RPC_URL: "https://soroban-testnet.stellar.org",
  HORIZON_URL: "https://horizon-testnet.stellar.org",
  NETWORK_PASSPHRASE: "Test SDF Network ; September 2015",
  NETWORK: "testnet" as const,
  STELLAR_EXPERT_BASE: "https://stellar.expert/explorer/testnet",
  STROOPS_PER_XLM: 10_000_000,
  DEFAULT_SLIPPAGE_BPS: 50,
  MAX_SLIPPAGE_BPS: 500,
  POOL_FEE_BPS: 30,
} as const;

export const TOKENS = {
  TOKEN_A: {
    id: ORIGINAL_TOKEN_A_ID,
    symbol: "XLM",
    name: "Native Stellar XLM",
    decimals: 7,
    color: "#7DF9FF",
    asset: XLM_ASSET,
    isNative: true,
  },
  TOKEN_B: {
    id: ORIGINAL_TOKEN_B_ID,
    symbol: "SDKE",
    name: "Aura Engine",
    decimals: 7,
    color: "#f59e0b",
    asset: SDKE_ASSET,
    isNative: false,
  },
  LP: {
    id: "CBFJJZXDFRUB66WI65J7QYUVASB63IX2JMNPJRFTGGYWZNQ6JJASW6R4",
    symbol: "XLM-SDKE-LP",
    name: "XLM-SDKE LP Token",
    decimals: 7,
    color: "#a855f7",
    asset: null,
    isNative: false,
  },

} as const;
