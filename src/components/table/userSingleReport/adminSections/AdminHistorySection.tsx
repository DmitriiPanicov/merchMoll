import { FC } from "react";

import { getVisibleHistory } from "../../../../utils/calculateHistoryPagination";
import { formatHistoryDateTime } from "../../../../utils/formatDate";

import HistoryPagination from "../../../historyPagination/historyPagination";

interface IProps {
  setCurrentHistoryPage: any;
  currentHistoryPage: any;
  filteredHistory: any;
  title: string;
}

const AdminHistorySection: FC<IProps> = ({
  setCurrentHistoryPage,
  currentHistoryPage,
  filteredHistory,
  title,
}) => {
  const visibleHistory = getVisibleHistory(filteredHistory, currentHistoryPage);

  return (
    <>
      <div className="history__title_paginationBlock">
        <span className="section__title">{title}</span>
        {filteredHistory.length > 25 && (
          <HistoryPagination
            totalItems={filteredHistory.length}
            onPageChange={(event: any) => setCurrentHistoryPage(event)}
            currentPage={currentHistoryPage}
            itemsPerPage={25}
          />
        )}
      </div>
      <table className="customerOutlet__data_table">
        <thead className="tunder__thead">
          <tr>
            <th className="tight__history_cell">Дата</th>
            <th className="tight__history_cell">Изменил</th>
            <th className="tight__history_cell">Тип изменения</th>
            <th className="wide__history_cell">Старое значение</th>
            <th className="wide__history_cell"> Новое значение</th>
          </tr>
        </thead>
        <tbody>
          {visibleHistory.map((elem: any, index: number) => (
            <tr key={index}>
              <td className="tight__history_cell">
                {formatHistoryDateTime(elem.date)}
              </td>
              <td className="tight__history_cell">{elem.changer}</td>
              <td className="tight__history_cell">{elem.name}</td>
              <td className="wide__history_cell">{elem.oldValue}</td>
              <td className="wide__history_cell">{elem.newValue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default AdminHistorySection;
