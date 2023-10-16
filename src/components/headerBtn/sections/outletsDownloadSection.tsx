import { FC, useState, useEffect } from "react";

import { calculateProgress } from "../../../utils/calculateUploadingProgress";

import styles from "../headerBtn.module.scss";

interface IProps {
  handleFileChange: any;
  setSelectedFiles: any;
  selectedFiles: any;
}

const OutletsDownloadSection: FC<IProps> = ({
  handleFileChange,
  setSelectedFiles,
  selectedFiles,
}) => {
  const [uploadProgress, setUploadProgress] = useState<number[]>([]);

  useEffect(() => {
    const uploadRequests: XMLHttpRequest[] = [];

    selectedFiles.forEach((file: File, index: number) => {
      const formData = new FormData();
      formData.append("file", file);

      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          calculateProgress(
            setUploadProgress,
            index,
            event.loaded,
            event.total
          );
        }
      });

      xhr.addEventListener("load", () => {
        calculateProgress(setUploadProgress, index, file.size, file.size);
      });

      xhr.open("POST", "/upload-endpoint");
      xhr.send(formData);
      uploadRequests.push(xhr);
    });

    return () => {
      uploadRequests.forEach((xhr) => xhr.abort());
    };
  }, [selectedFiles]);

  return (
    <div className={styles.download__outlets_block}>
      <div className={styles.download__outlets_rowBlock}>
        <span className={styles.block__info_title}>Загрузите Excel файл:</span>
        <input
          accept=".xlsx, .xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          className="download__file_input"
          onChange={handleFileChange}
          placeholder="Загрузить"
          type="file"
          name="file"
          id="file"
        />
        <label htmlFor="file" className="file__label">
          Загрузить
        </label>
      </div>
      <div className={styles.file__list}>
        {selectedFiles.map((file: File, index: number) => {
          const fileSize = (file.size / (1024 * 1024)).toFixed(2);
          const progress = uploadProgress[index] || 0;

          return (
            <div key={index} className={styles.file__list_elem}>
              <div className={styles.file__list_dot}></div>
              <span className={styles.file__name}>{file.name}</span>
              <span>
                {progress.toFixed(0)}% от {fileSize} MB
              </span>
              <span
                className={styles.cancel__file_btn}
                onClick={() => setSelectedFiles([])}
              >
                Отменить
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OutletsDownloadSection;
