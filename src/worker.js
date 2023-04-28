/* eslint-disable-next-line no-restricted-globals */
const sharedWorkerCode = () => {
  self.addEventListener("connect", (event) => {
    const port = event.ports[0];

    const ws = new WebSocket(
      "wss://dealer-status-reporter-devprem.leverex.io/websocket"
    );

    ws.onmessage = function (event) {
      const json = JSON.parse(event.data);
      try {
        port.postMessage({ message: "data_arrived", payload: json });
      } catch (err) {
        port.postMessageError(err);
      }
    };

    const sendWebSocketState = () => {
      port.postMessage({
        message: "state_changed",
        payload: ws.readyState,
      });
    };

    ws.onopen = function (_) {
      sendWebSocketState();
    };

    ws.onclose = function (_) {
      sendWebSocketState();
    };

    port.start();
  });
};

let code = sharedWorkerCode.toString();
code = code.substring(code.indexOf("{") + 1, code.lastIndexOf("}"));

const blob = new Blob([code], { type: "application/javascript" });
const worker_script = URL.createObjectURL(blob);

module.exports = worker_script;
