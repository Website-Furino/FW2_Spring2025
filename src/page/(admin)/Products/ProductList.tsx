import React, { useState, useEffect } from "react";
import { Button, Image, Popconfirm, Space, Table } from "antd";
import { Link } from "react-router-dom";
import { useDelete, useList } from "../../../hooks";

function ProductList() {
  const { data, isLoading } = useList({ resource: "products" });
  const { mutate } = useDelete({ resource: "products" });

  // State lưu trữ danh sách sản phẩm và trang hiện tại
  const [products, setProducts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (data) {
      setProducts(data.reverse());
    }
  }, [data]);

  // Hàm xử lý thay đổi trang
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const columns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      render: (_: any, __: any, index: number) => {
        return (currentPage - 1) * 10 + (index + 1); // Số thứ tự bắt đầu từ 1 cho mỗi trang
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Category",
      dataIndex: "categoryName",
      key: "categoryName",
    },
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (imageUrl: string) => {
        return <Image src={imageUrl} width={100} preview={true} />;
      },
    },
    {
      title: "Actions",
      render: (product: any) => {
        return (
          <Space>
            <Button type="primary">
              <Link to={`${product.id}/edit`}>Edit</Link>
            </Button>
            <Popconfirm
              title="Xóa sản phẩm này nhé"
              description="Bạn có chắc không?"
              onConfirm={() => {
                mutate(product.id);
                // Cập nhật danh sách sản phẩm sau khi xóa
                setProducts((prevProducts) =>
                  prevProducts.filter((p) => p.id !== product.id)
                );
              }}
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

  return (
    <div>
      <Table
        dataSource={products}
        columns={columns}
        loading={isLoading}
        rowKey="id"
        pagination={{
          current: currentPage, // Hiển thị trang hiện tại
          pageSize: 10, // 10 sản phẩm trên mỗi trang
          onChange: handlePageChange, // Cập nhật khi thay đổi trang
        }}
      />
    </div>
  );
}

export default ProductList;
