import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstanceWithAuth } from "../api/Axios";
import ButtonUtility from "../components/ButtonUtility";
import ButtonLoading from "../components/ButtonLoading";

export default function Admin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  let userType = Cookies.get('userType');
  useEffect(() => {
		if (userType !== 'admin') {
			navigate('/dashboard')
		}
  }, [userType]);

  const fetchData = async () => {
    setLoading(true);
    const response = await axiosInstanceWithAuth.get("/user/all");
    console.log(response);
    setLoading(false);
  }

  return (
    <>
      <p>Admins can view all existing users here!</p>
      {loading ? <ButtonLoading/> : <ButtonUtility text={"Fetch users"} onClick={fetchData}/>}
    </>
  )
}