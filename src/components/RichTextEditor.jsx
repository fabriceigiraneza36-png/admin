import React from "react";

export default function RichTextEditor({ value, onChange }) {
  return (
    <textarea
      className="form-textarea"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      rows={12}
      placeholder="Write your content here... (Supports Markdown)"
      style={{ fontFamily: "monospace", fontSize: "13px", lineHeight: "1.8" }}
    />
  );
}