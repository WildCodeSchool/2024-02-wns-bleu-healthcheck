import TestBarUrl from "@/common/components/testBarUrl/TestBarUrl";
import "./Home.scss";
import UrlCard, { UrlData } from "@/common/components/UrlCard/UrlCard";
import { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { TEST_URL } from "@/common/graphql/queries";

const Home = () => {

  const [urlData, setUrlData] = useState<UrlData>();
  const [executeQuery, { data }] = useLazyQuery(TEST_URL);

  useEffect(() => {
    if (data !== undefined) {
      const { date, response_time, status, status_code, status_message } = data.testUrl;
      setUrlData({
        url: data.testUrl.url,
        lastStatus: {
          date,
          response_time,
          status,
          status_code,
          status_message,
        }
      });
    }
  }, [data]);

  return (
    <div className="home__content-wrapper">
      <div className="home__content">
        <h1 className="home__main-title">LA NOUVELLE ÈRE DU DASHBOARDING</h1>
        <TestBarUrl execute={executeQuery} />
        {urlData && (<UrlCard urlData={urlData} />)}
      </div>
    </div>
  );
};

export default Home;
