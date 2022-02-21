import { useEffect, useState } from "react";
import { fetchPeople } from "./api";
import "./App.css";

function App() {
  // const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const [rstate, setRState] = useState(null);

  const [dataFetch, setDataFetch] = useState();

  useEffect(() => {
    const STATES = {
      idle: "idle",
      loading: "loading",
      successfull: "successful",
      error: "error",
    };

    function dataFetchMachine() {
      let mstate = STATES.idle;
      setRState(STATES.idle);

      return {
        state() {
          return mstate;
        },
        fetch() {
          mstate = STATES.loading;
          setRState(mstate);
        },
        resolve() {
          mstate = STATES.successfull;
          setRState(mstate);
        },
        reject() {
          mstate = STATES.error;
          setRState(mstate);
        },
      };
    }
    setDataFetch(dataFetchMachine());
  }, []);

  useEffect(() => {
    console.log();
    console.log(dataFetch && dataFetch.state());
    console.log(rstate);
  }, []);

  function fetchData() {
    // setIsLoading(true);

    dataFetch.fetch();
    console.log(dataFetch.state());

    fetchPeople()
      .then((r) => r.results)
      .then(
        (res) => {
          setResults(res);

          // setIsLoading(false);
          // setErrorMessage("");

          dataFetch.resolve();
          console.log(dataFetch.state(), rstate);
        },
        (message) => {
          setErrorMessage(message);

          // setIsLoading(false);

          dataFetch.reject();
          console.log(dataFetch.state(), rstate);
        }
      );
  }

  return (
    <div className="App">
      <div className="controls">
        <button onClick={() => fetchData()} disabled={rstate === "loading"}>
          Fetch
        </button>
        <div className={rstate + " label"}>{rstate}</div>
      </div>

      <div className="wrapper enumerated-states">
        <div>
          {dataFetch && dataFetch.state() === "idle" && (
            <p>Clic on Fetch Button to Start Request</p>
          )}

          {dataFetch && dataFetch.state() === "loading" /** isLoading */ ? (
            <>
              <p>Loading</p>
            </>
          ) : null}
          {dataFetch &&
          dataFetch.state() ===
            "successful" /** !isLoading && !errorMessage */ ? (
            <>
              <ul>
                {results &&
                  results.map((person, index) => (
                    <li key={index}>{person.name}</li>
                  ))}
              </ul>
            </>
          ) : null}
          {dataFetch &&
          dataFetch.state() === "error" /** !isLoading && errorMessage */ ? (
            <>
              <p>{errorMessage}</p>
            </>
          ) : null}
        </div>

        <div style={{ maxWidth: "40%" }}>
          {rstate === "idle" && <p>Clic on Fetch Button to Start Request</p>}
          {rstate === "loading" /** isLoading */ ? (
            <>
              <p>Loading</p>
            </>
          ) : null}
          {rstate === "successful" /** !isLoading && !errorMessage */ ? (
            <>
              <ul>
                {results &&
                  results.map((person, index) => (
                    <li key={index}>{person.name}</li>
                  ))}
              </ul>
            </>
          ) : null}
          {rstate === "error" /** !isLoading && errorMessage */ ? (
            <>
              <p>{errorMessage}</p>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default App;
