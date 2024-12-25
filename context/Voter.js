import React, { useState, useEffect, Children, useContext } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import axios from "axios";

import { VotingAddrss, VotingAddressABI } from "./constant";

// Replace these with your own Infura Project ID and Secret
// const infuraProjectId = "ecb9c7cee3a240d798621f1ddc4271e2"; // Replace with your Infura Project ID
// const infuraProjectSecret =
//   "17rDRq9zrowg/C1/MJYlPEKeGrVxZXBTIkzKf5ErImd5WUaSIb0Aqw"; // Replace with your Infura Project Secret

const localIpfsUrl = "http://localhost:5001/api/v0/add"; 

const fetchContract = (signerOrProvider) =>
  new ethers.Contract(VotingAddrss, VotingAddressABI, signerOrProvider);

export const VotingContext = React.createContext();

export const VotingProvider = ({ children }) => {
  const votingTitle = "EVOTE";
  const router = useRouter();
  const higestVote = []
  const [candidateArray, setCandidateArray] = useState([]);
  const candidateIndex = []
  const pushCandidate = []
  const [currentAccount, setCurrentAccount] = useState("");
  const [candidateLength, setCandidateLength] = useState("");
  const [error, setError] = useState("");
  const [voterArray, setVoterArray] = useState([]);
  const [voterAddress, setVoterAddress] = useState([]);
  const [voterLength, setVoterLength] = useState(0); // Initialize to 0


  const checkIfWalletIsConnected = async () => {
    if (!window.ethereum) return setError("Please Install Metamask");
    const account = await window.ethereum.request({ method: "eth_accounts" });

    if (account.length) {
      setCurrentAccount(account[0]);
    } else {
      setError("masukan akun metamask");
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError("Harap install Metamask.");
      return;
    }
    const account = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setCurrentAccount(account[0]);
  };

  // Upload file to Infura IPFS
  const uploadToIPFS = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
  
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
  
    try {
      const response = await axios.post(localIpfsUrl, formData, config);
  
      if (response.data && response.data.Hash) {
        const ipfsUrl = `http://localhost:8080/ipfs/${response.data.Hash}`; // Local gateway URL
        return ipfsUrl; // Return the IPFS URL after successful upload
      } else {
        setError("Local IPFS returned an invalid response.");
        console.error("Local IPFS response:", response.data);
      }
    } catch (error) {
      setError("Error saat upload gambar ke Local IPFS");
      console.error("Local IPFS upload error:", error);
    }
  };

  const createVoter = async (formInput, fileUrl, router) => {
    try {
      const { name, address, position } = formInput;

      // Check for missing form fields
      if (!name || !address || !position || !fileUrl) {
        setError("Isi semua bagian dan upload gambar.");
        return;
      }

      console.log("Creating voter:", name, address, position, fileUrl);

      // Initialize Web3Modal and connect
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);

      // Prepare the data to store in IPFS
      const data = JSON.stringify({ name, address, position, image: fileUrl });

      // Upload the data to Infura and get the IPFS URL
      const ipfsUrl = await uploadToIPFS(data);
      console.log("IPFS URL:", ipfsUrl);

      // Ensure the contract expects these types, and pass them in the correct order
      const voter = await contract.voterRight(address, name, ipfsUrl); // Use IPFS URL
      await voter.wait(); // Ensure the transaction is mined

      console.log("Voter Created:", voter);

      // Redirect to voter list
      router.push("/voterList");
    } catch (error) {
      console.error("Error creating voter:", error);
      setError("Error saat membuat pemilih");
    }
  };

  const setCandidate = async (candidateForm, fileUrl, router) => {
    try {
      const { name, address } = candidateForm;
  
      if (!name || !address || !fileUrl) {
        setError("Isi semua bagian dan upload gambar.");
        return;
      }
  
      console.log("Creating candidate:", name, address, fileUrl);
  
      // Initialize Web3Modal and connect
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);
  
      // Upload the image to IPFS (if not already uploaded)
      const ipfsUrl = await uploadToIPFS(fileUrl); // Get IPFS URL of the uploaded image
      console.log("IPFS URL:", ipfsUrl);
  
      // Use the correct contract method: setCandidates (passing 3 arguments)
      const candidate = await contract.setCandidates(address, name, ipfsUrl); // Now passing the correct 3 arguments
      await candidate.wait(); // Ensure the transaction is mined
  
      console.log("Candidate Created:", candidate);
  
      // Redirect to the candidate list page
      router.push("/");
  
    } catch (error) {
      console.error("Error creating candidate:", error);
      setError("Error saat membuat kandidat");
    }
  };
  
  
  

  const getNewCandidate = async () => {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);
  
      // Fetch the list of candidate addresses
      const allCandidate = await contract.getCandidate();
      console.log("All Candidate Addresses:", allCandidate);  // Log the list of candidate addresses
  
      const candidatesData = [];
      const candidateIndexes = [];
  
      // Loop through the candidate addresses and fetch the candidate data
      for (let el of allCandidate) {
        const singleCandidateData = await contract.getCandidateData(el);
        console.log("Single Candidate Data:", singleCandidateData); // Log details of each candidate
        candidatesData.push(singleCandidateData);
        candidateIndexes.push(singleCandidateData[2].toNumber()); // Assuming index is at position 2
      }
  
      // Log the full list of candidates with data
      console.log("Candidate Data Array:", candidatesData);
      
      // Update the state to store the fetched candidate data
      setCandidateArray(candidatesData); 
      setCandidateLength(allCandidate.length); // Set the candidate length
  
    } catch (error) {
      console.log("Error fetching candidates:", error);
      setError("Error saat mengambil data kandidat");
    }
  };
  
  


  const getAllVoterData = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchContract(signer);
  
    try {
      const voterListData = await contract.getVoterList(); // Get list of voters
      setVoterAddress(voterListData); // Update state with voter addresses
      console.log("Voter List Data:", voterListData);
  
      // Iterate through voter list and fetch additional data if needed
      const voterDetails = [];
      for (const el of voterListData) {
        const singleVoterData = await contract.getVoterData(el); // Use the correct function name
        voterDetails.push(singleVoterData); // Store each voter's data
      }
  
      console.log("Voter Details:", voterDetails);
      setVoterArray(voterDetails); // If you need to keep detailed voter info
      setVoterLength(voterListData.length); // Update the voter length after fetching data
    } catch (error) {
      console.error("Error fetching voter list:", error);
      setError("Error fetching voter list");
    }
  };
  
  

  const giveVote = async (id) => {
    try {
      const voterAddress = id.address;
      const voterId = id.id;
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);

      const voterList = await contract.vote(voterAddress, voterId);
      console.log(voterList);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllVoterData();
  }, []);

  useEffect(() => {
    console.log(voterLength); 
  }, [voterLength])

  return (
    <VotingContext.Provider
      value={{
        votingTitle,
        checkIfWalletIsConnected,
        getAllVoterData,
        getNewCandidate,
        connectWallet,
        uploadToIPFS,
        createVoter,
        giveVote,
        voterArray,
        setCandidate,
        setCandidateLength,
        voterLength,
        voterAddress,
        currentAccount,
        candidateLength,
        candidateArray,
        error
      }}
    >
      {children}
    </VotingContext.Provider>
  );
};
