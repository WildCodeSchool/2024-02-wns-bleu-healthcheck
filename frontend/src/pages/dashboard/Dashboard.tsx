import "./Dashboard.scss"
import {GET_LOGS, GET_SAVED_QUERIES} from "@/common/graphql/queries.ts";
import {useQuery} from "@apollo/client";
import UrlCard, {UrlData} from "../../common/components/UrlCard/UrlCard.tsx";
import {CircularProgress} from "@mui/material";
import SaveQueryBarUrl from "@/common/components/saveQueryBarUrl/SaveQueryBarUrl.tsx";
import {useState, useEffect} from "react";
import LogsModal from "@/common/components/logsModal/LogsModal.tsx";
import {UrlDataWithLogs} from "@/common/models/UrlDataWithLogs.ts";

const Dashboard = () => {

    const [savedQueries, setSavedQueries] = useState<UrlData[]>([]);
    const [selectedQuery, setSelectedQuery] = useState<UrlDataWithLogs | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const {data, loading, error} = useQuery(GET_SAVED_QUERIES, {
        pollInterval: 60000, // Refetch every 60 seconds
        fetchPolicy: "cache-and-network"
    });

    const { refetch } = useQuery(GET_LOGS, {
        skip: true,  // Don't fetch automatically, the logs will be fetched only when clicking on a card
    });

    useEffect(() => {
        if (data) {
            setSavedQueries(data.getSavedQueries);
        }
    }, [data]);

    const handleCardClick = async (query: UrlData) => {
        const { data } = await refetch({ savedQueryId: query._id });
        setSelectedQuery({ ...query, logs: data?.getLogsForSavedQuery || [] });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedQuery(null);
    };

    if (error) {
        return <p>Error: {error.message}</p>
    }
    return (
        <div className="dashboard__wrapper">
            <div className="dashboard_header">
                <div className="dashboard__search-bar">
                    <SaveQueryBarUrl/>
                </div>
            </div>
            <div className="dashboard__body">
                {loading &&
                    <div className="dashboard__loading">
                        <CircularProgress/>
                    </div>
                }

                {savedQueries && savedQueries.map((query: UrlData) => {
                    return <UrlCard urlData={query} key={query._id} onClick={() => handleCardClick(query)}/>
                })}

                {savedQueries && savedQueries.length === 0 && !loading &&
                    <div className="dashboard__no-queries">
                        <p>Ce dashboard est vide.</p>
                    </div>
                }
            </div>

            <LogsModal open={isModalOpen} handleClose={handleCloseModal} urlData={selectedQuery} logs={selectedQuery?.logs || []} />
        </div>
    );
};

export default Dashboard;
