import React, { useState } from "react";
import "./SaveQueryBarUrl.scss";
import { useMutation } from "@apollo/client";
import {
  CREATE_SAVED_QUERY,
  GET_SAVED_QUERIES,
} from "@/common/graphql/queries";
import Tooltip from "@mui/material/Tooltip";
import useValidateUrl from "@/common/hooks/useValidateUrl";
import Tools from "@/common/helpers/Tools";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SaveQueryBarUrl = () => {
  const [url, setUrl] = useState("");
  const isValidUrl = useValidateUrl(url);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputUrl = e.target.value;
    setUrl(inputUrl);
  };
  const [createSavedQuery] = useMutation(CREATE_SAVED_QUERY, {
    refetchQueries: [{ query: GET_SAVED_QUERIES }],
    awaitRefetchQueries: true,
  });

  const handleSubmit = () => {
    const name = Tools.getPrettyUrlName(url);

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
        <Tooltip
          title={isValidUrl ? "Sauvegarder la requête" : "URL invalide"}
          placement="top"
        >
          <div
            className={
              isValidUrl
                ? "savequery__bar-button-valid"
                : "savequery__bar-button-invalid"
            }
          >
            <button onClick={handleSubmit} disabled={!isValidUrl}>
              <LanguageOutlinedIcon style={{ fontSize: "20px" }} />
            </button>
          </div>
        </Tooltip>
      </div>
    </>
  );
};

export default SaveQueryBarUrl;
