import { useEffect } from "react";
import * as signalR from "@microsoft/signalr";
import toast from "react-hot-toast";

export function useSignalR(onTodoCompleted: (ids: number | number[]) => void) {
  useEffect(() => {
    const hubUrl = import.meta.env.VITE_SIGNALR_URL;
    const TOAST_ID = 'signalr-conn';

    if (!hubUrl) {
      toast.error('VITE_SIGNALR_URL no está configurado', { id: TOAST_ID });
      return;
    }

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl)
      .withAutomaticReconnect()
      .build();

    connection.onreconnecting(() => {
      toast.loading('Reconectando al tiempo real...', { id: TOAST_ID });
    });

    connection.onreconnected(() => {
      toast.success('Reconectado al tiempo real', { id: TOAST_ID });
    });

    connection.onclose((err) => {
      if (err) {
        toast.error('Conexión cerrada por error', { id: TOAST_ID });
        console.error('SignalR cerrado por error:', err);
      } else {
        toast('Conexión cerrada', { id: TOAST_ID });
      }
    });

    const handler = (payload: number | number[]) => {
      console.log('TodoCompleted recibido:', payload);
      onTodoCompleted(payload);
    };

    connection.on("TodoCompleted", handler);

    connection
      .start()
      .then(() => toast.success('Conectado a tiempo real', { id: TOAST_ID }))
      .catch((err) => {
        toast.error('Error al conectar a tiempo real', { id: TOAST_ID });
        console.error('Error SignalR start:', err);
      });

    return () => {
      connection.off("TodoCompleted", handler);
      connection.stop();
    };
  }, []);
}