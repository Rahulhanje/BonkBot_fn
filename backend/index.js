import express from "express";
import userModel from "./model.js";
import { Keypair,Transaction,Connection} from "@solana/web3.js";
import { hashPassword, verifyPassword } from "./passwordhash.js";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
import cors from 'cors'
import bs58 from 'bs58'

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
const jwt_secretKey = "abcd";
const connection=new Connection('https://api.devnet.solana.com');
app.post("/api/v1/signup", async (req, res) => {
  try {
    console.log(req.body); // Log the body to check if data is being received
    const { username, password } = req.body;

    // Check if the user already exists
    const user = await userModel.findOne({ username: username });
    if (user) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Create a new wallet
    const keypair = new Keypair();
    const hashedPassword = await hashPassword(password);

    await userModel.create({
      username: username,
      password: hashedPassword,
      privateKey: keypair.secretKey.toString(),
      publickey: keypair.publicKey.toString(),
    });

    res.json({
      message: "User created successfully",
      publicKey: keypair.publicKey.toString(),
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Error creating user" });
  }
});

app.post("/api/v1/signin", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the user exists
    const user = await userModel.findOne({ username: username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify the password
    const isMatch = await verifyPassword(password, user.password);
    if (isMatch) {
      const token = jwt.sign({ id: user },jwt_secretKey);
      res.json({ message: "User found", user:user,
        jwt:token
        });
    } else {
      res.status(401).json({ message: "Invalid password" });
    }
  } catch (error) {
    console.error("Error during signin:", error);
    res.status(500).json({ message: "Error verifying the password" });
  }
});

app.post("/api/v1/txn/sign", async (req, res) => {

    const serializedTransaction = req.body.message;

    console.log(serializedTransaction);

    const tx = Transaction.from(Buffer.from(serializedTransaction))
  
 
    const keyPair = Keypair.fromSecretKey(bs58.default.decode(process.env.PRIVATE_KEY));

    const {blockhash} = await connection.getLatestBlockhash();
    tx.blockhash = blockhash
    tx.feePayer = keyPair.publicKey

    tx.sign(keyPair)

    const signature = await connection.sendTransaction(tx, [keyPair]);
    console.log(signature)

    res.json({
        message:signature
    })
});



app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
