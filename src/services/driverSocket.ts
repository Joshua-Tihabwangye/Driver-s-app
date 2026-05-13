import { io, type Socket } from "socket.io-client";
import { SOCKET_BASE_URL, SOCKET_PATH } from "./api/config";
import { readDriverBackendAccessToken } from "./api/driverApi";

export type DriverSocket = Socket;

export function createDriverSocket(): DriverSocket {
  return io(`${SOCKET_BASE_URL}/driver`, {
    path: SOCKET_PATH,
    transports: ["websocket"],
    autoConnect: false,
    withCredentials: false,
    auth: {
      token: readDriverBackendAccessToken(),
    },
  });
}
