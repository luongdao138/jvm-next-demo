import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useRouter } from "next/router";

import { FC, useState } from "react";

import { AuthService } from "@/jvm-client/front";
import { TokenUtil } from "@/jvm-client/request/token";

interface LoginProps {}

const googleUrl = (() => {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";

  const queryOptions = {
    redirect_uri: process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URL!,
    client_id: process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID!,
    // access_type: "offline",
    response_type: "token",
    // prompt: "popup",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
    foo: "bar",
    uxmode: "popup",
  };

  const qs = new URLSearchParams(queryOptions).toString();

  return `${rootUrl}?${qs}`;
})();

const tokenUtil = new TokenUtil();
const LoginPage: FC<LoginProps> = ({}) => {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  const login = useGoogleLogin({
    onSuccess(res) {
      setAccessToken(res.access_token);
      axios
        .post("http://localhost:9000/api/v1/front/auth/google/login", {
          access_token: res.access_token,
        })
        .then((res) => {
          console.log({ data: res.data });
          tokenUtil.access_token = res.data.access_token;
          tokenUtil.refresh_token = res.data.refresh_token;
          // setAccessToken(res.data.access_token);
          // setRefreshToken(res.data.refresh_token);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    flow: "implicit",
    onError(errorResponse) {
      console.log({ errorResponse });
    },
  });

  const code = router.query?.code;

  const getUser = () => {
    AuthService.getUserSession()
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log({ ...err });
      });
  };

  const logout = () => {
    AuthService.deleteUserSession()
      .then(() => {
        tokenUtil.deleteRefreshToken();
        alert("Logout success");
      })
      .catch(console.log);
  };

  return (
    <div>
      {/* <a href={googleUrl}>Login link</a>*/}
      <button
        onClick={() => {
          login();
        }}
      >
        Login
      </button>

      <br />

      <button onClick={getUser}>Get user</button>
      <br />

      <button onClick={logout}>Logout</button>

      {accessToken && <div>Access token: {accessToken}</div>}

      {refreshToken && <div>Refresh token: {refreshToken}</div>}
    </div>
  );
};

export default LoginPage;
