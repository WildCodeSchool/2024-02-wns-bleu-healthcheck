import { useEffect, useState } from "react"

const validateEmail = (email: FormDataEntryValue) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(String(email));
};

const useValidateEmail = (email: string) => {
  const [isValidEmail, setIsValidEmail] = useState(true);

  useEffect(() => {
    setIsValidEmail(validateEmail(email));
  }, [email]);

  return isValidEmail;
};

export default useValidateEmail;