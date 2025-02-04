import React, { useState } from "react";
import useUser from "../hooks/useUser";
import { Link } from "react-router-dom";
import { Logo } from "../assets";
import { AnimatePresence } from "framer-motion";
import { PuffLoader } from "react-spinners";
import { motion } from "framer-motion";

import { HiLogout } from "react-icons/hi";
import { FadeInOutWIthOpacity, slideUpDownMenu } from "../animations";
import { useQueryClient } from "react-query";
import { auth } from "../config/firebase.config";
import { adminIds } from "../utils/helper";
import useFilters from "../hooks/useFilters";
const Header = () => {
  const [isMenu, setIsMenu] = useState(false);
  const { data, isLoading, isError } = useUser();

  const queryClient = useQueryClient();

  const { data: filterData } = useFilters();

  const signoutUser = async () => {
    await auth.signOut().then(() => {
      queryClient.setQueryData("user", null);
    });
  };

  const handleSearchTerm = (e) => {
    queryClient.setQueryData("globalFilter", {
      ...queryClient.getQueryData("globalFilter"),
      searchTerm: e.target.value,
    });
  };
  const clearFilter = (e) => {
    queryClient.setQueryData("globalFilter", {
      ...queryClient.getQueryData("globalFilter"),
      searchTerm: "",
    });
  };

  return (
    <header className="w-full flex items-center justify-between px-4 py-3 lg:px-8 border-b border-gray-300 bg-bgPrimary z-50 gap-12 sticky top-0">
      {/*logo*/}
      <Link to={"/"}>
        <img src={Logo} className="w-12 h-auto object-contain" alt="" />
      </Link>
      {/*Input*/}
      <div className="flex-1 border border-gray-300 px-4 py-1 rounded-md flex items-center justify-between bg-gray-200">
        <input
          value={filterData?.searchTerm ? filterData?.searchTerm : ""}
          onChange={handleSearchTerm}
          type="text"
          placeholder="Search here..."
          className="flex-1 h-10 bg-transparent text-base font-semibold outline-none border-none"
        />
        <AnimatePresence>
          {filterData?.searchTerm.length > 0 && (
            <motion.div
              onClick={clearFilter}
              {...FadeInOutWIthOpacity}
              className="w-8 h-8 flex items-center justify-center bg-gray-300 rounded-md cursor-pointer active:scale-95 duration-150"
            >
              <p className="text-2xl text-black">x</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/*Profile Section*/}
      <AnimatePresence>
        {isLoading ? (
          <PuffLoader color="#498FCD" size={40} />
        ) : (
          <React.Fragment>
            {data ? (
              <motion.div
                {...FadeInOutWIthOpacity}
                className="relative "
                onClick={() => setIsMenu(!isMenu)}
              >
                {data?.photoURL ? (
                  <div className="w-12 h-12 rounded-md relative flex items-center justify-center cursor-pointer">
                    <img
                      src={data?.photoURL}
                      className="w-full h-full object-cover rounded-md "
                      referrerPolicy="no-referrer"
                      alt=""
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-md relative flex items-center justify-center bg-blue-700 shadow-md">
                    <p className="text-lg text-white ">{data?.email[0]}</p>
                  </div>
                )}
                {/* dropdown menu*/}
                <AnimatePresence>
                  {isMenu && (
                    <motion.div
                      {...slideUpDownMenu}
                      className="absolute px-4 py-3 rounded-md
                 bg-white right-0 top-14 flex flex-col items-center
                  justify-start gap-3 w-64 pt-12"
                      onMouseLeave={() => setIsMenu(false)}
                    >
                      {data?.photoURL ? (
                        <div className="w-20 h-20 rounded-full relative flex items-center flex-col justify-center cursor-pointer">
                          <img
                            src={data?.photoURL}
                            className="w-full h-full object-cover rounded-full "
                            referrerPolicy="no-referrer"
                            alt=""
                          />
                        </div>
                      ) : (
                        <div
                          className="w-20 h-20 rounded-full relative flex
                     items-center justify-center bg-blue-700 shadow-full"
                        >
                          <p className="text-3xl text-white ">
                            {data?.email[0]}
                          </p>
                        </div>
                      )}
                      {data?.displayName && (
                        <p className="text-lg text-txtDark ">
                          {data?.displayName}
                        </p>
                      )}
                      <div className="w-full flex-col items-start flex gap-8 pt-6">
                        <Link
                          className="text-txtLight hover:text-txtDark text-base whitespace-nowrap "
                          to={`/profile/${data?.uid}`}
                        >
                          My account
                        </Link>
                        {adminIds.includes(data?.uid) && (
                          <Link
                            className="text-txtLight hover:text-txtDark text-base whitespace-nowrap "
                            to={"/template/create"}
                          >
                            Add New Template
                          </Link>
                        )}
                        <div
                          className="w-full px-2 py-2 border-t border-gray-300 flex items-center justify-between group cursor-pointer "
                          onClick={signoutUser}
                        >
                          <p className="group-hover:text-txtDark text-txtLight">
                            Sign out
                          </p>
                          <HiLogout className="group-hover:text-txtDark text-txtLight"></HiLogout>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <Link to={"/auth"}>
                <motion.button
                  {...FadeInOutWIthOpacity}
                  className="px-4
                 py-2 rounded-md border bg-gray-200 border-gray-300 hover:shadow-md active:scale-95 duration-150  "
                  type="button"
                >
                  Login
                </motion.button>
              </Link>
            )}
          </React.Fragment>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
