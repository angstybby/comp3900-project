import {
  DataTable,
  LeaderboardColumns,
} from "@/components/LeaderboardComponents/LeaderboardTable";

export default function Leaderboard() {
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={LeaderboardColumns} data={[]} />
    </div>
  );
}
