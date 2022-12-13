import { Button, Col, Form, Input, Row, TimePicker } from "antd";
import moment from "moment";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const DoctorForm = ({ onFinish, initialValues }) => {
  const [form] = Form.useForm(); // new form instance
  const { user } = useSelector((state) => state.user); // user object from the Redux store

  // set the user's email in the form when the component is rendered
  useEffect(() => {
    form.setFieldsValue({ email: user?.email });
  }, [form, user]);

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={onFinish}
      initialValues={{
        ...initialValues,
        ...(initialValues && {
          password: user?.password,
          timings: [
            moment(initialValues?.timings[0], "HH:mm"),
            moment(initialValues?.timings[1], "HH:mm"),
          ],
        }),
      }}
    >
      <h1 className="card-title-profile">Personlig Information</h1>
      <Row gutter={20}>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Fornavn"
            name="firstName"
            rules={[{ required: true, message: "Indtast dit fornavn" }]}
          >
            <Input placeholder="Fornavn" pattern="[A-Za-z]*" />
          </Form.Item>
        </Col>

        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Efternavn"
            name="lastName"
            rules={[{ required: true, message: "Indtast dit efternavn" }]}
          >
            <Input placeholder="Efternavn" pattern="[A-Za-z]*" />
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Telefon"
            name="phoneNumber"
            rules={[{ required: true, message: "Indtast dit telefonnummer" }]}
          >
            <Input placeholder="Telefon" type="number" />
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item label="Website" name="website">
            <Input placeholder="Website" />
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Adresse"
            name="address"
            rules={[{ required: true, message: "Indtast din adresse" }]}
          >
            <Input placeholder="Adresse" />
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Email"
            name="email"
            rules={[{ required: true, message: "Indtast din email" }]}
          >
            <Input placeholder="Email" />
          </Form.Item>
        </Col>

        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Kodeord"
            name="password"
            rules={[{ required: true, message: "Indtast dit kodeord" }]}
          >
            <Input placeholder="Kodeord" type="password" />
          </Form.Item>
        </Col>
      </Row>
      <h1 className="card-title-profile">Arbejdsinformation</h1>
      <Row gutter={20}>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Specialisering"
            name="specialization"
            rules={[{ required: true, message: "Indtast din specialisering" }]}
          >
            <Input placeholder="Specialisering" pattern="[A-Za-z]*" />
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Konsultationsgebyr"
            name="fee"
            rules={[
              { required: true, message: "Indtast et konsultationsgebyr" },
            ]}
          >
            <Input placeholder="Konsultationsgebyr" type="text" />
          </Form.Item>
        </Col>
        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item
            required
            label="Tidsrum"
            name="timings"
            rules={[{ required: true, message: "Indtast et tidsrum" }]}
          >
            <TimePicker.RangePicker
              allowClear={false}
              format="HH:mm"
              minuteStep={30}
            />
          </Form.Item>
        </Col>

        <Col span={8} xs={24} sm={24} lg={8}>
          <Form.Item>
            <Button className="primary-button" htmlType="submit">
              SUBMIT
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default DoctorForm;
