import { useContext, useEffect, useState } from "react";
import { VotingContext } from "../../context/Voter";
import Style from "../styles/index.module.css";
import Countdown from "react-countdown";
import Card from "../Components/Card/Card";
import image from "../assets/creator.png";

const Index = () => {
  const {
    getNewCandidate, // Make sure this is available in the context
    candidateArray,
    giveVote,
    checkIfWalletIsConnected,
    candidateLength,
    currentAccount,
    voterLength,
    votingTitle,
    getAllVoterData,
  } = useContext(VotingContext);

  // State to trigger re-render when new candidate is added
  const [refreshCandidates, setRefreshCandidates] = useState(false);

  // Run once on component mount to check wallet connection and fetch voter data
  useEffect(() => {
    if (checkIfWalletIsConnected) {
      checkIfWalletIsConnected();
      getAllVoterData();
      getNewCandidate(); // Fetch candidates on page load
    }
  }, [checkIfWalletIsConnected, getAllVoterData, getNewCandidate]); // Add getNewCandidate to dependency array

  // Watch for when a candidate is added and refresh candidate list
  useEffect(() => {
    if (refreshCandidates) {
      getNewCandidate(); // Refresh the list after a new candidate is added
      setRefreshCandidates(false); // Reset the flag
    }
  }, [refreshCandidates, getNewCandidate]);

  // Connect Wallet
  const connectWallet = async () => {
    if (!window.ethereum) {
      return console.error("Harap Install Metamask");
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  // Upload to IPFS (Candidate Image)
  const uploadToIPFSCandidate = async (file) => {
    try {
      const added = await client.add({ content: file });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      return url;
    } catch (error) {
      console.error("Error uploading to IPFS:", error);
      return null;
    }
  };

  return (
    <div className={Style.home}>
      {/* Show winner and statistics if wallet is connected */}
      {currentAccount && (
        <div className={Style.winner}>
          <div className={Style.winner_info}>
            <div className={Style.candidate_list}>
              <p>
                Total Kandidat: <span>{candidateLength}</span>
              </p>
            </div>
            <div className={Style.candidate_list}>
              <p>
                Total Pemilih: <span>{voterLength}</span>
              </p>
            </div>
          </div>
          <div className={Style.winner_message}>
            <small>
              <Countdown date={Date.now() + 1000000} />
            </small>
          </div>
        </div>
      )}

      {/* Display voting candidates */}
      <Card candidateArray={candidateArray} giveVote={giveVote} />

      {/* Voting title */}
      <div>{votingTitle}</div>
    </div>
  );
};

export default Index;
