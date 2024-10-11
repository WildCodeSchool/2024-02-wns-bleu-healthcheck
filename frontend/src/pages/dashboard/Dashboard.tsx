import "./Dashboard.scss";
import {
  GET_LOGS,
  GET_SAVED_QUERIES,
  UPDATE_QUERY_ORDER,
} from "@/common/graphql/queries.ts";
import { useMutation, useQuery } from "@apollo/client";
import UrlCard, { UrlData } from "../../common/components/UrlCard/UrlCard.tsx";
import { CircularProgress } from "@mui/material";
import SaveQueryBarUrl from "@/common/components/saveQueryBarUrl/SaveQueryBarUrl.tsx";
import { useState, useEffect } from "react";
import LogsModal from "@/common/components/logsModal/LogsModal.tsx";
import { UrlDataWithLogs } from "@/common/models/UrlDataWithLogs.ts";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { DndContext, DragEndEvent, closestCorners } from "@dnd-kit/core";
import { Log } from "@/common/models/Log.ts";

const Dashboard = () => {
  const [savedQueries, setSavedQueries] = useState<UrlData[]>([]);
  const [queryName, setQueryName] = useState("");
  const [logs, setLogs] = useState<Log[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, loading, error } = useQuery(GET_SAVED_QUERIES, {
    fetchPolicy: "cache-and-network",
  });

  const [updateQueryOrder] = useMutation(UPDATE_QUERY_ORDER);

  useEffect(() => {
    if (data) {
      const sortedQueries = [...(data.getSavedQueries as UrlData[])].sort(
        (a, b) => a.queryOrder - b.queryOrder
      );

      setSavedQueries(sortedQueries);
    }
  }, [data]);
  const handleCardClick = async (logs: Log[], name: string) => {
    setLogs(logs);
    setQueryName(name);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const mappedQueries = savedQueries.map((query) => ({
    ...query,
    id: query._id as string,
  }));
  const getQueryPos = (id: number) => {
    return savedQueries.findIndex((query) => query._id === id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id === over.id) return;
    setSavedQueries((query) => {
      const originalPos = getQueryPos(parseInt(active.id.toString()));
      const newPos = getQueryPos(parseInt(over.id.toString()));

      const sortedCards = arrayMove(query, originalPos, newPos);
      updateQueryOrder({
        variables: {
          queriesId: sortedCards.map((query) => query._id),
        },
      });

      return sortedCards;
    });
  };

  if (error) {
    return <p>Error: {error.message}</p>;
  }
  return (
    <div className="dashboard__wrapper">
      <div className="dashboard_header">
        <div className="dashboard__search-bar">
          <SaveQueryBarUrl />
        </div>
      </div>
      <div className="dashboard__body">
        {loading && (
          <div className="dashboard__loading">
            <CircularProgress />
          </div>
        )}

        {savedQueries && (
          <DndContext
            onDragEnd={handleDragEnd}
            collisionDetection={closestCorners}
          >
            <SortableContext
              items={mappedQueries}
              strategy={horizontalListSortingStrategy}
            >
              {savedQueries.map((query: UrlData) => (
                <UrlCard
                  urlData={query}
                  key={query._id}
                  onClick={() => handleCardClick}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}

        {savedQueries && savedQueries.length === 0 && !loading && (
          <div className="dashboard__no-queries">
            <p>Ce dashboard est vide.</p>
          </div>
        )}
      </div>

      <LogsModal
        open={isModalOpen}
        handleClose={handleCloseModal}
        urlName={queryName}
        logs={logs}
      />
    </div>
  );
};

export default Dashboard;
