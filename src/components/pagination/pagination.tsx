import { FC } from "react";

import Arrow from "../../assets/icons/arrow.svg";

import "../table/table.scss";

interface IPaginationProps {
  setCurrentPage: any;
  currentPage: number;
  handleChange: any;
  startPage: number;
  setStartPage: any;
  pageName?: string;
  count: any;
  limit: any;
}

const Pagination: FC<IPaginationProps> = ({
  setCurrentPage,
  handleChange,
  setStartPage,
  currentPage,
  startPage,
  pageName,
  count,
  limit,
}) => {
  const totalPages = Math.ceil(count / limit);
  const numbers = [];

  for (let i = 1; i <= totalPages; i++) {
    numbers.push(i);
  }

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber !== currentPage) {
      const newOffset = (pageNumber - 1) * limit;

      handleChange(limit, pageName === "userReports" ? pageNumber : newOffset);
      setCurrentPage(pageNumber);
    }
  };

  const handleNextPage = () => {
    const newStartPage = startPage + 10;
    handlePageChange(newStartPage);
    setCurrentPage(newStartPage);
    setStartPage(newStartPage);
  };

  const handlePreviousPage = () => {
    const newStartPage = Math.max(startPage - 10, 1);
    handlePageChange(newStartPage);
    setCurrentPage(newStartPage);
    setStartPage(newStartPage);
  };

  return (
    <div className="pagination__block">
      <span>Страница</span>
      <div className="numbers">
        {startPage > 1 && (
          <div className="arrowLeft" onClick={handlePreviousPage}>
            <img src={Arrow} alt="" />
          </div>
        )}
        <div className="numbers__wrap">
          {numbers
            .slice(startPage - 1, startPage + 9)
            .map((pageNumber: any) => (
              <div
                className={`numbers__number ${
                  currentPage === pageNumber ? "active" : ""
                }`}
                onClick={() => handlePageChange(pageNumber)}
                key={pageNumber}
              >
                {pageNumber}
              </div>
            ))}
        </div>
        {startPage + 9 < totalPages && (
          <div className="arrowRight" onClick={handleNextPage}>
            <img src={Arrow} alt="" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Pagination;
