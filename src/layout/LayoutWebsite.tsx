import Header from "../page/(website)/components/website/Header";
import Footer from "../page/(website)/components/website/Footer";
import { Outlet } from "react-router-dom";

const LayoutWebsite = () => {
  return (
    <div className="font-poppins min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LayoutWebsite;