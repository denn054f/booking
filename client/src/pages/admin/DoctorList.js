import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Table } from "antd";
import { showLoading, hideLoading } from "../../redux/loadSlice";
import PageLayout from "../../components/PageLayout";

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const dispatch = useDispatch();
  // fetch the list of doctors
  const getDoctorsData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get("/api/admin/get-all-doctors", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(hideLoading());
      setDoctors(response.data.data);
    } catch (error) {
      dispatch(hideLoading());
      console.error(error);
    }
  };

  const changeDoctorStatus = async (record, status) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/admin/change-doctor-account-status",
        { doctorId: record._id, userId: record.userId, status: status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      toast.success(response.data.message);
      // refresh the list of doctors
      getDoctorsData();
    } catch (error) {
      // Handle errors
      dispatch(hideLoading());
      toast.error("Error changing doctor account status");
      console.error(error);
    }
  };

  useEffect(() => {
    getDoctorsData();
  }, []);

  const columns = [
    {
      title: "Navn",
      dataIndex: "name",
      render: (text, record) => (
        <span>
          {record.firstName} {record.lastName}
        </span>
      ),
    },
    {
      title: "Telefon",
      dataIndex: "phoneNumber",
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
            <h1
              className="anchor"
              onClick={() => changeDoctorStatus(record, "approved")}
            >
              Godkend
            </h1>
          )}
          {record.status === "approved" && (
            <h1
              className="anchor"
              onClick={() => changeDoctorStatus(record, "Afvist")}
            >
              Afvis
            </h1>
          )}
        </div>
      ),
    },
  ];

  return (
    <PageLayout>
      <h1 className="page-title">Læger</h1>
      <hr className="hr" />
      <Table columns={columns} dataSource={doctors} bordered />
    </PageLayout>
  );
};

export default DoctorList;
