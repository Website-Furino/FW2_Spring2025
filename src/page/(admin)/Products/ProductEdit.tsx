import React, { useEffect, useState } from "react";
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
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { useList, useOne, useUpdate } from "../../../hooks";
import { RcFile } from "antd/es/upload/interface";

type ProductForm = {
  name: string;
  price: number;
  size: string;
  categoryName: string;
  material: string;
  imageUrl: string;
  noibat: boolean;
};

const { Option } = Select;

function ProductEdit() {
  const { id } = useParams();
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
      });
      setImageUrl(product.imageUrl || ""); // set default image if no image is set
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

    const productData = { ...values, imageUrl };
    mutate(productData, {
      onError: () => message.error("Failed to update product"),
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 30,
        marginTop: 30,
      }}
    >
      <h2>Edit Product</h2>
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          label="Product Name"
          name="name"
          rules={[{ required: true, message: "Please input product name!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Original Price"
          name="price"
          rules={[{ required: true, message: "Please input product price!" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Category"
          name="categoryName"
          rules={[{ required: true, message: "Please select product category!" }]}
        >
          <Select placeholder="Select a category">
            {/* Displaying categories dynamically */}
            {categ &&
              categ.map((cat) => (
                <Option key={cat.id} value={cat.name}>
                  {cat.name}
                </Option>
              ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Size"
          name="size"
          rules={[{ required: true, message: "Please input product size!" }]}
        >
          <Input placeholder="D1600 - R800 - C800 mm" />
        </Form.Item>

        <Form.Item
          label="Material"
          name="material"
          rules={[{ required: true, message: "Please input product material!" }]}
        >
          <Input placeholder="Khung gỗ bọc vải" />
        </Form.Item>

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

        <Form.Item label="Highlight" name="noibat" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default ProductEdit;
