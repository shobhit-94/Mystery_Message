import React from "react";
("use client");
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { CircleCheckIcon, OctagonXIcon, X } from "lucide-react";
import { Message } from "@/app/model/User.model";
import { toast } from "sonner";
import { ApiResponse } from "@/types/ApiResponse";
import axios from "axios";
type MessageCardProps = {
  message: Message; //message me Message Model aaaega pura jisme bahoot si chize hongi
  onMessageDelete: (messageId: string) => void; //onMessageDelete ek method aaega hai or  isme messageId aaegi jo ki string type ki hogi or OnMessageDelete khuch return nhi kerga
};
const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  //ab maine bata diya in dono ki tumhe ki type ka data recive hoga ab ye error ni aaegi 'Binding element 'onMessageDelete' implicitly has an 'any' type.ts(7031)(parameter) onMessageDelete: any'

  const handleDeleteConfirm = async () => {
    const res = await axios.delete<ApiResponse>(
      `/api/delete-message/messageId=${message._id}`
    );
    if (res.status === 200)
      toast.success("Successfully Delete the message", {
        icon: <CircleCheckIcon className="size-4" />,
      });
    else {
      toast.error("error in  Deleting the message", {
        icon: <OctagonXIcon className="size-4" />,
      });
    }
    onMessageDelete(message._id.toString()); //humne _id ko message model me string hi banaya hai per isko patani ku patani chal raha hai ye chiz koi ni  toString se error chalagaya vaise hume to pehle se hi pata hai ki _id string hi aaegi per chalo koi ni
  };
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>

          {/*
           */}

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <X className="w-5 h-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDeleteConfirm}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <CardDescription>Card Description</CardDescription>
          <CardAction>Card Action</CardAction>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MessageCard;
