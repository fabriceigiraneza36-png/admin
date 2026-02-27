import React, { useRef } from "react";
import { HiOutlineCloudUpload, HiX } from "react-icons/hi";

export default function ImageUpload({ value, onChange, onRemove }) {
  const inputRef = useRef(null);

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) onChange(file);
  };

  const preview =
    value instanceof File ? URL.createObjectURL(value) : value || null;

  return (
    <div
      className={`image-upload ${preview ? "has-image" : ""}`}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        style={{ display: "none" }}
      />
      {preview ? (
        <>
          <img src={preview} alt="Preview" />
          <button
            className="image-upload-remove"
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.();
            }}
          >
            <HiX />
          </button>
        </>
      ) : (
        <>
          <div className="image-upload-icon">
            <HiOutlineCloudUpload />
          </div>
          <div className="image-upload-text">Click to upload image</div>
          <div className="image-upload-hint">PNG, JPG, WEBP up to 5MB</div>
        </>
      )}
    </div>
  );
}