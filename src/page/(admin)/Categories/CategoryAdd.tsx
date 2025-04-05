import { Button, Form, Input } from "antd";
import { useCreate } from "../../../hooks";

type CategoryForm = {
  name: string;
};

function CategoryAdd() {
  const { mutate } = useCreate({ resource: "categories" });

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
      <h2>Add New Category</h2>
      <Form onFinish={onFinish}>
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

export default CategoryAdd;
