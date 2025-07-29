import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Form, Button, Card, Row, Col } from "react-bootstrap";
import axiosClient from "../api/axiosClient";
import { FiSave, FiXCircle, FiArrowLeft } from "react-icons/fi";

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
    <Container fluid="xl">
      <div className="main-content">
        <Button
          variant="light"
          className="mb-4"
          onClick={() => navigate("/products")}
        >
          <FiArrowLeft /> Quay lại danh sách
        </Button>
        <Card className="form-card">
          <Card.Header>
            <h2>{isEditMode ? "Chỉnh sửa Sản phẩm" : "Thêm Sản phẩm mới"}</h2>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={8}>
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
                      rows={5}
                      name="description"
                      value={product.description}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
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
                  <Form.Group className="mb-3">
                    <Form.Label>URL Hình ảnh</Form.Label>
                    <Form.Control
                      type="text"
                      name="image"
                      value={product.image}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  {product.image && (
                    <img
                      src={product.image}
                      alt="Preview"
                      className="img-fluid rounded mb-3"
                    />
                  )}
                </Col>
              </Row>
              <div className="mt-4">
                <Button variant="primary" type="submit" className="btn-icon">
                  <FiSave /> {isEditMode ? "Cập nhật" : "Lưu"}
                </Button>
                <Button
                  variant="secondary"
                  className="ms-2 btn-icon"
                  onClick={() => navigate("/products")}
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

export default ProductForm;
