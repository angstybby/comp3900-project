import { useEffect, useState } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { axiosInstanceWithAuth } from "@/api/Axios";

interface Group {
  members: number;
  id: number;
  groupName: string;
  description: string | null;
  groupOwnerId: string;
  MaxMembers: number;
  createdAt: Date;
  updatedAt: Date;
}

export default function ProjectGroupOptions() {
//   {
//   chooseOptions,
// }: {
//   chooseOptions: () => void;
// }
  const [groups, setGroups] = useState<Group[]>([]);

  const handleChooseOptions = (value: string) => {
    console.log("Choose options", value);
  };

  useEffect(() => {
    axiosInstanceWithAuth.get("/group/groups").then((res) => {
      setGroups(res.data);
    });
  }, []);

  return (
    <Select onValueChange={handleChooseOptions}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a group" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {groups.map((group) => (
            <SelectItem key={group.id} value={group.id.toString()}>
              {group.groupName}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
