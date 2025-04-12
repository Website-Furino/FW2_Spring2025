import { useState } from "react";
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
import { useCreate, useList } from "../../../hooks";
import { RcFile } from "antd/es/upload/interface";

const { Option } = Select;

// ================= INTERFACE =================

interface ProductForm {
  name: string;
  price: number;
  stock: number;
  categoryName: string;
  size: string;
  material: string;
  imageUrl: string;
  noibat: boolean;
}

interface Category {
  id: number | string;
  name: string;
}

// ================= COMPONENT =================

function ProductAdd() {
  const { mutate } = useCreate({ resource: "products" });
  const { data: categ } = useList({ resource: "categories" });

  const [imageUrl, setImageUrl] = useState<string>("");
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);

  const handleUploadChange = (file: RcFile) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
      return false;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result as string);
      setPreviewVisible(true);
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
    mutate(productData);
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "1200px",
        margin: "0 auto",
        width: "100%",
      }}
    >
      <h2>Add New Product</h2>
      <Form onFinish={onFinish} layout="vertical">
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
              rules={[{ required: true, message: "Please input stock!" }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12}>
            <Form.Item
              label="Category"
              name="categoryName"
              rules={[{ required: true, message: "Please select category!" }]}
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
              rules={[{ required: true, message: "Please input material!" }]}
            >
              <Input placeholder="Khung gỗ bọc vải" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12}>
            <Form.Item
              label="Product Image"
              name="imageUrl"
              rules={[{ required: true, message: "Please upload image!" }]}
            >
              <Upload beforeUpload={handleUploadChange} showUploadList={false}>
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Form.Item>

            {previewVisible && imageUrl && (
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
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default ProductAdd;