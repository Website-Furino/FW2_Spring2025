import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LayoutWebsite from "./page/(website)/layout";
import LayoutAdmin from "./page/(admin)/LayoutAdmin";
import NotFoundPage from "./page/(website)/404/page";
import Login from "./page/(website)/auth/login/Login";
import Register from "./page/(website)/auth/register/Register";
import ThankYouPage from "./page/(website)/checkout/thankyou";
import OrderHistory from "./page/(website)/order/OrderHistory";
import Orders from "./page/(admin)/Orders/Orders";
import OrderDetail from "./page/(admin)/Orders/OrderDetail";
import HomePage from "./page/(website)/home/page";
import ShopPage from "./page/(website)/shop/page";
import ProductDetail from "./page/(website)/product_detail/page";
import CartPage from "./page/(website)/cart/page";
import CheckoutPage from "./page/(website)/checkout/page";
import Dashboard from "./page/(admin)/Dashboard";
import ProductList from "./page/(admin)/Products/ProductList";
import ProductAdd from "./page/(admin)/Products/ProductAdd";
import ProductEdit from "./page/(admin)/Products/ProductEdit";
import UserList from "./page/(admin)/Users/UserList";
import CategoryList from "./page/(admin)/Categories/CategoryList";
import CategoryAdd from "./page/(admin)/Categories/CategoryAdd";
import CategoryEdit from "./page/(admin)/Categories/CategoryEdit";
import LoginAdmin from "./page/(admin)/auth/Login";
import PrivateRoute from "./page/(admin)/auth/PrivateRoute";
import WishList from "./page/(website)/wishlist/page";

function App() {
  const routerConfig = createBrowserRouter([
    {
      path: "/",
      element: <LayoutWebsite />,
      children: [
        { index: true, element: <HomePage /> },
        { path: "shop", element: <ShopPage /> },
        { path: "shop/:id", element: <ProductDetail /> },
        { path: "shop/cart", element: <CartPage /> },
        { path: "/checkout", element: <CheckoutPage /> },
        { path: "register", element: <Register /> },
        { path: "order-history", element: <OrderHistory /> },
        { path: "shop/checkout/thankyou", element: <ThankYouPage /> },
        { path: "login", element: <Login /> },
        { path: "wishlist", element: <WishList /> },
      ],
    },
    {
      path: "/admin",
      element: <LayoutAdmin />,
      children: [
        {
          path: "dashboard",
          element: (
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          ),
        },
        {
          path: "products",
          element: (
            <PrivateRoute>
              <ProductList />
            </PrivateRoute>
          ),
        },
        {
          path: "products/add",
          element: (
            <PrivateRoute>
              <ProductAdd />
            </PrivateRoute>
          ),
        },
        {
          path: "products/:id/edit",
          element: (
            <PrivateRoute>
              <ProductEdit />
            </PrivateRoute>
          ),
        },
        {
          path: "categories",
          element: (
            <PrivateRoute>
              <CategoryList />
            </PrivateRoute>
          ),
        },
        {
          path: "categories/add",
          element: (
            <PrivateRoute>
              <CategoryAdd />
            </PrivateRoute>
          ),
        },
        {
          path: "categories/:id/edit",
          element: (
            <PrivateRoute>
              <CategoryEdit />
            </PrivateRoute>
          ),
        },
        {
          path: "orders",
          element: (
            <PrivateRoute>
              <Orders />
            </PrivateRoute>
          ),
        },
        {
          path: "orders/:id",
          element: (
            <PrivateRoute>
              <OrderDetail />
            </PrivateRoute>
          ),
        },
        {
          path: "users",
          element: (
            <PrivateRoute>
              <UserList />
            </PrivateRoute>
          ),
        },
      ],
    },
    {
      path: "/admin/login",
      element: <LoginAdmin />,
    },
    { path: "*", element: <NotFoundPage /> },
  ]);

  return <RouterProvider router={routerConfig} />;
}

export default App;
