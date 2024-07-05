import React, { useState } from "react";
import "./TestBarUrl.scss";
import { AiOutlineGlobal } from "react-icons/ai";
import { LazyQueryExecFunction, OperationVariables } from "@apollo/client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TestBarUrl = ({ execute }: { execute: LazyQueryExecFunction<any, OperationVariables> }) => {

  const [url, setUrl] = useState("");
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    console.log(e.target.value);
  };

  const handleSubmit = () => {
    console.log("first test");
    execute({ variables: { url } });
  };

return (
  <>
    <div className="test__bar">
      <input
        name="test__bar"
        placeholder="Tester une URL..."
        value={url}
        onChange={handleInputChange}
        className="test__bar-input"
      />
      <div className="test__bar-button">
        <button onClick={handleSubmit}>
          <AiOutlineGlobal />
        </button>
      </div>
    </div>

    {/* <div>
        {loading && <p>Chargement...</p>}
        {error && <p>Erreur : {error.message}</p>}
        {data !== undefined && (
          <div>
            Résultat :
            <div>
              <p>Temps de réponse : {responseTime}ms</p>
              <p>Status : {status}</p>
              <p>Code de statut : {statusCode}</p>
              <p>Message de statut : {statusMessage}</p>
            </div>
          </div>
        )}
      </div> */}
  </>
);
};

export default TestBarUrl;
