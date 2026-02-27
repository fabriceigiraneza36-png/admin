import React from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

export default function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { currentPage, totalPages, totalItems, limit } = pagination;
  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, totalItems);

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <div className="pagination">
      <div className="pagination-info">
        Showing {start}–{end} of {totalItems}
      </div>
      <div className="pagination-buttons">
        <button
          className="page-btn"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <HiChevronLeft />
        </button>
        {pages.map((p, i) =>
          p === "..." ? (
            <span key={i} style={{ padding: "0 4px", color: "var(--gray-400)" }}>
              ...
            </span>
          ) : (
            <button
              key={i}
              className={`page-btn ${p === currentPage ? "active" : ""}`}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          )
        )}
        <button
          className="page-btn"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <HiChevronRight />
        </button>
      </div>
    </div>
  );
}