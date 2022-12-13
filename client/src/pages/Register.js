import { Button, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { MedicineBoxOutlined } from "@ant-design/icons";
import { hideLoading, showLoading } from "../redux/loadSlice";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      dispatch(showLoading());
      // send a POST request to the /api/user/register endpoint
      const response = await axios.post("/api/user/register", values);
      dispatch(hideLoading());
      // if the request was successful, redirect the user to the login page
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/login");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Fejl");
    }
  };

  return (
    <div className="auth">
      <div className="auth-form card">
        <i>
          <MedicineBoxOutlined />
        </i>
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Navn"
            name="name"
            rules={[{ required: true, message: "Indtast dit navn" }]}
          >
            <Input placeholder="Navn" pattern="[A-Za-z]*" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Indtast en gyldig email",
              },
            ]}
          >
            <Input placeholder="Email" type="email" />
          </Form.Item>
          <Form.Item
            label="Kodeord"
            name="password"
            rules={[{ required: true, message: "Indtast dit kodeord" }]}
          >
            <Input placeholder="Kodeord" type="password" />
          </Form.Item>
          <Form.Item>
            <Button className="primary-button " htmlType="submit">
              Opret
            </Button>
          </Form.Item>
          <Link to="/login">
            <Button className="primary-button ">Log ind</Button>
          </Link>
        </Form>
      </div>
    </div>
  );
};

export default Register;
