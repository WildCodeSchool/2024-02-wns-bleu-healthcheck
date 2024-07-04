import React, { useState } from "react";
import "./TestBarUrl.scss";
import { AiOutlineGlobal } from "react-icons/ai";
import { useLazyQuery } from "@apollo/client";
import { TEST_URL } from "../../graphql/queries";

const TestBarUrl = () => {
  const [url, setUrl] = useState("");

  const [executeQuery, { loading, error, data }] = useLazyQuery(TEST_URL);
  const { responseTime, status, statusCode, statusMessage } =
    data?.testUrl || {};
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleSubmit = () => {
    executeQuery({ variables: { url } });
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

      <div>
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
      </div>
    </>
  );
};

export default TestBarUrl;
