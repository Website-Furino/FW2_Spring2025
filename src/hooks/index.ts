import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { auth, create, deleteOne, getList, getOne, update } from "../providers";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

type Props = {
  resource: string;
  id?: number | string;
  values?: any;
};
export const useList = ({ resource = "products" }) => {
  return useQuery({
    queryKey: [resource],
    queryFn: () => getList({ resource }),
  });
};

// useOne: getDetail
export const useOne = ({ resource = "products", id }: Props) => {
  return useQuery({
    queryKey: [resource, id],
    queryFn: () => getOne({ resource, id }),
  });
};

// useCreate: addData
export const useCreate = ({ resource = "products" }) => {
  const nav = useNavigate();
  return useMutation({
    mutationFn: (values: any) => create({ resource, values }),
    onSuccess: () => {
      console.log("Success callback triggered");
      nav(`/admin/${resource}`);
      message.success("Thêm thành công", 5);
    },
  });
};

// useUpdate: updateData
export const useUpdate = ({ resource = "products", id }: Props) => {
  const nav = useNavigate();
  return useMutation({
    mutationFn: (values: any) => update({ resource, id, values }),
    onSuccess: () => {
      nav(`/admin/${resource}`);
      message.success("Sửa thành công");
    },
  });
};
// useDelete : deleteOne
export const useDelete = ({ resource = "products" }: Props) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id?: string | number) => deleteOne({ resource, id }),
    onSuccess: () => {
      message.success("Xóa thành công");
      // cap nhat lai danh sach
      queryClient.invalidateQueries({ queryKey: [resource] });
    },
  });
};
export const useAuth = ({ resource = "register" }) => {
  const nav = useNavigate();
  return useMutation({
    mutationFn: (values) => auth({ resource, values }),
    onSuccess: (data) => {
      if (resource == "register") {
        nav("/login");
        return;
      }
      console.log(data);
      message.success("Thành công");
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      nav("/");
    },
  });
};
