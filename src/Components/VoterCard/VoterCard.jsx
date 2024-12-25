import React from "react";
import Image from "next/image";

//Internal Import
import Style from "../card/Card.module.css";
import images from "../../assets/vote.jpg";
import voterCardStyle from "./VoterCard.module.css";

const voterCard = ({ voterArray }) => {
  return (
    <div className={Style.card}>
      {voterArray.map((el, i) => (
        <div key={i} className={Style.card_box}>
          <div className={Style.images}>
            <img src={el[5]} alt="Foto" />
          </div>

          <div className={Style.card_info}>
            <h2>
              {el[1]} #{el[0].toNumber()}
            </h2>
            <p>Address: {el[2].slice(0, 30)}...</p>
            <p>Details</p>
            <p className={voterCardStyle.vote_Status}>
              {el[6] == true ? "Kamu Sudah Memilih" : "Kamu Belum Memilih"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default voterCard;
