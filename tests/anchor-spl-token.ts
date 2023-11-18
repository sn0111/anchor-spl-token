import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AnchorSplToken } from "../target/types/anchor_spl_token";
import { TOKEN_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/utils/token";

describe("create-tokens", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider);

  const program = anchor.workspace.AnchorSplToken as Program<AnchorSplToken>;

  const mintToken = anchor.web3.Keypair.generate()

  const associateTokenProgram = new anchor.web3.PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL")

  const tokenAccount =anchor.utils.token.associatedAddress({mint:mintToken.publicKey,owner:provider.publicKey})

  const ta = anchor.web3.PublicKey.findProgramAddressSync(
    [provider.publicKey.toBuffer(),TOKEN_PROGRAM_ID.toBuffer(),mintToken.publicKey.toBuffer()],
    associateTokenProgram
  )[0]

  let tokenAccountKeyPair = anchor.web3.Keypair.generate()



  it("Create token!", async () => {

    console.log(mintToken.publicKey.toBase58())
    console.log(tokenAccount.toBase58())

    try {
      const tx = await program.methods.createToken(9,new anchor.BN(100*10**9))
    .accounts({
      mintToken:mintToken.publicKey,
      tokenAccount:tokenAccount,
      associateTokenProgram,
    })
    .signers([mintToken])
    .rpc();
    console.log("Your transaction signature", tx);
    } catch (error) {
      console.log(error)
    }
  });


  it("Token transfer", async () =>{

    // const alicePair = createKeypairFromFile("/home/satya0111/Documents/token-escrow-accounts/ALiMAttZLtGCLyEy8W4oQFNTxUZXtEnQTtF78ej7FAG.json")

    // const fromAccount = new anchor.web3.PublicKey("ALabSCqev7rzfLRcea2R1QyYYJyQQczVA4WKGZL78ySU")
    // const toAccount = new anchor.web3.PublicKey("ALtKoptBR42bTsUJGAj5cB2vUhCemgMWUE7ZwA98yJti")
    let toAccount = new anchor.web3.PublicKey("EoTV64eqFRu7166daCa5bjVfP9o7hJFmsndDLNHVyoWr")
    let mint = new anchor.web3.PublicKey("FB8sS5oRYTQ699enbtsMfdDuugAUqq9MLPPE3Yf4xTNv")
    let fromAccount = new anchor.web3.PublicKey("13G5cpLEAV9BESuyiNKaXV2LSmWi3NeeBjvNvtmbDtKo")
    try {
      const tx = await program.methods.transerToken(new anchor.BN(10**9*10))
      .accounts({
        mintToken:mint,
        fromAccount:fromAccount,
        toAccount:toAccount,
        associateTokenProgram
      })
      .signers([])
      .rpc()

      console.log("Your transaction signature", tx);
    } catch (error) {
      console.log(error)
    }


  })

  it("Create Metadata Account!", async () => {
    let mint = new anchor.web3.PublicKey("FB8sS5oRYTQ699enbtsMfdDuugAUqq9MLPPE3Yf4xTNv")

    const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
        let metadataAccount = anchor.web3.PublicKey.findProgramAddressSync(
            [
                Buffer.from("metadata"),
                TOKEN_METADATA_PROGRAM_ID.toBuffer(),
                mint.toBuffer()
            ],
            TOKEN_METADATA_PROGRAM_ID
        )[0]
        let masterAccount = anchor.web3.PublicKey.findProgramAddressSync(
            [
                Buffer.from("metadata"),
                TOKEN_METADATA_PROGRAM_ID.toBuffer(),
                mint.toBuffer(),
                Buffer.from("edition")
            ],
            TOKEN_METADATA_PROGRAM_ID
        )[0]
    let tokenAccount = new anchor.web3.PublicKey("13G5cpLEAV9BESuyiNKaXV2LSmWi3NeeBjvNvtmbDtKo")

    try {
      const tx = await program.methods.setTokenMetadata({
        name:"ABC Token",
        symbol:"ABC",
        uri:"https://arweave.net/CCWt9sHG97gyZLlHNMMZtRXT_rqq_26EQ8FFnh1I6r0",
        sellerFeeBasisPoints:500,
        suply:new anchor.BN(0)
      })
      .accounts({
        mintToken:mint,
        associateTokenProgram,
        metadataProgram:TOKEN_METADATA_PROGRAM_ID,
        metadataAccount:metadataAccount,
        masterAccount:masterAccount,
        editionAccount:masterAccount
      })
      .signers([])
      .rpc();
      console.log("Your transaction signature", tx);
      
    } catch (error) {
      console.log(error)
    }
  });
  

  // it("Set Authority token!", async () => {

  //   const reciever = createKeypairFromFile("/home/satya0111/sN73AySVY5sZMg3A36gP4DKD28EhEQ4AyRLzkY3XoCW.json")
  //   const tx = await program.methods.setAuthorityToken()
  //   .accounts({
  //     mintToken:mintToken.publicKey,
  //     tokenAccount,
  //     newSigner:reciever.publicKey
  //   })
  //   .signers([reciever])
  //   .rpc();
  //   console.log("Your transaction signature", tx);
  // });

  // it("Freeze token!", async () => {

    
  //   const tx = await program.methods.freezeToken()
  //   .accounts({
  //     mintToken:mintToken.publicKey,
  //     tokenAccount,
  //   })
  //   .signers([])
  //   .rpc();
  //   console.log("Your transaction signature", tx);
  // });

  // it("Unfreeze token!", async () => {

    
  //   const tx = await program.methods.unFreezeToken()
  //   .accounts({
  //     mintToken:mintToken.publicKey,
  //     tokenAccount,
  //   })
  //   .signers([])
  //   .rpc();
  //   console.log("Your transaction signature", tx);
  // });

  // it("Burn token!", async () => {

    
  //   const tx = await program.methods.burnToken(new anchor.BN(10**9*100))
  //   .accounts({
  //     mintToken:mintToken.publicKey,
  //     tokenAccount,
  //   })
  //   .signers([])
  //   .rpc();
  //   console.log("Your transaction signature", tx);
  // });

  // it("Close token!", async () => {

    
  //   const tx = await program.methods.closeToken()
  //   .accounts({
  //     mintToken:mintToken.publicKey,
  //     tokenAccount,
  //   })
  //   .signers([])
  //   .rpc();
  //   console.log("Your transaction signature", tx);
  // });

  // it("Set Authority token!", async () => {

  //   const reciever = createKeypairFromFile("/home/satya0111/sN73AySVY5sZMg3A36gP4DKD28EhEQ4AyRLzkY3XoCW.json")
  //   const tx = await program.methods.setAuthorityToken()
  //   .accounts({
  //     mintToken:mintToken.publicKey,
  //     tokenAccount,
  //     newSigner:reciever.publicKey
  //   })
  //   .signers([reciever])
  //   .rpc();
  //   console.log("Your transaction signature", tx);
  // });

  
});

