"use client";
import { useState, useRef } from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { TextField } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function Home() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [workAddress, setWorkAddress] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Quando seleciona arquivos
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;

    const validFiles: File[] = [];
    const urls: string[] = [];

    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) {
        alert(`O arquivo "${file.name}" não é uma imagem!`);
        continue;
      }
      validFiles.push(file);
      urls.push(URL.createObjectURL(file)); // cria preview
    }

    setSelectedFiles(validFiles);
    setPreviewUrls(urls);
  }

  // Enviar para o backend
  async function handleUpload() {
    if (!workAddress) {
      alert("Please insert pic address!");
      return;
    }

    if (selectedFiles.length === 0) return;

    setIsUploading(true); // 🔹 começa loading

    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => formData.append("files", file));
      formData.append("workAddress", workAddress);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setWorkAddress("");
        alert("All photos were submitted!");

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        setSelectedFiles([]);
        setPreviewUrls([]);
      }
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setIsUploading(false); // 🔹 termina loading
    }
  }

  // Cancelar seleção
  function handleCancel() {
    setSelectedFiles([]);
    setPreviewUrls([]);
  }

  return (
    <div className="p-4">
      <div className="flex flex-col">
        <TextField
          id="workaddress"
          value={workAddress}
          onChange={(e) => setWorkAddress(e.target.value)}
          name="workaddress"
          label="Address"
          variant="outlined"
          required
        />
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
          sx={{ margin: "auto", marginTop: "20px" }}
        >
          Upload Photos
          <VisuallyHiddenInput
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            multiple
          />
        </Button>
      </div>

      {previewUrls.length > 0 && (
        <div className="mt-4">
          <h2>Pré-visualização:</h2>
          <div className="flex gap-4 flex-wrap">
            {previewUrls.map((url, idx) => (
              <img key={idx} src={url} alt={`preview-${idx}`} width={150} />
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className={`px-4 py-2 rounded text-white ${
                isUploading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500"
              }`}
            >
              Enviar
            </button>
            <button
              onClick={handleCancel}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
