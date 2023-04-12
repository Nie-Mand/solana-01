import './style.css'
import * as anchor from "@coral-xyz/anchor"
import idl from './idl.json'

// INIT ANCHOR
const anchorProvider = new anchor.AnchorProvider(
  new anchor.web3.Connection("https://api.devnet.solana.com"),
  {} as any, // signer,
  {}
)

anchor.setProvider(anchorProvider)

// INIT PROGRAM
const SURVEY_ACCOUNT = new anchor.web3.PublicKey(
  "BJ9aHa3rnxxB9RWgHpwaJuVjLhYM5NpN6EicQiyp2FRT"
);
const programId = new anchor.web3.PublicKey(
  "8E1z8WbdadNDHPtYbUgNhJYfcqsHsJvNvxoGQFVmsAEY"
)
const program = new anchor.Program(idl as any, programId);



async function main() {

  // GET DATA
  const data: any = await program.account.surveyAccount.fetch(SURVEY_ACCOUNT);
  const nbVoters = data.nbVoters.toNumber();
  const agree = data.agree.toNumber()
  const disagree = data.disagree.toNumber()

  // COMPUTE POURCENTAGE
  const agreePourcentage = (agree / nbVoters) * 100;
  const disagreePourcentage = (disagree / nbVoters) * 100; 


  // HTML Part
  const greenBar = document.getElementById("green-bar");
  const redBar = document.getElementById("red-bar");
  const nbAgree = document.getElementById("nb-agree");
  const nbDisagree = document.getElementById("nb-disagree");

  if (!greenBar || !redBar || !nbAgree || !nbDisagree) return

  greenBar.style.width = `${agreePourcentage}%`;
  redBar.style.width = `${disagreePourcentage}%`;
  nbAgree.innerHTML = agreePourcentage.toString();
  nbDisagree.innerHTML = disagreePourcentage.toString();
}

main()

const agreeButton = document.getElementById("agree-button");

if (agreeButton) {
  agreeButton.addEventListener("click", async function agree() {
    await program.methods.agree()
      .accounts({
        surveyAccount: SURVEY_ACCOUNT,
        signer: anchorProvider.wallet.publicKey,
      })
    .rpc()
    main()
  });
}