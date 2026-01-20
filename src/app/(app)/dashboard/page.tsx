"use client";
import { Message } from "@/app/model/User.model";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
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
import { Label } from "@/components/ui/label";
const Page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [annoyms_messages, setannoyms_messages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const handleDeleteMessage = (messageId: string) => {
    setMessages(
      messages.filter((message) => message._id.toString() !== messageId),
    );
  };
  const [profileUrl, setProfileUrl] = useState<string>("");
  const [baseUrl, setBaseUrl] = useState("");

  const { data: session, status } = useSession(); //status may be 'unauthenticated
  const form = useForm<z.infer<typeof acceptMessageSchema>>({
    resolver: zodResolver(acceptMessageSchema),
  });
  // const annoyms_messages = [
  const Allmessages = [
    "What’s something you wish people understood about you?",
    "If you could change one decision from your past, what would it be?",
    "What motivates you when you feel stuck?",
    "Is there a dream you haven’t told anyone about yet?",
    "What’s one habit you’re trying to improve right now?",
    "Who has influenced your life the most without knowing it?",
    "What’s a fear you’re slowly learning to overcome?",
    "What makes you genuinely happy, even on bad days?",
    "If you could give your future self one piece of advice, what would it be?",
    "What’s something you’re proud of but rarely talk about?",
  ];
  useEffect(() => {
    setannoyms_messages(Allmessages);
    // setannoyms_messages(messages);
  }, []);

  const {
    //react-hook-form se ye methods milte hai jaha uper zod resolver laga rakha hai
    //ye sare method budefault hook-form se milte hai jake getstated me me dekho reat-hook-forms ke
    register, //humne de-structure ker liye
    handleSubmit,
    watch,
    setValue,
    control, // ✅ ADD THIS
    formState: { errors },
  } = form;

  const acceptMessages = watch("acceptMessages");
  const deleteAnnonymsMessage = async (msg: Message) => {
    // const index = annoyms_messages.indexOf(msg);
    // console.log("index", index);
    // if (index > -1) {
    //   annoyms_messages.splice(index, 1);
    //   toast.success("Message deleted");
    // }
    // annoyms_messages.filter((message) => message !== msg);
    // console.log("annoyms_messages after delete", annoyms_messages);
    setIsSwitchLoading(true);
    console.log("msg to delete", msg);
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message?messageId=${msg._id}`,
      );
      toast.success(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        "Error " + axiosError.response?.data.message ||
          "failed to delete message",
      );
    } finally {
      setIsSwitchLoading(false);
    }
    setMessages((prev) => prev.filter((message) => message._id !== msg._id));
    console.log("annoyms_messages after delete", annoyms_messages);
  };
  const fetchAccpeteEssages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-message");
      response.data.isAcceptinhMessages;
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        "Error " + axiosError.response?.data.message ||
          "failed to fetch messages",
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
            "failed to fetch messages",
        );
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setMessages],
  );
  useEffect(() => {
    if (!session || !session.user) return;
    <div>Please login</div>;
    fetchMessages();
    fetchAccpeteEssages();
    //handle switch change
  }, [session, setValue, fetchAccpeteEssages, fetchMessages]);
  const handleSwitchChange = async (checked: boolean) => {
    console.log("checked = ", checked);
    try {
      const res = await axios.post<ApiResponse>("/api/accept-message", {
        acceptMessage: checked,
      });
      setValue("acceptMessages", !acceptMessages);
      toast.success(res.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        "Error " + axiosError.response?.data.message ||
          "failed to fetch messages",
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
              placeholder="you profile url appears here"
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
          {/* Controller is a translator between React Hook Form and custom components 
          
          🧠 Why control is needed (simple)
              register() = automatic wiring (only native inputs)
              Controller = manual wiring
              control = brain of React Hook Form
             Without control, RHF cannot:
              track the field
              update values
              re-render correctly
          
          */}

          <Controller
            name="acceptMessages" //“React Hook Form, store this field’s value under the key acceptMessages”
            // and  const acceptMessages = watch("acceptMessages"); watch the listen the changes of this field and below <lable {acceptmessages}/> value update hote rahega
            control={control}
            render={({ field }) => (
              <Switch
                checked={field.value}
                // onCheckedChange={field.onChange}
                onCheckedChange={async (checked) => {
                  // 1️⃣ Update React Hook Form state
                  field.onChange(checked);

                  // 2️⃣ Call your API
                  await handleSwitchChange(checked);
                }}
              />
            )}
          />
          {/*4️⃣ So how does the label text still update?
              Because of this line 👇
              const acceptMessages = watch("acceptMessages");
              watch() listens to React Hook Form state, not the label.
            */}
          <Label
            htmlFor="aceept_the_messages" //“When someone clicks this label, focus the element whose id isaccept_the_messages”
            className="ml-2 text-2xl font-bold"
          >
            Accept Messages:{acceptMessages ? " on" : " off"}
          </Label>
          {/* <span className="ml-2 text-2xl font-bold">
            Accept Messages:{acceptMessages ? " on" : " off"}
          </span> */}
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
        {/* <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
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
        </div> */}
      </div>
      <div className=" h-fit text-2xl mx-auto max-w-7xl px-10   bg-white">
        <h2 className="text-2xl font-bold mb-4">Suggested Messages</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {/* {annoyms_messages.map((msg, index) => ( */}
          {messages.length > 0 ? (
            messages.map((msg, index) => (
              <>
                <div
                  key={index}
                  className=" p-5 border-2 h-full   bg-gray-50 rounded-lg flex flex-col text-wrap gap-5 border-gray-300"
                >
                  <i
                    className="fa-regular  fa-circle-xmark self-end"
                    onClick={() => deleteAnnonymsMessage(msg)}
                  ></i>
                  <h2 className="text-2xl font-bold text-black">
                    {msg.content}
                  </h2>
                  <p className="text-xl font-semibold text-black">
                    {msg.createdAt?.toString()}
                  </p>
                </div>
              </>
            ))
          ) : (
            <p>No Messages to display</p>
          )}
        </div>
      </div>
    </>
  );
};
export default Page;
