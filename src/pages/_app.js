import "../styles/globals.css";
import React from "react";
import { VotingProvider } from "../../context/Voter";
import Navbar from "../Components/NavBar/NavBar";

//Internal Import
const MyApp = ({ Component, pageProps }) => (
  <VotingProvider>
    <div>
      <Navbar />
      <div>
        <Component {...pageProps} />
      </div>
    </div>
  </VotingProvider>
);

export default MyApp;
