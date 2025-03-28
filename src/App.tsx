import LayoutWebsite from "./page/(website)/layout";
import LayoutAdmin from "./page/(admin)/LayoutAdmin";
import NotFoundPage from "./page/(website)/404/page";
import CategoryList from "./page/(admin)/Categories/CategoryList";
import CategoryAdd from "./page/(admin)/Categories/CategoryAdd";
import CategoryEdit from "./page/(admin)/Categories/CategoryEdit";
import UserList from "./page/(admin)/Users/UserList";
import Login from "./page/(website)/login/Login";
import Register from "./page/(website)/register/Register";
import ThankYouPage from "./page/(website)/checkout/thankyou";
import OrderHistory from "./page/(website)/order/OrderHistory";
import Orders from "./page/(admin)/Orders/Orders";
import OrderDetail from "./page/(admin)/Orders/OrderDetail";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import HomePage from "./page/(website)/home/page";
import ShopPage from "./page/(website)/shop/page";
import ProductDetail from "./page/(website)/product_detail/page";
import CartPage from "./page/(website)/cart/page";
import CheckoutPage from "./page/(website)/checkout/page";
import Dashboard from "./page/(admin)/Dashboard";
import ProductList from "./page/(admin)/Products/ProductList";
import ProductAdd from "./page/(admin)/Products/ProductAdd";
import ProductEdit from "./page/(admin)/Products/ProductEdit";

function App() {
  const routerConfig = createBrowserRouter([
    {
      path: "/",
      element: <LayoutWebsite />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: "shop",
          element: <ShopPage />,
        },
        {
          path: "shop/:id",
          element: <ProductDetail />,
        },
        {
          path: "shop/cart",
          element: <CartPage />,
        },
        {
          path: "shop/cart/checkout",
          element: <CheckoutPage />,
        },
        {
          path: "register",
          element: <Register />,
        },
        {
          path: "order-history",
          element: <OrderHistory />,
        },
        {
          path: "shop/checkout/thankyou",
          element: <ThankYouPage />,
        },
        {
          path: "login",
          element: <Login />,
        },
      ],
    },
    {
      path: "/admin",
      element: <LayoutAdmin />,
      children: [
        {
          index: true,
          element: <Dashboard />,
        },
        {
          path: "products",
          element: <ProductList />,
        },
        {
          path: "products/add",
          element: <ProductAdd />,
        },
        {
          path: "products/:id/edit",
          element: <ProductEdit />,
        },
        {
          path: "categories",
          element: <CategoryList />,
        },
        {
          path: "categories/add",
          element: <CategoryAdd />,
        },
        {
          path: "categories/:id/edit",
          element: <CategoryEdit />,
        },
        {
          path: "orders",
          element: <Orders />,
        },
        {
          path: "orders/:id",
          element: <OrderDetail />,
        },
        {
          path: "users",
          element: <UserList />,
        },
      ],
    },
    { path: "*", element: <NotFoundPage /> },
  ]);

  return <RouterProvider router={routerConfig} />;
}

export default App;
