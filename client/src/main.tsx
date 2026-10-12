import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import AdminOrders from "./pages/Admin/AdminOrders";
import Cart from "./pages/Cart/Cart";
import Checkout from "./pages/Checkout/Checkout";
import Collection from "./pages/Collection/Collection";
import Girl from "./pages/Girl/Girl";
import Home from "./pages/Home/Home";
import Men from "./pages/Men/Men";
import NotFound from "./pages/NotFound/NotFound";
import OrderDetail from "./pages/OrderDetail/OrderDetail";
import Product from "./pages/Product/Product";
import Profile from "./pages/Profile/Profile";
import ProfileDashboard from "./pages/ProfileDashboard/ProfileDashboard";
import ProfileSettings from "./pages/ProfileSettings/ProfileSettings";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import StaticPage from "./pages/StaticPage/StaticPage";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/checkout",
        element: <Checkout />,
      },
      {
        path: "/collection",
        element: <Collection />,
      },
      {
        path: "/collection/:filter",
        element: <Collection />,
      },
      {
        path: "/girl",
        element: <Girl />,
      },
      {
        path: "/men",
        element: <Men />,
      },
      {
        path: "/product/:id",
        element: <Product />,
      },
      {
        path: "/admin/orders",
        element: <AdminOrders />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/profile/dashboard",
        element: <ProfileDashboard />,
      },
      {
        path: "/profile/settings",
        element: <ProfileSettings />,
      },
      {
        path: "/profile/orders/:orderId",
        element: <OrderDetail />,
      },
      {
        path: "/reset-password",
        element: <ResetPassword />,
      },
      {
        path: "/pages/:slug",
        element: <StaticPage />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

const rootElement = document.getElementById("root");
if (rootElement == null) {
  throw new Error(`Your HTML Document should contain a <div id="root"></div>`);
}

createRoot(rootElement).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
);
