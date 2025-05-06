import dotenv from "dotenv";
import StellarSdk from "stellar-sdk"; // works with v10.4.0

dotenv.config();

const server = new StellarSdk.Server("https://horizon-testnet.stellar.org");

const publicKey = process.env.PUBLIC_KEY;
const secretKey = process.env.SECRET_KEY;
const assetCode = process.env.ASSET_CODE;
const issuer = process.env.ASSET_ISSUER;

const asset = new StellarSdk.Asset(assetCode, issuer);

(async () => {
  try {
    const account = await server.loadAccount(publicKey);

    const tx = new StellarSdk.TransactionBuilder(account, {
      fee: await server.fetchBaseFee(),
      networkPassphrase: StellarSdk.Networks.TESTNET,
    })
      .addOperation(StellarSdk.Operation.changeTrust({ asset }))
      .setTimeout(100)
      .build();

    tx.sign(StellarSdk.Keypair.fromSecret(secretKey));
    const result = await server.submitTransaction(tx);

    console.log("✅ Trustline established successfully!");
    console.log(result);
  } catch (e) {
    console.error("❌ Failed to establish trustline:");
    console.error(e.response?.data || e.message);
  }
})();
