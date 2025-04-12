import { useState, useEffect } from "react";
import { Button, Image, Popconfirm, Space, Table } from "antd";
import { Link } from "react-router-dom";
import { useDelete, useList } from "../../../hooks";

function BannerList() {
  const { data, isLoading } = useList({ resource: "banners" });
  const { mutate } = useDelete({ resource: "banners" });

  // State lưu trữ danh sách banner và trang hiện tại
  const [banners, setBanners] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (data) {
      setBanners(data.reverse());
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
        return (currentPage - 1) * 10 + (index + 1);
      },
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
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
      title: "Status",
      dataIndex: "active",
      key: "active",
      render: (active: boolean) => (active ? "Active" : "Inactive"),
    },
    {
      title: "Actions",
      render: (banner: any) => {
        return (
          <Space>
            <Button type="primary">
              <Link to={`${banner.id}/edit`}>Edit</Link>
            </Button>
            <Popconfirm
              title="Xóa banner này nhé"
              description="Bạn có chắc không?"
              onConfirm={() => {
                mutate(banner.id);
                setBanners((prevBanners) =>
                  prevBanners.filter((b) => b.id !== banner.id)
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
        dataSource={banners}
        columns={columns}
        loading={isLoading}
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize: 10,
          onChange: handlePageChange,
        }}
      />
    </div>
  );
}
export default BannerList;