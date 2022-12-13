import { Button, Form, Input } from "antd";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { MedicineBoxOutlined } from "@ant-design/icons";
import { hideLoading, showLoading } from "../redux/loadSlice";

const Login = () => {
  // use the dispatch hook to dispatch actions
  const dispatch = useDispatch();
  // use the useNavigate hook to navigate to different routes
  const navigate = useNavigate();

  // function to handle form submission
  const handleSubmit = async (values) => {
    dispatch(showLoading());
    try {
      // send a POST request to the login endpoint
      const response = await axios.post("/api/user/login", values);
      if (response.data.success) {
        localStorage.setItem("token", response.data.data);
        navigate("/");
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Fejl");
    }
    dispatch(hideLoading());
  };

  return (
    <div className="auth">
      <div className="auth-form card">
        <i>
          <MedicineBoxOutlined />
        </i>
        <Form layout="vertical" onFinish={handleSubmit}>
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
            <Button className="primary-button" htmlType="submit">
              Log ind
            </Button>
          </Form.Item>
          <Link to="/register">
            <Button className="primary-button">Opret</Button>
          </Link>
        </Form>
      </div>
    </div>
  );
};

export default Login;
