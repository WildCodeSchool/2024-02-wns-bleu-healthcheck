import "./App.scss";
import TestBarUrl from "./common/components/testBarUrl/TestBarUrl.tsx";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:4000",
  cache: new InMemoryCache(),
});

function App() {
  return (
    <>
      <ApolloProvider client={client}>
        <div className="app">
          <div className="app__title">App</div>
          <TestBarUrl />
        </div>
      </ApolloProvider>
    </>
  );
}
export default App;
