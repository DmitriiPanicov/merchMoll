import axios from "axios";

const cookieObj = new URLSearchParams(
  document.cookie.replaceAll("&", "%26").replaceAll("; ", "&")
);

const IS_VISIBLE_SIDEBAR = process.env.REACT_APP_IS_VISIBLE_SIDEBAR;

export async function getToken(): Promise<any> {
  if (JSON.parse(IS_VISIBLE_SIDEBAR as string)) {
    return {
      token: localStorage.getItem("token"),
      userData: JSON.parse(localStorage.getItem("userData") as string),
    };
  } else {
    if (localStorage.getItem("JSESSIONID") === cookieObj.get("JSESSIONID")) {
      // @ts-ignore
      const userData = JSON.parse(localStorage.getItem("userData"));
      return {
        token: localStorage.getItem("token"),
        userData,
      };
    } else {
      const response = await axios(
        `${process.env.REACT_APP_BASE_URL}/api/user/info`
      );

      const token = "Basic " + response.data.token;
      localStorage.setItem("token", token);
      localStorage.setItem("JSESSIONID", cookieObj.get("JSESSIONID") as any);
      localStorage.setItem("userData", JSON.stringify(response.data));
      return {
        token,
        userData: response.data,
      };
    }
  }
}
