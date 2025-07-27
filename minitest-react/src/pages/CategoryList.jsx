import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Button, Table, Modal } from "react-bootstrap";
import axiosClient from "../api/axiosClient";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axiosClient.get("/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách danh mục:", error);
    }
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;
    try {
      await axiosClient.delete(`/categories/${categoryToDelete.id}`);
      fetchCategories();
      handleCloseDeleteModal();
    } catch (error) {
      console.error("Lỗi khi xóa danh mục:", error);
    }
  };

  const handleShowDeleteModal = (category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setCategoryToDelete(null);
  };

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center my-4">
        <h1>Quản lý Danh mục</h1>
        <Link to="/categories/add">
          <Button variant="primary">Thêm danh mục mới</Button>
        </Link>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên danh mục</th>
            <th className="text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.id}</td>
              <td>{category.name}</td>
              <td className="text-center">
                <Link to={`/categories/edit/${category.id}`}>
                  <Button variant="warning" size="sm" className="me-2">
                    Sửa
                  </Button>
                </Link>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleShowDeleteModal(category)}
                >
                  Xóa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận Xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn xóa danh mục{" "}
          <strong>{categoryToDelete?.name}</strong> không?
          <br />
          <small className="text-danger">
            Lưu ý: Hành động này không xóa các sản phẩm thuộc danh mục này.
          </small>
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

export default CategoryList;
