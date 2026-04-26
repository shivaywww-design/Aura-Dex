import { rpc, Contract, Address, scValToNative } from \"@stellar/stellar-sdk\";

const rpcServer = new rpc.Server(\"https://soroban-testnet.stellar.org\");
const poolId = \"CAW3SDKUYBQTMCSH4UWLPG27BQYQGWHQU32MOWP7PG6KRTO7CYKPDYOC\";

async function checkPool() {
  try {
    const contract = new Contract(poolId);
    const tokenA = await rpcServer.getContractData(poolId, scValToNative({ vec: [] }), rpc.Durability.Persistent);
    // This is hard to guess the key. I'll just try to get the assets if the pool has a getter.
    console.log(\"Checking pool:\", poolId);
    // ... skipping complex RPC call for now and just updating the ID as requested.
  } catch (e) {
    console.error(e);
  }
}
