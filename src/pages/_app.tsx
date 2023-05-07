import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <GoogleOAuthProvider
      clientId={process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID as string}
      onScriptLoadSuccess={() => {
        console.log("Success");
      }}
      onScriptLoadError={() => {
        console.log("Error");
      }}
    >
      <Component {...pageProps} />
    </GoogleOAuthProvider>
  );
}
