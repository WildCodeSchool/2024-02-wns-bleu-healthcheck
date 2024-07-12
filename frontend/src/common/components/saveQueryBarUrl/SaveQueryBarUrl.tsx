import React, { useState } from "react";
import "./SaveQueryBarUrl.scss";
import { AiOutlineGlobal } from "react-icons/ai";
import { useMutation } from "@apollo/client";
import { CREATE_SAVED_QUERY } from "@/common/graphql/queries";
import Tooltip from "@mui/material/Tooltip";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SaveQueryBarUrl = () => {
  const [url, setUrl] = useState("");
  const [isValidUrl, setIsValidUrl] = useState(false);

  const validateUrl = (inputUrl: string) => {
    const pattern =
      /^(https?:\/\/)([\w\-]+(\.[\w\-]+)*)(\.(com|fr|net|org|io|co|us|uk|de|jp|cn|ru|br|au|in|it|es|ca|se|no|fi|dk|nl|pl|ph|id|nz|gr|ar|mx|sg|il|my|tr|pt|cz|hk|ie|kr|th|at|be|ch|vn|za|eg|pk|ng|bd|ua|pe|ro|sa|tw|cl|ve|ir|ma|ec|dz|ke|np|lk|kz|tn|gt|do|by|az|sv|zw|gh|tz|ug|sn|kh|mm|zm|ao|rw|cm|ci|mw|am|mg|bf|ne|mo|la|bj|tg|pg|ni|sl|fj|bw|lr|gq|bb|bs|mv|bn|is))(\b(\/[\w\-]*)*(\/[\w\-.,@?^=%&:~+#]*)?)?$/;

    return pattern.test(inputUrl);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputUrl = e.target.value;
    setUrl(inputUrl);
    setIsValidUrl(validateUrl(inputUrl));
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
              <AiOutlineGlobal />
            </button>
          </div>
        </Tooltip>
      </div>
    </>
  );
};

export default SaveQueryBarUrl;
