import Banner from "../components/website/Banner";
import NewsHome from "./components/News";
import Support from "../components/website/Support";
import NoiBat from "./components/NoiBat";
import TopSellerPage from "./components/TopSeller";

const HomePage = () => {
  return (
    <div>
      <Banner />
      <main className="max-w-[1280px] w-full mx-auto mt-11 px-4 md:px-6 lg:px-8">
        <TopSellerPage />
        <NewsHome />
        <NoiBat />
      </main>
      <Support />
    </div>
  );
};

export default HomePage;