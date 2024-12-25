import React, { useState, useContext, useCallback } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

// Import context
import Style from "../styles/allowedVoter.module.css";
import images from "../assets/Asset";
import Button from "../Components/Button/Button";
import Input from "../Components/Input/Input";
import { useDropzone } from "react-dropzone";
import { VotingContext } from "../../context/Voter";

const allowedVoters = () => {
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, setFormInput] = useState({
    name: "",
    address: "",
    position: "",
  });

  const router = useRouter();
  const { uploadToIPFS, createVoter } = useContext(VotingContext);

  // Handle file drop
  const onDrop = useCallback(
    async (acceptedFiles) => {
      try {
        const file = acceptedFiles[0];
        if (!file) {
          alert("File tidak valid!");
          return;
        }

        const url = await uploadToIPFS(file);
        setFileUrl(url);
      } catch (error) {
        console.error("Error uploading file:", error);
        alert("Gagal mengupload file. Pastikan IPFS berjalan.");
      }
    },
    [uploadToIPFS]
  );

  // Dropzone setup
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
    maxSize: 5000000, // Maksimum 5MB
  });

  // Prevent page reload when submitting form
  const handleCreateVoter = async (e) => {
    e.preventDefault();

    // Validasi form input
    if (!formInput.name || !formInput.address || !formInput.position) {
      alert("Harap lengkapi semua field!");
      return;
    }
    if (!fileUrl) {
      alert("Harap upload gambar pemilih terlebih dahulu!");
      return;
    }

    try {
      await createVoter(formInput, fileUrl, router);
    } catch (error) {
      console.error("Error creating voter:", error);
      alert("Gagal membuat pemilih. Periksa koneksi Anda.");
    }
  };

  return (
    <div className={Style.createVote}>
      {/* Voter Information Preview */}
      {fileUrl && (
        <div className={Style.voterInfo}>
          <img src={fileUrl} alt="Voter Image" />
          <div className={Style.voterInfo_paragraph}>
            <p>
              Nama: <span>&nbsp;{formInput.name}</span>
            </p>
            <p>
              Add: <span>&nbsp;{formInput.address.slice(0, 20)}...</span>
            </p>
            <p>
              Pos: <span>&nbsp;{formInput.position}</span>
            </p>
          </div>
        </div>
      )}

      {!fileUrl && (
        <div className={Style.sideInfo}>
          <div className={Style.sideInfo_box}>
            <h4>Buat Akun Untuk Voting</h4>
            <p>
              Blockchain voting organizer provides an Ethereum Blockchain
              system.
            </p>
            <p className={Style.sideInfo_para}>Daftar Kontrak Pemilih</p>
          </div>
        </div>
      )}
      




      {/* Form untuk menambahkan voter */}
      <div className={Style.sideInfo}>
        <div className={Style.sideInfo_box}>
          <h4>Register Untuk Pemilihan Suara</h4>
          <p>Blockchain Voting</p>
          <p className={Style.sideInfo_para}>Contract Kandidat</p>
        </div>

        <div className={Style.voter}>
          <div className={Style.voter__container}>
            <h1>Buat Pemilih Baru</h1>
            <div className={Style.voter__container__box}>
              <div className={Style.voter__container__box__div}>
                <div {...getRootProps()} className={Style.dropzone}>
                  <input {...getInputProps()} />
                  <div className={Style.voter__container__box__div__info}>
                    <p>Upload File Gambar di sini</p>
                    <div className={Style.voter__container__box__div__image}>
                      <Image
                        src={images.upload}
                        width={150}
                        height={150}
                        objectFit="contain"
                        alt="File Upload"
                      />
                    </div>
                    <p>Taruh Gambar</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Input form */}
          <div className={Style.input__container}>
            <Input
              inputType="text"
              title="Nama"
              placeholder="Nama Pemilih"
              handleClick={(e) =>
                setFormInput({ ...formInput, name: e.target.value })
              }
            />
            <Input
              inputType="text"
              title="Alamat Blockchain"
              placeholder="Alamat Blockchain Pemilih"
              handleClick={(e) =>
                setFormInput({ ...formInput, address: e.target.value })
              }
            />
            <Input
              inputType="text"
              title="Posisi"
              placeholder="Posisi Pemilih"
              handleClick={(e) =>
                setFormInput({ ...formInput, position: e.target.value })
              }
            />

            <div className={Style.Button}>
              <Button btnName="Verifikasi" handleClick={handleCreateVoter} />
            </div>
          </div>
        </div>

        {/* Notice */}
        <div className={Style.createdVoter}>
          <div className={Style.createdVoter__info}>
            <p>Notice For Use</p>
            <p>Hanya admin yang dapat membuat</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default allowedVoters;
