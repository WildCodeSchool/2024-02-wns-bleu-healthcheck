import "./Dashboard.scss"
import {GET_SAVED_QUERIES} from "@/common/graphql/queries.ts";
import { useQuery} from "@apollo/client";
import UrlCard, {UrlData} from "../../common/components/UrlCard/UrlCard.tsx";

const Dashboard = () => {

    const { data, loading, error } = useQuery(GET_SAVED_QUERIES);
    const savedQueries:UrlData[] = data?.getSavedQueries;


    if(error) {
        return <p>Error: {error.message}</p>
    }
    return (
        <div className="dashboard__wrapper">
            <div className="dashboard_header">
                Add stuff here (header)

            </div>
            <div className="dashboard__body">
                {loading &&
                    <div className="dashboard__loading">
                        Loading...
                    </div>
                }

                {savedQueries && savedQueries.map((query:UrlData) => {
                    return <UrlCard urlData={query} key={query._id} />
                })}
            </div>

        </div>
    );
};

export default Dashboard;
