import { Button, Form, Input } from "antd";

const UserForm = ({ onFinish, initialValues }) => {
  // destructure the initialValues object for easier access
  const { name, email, password } = initialValues;

  return (
    <div className="center">
      <div className="form-input">
        <Form
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            // use the destructured properties here
            name,
            email,
            password,
          }}
        >
          <Form.Item
            required
            label="Navn"
            name="name"
            rules={[{ required: true, message: "Indtast dit navn" }]}
          >
            <Input placeholder="Name" pattern="[A-Za-z]*" />
          </Form.Item>
          <Form.Item
            required
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
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
            required
            label="Password"
            name="password"
            rules={[{ required: true, message: "Indtast dit kodeord" }]}
          >
            <Input placeholder="Kodeord" type="password" />
          </Form.Item>
          <Form.Item>
            <Button className="primary-button" htmlType="submit">
              Opdater
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default UserForm;
