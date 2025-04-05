import React from "react";

const Footer = () => {
  return (
    // <!-- footer -->
    <footer className="w-full bg-[#fff] text-sm font-poppins">
      <div className="w-[1280px] mx-auto grid grid-cols-4 py-10 space-x-30 min-h-[300px]">
        <div className="flex flex-col pr-2">
          <div className="mb-4">
            <h3 className="text-2xl font-bold">Funiro.</h3>
          </div>
          <p className="text-base text-[#9f9f9f]">
            400 University Drive Suite 200 Coral
            <br />
            Gables,
            <br />
            FL 33134 USA
          </p>
        </div>
        <div className="flex flex-col space-y-14 font-medium">
          <p className="mb-2 text-base text-[#9F9F9F]">Links</p>
          <ul className="space-y-11">
            <li className="hover:text-yellow-600 cursor-pointer">Home</li>
            <li className="hover:text-yellow-600 cursor-pointer">Shop</li>
            <li className="hover:text-yellow-600 cursor-pointer">About</li>
            <li className="hover:text-yellow-600 cursor-pointer">Contact</li>
          </ul>
        </div>
        <div className="flex flex-col space-y-14 text-base font-medium">
          <p className="mb-2 text-[#9F9F9F]">Help</p>
          <ul className="space-y-11">
            <li className="hover:text-yellow-600 cursor-pointer">
              Payment Options
            </li>
            <li className="hover:text-yellow-600 cursor-pointer">Returns</li>
            <li className="hover:text-yellow-600 cursor-pointer">
              Privacy Policies
            </li>
          </ul>
        </div>
        <div className="flex flex-col space-y-14 font-medium text-base">
          <p className="mb-2 text-[#9F9F9F]">Newsletter</p>
          <div className="flex space-x-4">
            <input
              type="text"
              className="border-b font-normal border-[#000] outline-none"
              placeholder="Enter Your Mail Eddress "
            />
            <button className="uppercase border-b border-[#000] p-3 hover:bg-yellow-600 hover:opacity-70 hover:text-white hover:border-yellow-400">
              subscrice
            </button>
          </div>
        </div>
      </div>
      <div className="w-[1280px] text-base mx-auto border-t border-[#d9d9d9]]">
        <p className="py-8">2023 furino. All rights reverved</p>
      </div>
    </footer>
  );
};

export default Footer;
