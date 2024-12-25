import React, { useState, useEffect, useContext } from "react";

// Internal Import
import VoterCard from "../Components/VoterCard/VoterCard"; // Updated to PascalCase
import Style from '../styles/voterList.module.css';
import { VotingContext } from "../../context/Voter";

const VoterList = () => { // Renamed to PascalCase
  const { getAllVoterData, voterArray } = useContext(VotingContext);

  useEffect(() => {
    getAllVoterData();
  }, []);

  return (
    <div className={Style.voterList}>
      <VoterCard voterArray={voterArray} /> {/* Updated to PascalCase */}
    </div>
  );
};

export default VoterList; // Updated to PascalCase
