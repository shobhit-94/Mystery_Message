"use client";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
//ye file annonmys data show krne ke liye hota hai
//[username] kerne se dynamic data load kera sakte hai
const Page = () => {
  const { username } = useParams<{ username: string }>();
  const [message, setMessage] = useState("");
  const [isRotating, setIsRotating] = useState(false);
  const [AIResponse, setAIResponse] = useState<string[]>([]);

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
  const sendMessage = async () => {
    console.log("Sending message:", message);

    if (message.trim() === "") return;
    try {
      const response = await axios.post<ApiResponse>(`/api/send-message`, {
        username: username,
        content: message,
      });
      toast.success(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        "Error " + axiosError.response?.data.message || "failed to send message"
      );
    }
  };
  const formatAIResponse = (text: string): string[] => {
    // let cleaned: string | string[] = text;

    // Remove markdown
    let cleaned = text
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/###|##|#/g, "")
      .replace(/---/g, "")
      .replace(/_/g, "")
      .replace(/`/g, "")
      .replace(/:\s*$/gm, "");



    // Newlines
    cleaned = cleaned.replace(/\\n\\n/g, "\n");
    cleaned = cleaned.replace(/\\n/g, "\n");

    //3. Split into lines|Convert to array
    let lines = cleaned
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    // Bullet formatting|Extract ONLY meaningful messages
    lines = lines
      .filter((line) => /^\d+\./.test(line) || line.startsWith("•"))
      .map((line) => line.replace(/^\d+\.\s*/, "").replace(/^•\s*/, ""));

    return lines;
  };

  const suggestMessages = async () => {
    try {
      const res = await axios.post<ApiResponse>("/api/suggest-messages", {
        prompt: "Give 5 annoymns message to send our friend during chitchat",
      });
      const formatted = formatAIResponse(res.data.text);

      console.log(formatted, "formatted");
      setAIResponse(formatted); //text ko define kro string se  ApiResponse me nhi to error aegi
      toast.success(res.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        "Error " + axiosError.response?.data.message ||
          "failed to fetch messages"
      );
    } finally {
      setIsRotating(false);
    }
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
              form="send-message-form"
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
            <form
              id="send-message-form"
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
                console.log("hello enter");
              }}
            >
              <Button
                form="send-message-form"
                type="submit"
                className="p-5 w-fit"
                onClick={() => {
                  sendMessage();
                  console.log("hello click");
                }}
              >
                Send it <i className="fa-solid fa-paper-plane"></i>
              </Button>
            </form>
          ) : (
            <Button disabled className="p-5 w-fit">
              Send it <i className="fa-solid fa-ban"></i>
            </Button>
          )}
        </div>
      </div>
      <div className=" bg-amber-50 flex flex-col justify-center items-center md:items-start mt-10">
        <Button
          onClick={() => {
            setIsRotating(true);
            suggestMessages();
            console.log("clicked");
          }}
          className=" font-medium h-10 md:h-15 mt-10 mb-5  text-sm text-center ml:5 md:ml-10"
        >
          Suggest Messages{" "}
          <i
            className={`fa-solid fa-star ml-2 ${isRotating ? "fa-spin" : ""}`}
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
        {AIResponse.length === 0
          ? messages.map((msg, index) => (
              <MessageMenu
                key={index}
                msg={msg}
                onClick={() => setMessage(msg)}
              />
            ))
          : AIResponse.map((msg, index) => (
              <MessageMenu
                key={index}
                msg={msg}
                onClick={() => setMessage(msg)}
              />
            ))}

        {/* <h4 className="mt-1 ">Messages</h4> */}
      </div>
      <div className="gap-5 h-fit mx-20 flex border-2 rounded-lg border-gray-300 flex-col justify-center items-center mt-10">
        <p className="text-black md:self-center text-xl md:text-2xl font-medium">
          Get your Message Board {AIResponse}
        </p>
        <Button className="p-5 w-fit">
          <a href="/sign-up"> Create your account</a>
        </Button>
      </div>
    </>
  );
};

export default Page;
