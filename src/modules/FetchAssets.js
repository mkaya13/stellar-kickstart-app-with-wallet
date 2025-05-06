// modules/FetchAssets.js
const FetchAssets = async (publicKey) => {
    try {
      const res = await fetch(`https://horizon-testnet.stellar.org/accounts/${publicKey}`);
      const data = await res.json();
      return data.balances || [];
    } catch (error) {
      console.error("Error fetching balances:", error);
      return [];
    }
  };
  
  export default FetchAssets;
  