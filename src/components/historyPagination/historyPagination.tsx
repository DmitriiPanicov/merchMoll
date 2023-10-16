import { FC } from "react";

import "../table/table.scss";

interface IPaginationProps {
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  currentPage: number;
  totalItems: number;
}

const HistoryPagination: FC<IPaginationProps> = ({
  onPageChange,
  itemsPerPage,
  currentPage,
  totalItems,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page: number) => {
    onPageChange(page);
  };

  return (
    <div className="numbers__wrap">
      {Array.from({ length: totalPages }).map((_, index) => (
        <div
          className={`numbers__number_history ${
            currentPage === index + 1 ? "active__history_number" : ""
          }`}
          onClick={() => handlePageChange(index + 1)}
          key={index}
        >
          {index + 1}
        </div>
      ))}
    </div>
  );
};

export default HistoryPagination;
