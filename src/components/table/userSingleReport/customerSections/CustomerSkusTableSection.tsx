import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface IProps {
  setSelectedSkusPhoto: any;
  previousReportIdRef: any;
}

const CustomerSkusTableSection: FC<IProps> = ({
  setSelectedSkusPhoto,
  previousReportIdRef,
}) => {
  const { report } = useSelector(
    (state: any) => state.userSingleReport.userSingleReport
  );

  const [isHiddenPrice, setIsHiddenPrice] = useState<boolean>(false);
  const [isHiddenStock, setIsHiddenStock] = useState<boolean>(false);
  const [isHiddenFace, setIsHiddenFace] = useState<boolean>(false);

  const photoViewerInstance = document.querySelector(".photoviewer-modal");

  useEffect(() => {
    if (report && report?.reportId?.id) {
      if (previousReportIdRef.current !== report?.reportId?.id) {
        if (photoViewerInstance) {
          photoViewerInstance.remove();
        }
      }
    }
  }, [photoViewerInstance, previousReportIdRef, report]);

  useEffect(() => {
    const checkPropertyUndefined = (property: string) =>
      report &&
      report.skus.every((obj: any) => typeof obj[property] === "undefined");

    setIsHiddenStock(checkPropertyUndefined("stockAvailability"));
    setIsHiddenPrice(checkPropertyUndefined("price"));
    setIsHiddenFace(checkPropertyUndefined("face"));
  }, [report]);

  return (
    <>
      <span className="section__title">Данные</span>
      <table className="customer__skus_table">
        <thead className="tunder__thead">
          <tr>
            <th>п/п</th>
            <th>Группа</th>
            <th className="wide__skus_cell">Наименование</th>
            {!isHiddenFace && <th>Фейс</th>}
            {!isHiddenStock && <th>Наличие товара</th>}
            {!isHiddenPrice && <th>Цена</th>}
            <th>Горячая линия</th>
          </tr>
        </thead>
        <tbody>
          {report &&
            report?.skus
              .slice()
              ?.sort(
                (firstElem: any, secondElem: any) =>
                  firstElem.position - secondElem.position
              )
              .map((elem: any, index: number) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{elem.group}</td>
                  <td>
                    <span
                      className={elem?.url ? "sku__name_link" : ""}
                      onClick={() =>
                        elem?.url && setSelectedSkusPhoto(elem?.url?.link)
                      }
                    >
                      {elem.brand} {elem.sku.name}
                    </span>
                  </td>
                  {!isHiddenFace && <td>{elem.face}</td>}
                  {!isHiddenStock && (
                    <td>
                      {elem.stockAvailabilityType === "bool" &&
                      elem.stockAvailability <= 0
                        ? "Нет"
                        : elem.stockAvailabilityType === "bool" &&
                          elem.stockAvailability > 0
                        ? "Да"
                        : elem.stockAvailability}
                    </td>
                  )}
                  {!isHiddenPrice && <td>{elem.price}</td>}
                  <td>{elem.hotline || "—"}</td>
                </tr>
              ))}
        </tbody>
      </table>
    </>
  );
};

export default CustomerSkusTableSection;
