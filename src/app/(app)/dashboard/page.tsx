"use client";
import { Message } from "@/app/model/User.model";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Loader2, RefreshCcw } from "lucide-react";
import MessageCard from "@/components/MessageCard";
const page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const handleDeleteMessage = (messageId: string) => {
    setMessages(
      messages.filter((message) => message._id.toString() !== messageId)
    );
  };
  const [profileUrl, setProfileUrl] = useState<string>("");
  const [baseUrl, setBaseUrl] = useState("");

  const { data: session, status } = useSession(); //status may be 'unauthenticated
  const form = useForm<z.infer<typeof acceptMessageSchema>>({
    resolver: zodResolver(acceptMessageSchema),
  });

  const {
    //ye sare method budefault hook-form se milte hai jake getstated me me dekho reat-hook-forms ke
    register, //humne de-structure ker liye
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = form;
  const acceptMessages = watch("acceptMessages");

  const fetchAccpeteEssages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-message");
      response.data.isAcceptinhMessages;
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        "Error " + axiosError.response?.data.message ||
          "failed to fetch messages"
      );
    } finally {
      setIsSwitchLoading(false);
    }
  }, []);
  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setLoading(true);
      setIsSwitchLoading(false);
      try {
        const res = await axios.get<ApiResponse>("/api/get-messages");
        setMessages(res.data?.messages || []);
        if (refresh) {
          toast.success("Refreshed messages");
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.error(
          "Error " + axiosError.response?.data.message ||
            "failed to fetch messages"
        );
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setMessages]
  );
  useEffect(() => {
    if (!session || !session.user) return;
    <div>Please login</div>;
    fetchMessages();
    fetchAccpeteEssages();
    //handle switch change
  }, [session, setValue, fetchAccpeteEssages, fetchMessages]);
  const handleSwitchChange = async () => {
    try {
      const res = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessage: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast.success(res.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        "Error " + axiosError.response?.data.message ||
          "failed to fetch messages"
      );
    }
  };

  //next-auth.d file me dekho session wla waha username hai
  const username = session?.user.username;
  //TODO do more reseacrh
  useEffect(() => {
    setBaseUrl(`${window.location.protocol}//${window.location.host}`);
  }, []);
  useEffect(() => {
    //if you not use effect then it will only run first time
    if (!session?.user?.username) return;

    setBaseUrl(`${window.location.protocol}//${window.location.host}`);
    setProfileUrl(`${baseUrl}/u/${session.user.username}`);
    console.log("baseURL = ", baseUrl);
  }, [session]);

  const coptyToClipboard = () => {
    console.log("hello");
    if (!profileUrl) return;

    navigator.clipboard.writeText(profileUrl);
    toast.success("URL copied to clipboard");
  };
  if (status === "loading") return <div>Loading...</div>;
  if (status === "unauthenticated") return <div>Please login</div>;

  return (
    <>
      {/* {status === "unauthenticated" && <div>Please login</div>}
      {status === "loading" && <div>loading</div>} */}

      <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
        <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Copy Your unique Link</h2>
          <div className="flex items-center">
            <input
              type="text"
              value={profileUrl} //user ko dihta hai pehle se ki vo kya copy ker rah hai to vo theek re hta hai
              disabled
              className="input input-bordered w-full p-2 mr-2"
            />
            <Button
              onClick={() => {
                coptyToClipboard();
                console.log("click");
              }}
            >
              Copy
            </Button>
          </div>
        </div>
        ;
        <div className="mb-4">
          <Switch
            {...register("acceptMessages")}
            checked={acceptMessages}
            onCheckedChange={() => handleSwitchChange}
            disabled={isSwitchLoading}
          />
          <span className="ml-2">
            Accept Messages:{acceptMessages ? "on" : "off"}
          </span>
        </div>
        ;
        <Separator />
        <Button
          className="mt-4"
          onClick={(e) => {
            e.preventDefault();
            fetchMessages(true);
          }}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
        </Button>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <MessageCard // ye bana hai components/ folder me
                key={message._id.toString()}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))
          ) : (
            <p>No messages to display</p>
          )}
        </div>
      </div>
    </>
  );
};
export default page;
