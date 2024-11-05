import { GoLink, GoCode } from "react-icons/go";
import { CiTimer } from "react-icons/ci";

import "./_homepageCard.scss";

interface HomepageCardProps {
  data: {
    url: string;
    testStatus: {
      date: string;
      response_time: number;
      status: number;
      status_code: number;
      status_message: string;
    }
  }
}

export interface HomepageCardData {
  url: string;
  testStatus: {
    date: string;
    response_time: number;
    status: number;
    status_code: number;
    status_message: string;
  }
}

function HomepageCard({ data }: HomepageCardProps) {

  return (
    <div
      className={`card ${
        data.testStatus.status === 2
          ? "success"
          : data.testStatus.status === 1
          ? "warning"
          : "error"
      }`}
    >
      <div className="card__content">
        <ul className="card__list">
          <li className="card__url card__element card__text">
            <span className="card__icon">
              <GoLink />
            </span>
            URL : {data.url}
          </li>
          <li className="card__url card__element">
            <span className="card__icon">
              <GoCode />
            </span>
            Code de retour : {data.testStatus.status_code}
          </li>
          <li className="card__url card__element">
            <span className="card__icon">
              <CiTimer />
            </span>
            Temps de réponse :{" "}
            {data.testStatus.response_time ? `${data.testStatus.response_time} ms` : ""}
          </li>
        </ul>
      </div>
    </div>
  );
}

export default HomepageCard;
