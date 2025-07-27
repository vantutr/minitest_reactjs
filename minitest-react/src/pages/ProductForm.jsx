import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Form, Button, Card } from "react-bootstrap";
import axiosClient from "../api/axiosClient";

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    categoryId: "",
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosClient.get("/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
      }
    };

    fetchCategories();

    if (isEditMode) {
      const fetchProduct = async () => {
        try {
          const response = await axiosClient.get(`/products/${id}`);
          setProduct(response.data);
        } catch (error) {
          console.error("Lỗi khi lấy thông tin sản phẩm:", error);
        }
      };
      fetchProduct();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevState) => ({
      ...prevState,
      [name]: name === "price" || name === "categoryId" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await axiosClient.put(`/products/${id}`, product);
      } else {
        await axiosClient.post("/products", product);
      }
      navigate("/products");
    } catch (error) {
      console.error("Lỗi khi lưu sản phẩm:", error);
    }
  };

  return (
    <Container>
      <Card>
        <Card.Header as="h2">
          {isEditMode ? "Chỉnh sửa Sản phẩm" : "Thêm Sản phẩm mới"}
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Tên sản phẩm</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={product.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={product.description}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Giá</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={product.price}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>URL Hình ảnh</Form.Label>
              <Form.Control
                type="text"
                name="image"
                value={product.image}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Danh mục</Form.Label>
              <Form.Select
                name="categoryId"
                value={product.categoryId}
                onChange={handleChange}
                required
              >
                <option value="">Chọn một danh mục</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Button variant="primary" type="submit">
              Lưu
            </Button>
            <Button
              variant="secondary"
              className="ms-2"
              onClick={() => navigate("/products")}
            >
              Hủy
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProductForm;
