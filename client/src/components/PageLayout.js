import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  UserOutlined,
  UserAddOutlined,
  SettingOutlined,
  LogoutOutlined,
  ScheduleOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MedicineBoxOutlined,
  UnorderedListOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import { Layout, Badge } from "antd";

const { Header, Content, Sider } = Layout;

const PageLayout = ({ children }) => {
  // user object from the Redux store
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  // useState hook to maintain the state for whether the menu is collapsed
  const [collapsed, setCollapsed] = useState(false);

  const menu = {
    // menu items that are available to all users
    commonUser: [
      {
        name: "Booking",
        path: "/",
        icon: <ScheduleOutlined />,
      },
      {
        name: "Profil",
        // path for the user's profile page based on their role
        path:
          user && user.isDoctor
            ? `/doctor/profile/${user?._id}`
            : `/user/profile/${user?._id}`,
        icon: <SettingOutlined />,
      },
    ],
    // items that are only available to users who are not admins
    user: [
      {
        name: "Aftaler",
        path: "/appointments",
        icon: <UnorderedListOutlined />,
      },
      {
        name: "Ansøgning",
        path: "/doctor-application",
        icon: <SolutionOutlined />,
        styles: {
          position: "absolute",
          bottom: "5%",
          display: "none",
        },
      },
    ],
    // items that are only available to doctors
    doctor: [
      {
        name: "Aftaler",
        path: "/doctor/appointments",
        icon: <UnorderedListOutlined />,
      },
    ],
    // items that are only available to admins
    admin: [
      {
        name: "Brugere",
        path: "/admin/UserList",
        icon: <UserOutlined />,
      },
      {
        name: "Læger",
        path: "/admin/DoctorList",
        icon: <UserAddOutlined />,
      },
    ],
  };

  const renderMenu = [
    ...menu.commonUser,
    ...(user && user.isAdmin
      ? menu.admin
      : user && user.isDoctor
      ? menu.doctor
      : menu.user),
  ];

  let role = "Booking";
  // user is an admin, set the role to "Admin"
  if (user && user.isAdmin) {
    role = "Admin";
  }
  // user is a doctor, set the role to "Doctor"
  else if (user && user.isDoctor) {
    role = "Læge";
  }

  return (
    <Layout>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        collapsedWidth={0}
        breakpoint="xs"
        onCollapse={setCollapsed}
      >
        <Link to="/">
          <div className="sidebar-header">
            <i>
              <MedicineBoxOutlined />
            </i>
            <h1 className="role">{role}</h1>
          </div>
        </Link>
        <ul className="menu">
          {renderMenu.map((menu, index) => {
            const isActive = location.pathname === menu.path;
            return (
              // added the styles to the <li> element if they are provided
              <li
                key={index}
                className={`flex menu-item ${isActive && "active-menu-item"}`}
                style={menu.styles} // added
              >
                <i>{menu.icon}</i>
                <Link to={menu.path}>{menu.name}</Link>
              </li>
            );
          })}
          <li
            className="flex menu-item "
            onClick={() => {
              localStorage.clear();
              navigate("/login");
              window.location.reload();
            }}
          >
            <i>
              <LogoutOutlined />
            </i>
            <Link to="/login">Logout</Link>
          </li>
        </ul>
      </Sider>
      <Layout>
        <Header>
          <i className="header-icon-collapse">
            {React.createElement(
              collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: "trigger",
                onClick: () => setCollapsed(!collapsed),
              }
            )}
          </i>
          <div className="header-user-notify">
            <Link
              className="anchor"
              to={
                user?.isAdmin
                  ? `/`
                  : user?.isDoctor
                  ? `/doctor/profile/${user?._id}`
                  : `/user/profile/${user?._id}`
              }
            >
              {user?.name}
            </Link>
            <Badge
              count={user?.unseenNotifications.length}
              onClick={() => navigate("/notifications")}
            >
              <i className="header-icon ">
                <MailOutlined />
              </i>
            </Badge>
          </div>
        </Header>
        <Content className="content">{children}</Content>
      </Layout>
    </Layout>
  );
};

export default PageLayout;
