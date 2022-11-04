import styles from "../styles/Home.module.css";
import { useState, useRef, useEffect } from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useSession } from "../providers/SessionProvider";

function SpecialData() {
  const queryClient = useQueryClient();
  const { apiKey } = useSession();
  const { data, isLoading, isError } = useQuery(
    ["some-data", apiKey],
    async () => {
      const response = await fetch("/api/some-expired-token");
      if (response.status === 403) {
        throw new Error("Invalid token passed");
      }
      const data = await response.json();

      return data;
    },
    {
      onError: () => {
        queryClient.invalidateQueries({ queryKey: ["user-session"] });
      },
    }
  );

  if (isLoading) {
    return <div>Loading special data</div>;
  }

  if (isError) {
    return (
      <div>Something went wrong, now we have to invalidate your session</div>
    );
  }

  return <div>Special Data: {data.message}</div>;
}

export default function Home() {
  const queryClient = useQueryClient();
  const timerRef = useRef();
  const [timer, setTimer] = useState(0);
  const { apiKey } = useSession();

  const increaseTimer = () => {
    if (timer + 1 === 60) {
      queryClient.invalidateQueries({ queryKey: ["user-session"] });
      setTimer(0);
    } else {
      setTimer(timer + 1);
    }
  };

  useEffect(() => {
    timerRef.current = setInterval(increaseTimer, 1000);

    return () => {
      clearInterval(timerRef.current);
    };
  }, [timer]);

  return (
    <div className={styles.container}>
      <p>The current session user is {apiKey}</p>
      <p>Session will live for a minute</p>
      <p>Current time: {timer}</p>
      <SpecialData />
    </div>
  );
}
