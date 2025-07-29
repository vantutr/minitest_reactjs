import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Form, Button, Card } from "react-bootstrap";
import axiosClient from "../api/axiosClient";
import { FiSave, FiXCircle, FiArrowLeft } from "react-icons/fi";

const CategoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [category, setCategory] = useState({ name: "" });

  useEffect(() => {
    if (isEditMode) {
      const fetchCategory = async () => {
        try {
          const response = await axiosClient.get(`/categories/${id}`);
          setCategory(response.data);
        } catch (error) {
          console.error("Lỗi khi lấy thông tin danh mục:", error);
        }
      };
      fetchCategory();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    setCategory({ ...category, name: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category.name.trim()) {
      // Thay thế alert bằng một cơ chế tốt hơn trong tương lai (ví dụ: react-toastify)
      alert("Tên danh mục không được để trống!");
      return;
    }

    try {
      if (isEditMode) {
        await axiosClient.put(`/categories/${id}`, category);
      } else {
        await axiosClient.post("/categories", category);
      }
      navigate("/categories");
    } catch (error) {
      console.error("Lỗi khi lưu danh mục:", error);
    }
  };

  return (
    <Container fluid="xl">
      <div className="main-content">
        <Button
          variant="light"
          className="mb-4"
          onClick={() => navigate("/categories")}
        >
          <FiArrowLeft /> Quay lại danh sách
        </Button>
        <Card className="form-card">
          <Card.Header>
            <h2>{isEditMode ? "Chỉnh sửa Danh mục" : "Thêm Danh mục mới"}</h2>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Tên danh mục</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={category.name}
                  onChange={handleChange}
                  required
                  placeholder="Ví dụ: Điện thoại, Laptop..."
                />
              </Form.Group>
              <div className="mt-4">
                <Button variant="primary" type="submit" className="btn-icon">
                  <FiSave /> {isEditMode ? "Cập nhật" : "Lưu"}
                </Button>
                <Button
                  variant="secondary"
                  className="ms-2 btn-icon"
                  onClick={() => navigate("/categories")}
                >
                  <FiXCircle /> Hủy
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};

export default CategoryForm;
