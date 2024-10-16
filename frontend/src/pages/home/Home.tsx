import TestBarUrl from "@/common/components/testBarUrl/TestBarUrl";
import "./Home.scss";
import UrlCard, { UrlData } from "@/common/components/UrlCard/UrlCard";
import { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { TEST_URL } from "@/common/graphql/queries";
import { Link } from "react-router-dom";
import useAuth from "@/common/hooks/useAuth";

const Home = () => {
  const [urlData, setUrlData] = useState<UrlData>();
  const [executeQuery, { data }] = useLazyQuery(TEST_URL, {
    fetchPolicy: "network-only",
  });
  const text = "Créez-vous un compte ";
  const { userInfos } = useAuth();
  useEffect(() => {
    if (data !== undefined) {
      const { date, response_time, status, status_code, status_message } =
        data.testUrl.lastStatus;
      setUrlData({
        url: data.testUrl.url,
        lastStatus: {
          date,
          response_time,
          status,
          status_code,
          status_message,
        },
      });
    }
  }, [data]);

  return (
    <div className="home__content-wrapper">
      <div className="home__content">
        <h1 className="home__main-title">LA NOUVELLE ÈRE DU DASHBOARDING</h1>
        <TestBarUrl execute={executeQuery} />
      </div>
      {urlData && (
        <>
          {" "}
          <UrlCard urlData={urlData} />
          {!userInfos.isLoggedIn && (
            <div className="home__redirect">
              <h2>
                Vous voulez enregistrer cette URL?{" "}
                <Link to="/register" className="home__redirect-link">
                  {text.split("").map((char, index) => (
                    <span key={index}>{char}</span>
                  ))}
                </Link>
                et profitez d'un dashboard complet !
              </h2>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
