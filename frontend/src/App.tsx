import "./App.scss";
import Header from "./common/components/header/Header.tsx";
import TestBarUrl from "./common/components/testBarUrl/TestBarUrl.tsx";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:4000",
  cache: new InMemoryCache(),
});

function App() {
  return (
    <>
      <Header />
      <ApolloProvider client={client}>
        <div className="app">
          <div className="app__title">Bonjour</div>
          <TestBarUrl />
        </div>
      </ApolloProvider>
    </>
  );
}
export default App;
