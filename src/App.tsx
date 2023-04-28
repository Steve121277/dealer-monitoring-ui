import "./App.css";
import React from "react";
import PrintTree from "./components/PrintTree";

const worker_script = require("./worker");

type DATASTREAM = { [key: string]: any[] };

function App() {
  const [readyState, setReadyState] = React.useState<number>(0);
  const [dataStreams, setDataStreams] = React.useState<DATASTREAM>({});
  const [receivedCount, addReceivedCount] = React.useState<number>(0);
  const [selectedService, setSelectedService] = React.useState<string>("");
  const [lastService, setLastService] = React.useState<string>("");

  React.useEffect(() => {
    const myWorker = new SharedWorker(worker_script);
    myWorker.port.addEventListener("message", (event: any) => {
      if (event.data.message === "data_arrived") {
        const serviceId = event.data.payload["service_id"];
        addReceivedCount((_value) => _value + 1);

        setDataStreams((_dataStreams) => handler({ ..._dataStreams }));

        const handler = (reserved: DATASTREAM) => {
          setLastService(serviceId);
          if (typeof reserved[serviceId] === "undefined")
            reserved[serviceId] = [];
          reserved[serviceId].push(event.data.payload);
          return reserved;
        };
      } else if (event.data.message === "state_changed") {
        setReadyState(event.data.payload);
      }
    });
    myWorker.port.start();

    return () => {
      myWorker.port.removeEventListener("message", (event: any) => {});
    };
  }, []);

  return (
    <div className="root_container">
      <span className="state">
        Web Socket State:
        {readyState === 0 && <span className="connecting">Connecting</span>}
        {readyState === 1 && <span className="open">Open</span>}
        {readyState === 3 && <span className="close">Close</span>}
      </span>
      <p className="status_bar">Received Count : {receivedCount}</p>
      <div className="main_content">
        <div className="service_list">
          {Object.getOwnPropertyNames(dataStreams).map((prop, index) => (
            <p
              key={index}
              className={`service_list_item ${
                prop === selectedService ? "selected" : ""
              }`}
              onClick={() => setSelectedService(prop)}
            >
              {prop}
              <span
                className={`count_tag ${lastService === prop ? "last" : ""}`}
              >
                {dataStreams[prop].length}
              </span>
            </p>
          ))}
        </div>
        {selectedService !== "" &&
          typeof dataStreams[selectedService] !== "undefined" && (
            <PrintTree data={dataStreams[selectedService]} />
          )}
      </div>
    </div>
  );
}

export default App;
