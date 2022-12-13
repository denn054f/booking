import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { Table } from "antd";
import axios from "axios";
import moment from "moment";
import PageLayout from "../../components/PageLayout";
import { showLoading, hideLoading } from "../../redux/loadSlice";

const DoctorAppointments = () => {
  // initialize state for appointments
  const [appointments, setAppointments] = useState([]);
  const dispatch = useDispatch();
  // fetch appointments data from the API
  const getAppointmentsData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get(
        "/api/doctor/get-appointments-by-doctor-id",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        setAppointments(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  const changeAppointmentStatus = async (record, status) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/doctor/change-appointment-status",
        { appointmentId: record._id, status: status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        getAppointmentsData();
      }
    } catch (error) {
      toast.error("Fejl");
      dispatch(hideLoading());
    }
  };

  const columns = [
    {
      title: "Patient",
      dataIndex: "name",
      // use the userInfo property from the record to display the users name
      render: (text, record) => <span>{record.userInfo.name}</span>,
    },
    {
      title: "Telefon",
      dataIndex: "phoneNumber",
      render: (text, record) => <span>{record.doctorInfo.phoneNumber}</span>,
    },
    {
      title: "Dato & Tid",
      dataIndex: "createdAt",
      // use moment.js to format the date and time of the appointment
      render: (text, record) => (
        <span>
          {moment(record.date).format("DD-MM-YYYY")}
          {moment(record.time).format("HH:mm")}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Handlinger",
      dataIndex: "actions",
      className: "hide-on-mobile",
      render: (text, record) => (
        <div className="flex">
          {record.status === "pending" && (
            <div className="flex">
              <h1
                className="anchor anchor-actions"
                onClick={() => changeAppointmentStatus(record, "Godkendt")}
              >
                Godkend
              </h1>
              <h1
                className="anchor anchor-actions"
                onClick={() => changeAppointmentStatus(record, "Afvist")}
              >
                Afvis
              </h1>
            </div>
          )}
        </div>
      ),
    },
  ];

  useEffect(() => {
    getAppointmentsData();
  }, []);

  return (
    <PageLayout>
      <h1 className="page-title">Aftaler</h1>
      <hr className="hr" />
      <Table columns={columns} dataSource={appointments} />
    </PageLayout>
  );
};

export default DoctorAppointments;
