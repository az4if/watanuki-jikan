import React, { useMemo } from "react";
import {
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from "react-icons/fa";

const Pagination = ({ currentPage, totalPages, onChange }) => {
  console.log(currentPage, totalPages);

  const range = (start, end) => {
    return [...Array(end - start + 1)].map((_, i) => start + i);
  };

  const getPage = (page, total) => {
    if (total <= 5) return range(1, total);

    const start = Math.max(1, page - 2);
    const end = Math.min(total, page + 2);

    return range(start, end);
  };

  const pageNav = useMemo(
    () => getPage(currentPage, totalPages),
    [currentPage, totalPages],
  );

  const showFirst = currentPage > 1;
  const showPrev = currentPage > 1;
  const showNext = totalPages - currentPage > 1;
  const showEnd = totalPages - currentPage > 1;

  const changePage = (num) => {
    onChange(num);
  };

  const liClass =
    "bg-lightbg text-xs sm:text-base hover:text-primary rounded-full size-9 sm:size-11 flex justify-center items-center cursor-pointer";

  return (
    <nav>
      <ul className="flex justify-center items-center gap-0.5 sm:gap-2 my-5">
        {showFirst && (
          <li className={liClass} title="page 1" onClick={() => changePage(1)}>
            <FaAngleDoubleLeft />
          </li>
        )}

        {showPrev && (
          <li
            className={liClass}
            title={`page ${currentPage - 1}`}
            onClick={() => changePage(currentPage - 1)}
          >
            <FaAngleLeft />
          </li>
        )}

        {pageNav.map((p) => (
          <li
            key={p}
            title={`page ${p}`}
            className={`${
              currentPage === p ? "bg-primary text-black" : ""
            } ${liClass}`}
            onClick={() => changePage(p)}
          >
            <button>{p}</button>
          </li>
        ))}

        {showNext && (
          <li
            className={liClass}
            title={`page ${currentPage + 1}`}
            onClick={() => changePage(currentPage + 1)}
          >
            <FaAngleRight />
          </li>
        )}

        {showEnd && (
          <li
            className={liClass}
            title={`page ${totalPages}`}
            onClick={() => changePage(totalPages)}
          >
            <FaAngleDoubleRight />
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Pagination;
