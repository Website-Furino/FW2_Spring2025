import React from "react";
import Banner from "../components/website/Banner";
import NewsHome from "./components/News";
import Support from "../components/website/Support";
import NoiBat from "./components/NoiBat";
import TopSellerPage from "./components/TopSeller";

const HomePage = () => {
  return (
    <div>
      <Banner />
      <main className="w-[1280px] mx-auto mt-11">
        <TopSellerPage />
        <NewsHome />
        <NoiBat />
      </main>
      <Support />
    </div>
  );
};

export default HomePage;
