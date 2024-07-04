import { RouterProvider } from "react-router-dom";
import "./App.scss";
// import Header from "./common/components/header/Header.tsx";
// import TestBarUrl from "./common/components/testBarUrl/TestBarUrl.tsx";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import router from "./router/router.tsx";

const client = new ApolloClient({
  uri: "http://localhost:4000",
  cache: new InMemoryCache(),
});

function App() {
  return (
    <>
      <ApolloProvider client={client}>
        <RouterProvider router={router} />
      </ApolloProvider>
    </>
  );
}
export default App;
