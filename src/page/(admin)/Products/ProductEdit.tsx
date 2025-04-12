import { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Switch,
  Upload,
  message,
  Image,
  Select,
  Row,
  Col,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { useList, useOne, useUpdate } from "../../../hooks";
import { RcFile } from "antd/es/upload/interface";

const { Option } = Select;

// ================= INTERFACES =================

interface ProductForm {
  name: string;
  price: number;
  size: string;
  categoryName: string;
  material: string;
  imageUrl: string;
  noibat: boolean;
  stock: number;
}

interface Category {
  id: number | string;
  name: string;
}

interface ProductForm {
  id: number | string;
}

// ================= COMPONENT =================

function ProductEdit() {
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const { data: categ } = useList({ resource: "categories" });
  const { data: product, isLoading } = useOne({ resource: "products", id });
  const { mutate } = useUpdate({ resource: "products", id });

  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        name: product.name,
        price: product.price,
        size: product.size,
        categoryName: product.categoryName,
        material: product.material,
        noibat: product.noibat,
        stock: product.stock,
      });
      setImageUrl(product.imageUrl || "");
    }
  }, [product, form]);

  const handleUploadChange = (file: RcFile) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
      return false;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    return false;
  };
  
  const onFinish = (values: ProductForm) => {
    if (!imageUrl) {
      message.error("Please upload an image.");
      return;
    }

    const productData: ProductForm = { ...values, imageUrl };
    mutate(productData, {
      onSuccess: () => message.success("Product updated successfully"),
      onError: () => message.error("Failed to update product"),
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        padding: "20px",
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <h2>Edit Product</h2>
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        style={{ width: "100%" }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={12} lg={12}>
            <Form.Item
              label="Product Name"
              name="name"
              rules={[{ required: true, message: "Please input product name!" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12}>
            <Form.Item
              label="Original Price"
              name="price"
              rules={[{ required: true, message: "Please input product price!" }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12}>
            <Form.Item
              label="Stock"
              name="stock"
              rules={[{ required: true, message: "Please input stock quantity!" }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12}>
            <Form.Item
              label="Category"
              name="categoryName"
              rules={[{ required: true, message: "Please select product category!" }]}
            >
              <Select placeholder="Select a category">
                {categ?.map((cat: Category) => (
                  <Option key={cat.id} value={cat.name}>
                    {cat.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12}>
            <Form.Item
              label="Size"
              name="size"
              rules={[{ required: true, message: "Please input product size!" }]}
            >
              <Input placeholder="D1600 - R800 - C800 mm" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12}>
            <Form.Item
              label="Material"
              name="material"
              rules={[{ required: true, message: "Please input product material!" }]}
            >
              <Input placeholder="Khung gỗ bọc vải" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12}>
            <Form.Item label="Product Image" name="imageUrl">
              <Upload
                beforeUpload={handleUploadChange}
                showUploadList={false}
                accept="image/*"
              >
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Form.Item>

            {imageUrl && (
              <Form.Item label="Preview Image">
                <Image width={100} src={imageUrl} />
              </Form.Item>
            )}
          </Col>
          <Col xs={24} sm={24} md={12} lg={12}>
            <Form.Item label="Highlight" name="noibat" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              Submit
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default ProductEdit;