import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import axios from "axios";
import { showLoading, hideLoading } from "../../redux/loadSlice";
import PageLayout from "../../components/PageLayout";
import UserForm from "../../components/UserForm";

const UserProfile = () => {
  // declare a state variable for the active user and a dispatch function for Redux actions
  const [activeUser, setActiveUser] = useState(null);
  const dispatch = useDispatch();

  const handleSubmit = async (values) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/user/update-user-profile",
        {
          ...values,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Fejl");
    }
  };

  const getUserData = async () => {
    try {
      dispatch(showLoading());
      // send a request to the API to get the user's information
      const response = await axios.post(
        "/api/user/get-user-info-by-id",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      // if the request was successful, update the activeUser state variable
      if (response.data.success) {
        setActiveUser(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <PageLayout>
      <h1 className="page-title center">Profil</h1>
      <hr className="hr" />
      {activeUser && (
        <UserForm onFinish={handleSubmit} initialValues={activeUser} />
      )}
    </PageLayout>
  );
};

export default UserProfile;
