import React from "react";

// Internal Import
import Style from "./Card.module.css";

const Card = ({ candidateArray = [], giveVote }) => {
  return (
    <div className={Style.card}>
      {candidateArray.length > 0 ? (
        candidateArray.map((el, i) => (
          <div key={i} className={Style.card_box}>
            <div className={Style.images}>
              <img src={el[4]} alt="profile" /> {/* Using el[4] for IPFS URL */}
            </div>

            <div className={Style.card_info}>
              <h2>
                {el[1].toString()} #{el[1].toString()} {/* Display Candidate ID */}
              </h2>
              <p>{el[0]}</p> {/* Display Candidate Name */}
              <p>Address: {el[3].slice(0, 30)}...</p> {/* Display Candidate Address */}
              <p className={Style.total}>Total Vote</p>
            </div>

            <div className={Style.card_vote}>
              <p>{el[2].toString()}</p> {/* Display Vote Count (converted BigNumber) */}
            </div>

            <div className={Style.card_button}>
              <button
                onClick={() =>
                  giveVote({
                    id: el[1],   // Passing address for vote
                    address: el[3], // Candidate address
                  })
                }
              >
                Beri Vote
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No candidates available</p>
      )}
    </div>
  );
};

export default Card;
