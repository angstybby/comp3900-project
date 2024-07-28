import { axiosInstanceWithAuth } from "@/api/Axios";
import {
  DataTable,
  LeaderboardColumns,
  LeaderboardTableProps,
} from "@/components/LeaderboardComponents/LeaderboardTable";
import LoadingCircle from "@/components/LoadingCircle";
import { useEffect, useState } from "react";
import { set } from "zod";

export default function Leaderboard() {
  const [data, setData] = useState<LeaderboardTableProps[]>([]);
  // TODO implement loading state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstanceWithAuth.post("/leaderboard");
        setData(response.data);
      } catch (error) {
        console.error(error);
        //TODO Show the error
      }
    };
    setLoading(true);
    fetchData();
    setLoading(false);
  }, []);

  return (
    <div className="container mx-auto py-10">
      {loading ? (
        <LoadingCircle />
      ) : (
        <DataTable columns={LeaderboardColumns} data={data} />
      )}
    </div>
  );
}
