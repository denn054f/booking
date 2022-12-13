import React from "react";
import { Card, Col, Row } from "antd";
import { Link } from "react-router-dom";

const Doctor = ({ doctor }) => {
  const { firstName, lastName, phoneNumber, address, fee, timings } = doctor;

  return (
    <Row gutter={18}>
      <Col span={24}>
        <Card
          className="card"
          bordered={true}
          hoverable={true}
          actions={[
            <Link to={`/book-appointment/${doctor._id}`}>Book en tid</Link>,
          ]}
        >
          <h1 className="card-title">{`${firstName} ${lastName}`}</h1>
          <hr className="hr" />
          <p>
            <b>Telefon : </b>
            {phoneNumber}
          </p>
          <p>
            <b>Adresse : </b>
            {address}
          </p>
          <p>
            <b>Pris per besøg (1 time) : </b>
            {fee}
          </p>
          <p>
            <b>Tidsrum : </b>
            {timings[0]} - {timings[1]}
          </p>
        </Card>
      </Col>
    </Row>
  );
};

export default Doctor;
