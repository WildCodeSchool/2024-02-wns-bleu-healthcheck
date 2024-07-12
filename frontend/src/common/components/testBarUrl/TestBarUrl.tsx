import React, { useState } from "react";
import "./TestBarUrl.scss";
import { AiOutlineGlobal } from "react-icons/ai";
import { LazyQueryExecFunction, OperationVariables } from "@apollo/client";
import Tooltip from "@mui/material/Tooltip";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TestBarUrl = ({
  execute,
}: {
  execute: LazyQueryExecFunction<any, OperationVariables>;
}) => {
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

  const handleSubmit = () => {
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
        <Tooltip title={isValidUrl ? "Tester l'URL !" : "URL invalide"}>
          <div
            className={
              isValidUrl ? "test__bar-button-valid" : "test__bar-button-invalid"
            }
          >
            <button onClick={handleSubmit} disabled={!isValidUrl}>
              <AiOutlineGlobal size={22} />
            </button>
          </div>
        </Tooltip>
      </div>
    </>
  );
};

export default TestBarUrl;
