export const formatDate = (newDate: any) => {
  const options: any = { day: "numeric", month: "long", year: "numeric" };
  const date = new Date(newDate);
  return date.toLocaleDateString("ru-RU", options);
};

export const formatDateTime = (newDateTime: any) => {
  const options: any = {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  };

  const dateTime = newDateTime && new Date(newDateTime);
  return new Intl.DateTimeFormat("ru-RU", options).format(dateTime);
};

export const formatMediasDateTime = (newMediasDate: any) => {
  const date = new Date(newMediasDate);

  const options: any = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };

  const formattedDate = date.toLocaleString("ru-RU", options);

  const [datePart, timePart] = formattedDate.split(", ");

  const [time] = timePart.split(" ");
  const [hours, minutes, seconds] = time.split(":");

  const formattedTime = `${hours}:${minutes}:${seconds}`;
  const formattedDatePart = datePart.replace(/\./g, "/");

  return `${formattedTime} ${formattedDatePart}`;
};

export const formatHistoryDateTime = (newHistoryDate: any) => {
  const date = new Date(newHistoryDate);

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const hours = date.getHours();
  const minutes = date.getMinutes();

  const formattedDate = `${day < 10 ? "0" + day : day}.${
    month < 10 ? "0" + month : month
  }.${year}`;
  const formattedTime = `${hours < 10 ? "0" + hours : hours}:${
    minutes < 10 ? "0" + minutes : minutes
  }`;

  return `${formattedDate} ${formattedTime}`;
};

export const stateDate = (date: any) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const formatUnloadingsDate = (dateTimeString: any) => {
  const dateObject = new Date(dateTimeString);
  const day = String(dateObject.getDate()).padStart(2, "0");
  const month = String(dateObject.getMonth() + 1).padStart(2, "0");
  const year = dateObject.getFullYear();
  const hours = String(dateObject.getHours()).padStart(2, "0");
  const minutes = String(dateObject.getMinutes()).padStart(2, "0");
  const seconds = String(dateObject.getSeconds()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

export const formatUnloadingsTime = (time: string) => {
  const [hours, minutes, seconds] = time.split(":");
  return `${hours}ч ${minutes}м ${seconds}с`;
};

export const getCorrectDate = (newDate: any) => {
  const year = newDate.getFullYear();
  const month = String(newDate.getMonth() + 1).padStart(2, "0");
  const day = String(newDate.getDate()).padStart(2, "0");
  const hours = String(newDate.getHours()).padStart(2, "0");
  const minutes = String(newDate.getMinutes()).padStart(2, "0");
  const seconds = String(newDate.getSeconds()).padStart(2, "0");
  const milliseconds = String(newDate.getMilliseconds()).padStart(3, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
};
