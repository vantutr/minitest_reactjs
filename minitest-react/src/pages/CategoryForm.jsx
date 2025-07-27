import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Form, Button, Card } from "react-bootstrap";
import axiosClient from "../api/axiosClient";

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
    <Container>
      <Card>
        <Card.Header as="h2">
          {isEditMode ? "Chỉnh sửa Danh mục" : "Thêm Danh mục mới"}
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
                placeholder="Nhập tên danh mục..."
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Lưu
            </Button>
            <Button
              variant="secondary"
              className="ms-2"
              onClick={() => navigate("/categories")}
            >
              Hủy
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CategoryForm;
