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
import {
  FiPlus,
  FiSearch,
  FiEdit,
  FiTrash2,
  FiChevronUp,
  FiChevronDown,
} from "react-icons/fi";

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

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return null;
    return sortConfig.direction === "asc" ? <FiChevronUp /> : <FiChevronDown />;
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
    <Container fluid="xl">
      <div className="main-content">
        <div className="page-header">
          <h1>Quản lý Sản phẩm</h1>
          <Link to="/products/add">
            <Button variant="primary" className="btn-icon">
              <FiPlus /> Thêm sản phẩm
            </Button>
          </Link>
        </div>
        <Row className="mb-4">
          <Col md={6}>
            <InputGroup>
              <InputGroup.Text>
                <FiSearch />
              </InputGroup.Text>
              <Form.Control
                placeholder="Tìm kiếm theo tên hoặc ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>
        </Row>
        <div className="table-responsive">
          <Table hover>
            <thead>
              <tr>
                <th onClick={() => requestSort("id")}>
                  ID <SortIcon columnKey="id" />
                </th>
                <th onClick={() => requestSort("name")}>
                  Tên sản phẩm <SortIcon columnKey="name" />
                </th>
                <th>Hình ảnh</th>
                <th onClick={() => requestSort("price")}>
                  Giá <SortIcon columnKey="price" />
                </th>
                <th>Danh mục</th>
                <th className="text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product) => (
                <tr key={product.id}>
                  <td>#{product.id}</td>
                  <td>
                    <strong>{product.name}</strong>
                  </td>
                  <td>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-image"
                    />
                  </td>
                  <td>{product.price.toLocaleString("vi-VN")} VNĐ</td>
                  <td>
                    <span className="badge bg-light text-dark">
                      {categories[product.categoryId] || "N/A"}
                    </span>
                  </td>
                  <td className="text-center">
                    <Link to={`/products/edit/${product.id}`}>
                      <Button
                        variant="link"
                        className="text-warning btn-action"
                      >
                        <FiEdit />
                      </Button>
                    </Link>
                    <Button
                      variant="link"
                      className="text-danger btn-action"
                      onClick={() => handleShowDeleteModal(product)}
                    >
                      <FiTrash2 />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-4">
            <Pagination>
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
          </div>
        )}
      </div>
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <FiTrash2 className="me-2" /> Xác nhận Xóa
          </Modal.Title>
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
