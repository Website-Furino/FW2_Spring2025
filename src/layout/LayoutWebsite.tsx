import Header from "../page/(website)/components/website/Header";
import Footer from "../page/(website)/components/website/Footer";
import { Outlet } from "react-router-dom";

const LayoutWebsite = () => {
  return (
    <div className="font-poppins">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default LayoutWebsite;
