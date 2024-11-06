import React, { useState } from "react";
import "./TestBarUrl.scss";
import { LazyQueryExecFunction, OperationVariables } from "@apollo/client";
import Tooltip from "@mui/material/Tooltip";
import useValidateUrl from "@/common/hooks/useValidateUrl";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TestBarUrl = ({
  execute,
}: {
  execute: LazyQueryExecFunction<any, OperationVariables>;
}) => {
  const [url, setUrl] = useState("");
  const isValidUrl = useValidateUrl(url);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleSubmit = () => {
    if (isValidUrl) {
      execute({ variables: { url } });
    }
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
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
        <Tooltip title={isValidUrl ? "Tester l'URL !" : "URL invalide"}>
          <div
            className={
              isValidUrl ? "test__bar-button-valid" : "test__bar-button-invalid"
            }
          >
            <button onClick={handleSubmit} disabled={!isValidUrl}>
              <LanguageOutlinedIcon style={{ fontSize: "22" }} />
            </button>
          </div>
        </Tooltip>
      </div>
    </>
  );
};

export default TestBarUrl;
