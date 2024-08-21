import { GoLink, GoSync, GoCode } from "react-icons/go";
import { FaTrash } from "react-icons/fa";
import { CiTimer } from "react-icons/ci";
import "./_urlCard.scss";
import moment from "moment"
import { Button } from "@mui/material"

export interface UrlData {
  url: string;
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
  frequency?: number;
  name?: string;
  lastStatus?: {
    date: string;
    response_time: number;
    status: number;
    status_code: number;
    status_message: string;
  };
}

interface UrlCardProps {
  urlData: UrlData;
  onClick?: () => void; // Optional onClick prop
}

function UrlCard({ urlData, onClick }: UrlCardProps) {  return (
    <div
        className={`card ${urlData.lastStatus?.status === 2 ? "success" : urlData.lastStatus?.status === 1 ? "warning" : "error"} ${onClick ? "clickable" : ""}`}
        onClick={onClick}
    >
      {urlData.name && (<p className="card__name">{urlData.name}</p>)}
      <div className="card__content">
        <ul className="card__list">
          <li className="card__url card__element card__text">
            <span className="card__icon"><GoLink /></span>URL : {urlData.url}
          </li>
          <li className="card__url card__element">
            <span className="card__icon"><GoCode /></span>Code de retour : {urlData.lastStatus?.status_code}
          </li>
          <li className="card__url card__element">
            <span className="card__icon"><CiTimer/></span>Temps de réponse : {urlData.lastStatus?.response_time ? `${urlData.lastStatus?.response_time} ms` : ""}
          </li>
          {urlData.frequency && (<li className="card__frequence card__element">
            <span className="card__icon"><GoSync /></span>Fréquence : {urlData.frequency} min
          </li>)}
        </ul>
        <p className="card__lastquery">Dernière requête : {urlData.lastStatus?.date ? moment(urlData.lastStatus?.date).fromNow() : "en cours" }</p>
      </div>

      {/*Delete button in the top right corner*/}
      <div className="card__delete">
        <Button
            onClick={(e) => {
              e.stopPropagation();
              console.log("Delete button clicked for card with id", urlData._id);
            }}
            sx={{borderRadius: "50%", height: "32px", minHeight: "32px", width: "32px" , minWidth: "32px", display: "flex", justifyContent: "center", alignItems: "center"}}
        >
          <FaTrash />
        </Button>
      </div>

    </div>
  );
}

export default UrlCard;
