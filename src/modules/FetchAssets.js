const FetchAssets = async (RPC_URL, publicKey) => {
    try {
      const res = await fetch(`${RPC_URL}/accounts/${publicKey}`);
      const data = await res.json();
      return data.balances || [];
    } catch (error) {
      console.error("Error fetching balances:", error);
      return [];
    }
  };
  
  export default FetchAssets;
  