"use client";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
//ye file annonmys data show krne ke liye hota hai
//[username] kerne se dynamic data load kera sakte hai
const page = () => {
  const { username } = useParams<{ username: string }>();
  const [message, setMessage] = useState("");
  const [isRotating, setIsRotating] = useState(false);

  const messages = [
    "The door was locked from the inside, yet the key was gone.",
    "Every clock in the house stopped at exactly 3:17 AM.",
    "A whisper called my name from an empty room.",
    "The letter arrived before it was ever written.",
    "Footprints appeared in the snow—and then simply vanished.",
  ];
  type MessageMenuProps = {
    msg: string;
    onClick: () => void;
  };

  const MessageMenu = ({ msg, onClick }: MessageMenuProps) => {
    return (
      <div
        className="mb-2 p-4 bg-gray-100 rounded-lg w-11/12 cursor-pointer hover:bg-gray-200"
        onClick={onClick}
      >
        <p className="text-gray-800 text-base md:text-lg">{msg}</p>
      </div>
    );
  };
  return (
    <>
      <div
        className="bg-amber-50 flex flex-col justify-center  items-center"
        // style={{
        //   // backgroundColor: "red",
        //   minHeight: "12vh",
        //   display: "flex",
        //   flexDirection: "column",
        //   justifyContent: "center",
        //   alignItems: "center",
        // }}
      >
        <p className=" mt-10 text-pretty md:text-balance text-2xl md:text-3xl font-semibold text-center">
          send annonmys message to @ <span>{username}</span>{" "}
        </p>
        {/* //item center horizonalt align kerne ke liye  */}
        <div
          className="  w-sm md:w-7xl mt-10 flex justify-center gap-10 items-center text-center flex-col"
          // style={{ width: "50%" }}
        >
          <div className="w-sm md:w-full flex flex-col md:flex-row gap-5 justify-center items-center">
            <Input
              type="text"
              className="h-14 placeholder:text-gray-500  !text-2xl rounded-l-lg placeholder:text-xl placeholder:font-semibold"
              placeholder="Write your anonymous message here"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            {message && (
              <i
                className="fa-regular fa-circle-xmark text-4xl cursor-pointer text-black hover:text-gray-700 mr-2"
                onClick={() => setMessage("")}
              ></i>
            )}
          </div>
          {message !== "" ? (
            <Button className="p-5 w-fit">
              Send it <i className="fa-solid fa-paper-plane"></i>
            </Button>
          ) : (
            <Button disabled className="p-5 w-fit">
              Send it <i className="fa-solid fa-ban"></i>
            </Button>
          )}
        </div>
      </div>
      <div className=" bg-amber-50 flex flex-col justify-center items-center md:items-start mt-10">
        <Button
          onClick={() => setIsRotating(true)}
          className=" font-medium h-10 md:h-15 mt-10 mb-5  text-sm text-center ml:5 md:ml-10"
        >
          Suggest Messages{" "}
          <i
            className={`fa-regular fa-star ${isRotating ? "fa-spin" : ""}`}
          ></i>
        </Button>
        <p className="text-black md:self-center text-xl md:text-2xl font-medium">
          Click any messsage below to select it{" "}
        </p>
      </div>

      <div className=" h-fit mx-20 flex border-2 rounded-lg border-gray-300 flex-col justify-center items-center mt-10">
        <h4 className="md:mt-1 mt-5 md:ml-20 p-4 mb-auto md:self-start self-center  text-black text-xl md:text-2xl font-semibold">
          Messages
        </h4>
        {messages.map((msg, index) => (
          <MessageMenu key={index} msg={msg} onClick={() => setMessage(msg)} />
        ))}
        {/* <h4 className="mt-1 ">Messages</h4> */}
      </div>
      <div className="gap-5 h-fit mx-20 flex border-2 rounded-lg border-gray-300 flex-col justify-center items-center mt-10">
        <p className="text-black md:self-center text-xl md:text-2xl font-medium">
          Get your Message Board
        </p>
        <Button className="p-5 w-fit">
          <a href="/sign-up"> Create your account</a>
        </Button>
      </div>
    </>
  );
};

export default page;
