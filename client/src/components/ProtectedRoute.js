import { Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUser } from "../redux/userSlice";
import { showLoading, hideLoading } from "../redux/loadSlice";

const ProtectedRoute = (props) => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // authenticate user and set user data in Redux store
  const authenticateUser = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/user/get-user-info-by-id",
        { token: localStorage.getItem("token") },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      // if request is successful and user data is returned, set user data in Redux store
      if (response.data.success) {
        dispatch(setUser(response.data.data));
      } else {
        localStorage.clear();
        navigate("/login");
      }
    } catch (error) {
      dispatch(hideLoading());
      localStorage.clear();
      navigate("/login");
    }
  };

  useEffect(() => {
    if (!user) {
      authenticateUser();
    }
  }, [user]);

  // if user is authenticated (i.e. has a token in local storage), render protected route
  if (localStorage.getItem("token")) {
    return props.children;
  } else {
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoute;
