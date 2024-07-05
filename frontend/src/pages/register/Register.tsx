import { Button } from "@mui/material";
import "./Register.scss";

const Register = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Formulaire soumis");
  };

  return (
    <div className="register__container">
      <form onSubmit={handleSubmit} className="register__form">
        <div className="register__form-content">
          <label htmlFor="username">Nom d'utilisateur:</label>
          <input type="text" id="username" name="username" required />
        </div>
        <div className="register__form-content">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div className="register__form-content">
          <label htmlFor="password">Mot de passe:</label>
          <input type="password" id="password" name="password" required />
        </div>

        <Button type="submit">Créer un compte</Button>
      </form>
    </div>
  );
};

export default Register;
