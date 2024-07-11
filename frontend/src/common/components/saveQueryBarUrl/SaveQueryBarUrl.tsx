import React, { useState } from "react";
import "./SaveQueryBarUrl.scss";
import { AiOutlineGlobal } from "react-icons/ai";
import {useMutation} from "@apollo/client";
import {CREATE_SAVED_QUERY} from "@/common/graphql/queries";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SaveQueryBarUrl = () => {

  const [url, setUrl] = useState("");
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const [createSavedQuery] = useMutation(CREATE_SAVED_QUERY);

  const handleSubmit = () => {

    // Remove the protocol and "www." prefix if they exist
    const cleanedUrl = url.replace(/^(https?:\/\/)?(www\.)?/, "");

    // Split by "." and take the first term
    const name = cleanedUrl.split(".")[0];

    // Set default frequency
    const frequency = "60";

    createSavedQuery({ variables: { data: { url, name, frequency } } });
  };

return (
  <>
    <div className="savequery__bar">
      <input
        name="savequery__bar"
        placeholder="Sauvegarder une URL..."
        value={url}
        onChange={handleInputChange}
        className="savequery__bar-input"
      />
      <div className="savequery__bar-button">
        <button onClick={handleSubmit}>
          <AiOutlineGlobal />
        </button>
      </div>
    </div>
  </>
);
};

export default SaveQueryBarUrl;
