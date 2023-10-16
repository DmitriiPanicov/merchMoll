export const generateStyles = (isSuccess?: boolean) => {
  if (isSuccess) {
    return {
      style: {
        borderRadius: "8px",
        border: "2px solid rgba(64, 191, 107, 1)",
        background: "#e5f7ec",
        color: "rgba(39, 40, 53, 1)",
      },
    };
  } else
    return {
      style: {
        borderRadius: "8px",
        border: "2px solid rgba(235, 79, 86, 1)",
        background: "#ffebeb",
        color: "rgba(39, 40, 53, 1)",
      },
    };
};
