import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";

const connection = new Connection("https://api.devnet.solana.com");

function App() {
  async function sendSol() {
    const ix = SystemProgram.transfer({
      fromPubkey: new PublicKey("7qE3FJYpsH4LbYWLSohxY4WxKW2XVgJ5yZ4GNfLwFKvE"),
      toPubkey: new PublicKey("8pyAjXonZuD2zjj1Wt6VUYUNgfisdzhrFJZDoF7WkmAC"),
      lamports: 0.01 * LAMPORTS_PER_SOL,
    });

    const tx = new Transaction().add(ix);
    const { blockhash } = await connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = new PublicKey("7qE3FJYpsH4LbYWLSohxY4WxKW2XVgJ5yZ4GNfLwFKvE");

    // Note: You would need to sign the transaction with the private key of the fromPublicKey
    // For example, if using a wallet adapter, it would look like this:
    // await wallet.signTransaction(tx);

    const serializedTx = tx.serialize({
      requireAllSignatures: false,
      verifySignatures: false,
    });

    console.log("Serialized transaction:", serializedTx);
    await axios.post("http://localhost:3000/api/v1/txn/sign", {
      message: serializedTx,
      retry : false 
    })
  }

  return (
    <div className="flex flex-col gap-5 justify-center h-screen items-center">
      <input
        className="text-red border border-black rounded-md px-3"
        type="text"
        placeholder="Amount"
      />
      <input
        className="text-red border border-black rounded-md px-3"
        type="text"
        placeholder="Address"
      />
      <button onClick={sendSol} className="bg-slate-800 px-8 text-white rounded-lg py-2">
        Submit
      </button>
    </div>
  );
}

export default App;
