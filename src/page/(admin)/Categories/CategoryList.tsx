import { Link } from "react-router-dom";
import { useDelete, useList } from "../../../hooks";
import { Button, Popconfirm, Space, Table } from "antd";

function CategoryList() {
  const { data, isLoading } = useList({ resource: "categories" });
  const { mutate } = useDelete({ resource: "categories" });

  const columns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      render: (_: any, __: any, index: number) => {
        return index + 1; // index bắt đầu từ 0, nên cộng thêm 1 để bắt đầu từ 1
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Actions",
      render: (category: any) => {
        return (
          <Space>
            <Button type="primary">
              <Link to={`${category.id}/edit`}>Edit</Link>
            </Button>
            <Popconfirm
              title="Xóa danh mục này nhé"
              description="Bạn có chắc không?"
              onConfirm={() => mutate(category.id)}
              okText="Có"
              cancelText="Không"
            >
              <Button danger>Delete</Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
  return <Table dataSource={data} columns={columns} loading={isLoading} />;
}

export default CategoryList;
