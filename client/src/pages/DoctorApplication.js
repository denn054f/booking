import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import PageLayout from "../components/PageLayout";
import { showLoading, hideLoading } from "../redux/loadSlice";
import DoctorForm from "../components/DoctorForm";

const DoctorApplication = () => {
  // get the current user from the store
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // event handler for form submission
  const handleSubmit = async (values) => {
    try {
      dispatch(showLoading());
      const data = {
        ...values,
        userId: user._id,
        email: user.email,
        timings: [
          moment(values.timings[0]).format("HH:mm"),
          moment(values.timings[1]).format("HH:mm"),
        ],
      };
      const response = await axios.post("/api/user/doctor-application", data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/");
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
      <h1 className="page-title">Læge Ansøgning</h1>
      <hr className="hr" />
      <DoctorForm onFinish={handleSubmit} />
    </PageLayout>
  );
};

export default DoctorApplication;
