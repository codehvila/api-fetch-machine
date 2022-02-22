import { fetchPeople } from "./api";
import "./App.css";
import { fetchMachine } from "./machines/fetch";
import { useMachine } from "@xstate/react";

function App() {
  // const [isLoading, setIsLoading] = useState(false);
  // const [results, setResults] = useState([]);
  // const [errorMessage, setErrorMessage] = useState("");
  const [fetchState, sendToFetchMachine] = useMachine(fetchMachine, {
    actions: {
      fetchData: (ctc, event) => {
        // setIsLoading(true);
        fetchPeople()
          .then((r) => r.results)
          .then(
            (res) => {
              sendToFetchMachine({ type: "RESOLVE", results: res });
              // setResults(res);
              // setIsLoading(false);
            },
            (message) => {
              sendToFetchMachine({ type: "REJECT", message });
              // setErrorMessage(message);
              // setIsLoading(false);
            }
          );
      },
    },
  });

  // function fetchData() {
  // }

  return (
    <div className="App">
      <button
        onClick={
          () => sendToFetchMachine({ type: "FETCH" }) /** () => fetchData() */
        }
      >
        Fetch
      </button>
      {/** isLoading */ fetchState.matches("pending") ? <p>Loading</p> : null}
      {
        /** !isLoading && !errorMessage */ fetchState.matches("successful") ? (
          <ul>
            {fetchState.context.results &&
              fetchState.context.results.map((person, index) => (
                <li key={index}>{person.name}</li>
              ))}
          </ul>
        ) : null
      }
      {
        /** !isLoading && errorMessage */ fetchState.matches("failed") ? (
          <p>{/** errorMessage */ fetchState.context.message}</p>
        ) : null
      }
    </div>
  );
}

export default App;
