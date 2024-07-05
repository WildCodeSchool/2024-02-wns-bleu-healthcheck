import "./App.scss";
import Card from "./common/components/Card/Card";
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
          <div className="app__title">Bonjour</div>
          <Card />
        </div>
      </ApolloProvider>
    </>
  );
}
export default App;
