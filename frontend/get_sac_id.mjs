import { Asset, Address } from "@stellar/stellar-sdk";

const asset = new Asset("SDKE", "GBZOLFASCCGMZHWKMF5GVEDEXTV2HD2W3BKW6SP5D5CPKQ3T75T36I5G");
const contractId = asset.contractId("Test SDF Network ; September 2015");

console.log("Asset:", asset.getCode(), ":", asset.getIssuer());
console.log("Contract ID:", contractId);
