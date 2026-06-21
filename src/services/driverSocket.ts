import { io, type Socket } from "socket.io-client";
import { SOCKET_BASE_URL, SOCKET_PATH } from "./api/config";
import { readDriverBackendAccessToken } from "./api/driverApi";

export type DriverSocket = Socket;

let driverSocket: DriverSocket | null = null;

export function createDriverSocket(): DriverSocket {
  if (!driverSocket) {
    driverSocket = io(`${SOCKET_BASE_URL}/driver`, {
      path: SOCKET_PATH,
      transports: ["websocket"],
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000,
      withCredentials: false,
      auth: {
        token: readDriverBackendAccessToken(),
      },
    });
  }

  driverSocket.auth = {
    token: readDriverBackendAccessToken(),
  };

  return driverSocket;
}

/**
 * Cleanly disconnect and destroy the singleton socket instance.
 * Call this when the driver goes offline so the backend no longer
 * receives presence pings from a stale connection.
 */
export function disconnectDriverSocket(): void {
  if (driverSocket) {
    driverSocket.disconnect();
    driverSocket = null;
  }
}
