import Cookies from "js-cookie";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const navigate = useNavigate();
  let userType = Cookies.get('userType');
  useEffect(() => {
		if (userType !== 'admin') {
			navigate('/dashboard')
		}
  }, [userType]);
  return (
    <>
      <p>Admins can view all existing users here!</p>
    </>
  )
}