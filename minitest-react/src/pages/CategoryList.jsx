import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Button, Table, Modal } from "react-bootstrap";
import axiosClient from "../api/axiosClient";
import { FiPlus, FiEdit, FiTrash2, FiTag } from "react-icons/fi";

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
    <Container fluid="xl">
      <div className="main-content">
        <div className="page-header">
          <h1>Quản lý Danh mục</h1>
          <Link to="/categories/add">
            <Button variant="primary" className="btn-icon">
              <FiPlus /> Thêm danh mục
            </Button>
          </Link>
        </div>

        <div className="table-responsive">
          <Table hover>
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
                  <td>#{category.id}</td>
                  <td>
                    <FiTag className="me-2 text-muted" />
                    <strong>{category.name}</strong>
                  </td>
                  <td className="text-center">
                    <Link to={`/categories/edit/${category.id}`}>
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
                      onClick={() => handleShowDeleteModal(category)}
                    >
                      <FiTrash2 />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>

      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <FiTrash2 className="me-2" /> Xác nhận Xóa
          </Modal.Title>
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
