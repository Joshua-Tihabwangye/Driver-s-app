import { io, type Socket } from "socket.io-client";
import { API_BASE_URL } from "./api/config";
import { readDriverBackendAccessToken } from "./api/driverApi";

export type DriverSocket = Socket;

export function createDriverSocket(): DriverSocket {
  return io(`${API_BASE_URL}/driver`, {
    path: "/socket.io",
    transports: ["websocket"],
    autoConnect: false,
    withCredentials: false,
    auth: {
      token: readDriverBackendAccessToken(),
    },
  });
}
