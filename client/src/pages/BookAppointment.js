import { Button, DatePicker, TimePicker } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import moment from "moment";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import PageLayout from "../components/PageLayout";
import { showLoading, hideLoading } from "../redux/loadSlice";

const BookAppointment = () => {
  // get the currently logged-in user from the Redux store
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  // state to track whether the doctor is available at the selected date and time
  const [isAvailable, setIsAvailable] = useState(false);
  // state to track the selected date and time
  const [date, setDate] = useState();
  const [time, setTime] = useState();
  const [doctor, setDoctor] = useState(null);
  // get the doctor's information from the server
  const getDoctorData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/doctor/get-doctor-info-by-id",
        {
          doctorId: params.doctorId,
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

  const checkAvailability = async () => {
    try {
      dispatch(showLoading());
      // make a request to the server to check the doctor's availability
      const response = await axios.post(
        "/api/user/check-booking-availability",
        {
          doctorId: params.doctorId,
          date: date,
          time: time,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        setIsAvailable(true);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error booking appointment");
      dispatch(hideLoading());
    }
  };

  const bookNow = async () => {
    // reset isAvailable to false
    setIsAvailable(false);
    try {
      dispatch(showLoading());
      // make a request to the server to book the appointment
      const response = await axios.post(
        "/api/user/book-appointment",
        {
          doctorId: params.doctorId,
          userId: user._id,
          doctorInfo: doctor,
          userInfo: user,
          date: date,
          time: time,
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
        navigate("/appointments");
      }
    } catch (error) {
      toast.error("Error booking appointment");
      dispatch(hideLoading());
    }
  };

  return (
    <PageLayout>
      {doctor && (
        <>
          <h1 className="page-title center">
            {doctor.firstName} {doctor.lastName}
          </h1>
          <hr className="hr" />
          <div className="center">
            <div className="form-input">
              <h1 className="text">
                <b>Tidsrum :</b> {doctor.timings[0]} - {doctor.timings[1]}
              </h1>
              <p>
                <b>Telefon : </b>
                {doctor.phoneNumber}
              </p>
              <p>
                <b>Adresse : </b>
                {doctor.address}
              </p>
              <p>
                <b>Pris per besøg (1 time) : </b>
                {doctor.fee}
              </p>
              <p>
                <b>Hjemmeside : </b>
                {doctor.website}
              </p>
              <div className="center-column mt">
                <DatePicker
                  format="DD-MM-YYYY"
                  onChange={(value) => {
                    setDate(moment(value).format("DD-MM-YYYY"));
                    setIsAvailable(false);
                  }}
                />
                <TimePicker
                  format="HH:mm"
                  className="mt"
                  minuteStep={30}
                  onChange={(value) => {
                    setIsAvailable(false);
                    setTime(moment(value).format("HH:mm"));
                  }}
                />
                {!isAvailable && (
                  <Button
                    className="primary-button mt"
                    onClick={checkAvailability}
                  >
                    Se ledighed
                  </Button>
                )}

                {isAvailable && (
                  <Button className="primary-button mt" onClick={bookNow}>
                    Reservér nu
                  </Button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </PageLayout>
  );
};

export default BookAppointment;
