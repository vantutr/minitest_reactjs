import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Button,
  Table,
  Form,
  Row,
  Col,
  Pagination,
  InputGroup,
  Modal,
} from "react-bootstrap";
import axiosClient from "../api/axiosClient";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const productsPerPage = 5;

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axiosClient.get("/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosClient.get("/categories");
      const categoryMap = response.data.reduce((acc, category) => {
        acc[category.id] = category.name;
        return acc;
      }, {});
      setCategories(categoryMap);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách danh mục:", error);
    }
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    try {
      await axiosClient.delete(`/products/${productToDelete.id}`);
      fetchProducts();
      handleCloseDeleteModal();
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
    }
  };

  const handleShowDeleteModal = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  const processedProducts = useMemo(() => {
    let filteredProducts = [...products];

    if (searchTerm) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.id.toString().includes(searchTerm)
      );
    }

    filteredProducts.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    return filteredProducts;
  }, [products, searchTerm, sortConfig]);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = processedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(processedProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Container>
      <h1 className="my-4">Quản lý Sản phẩm</h1>
      <Row className="mb-3">
        <Col md={8}>
          <InputGroup>
            <Form.Control
              placeholder="Tìm kiếm theo tên hoặc ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={4} className="text-end">
          <Link to="/products/add">
            <Button variant="primary">Thêm sản phẩm mới</Button>
          </Link>
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th onClick={() => requestSort("id")}>
              ID{" "}
              {sortConfig.key === "id"
                ? sortConfig.direction === "asc"
                  ? "▲"
                  : "▼"
                : ""}
            </th>
            <th onClick={() => requestSort("name")}>
              Tên sản phẩm{" "}
              {sortConfig.key === "name"
                ? sortConfig.direction === "asc"
                  ? "▲"
                  : "▼"
                : ""}
            </th>
            <th>Hình ảnh</th>
            <th onClick={() => requestSort("price")}>
              Giá{" "}
              {sortConfig.key === "price"
                ? sortConfig.direction === "asc"
                  ? "▲"
                  : "▼"
                : ""}
            </th>
            <th>Danh mục</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: "100px", height: "auto" }}
                />
              </td>
              <td>{product.price.toLocaleString("vi-VN")} VNĐ</td>
              <td>{categories[product.categoryId] || "N/A"}</td>
              <td>
                <Link to={`/products/edit/${product.id}`}>
                  <Button variant="warning" size="sm" className="me-2">
                    Sửa
                  </Button>
                </Link>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleShowDeleteModal(product)}
                >
                  Xóa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {totalPages > 1 && (
        <Pagination className="justify-content-center">
          {[...Array(totalPages).keys()].map((number) => (
            <Pagination.Item
              key={number + 1}
              active={number + 1 === currentPage}
              onClick={() => paginate(number + 1)}
            >
              {number + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      )}

      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận Xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn xóa sản phẩm{" "}
          <strong>{productToDelete?.name}</strong> không?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProductList;
