import { axiosInstanceWithAuth } from "@/api/Axios";
import {
  DataTable,
  LeaderboardColumns,
  LeaderboardTableProps,
} from "@/components/LeaderboardComponents/LeaderboardTable";
import LoadingCircle from "@/components/LoadingCircle";
import { useEffect, useState } from "react";

export default function Leaderboard() {
  const [data, setData] = useState<LeaderboardTableProps[]>([]);
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
    <div className=" p-14">
      <h1 className="text-4xl font-medium pb-8">
        Leaderboard
      </h1>
      {loading ? (
        <LoadingCircle />
      ) : (
        <DataTable columns={LeaderboardColumns} data={data} />
      )}
    </div>
  );
}
