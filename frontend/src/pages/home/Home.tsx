import TestBarUrl from "@/common/components/testBarUrl/TestBarUrl";
import "./Home.scss";
import UrlCard, { UrlData } from "@/common/components/UrlCard/UrlCard";
import { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { TEST_URL } from "@/common/graphql/queries";
import { Link } from "react-router-dom";

const Home = () => {
  const [urlData, setUrlData] = useState<UrlData>();
  const [executeQuery, { data }] = useLazyQuery(TEST_URL, {
    fetchPolicy: "network-only",
  });
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
    console.log(data);
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
          <div className="home__redirect">
            <h2>
              Vous voulez enregistrer cette URL?{" "}
              <Link to="/register" className="home__redirect-link">
                <span>C</span>
                <span>r</span>
                <span>é</span>
                <span>e</span>
                <span>z</span>
                <span>-</span>
                <span>v</span>
                <span>o</span>
                <span>u</span>
                <span>s</span>
                <span> </span>
                <span>u</span>
                <span>n</span>
                <span> </span>
                <span>c</span>
                <span>o</span>
                <span>m</span>
                <span>p</span>
                <span>t</span>
                <span>e</span>
                <span> </span>
              </Link>
              et profitez d'un dashboard complet !
            </h2>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
