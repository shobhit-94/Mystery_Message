"use client"; //clent component me convert kernge kyuki
//clent component matlab ye server se ni aaega ,user ke browser se aaega

import React from "react";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";
const Navbar = () => {
  const { data: session } = useSession();
  const user = session?.user ;
  return (
    <nav className="p-4 md:p-6 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a href="#" className="text-xl font-bold mb-4 md:mb-0">
          Mystery message
        </a>
        {session ? (
          <>
            <span className="mr-4 decoration-2 text-2xl">
              Welcome , {user?.username || user?.email}
            </span>
            <Button className="w-full md:w-auto" onClick={() => signOut()}>
              Logout
            </Button>
          </>
        ) : (
          <>
            {
              <a href="" className="w-full md:w-auto">
                Login
              </a>
            }
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
