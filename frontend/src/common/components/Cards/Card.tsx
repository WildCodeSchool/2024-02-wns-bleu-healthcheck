import { BsCalendar } from "react-icons/bs";
import { GoLink, GoSync  } from "react-icons/go";
import "./_card.scss"


function Card() {
  return (
    <div className="card">
      <p className="card__name">nom de l'url</p>
      <div className="card__content">
        <ul>
          <li className="card__url">
            <span className="card__icon"><GoLink /></span>URL :
          </li>
          <li className="card__statut">
            <span className="card__icon"><BsCalendar /></span>Statut :
          </li>
          <li className="card__frequence">
            <span className="card__icon"><GoSync /></span>Fréquence :
          </li>
        </ul>
        <p className="card__lastquery">Dernière requête : il y a minutes</p>
      </div>
    </div>
  );
}

export default Card;
