import TestBarUrl from "@/common/components/testBarUrl/TestBarUrl";
import "./Home.scss";

const Home = () => {

  return (
    <div className="home__content-wrapper">
        <div className="home__content">
            <h1 className="home__main-title">LA NOUVELLE ÈRE DU DASHBOARDING</h1>
            <TestBarUrl/>
        </div>
    </div>
  );
};

export default Home;
