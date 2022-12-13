import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import axios from "axios";
import moment from "moment";
import { showLoading, hideLoading } from "../../redux/loadSlice";
import PageLayout from "../../components/PageLayout";
import DoctorForm from "../../components/DoctorForm";

const DoctorProfile = () => {
  // hooks to access the global state and dispatch actions
  const { user } = useSelector((state) => state.user);
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [doctor, setDoctor] = useState(null);
  // function to update the doctor's profile information
  const handleSubmit = async (values) => {
    try {
      dispatch(showLoading());
      // format the timings values
      const timings = [
        moment(values.timings[0]).format("HH:mm"),
        moment(values.timings[1]).format("HH:mm"),
      ];
      const response = await axios.post(
        "/api/doctor/update-doctor-profile",
        {
          ...values,
          userId: user._id,
          timings,
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
        navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Fejl");
    }
  };

  const getDoctorData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/doctor/get-doctor-info-by-user-id",
        {
          userId: params.userId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        setDoctor(response.data.data);
      }
    } catch (error) {
      console.log(error);
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getDoctorData();
  }, []);

  return (
    <PageLayout>
      <h1 className="page-title">Profil</h1>
      <hr className="hr" />
      {doctor && <DoctorForm onFinish={handleSubmit} initialValues={doctor} />}
    </PageLayout>
  );
};

export default DoctorProfile;
