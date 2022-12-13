import { Tabs } from "antd";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import { hideLoading, showLoading } from "../redux/loadSlice";
import { setUser } from "../redux/userSlice";

const Notifications = () => {
  // get the user object from the global state
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // mark all notifications as seen
  const markAllAsSeen = async () => {
    try {
      dispatch(showLoading());
      // make a POST request to the API to mark all notifications as seen
      const response = await axios.post(
        "/api/user/mark-all-notifications-as-seen",
        { userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      // if the request was successful, update the global state and show a success message
      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(setUser(response.data.data));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Fejl");
    }
  };
  // delete all notifications
  const deleteAll = async () => {
    try {
      dispatch(showLoading());
      // make a POST request to the API to delete all notifications
      const response = await axios.post(
        "/api/user/delete-all-notifications",
        { userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(setUser(response.data.data));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Fejl");
    }
  };

  return (
    <PageLayout>
      <h1 className="page-title">Notifikationer</h1>
      <hr className="hr" />
      <Tabs>
        <Tabs.TabPane tab="Ikke set" key={0}>
          <div className="flex-end">
            <h1 className="anchor" onClick={() => markAllAsSeen()}>
              Marker alle som set
            </h1>
          </div>
          {user?.unseenNotifications.map((notification, index) => (
            <div
              key={index}
              className="notification"
              onClick={() => navigate(notification.onClickPath)}
            >
              <div className="card-text">{notification.message}</div>
            </div>
          ))}
        </Tabs.TabPane>
        <Tabs.TabPane tab="Set" key={1}>
          <div className="flex-end">
            <h1 className="anchor" onClick={() => deleteAll()}>
              Slet Alle
            </h1>
          </div>
          {user?.seenNotifications.map((notification, index) => (
            <div
              key={index}
              className="notification"
              onClick={() => navigate(notification.onClickPath)}
            >
              <div className="card-text">{notification.message}</div>
            </div>
          ))}
        </Tabs.TabPane>
      </Tabs>
    </PageLayout>
  );
};

export default Notifications;
