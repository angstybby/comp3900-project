import { axiosInstanceWithAuth } from "@/api/Axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"

interface Details {
  id: number,
  groupName: string,
  description: string,
}

const GroupDetails = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const [details, setDetails] = useState<Details>({
    id: 0,
    groupName: "",
    description: "",
  });

  useEffect(() => {
    const fetchDetails = async () => {
      const response = await axiosInstanceWithAuth.get(`/group/details/${groupId}`, {
        data: {
          groupId: groupId,
        }
      })
      setDetails(response.data);
      console.log(response.data);
    }

    fetchDetails();
  },[])

  return (
    <>
      <div className="px-14 py-5">
        <p className="mt-8 text-2xl font-bold mb-5">{`GroupDetails for ${groupId}`}</p>
        <div className="mb-5">
          <p className="mb-2">
            {`GroupId: `}
            <span className="font-bold">
            {`${groupId}`}
            </span>
          </p>
          <p>
            {`Group Name : `}
            <span className="font-bold">
              {`${details.groupName}`}
            </span>
          </p>
          <p className="font-bold mt-5">Group Description:</p>
          <p>{`${details.description}`}</p>
          <p className="font-bold">Group Skills:</p>
        </div>
        
      </div>    
    </>
  )
}

export default GroupDetails