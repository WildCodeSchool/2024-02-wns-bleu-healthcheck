import { BsCalendar } from "react-icons/bs";
import { GoLink, GoSync  } from "react-icons/go";
import "./_card.scss"

interface CardProps {
  url: string;
  status: string;
}

function Card({ url, status}: CardProps) {
  return (
    <div className="card">
      <p className="card__name">nom de l'url</p>
      <div className="card__content">
        <ul className="card__list">
          <li className="card__url card__element">
            <span className="card__icon"><GoLink /></span>URL : {url}
          </li>
          <li className="card__statut card__element">
            <span className="card__icon"><BsCalendar /></span>Statut : {status}
          </li>
          <li className="card__frequence card__element">
            <span className="card__icon"><GoSync /></span>Fréquence :
          </li>
        </ul>
        <p className="card__lastquery">Dernière requête : il y a minutes</p>
      </div>
    </div>
  );
}

export default Card;
