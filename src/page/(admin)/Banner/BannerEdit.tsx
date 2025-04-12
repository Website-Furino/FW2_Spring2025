import { useEffect, useState } from "react";
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
import { useParams } from "react-router-dom";
import { useOne, useUpdate } from "../../../hooks";
import { RcFile } from "antd/es/upload/interface";

// ================= INTERFACES =================

interface BannerForm {
  title: string;
  description: string;
  imageUrl: string;
  active: boolean;
}

// ================= COMPONENT =================

function BannerEdit() {
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const { data: banner, isLoading } = useOne({ resource: "banners", id });
  const { mutate } = useUpdate({ resource: "banners", id });

  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    if (banner) {
      form.setFieldsValue({
        title: banner.title,
        description: banner.description,
        active: banner.active,
      });
      setImageUrl(banner.imageUrl || "");
    }
  }, [banner, form]);

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
  
  const onFinish = (values: BannerForm) => {
    if (!imageUrl) {
      message.error("Please upload an image.");
      return;
    }

    const bannerData: BannerForm = { ...values, imageUrl };
    mutate(bannerData, {
      onSuccess: () => message.success("Banner updated successfully"),
      onError: () => message.error("Failed to update banner"),
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
      <Row>
        <Col xs={24}>
          <h2>Edit Banner</h2>
        </Col>
      </Row>
      <Row>
        <Col xs={24} sm={24} md={20} lg={16} xl={14}>
          <Form
            form={form}
            onFinish={onFinish}
            layout="vertical"
            style={{ marginTop: "20px" }}
          >
            <Form.Item
              label="Banner Title"
              name="title"
              rules={[{ required: true, message: "Please input banner title!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Banner Description"
              name="description"
              rules={[{ required: true, message: "Please input banner description!" }]}
            >
              <Input.TextArea />
            </Form.Item>

            <Form.Item label="Banner Image" name="imageUrl">
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
                <Image width="100%" style={{ maxWidth: "300px" }} src={imageUrl} />
              </Form.Item>
            )}

            <Form.Item label="Active" name="active" valuePropName="checked">
              <Switch />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
}

export default BannerEdit;