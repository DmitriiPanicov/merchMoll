import { FC, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute: FC<any> = ({ component }) => {
  const [hasToken, setHasToken] = useState<boolean>(
    !!localStorage.getItem("token")
  );

  useEffect(() => {
    setHasToken(!!localStorage.getItem("token"));
  }, [hasToken]);

  if (hasToken) {
    return component;
  } else {
    return <Navigate to="/login" />;
  }
};

export default PrivateRoute;
