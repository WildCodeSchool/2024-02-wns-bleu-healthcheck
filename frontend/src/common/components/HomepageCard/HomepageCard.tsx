import InsertLinkOutlinedIcon from "@mui/icons-material/InsertLinkOutlined";
import CodeOutlinedIcon  from "@mui/icons-material/CodeOutlined";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";

import "../UrlCard/_urlCard.scss";

interface HomepageCardProps {
  data: {
    url: string;
    name: string;
    testStatus: {
      date: string;
      response_time: number;
      status: number;
      status_code: number;
      status_message: string;
    };
  };
}

export interface HomepageCardData {
  url: string;
  name: string;
  testStatus: {
    date: string;
    response_time: number;
    status: number;
    status_code: number;
    status_message: string;
  };
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
      {data.name && <p className="card__name">{data.name}</p>}
      <div className="card__content">
        <ul className="card__list">
          <li className="card__url card__element card__text">
            <span className="card__icon">
              <InsertLinkOutlinedIcon style={{ fontSize: "20px" }} />
            </span>
            <span className="card__text">
              URL : {data.url}
            </span>
          </li>
          <li className="card__url card__element">
            <span className="card__icon">
              <CodeOutlinedIcon style={{fontSize: "20px"}}/>
            </span>
            <span className="card__text">
              Code de retour : {data.testStatus.status_code}
            </span>
          </li>
          <li className="card__url card__element">
            <span className="card__icon">
              <TimerOutlinedIcon style={{fontSize: "20px"}}/>
            </span>
            <span className="card__text">
            Temps de réponse :{" "}
              {data.testStatus.response_time
                  ? `${data.testStatus.response_time} ms`
                  : ""}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default HomepageCard;
