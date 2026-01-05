"use client"; //clent component me convert kernge kyuki
//clent component matlab ye server se ni aaega ,user ke browser se aaega

import React from "react";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";
import { usePathname, useRouter } from "next/navigation";
const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;
  const handleSignin = () => {
    // setTimeout(() => {
    //   router.replace("/sign-in");
    // }, 2000);
    router.replace("/sign-in");
  };
  return (
    <nav className="p-4 md:p-6 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a href="#" className="text-xl font-bold mb-4 md:mb-0">
          Mystery message
        </a>
        {session ? (
          <>
            <span className=" font-bold   text-xl flex flex-row   items-center gap-3">
              {" "}
              Welcome
              <span className="text-xl font-semibold md:text-xl  ">
                {user?.username || user?.email}
              </span>
            </span>
            <Button className=" my-4 md:w-auto" onClick={() => signOut()}>
              Logout
            </Button>
          </>
        ) : (
          <>
            {pathname !== "/sign-in" && (
              <Button onClick={handleSignin}>Signin</Button>
            )}
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
