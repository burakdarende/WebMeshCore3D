import "../styles/globals.css";
import { useEffect } from "react";
import { initCustomCursors } from "../utils/cursorUtils";

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Initialize custom cursors when app loads
    initCustomCursors();
  }, []);

  return <Component {...pageProps} />;
}
