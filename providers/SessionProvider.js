import { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const { data, isLoading, isError } = useQuery(
    ["user-session"],
    async () => {
      const response = await fetch("/api/get-token");
      if (!response.ok) {
        throw new Error("Could not fetch token");
      }

      const data = await response.json();

      return data;
    },
    {
      staleTime: 1000 * 60,
      cacheTime: 1000 * 60,
    }
  );

  if (isLoading) {
    return <div>Authenticating session...</div>;
  }

  if (isError) {
    return <div>Could not fetch token...</div>;
  }

  return (
    <SessionContext.Provider value={{ ...data }}>
      {children}
    </SessionContext.Provider>
  );
}

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context == null) {
    throw new Error("useSession must be used within SessionProvider");
  }

  return context;
};
