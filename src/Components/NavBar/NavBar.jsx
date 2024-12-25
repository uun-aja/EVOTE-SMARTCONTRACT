import React, { useState, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { AiFillLock, AiFillUnlock } from "react-icons/ai";

// Internal Import
import { VotingContext } from "../../../context/Voter";
import Style from "./Navbar.module.css";
import loading from "../../assets/loading.gif";

const Navbar = () => {
  const { connectWallet, error, currentAccount } = useContext(VotingContext);
  const [openNav, setOpenNav] = useState(false);

  const openNavigation = () => {
    setOpenNav(!openNav);
  };

  return (
    <div className={Style.navbar}>
      {error && (
        <div className={Style.message_box}>
          <div className={Style.message}>
            <p>{error}</p>
          </div>
        </div>
      )}

      <div className={Style.navbar_box}>
        <div className={Style.title}>
          <Link href="/">
            <div>
              <Image src={loading} alt="logo" width={60} height={60} />
            </div>
          </Link>
        </div>

        <div className={Style.connect}>
          {currentAccount ? (
            <div>
              <div className={Style.connect_flex}>
                <button onClick={openNavigation}>
                  {currentAccount.slice(0, 10)}..
                </button>
                <span>
                  {openNav ? (
                    <AiFillUnlock onClick={openNavigation} />
                  ) : (
                    <AiFillLock onClick={openNavigation} />
                  )}
                </span>
              </div>

              {openNav && (
                <div className={Style.navigation}>
                  <p>
                    <Link href="/">Home</Link>
                  </p>
                  <p>
                    <Link href="/candidat-registration">Candidate Registration</Link>
                  </p>
                  <p>
                    <Link href="/allow-voters">Voter Registration</Link>
                  </p>
                  <p>
                    <Link href="/voterList">Voter List</Link>
                  </p>
                </div>
              )}
            </div>
          ) : (
            <button onClick={connectWallet} className={Style.connect_button}>
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
