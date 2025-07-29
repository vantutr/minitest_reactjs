import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { FiBox, FiLogOut, FiGrid, FiTag } from "react-icons/fi";

const AppNavbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  return (
    <Navbar expand="lg" className="app-navbar" sticky="top">
      <Container fluid="xl">
        <Navbar.Brand as={NavLink} to="/">
          <FiBox size={24} />
          <span>Product Admin</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {isLoggedIn && (
            <>
              <Nav className="me-auto">
                <Nav.Link as={NavLink} to="/products">
                  <FiGrid className="me-2" />
                  Sản phẩm
                </Nav.Link>
                <Nav.Link as={NavLink} to="/categories">
                  <FiTag className="me-2" />
                  Danh mục
                </Nav.Link>
              </Nav>
              <Button
                variant="danger"
                onClick={handleLogout}
                className="btn-icon"
              >
                <FiLogOut className="me-2" />
                Đăng xuất
              </Button>
            </>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
