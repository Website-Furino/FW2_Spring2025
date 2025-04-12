  const Support = () => {
    return (
      <section className="bg-[#FFF7ED] mt-16">
        <div className="max-w-[1280px] h-auto flex flex-col md:flex-row justify-between items-center mx-auto pt-16 pb-[60px] px-4 gap-8 md:gap-4">
          <div className="flex items-center">
            <div>
              <img src="./img/Group.svg" alt="High Quality Icon" className="w-12 h-12 md:w-auto md:h-auto" />
            </div>
            <div className="ml-4">
              <h3 className="mb-1 text-lg md:text-xl font-semibold text-[#171717]">
                High Quality
              </h3>
              <p className="text-sm md:text-base text-[#898989]">
                Crafted from top materials
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <div>
              <img src="./img/Group2.png" alt="24 / 7 Support Icon" className="w-12 h-12 md:w-auto md:h-auto" />
            </div>
            <div className="ml-4">
              <h3 className="mb-1 text-lg md:text-xl font-semibold text-[#171717]">
                24 / 7 Support
              </h3>
              <p className="text-sm md:text-base text-[#898989]">Dedicated support</p>
            </div>
          </div>
          <div className="flex items-center">
            <div>
              <img src="./img/shipping.svg" alt="Warranty Protection Icon" className="w-12 h-12 md:w-auto md:h-auto" />
            </div>
            <div className="ml-4">
              <h3 className="mb-1 text-lg md:text-xl font-semibold text-[#171717]">
                Warranty Protection
              </h3>
              <p className="text-sm md:text-base text-[#898989]">Over 2 years</p>
            </div>
          </div>
          <div className="flex items-center">
            <div>
              <img src="./img/customer-support.svg" alt="Free Shipping Icon" className="w-12 h-12 md:w-auto md:h-auto" />
            </div>
            <div className="ml-4">
              <h3 className="mb-1 text-lg md:text-xl font-semibold text-[#171717]">
                Free Shipping
              </h3>
              <p className="text-sm md:text-base text-[#898989]">Order over 150 $</p>
            </div>
          </div>
        </div>
      </section>
    );
  };

  export default Support;
