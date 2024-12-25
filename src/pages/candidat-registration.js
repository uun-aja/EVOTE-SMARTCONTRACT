
import React, { useState, useContext, useCallback } from "react";
import { VotingContext } from "../../context/Voter";
import Button from "../Components/Button/Button";
import Input from "../Components/Input/Input";
import Style from "../styles/allowedVoter.module.css";
import { useRouter } from "next/router";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import images from "../assets/Asset";

const CandidateRegistration = () => {
  const [fileUrl, setFileUrl] = useState(null);
  const [candidateForm, setCandidateForm] = useState({
    name: "",
    address: "",
  });

  const { setCandidate, uploadToIPFS, error } = useContext(VotingContext);
  const router = useRouter();

  // Upload image to IPFS
  const onDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      try {
        const url = await uploadToIPFS(file);
        setFileUrl(url);
        console.log("Uploaded IPFS URL:", url);
      } catch (err) {
        console.error("Error uploading file:", err);
      }
    },
    [uploadToIPFS]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
    maxSize: 5000000,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCandidateForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCreateCandidate = (e) => {
    e.preventDefault();
    if (!fileUrl) {
      alert("Harap upload gambar terlebih dahulu.");
      return;
    }
    setCandidate(candidateForm, fileUrl, router);
  };

  const handleVerify = () => {
    if (!candidateForm.name || !candidateForm.address) {
      alert("Harap isi nama dan alamat blockchain");
      return;
    }
    if (!fileUrl) {
      alert("Harap upload gambar terlebih dahulu.");
      return;
    }
    router.push("/verifikasi");
  };

  return (
    <div className={Style.createVoter}>
      <div>
        {fileUrl && (
          <div className={Style.voterInfo}>
            <img src={fileUrl} alt="Voter Image" />
            <div className={Style.voterInfo_paragraph}>
              <p>
                Name: <span>&nbsp;{candidateForm.name}</span>
              </p>
              <p>
                Add: <span>&nbsp;{candidateForm.address.slice(0, 20)}</span>
              </p>
            </div>
          </div>
        )}

        {!fileUrl && (
          <div className={Style.sideInfo}>
            <div className={Style.sideInfo_box}>
              <h4>Kandidat Baru</h4>
              <p>
               
              </p>
              <p className={Style.sideInfo_para}>Contract Candidate List</p>
            </div>
          </div>
        )}
      </div>

      <div className={Style.voter}>
        <div className={Style.voter_container}>
          <h1>Buat Kandidat Baru</h1>
          <div className={Style.voter_container_box}>
            <div className={Style.voter_container_box_div}>
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <div className={Style.voter_container_box_div_info}>
                  <p>Upload file, jpg, png, gif, webm max 10MB</p>
                  <div className={Style.voter_container_box_div_info_image}>
                    <img
                      src={images.upload}
                      width={150}
                      height={150}
                      alt="File Upload"
                    />
                  </div>
                  <p>Drag & Drop File</p>
                  <p>or Browse media in your Device</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={Style.input_container}>
          <Input
            inputType="text"
            title="Nama Kandidat"
            placeholder="Nama Kandidat"
            handleClick={(e) =>
              setCandidateForm({ ...candidateForm, name: e.target.value })
            }
          />
          <Input
            inputType="text"
            title="Alamat Blockchain"
            placeholder="Alamat Blockchain Kandidat"
            handleClick={(e) =>
              setCandidateForm({ ...candidateForm, address: e.target.value })
            }
          />
          <div className={Style.Button}>
            <Button btnName="Kirim" handleClick={handleCreateCandidate} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateRegistration;
