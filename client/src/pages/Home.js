import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { Col, Row } from "antd";
import toast from "react-hot-toast";
import Doctor from "../components/Doctor";
import { showLoading, hideLoading } from "../redux/loadSlice";
import PageLayout from "../components/PageLayout";

const Home = () => {
  // use the useState hook to manage state
  const [doctors, setDoctors] = useState([]);
  const dispatch = useDispatch();
  // function to fetch the list of approved doctors
  const fetchDoctors = async () => {
    dispatch(showLoading());
    try {
      // send a GET request to the endpoint with the authorization header
      const response = await axios.get("/api/user/get-all-approved-doctors", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      // if the request was successful, update the state with the returned data
      if (response.data.success) {
        setDoctors(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Fejl");
    }
    dispatch(hideLoading());
  };
  // use the useEffect hook to call the fetchDoctors function when the component is rendered
  useEffect(() => {
    fetchDoctors();
  }, []);

  return (
    <PageLayout>
      <h1 className="page-title">Reservér en tid</h1>
      <hr className="hr" />
      <Row gutter={20}>
        {doctors.map((doctor, index) => (
          <Col key={index} span={8} xs={24} sm={24} lg={8}>
            <Doctor doctor={doctor} />
          </Col>
        ))}
      </Row>
    </PageLayout>
  );
};

export default Home;
