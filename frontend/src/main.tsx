import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router/router.tsx";
import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from "@apollo/client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const link = createHttpLink({
  uri: '/api',
  credentials: 'same-origin'
});

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link,
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <ToastContainer />
      <RouterProvider router={router} />
    </ApolloProvider>
  </React.StrictMode>
);
