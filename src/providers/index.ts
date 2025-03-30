import axios from "axios";

axios.defaults.baseURL = "http://localhost:3000/";

const token = localStorage.getItem("token");
const axiosClient = axios.create({
  baseURL: "http://localhost:3000/",
  headers: {
    Authorization: token && `Beaer ${token}`,
  },
});

type ProviderProps = {
  resource: string;
  id?: number | string;
  values?: any;
};
export const getList = async ({ resource = "products" }) => {
  const { data } = await axiosClient.get(resource);
  return data;
};

export const getOne = async ({ resource = "products", id }: ProviderProps) => {
  if (!id) return;
  const { data } = await axiosClient.get(`${resource}/${id}`);
  return data;
};

// create
export const create = async ({
  resource = "products",
  values,
}: ProviderProps) => {
  const { data } = await axiosClient.post(resource, values);
  return data;
};

// update
export const update = async ({
  resource = "products",
  id,
  values,
}: ProviderProps) => {
  if (!id) return;
  const { data } = await axiosClient.put(`${resource}/${id}`, values);
  return data;
};

// delete
export const deleteOne = async ({
  resource = "products",
  id,
}: ProviderProps) => {
  if (!id) return;
  const { data } = await axiosClient.delete(`${resource}/${id}`);
  return data;
};
export const auth = async ({
  resource = "register",
  values,
}: ProviderProps) => {
  const { data } = await axiosClient.post(resource, values);
  return data;
};
