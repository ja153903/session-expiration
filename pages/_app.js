import "../styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { SessionProvider } from "../providers/SessionProvider";

if (process.env.NEXT_PUBLIC_API_MOCKING === "enabled") {
  require("../mocks");
}

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <Component {...pageProps} />
      </SessionProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
