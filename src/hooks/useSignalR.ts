import { useEffect } from "react";
import * as signalR from "@microsoft/signalr";

export function useSignalR(onTodoCompleted: (ids: number | number[]) => void) {
  useEffect(() => {
    const hubUrl = import.meta.env.VITE_SIGNALR_URL;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl)
      .withAutomaticReconnect()
      .build();

    const handler = (payload: number | number[]) => {
      onTodoCompleted(payload);
    };

    connection.on("TodoCompleted", handler);
    connection.start().catch(console.error);

    return () => {
      connection.off("TodoCompleted", handler);
      connection.stop();
    };
  }, [onTodoCompleted]);
}