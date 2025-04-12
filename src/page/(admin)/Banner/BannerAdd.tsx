import { useState } from "react";
import {
  Button,
  Form,
  Input,
  Switch,
  Upload,
  message,
  Image,
  Row,
  Col,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useCreate } from "../../../hooks";
import { RcFile } from "antd/es/upload/interface";

// ================= INTERFACE =================

interface BannerForm {
  title: string;
  description: string;
  imageUrl: string;
  active: boolean;
}

// ================= COMPONENT =================

function BannerAdd() {
  const { mutate } = useCreate({ resource: "banners" });

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

  const onFinish = (values: BannerForm) => {
    if (!imageUrl) {
      message.error("Please upload an image.");
      return;
    }

    const bannerData: BannerForm = { ...values, imageUrl };
    mutate(bannerData);
  };

  return (
    <div
      style={{
        padding: "20px",
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <Row>
        <Col xs={24}>
          <h2>Add New Banner</h2>
        </Col>
      </Row>
      <Row>
        <Col xs={24} sm={24} md={20} lg={16} xl={14}>
          <Form onFinish={onFinish} layout="vertical" style={{ marginTop: "20px" }}>
            <Form.Item
              label="Banner Title"
              name="title"
              rules={[{ required: true, message: "Please input banner title!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: "Please input description!" }]}
            >
              <Input.TextArea />
            </Form.Item>

            <Form.Item
              label="Banner Image"
              name="imageUrl"
              rules={[{ required: true, message: "Please upload image!" }]}
            >
              <Upload beforeUpload={handleUploadChange} showUploadList={false}>
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Form.Item>

            {previewVisible && imageUrl && (
              <Form.Item label="Preview Image">
                <Image width="100%" style={{ maxWidth: "300px" }} src={imageUrl} />
              </Form.Item>
            )}

            <Form.Item label="Active" name="active" valuePropName="checked">
              <Switch />
            </Form.Item>

            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    </div>
  );
}

export default BannerAdd;