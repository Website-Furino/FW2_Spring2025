import { Button, Form, Input } from "antd";
import { useOne, useUpdate } from "../../../hooks";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

type CategoryForm = {
  name: string;
};

function CategoryEdit() {
  const { id } = useParams();
  const [form] = Form.useForm();
  const { data: category, isLoading } = useOne({ resource: "categories", id });
  const { mutate } = useUpdate({ resource: "categories", id });

  useEffect(() => {
    if (category) {
      form.setFieldsValue(category);
    }
  }, [category, form]);

  const onFinish = (values: CategoryForm) => {
    const categoryData = { ...values };
    mutate(categoryData);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 30,
        marginTop: 30,
      }}
    >
      <h2>Edit New Category</h2>
      <Form onFinish={onFinish} form={form}>
        <Form.Item
          label="Category Name"
          name="name"
          rules={[{ required: true, message: "Please input category name!" }]}
        >
          <Input />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default CategoryEdit;
