import { useEffect, useState } from "react";
const validateUrl = (inputUrl: string) => {
  const pattern =
    /^(https?:\/\/)([\w\-]+(\.[\w\-]+)*)(\.(com|fr|net|org|io|co|us|uk|de|jp|cn|ru|br|au|in|it|es|ca|se|no|fi|dk|nl|pl|ph|id|nz|gr|ar|mx|sg|il|my|tr|pt|cz|hk|ie|kr|th|at|be|ch|vn|za|eg|pk|ng|bd|ua|pe|ro|sa|tw|cl|ve|ir|ma|ec|dz|ke|np|lk|kz|tn|gt|do|by|az|sv|zw|gh|tz|ug|sn|kh|mm|zm|ao|rw|cm|ci|mw|am|mg|bf|ne|mo|la|bj|tg|pg|ni|sl|fj|bw|lr|gq|bb|bs|mv|bn|is))(\b(\/[\w\-]*)*(\/[\w\-.,@?^=%&:~+#]*)?)?$/;

  return pattern.test(inputUrl);
};

const useValidateUrl = (inputUrl: string) => {
  const [isValidUrl, setIsValidUrl] = useState(false);

  useEffect(() => {
    setIsValidUrl(validateUrl(inputUrl));
  }),
    [inputUrl];
  return isValidUrl;
};
export default useValidateUrl;
