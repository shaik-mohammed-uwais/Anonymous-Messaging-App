"use client";

import React, { useMemo } from "react";
import axios, { AxiosError } from "axios";
import dayjs from "dayjs";
import { X } from "lucide-react";
import { Message } from "@/model/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useToast } from "@/components/ui/use-toast";
import { ApiResponse } from "@/types/ApiResponse";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

// Light pastel colors inspired by your screenshot
const CARD_COLORS: readonly string[] = [
  "#FEC871",
  "#FD9B71",
  "#E4ED8F",
  "#B491FA",
  "#FF9CC3",
  "#00D4FF",
];

function getRandomCardColor(): string {
  const i = Math.floor(Math.random() * CARD_COLORS.length);
  return CARD_COLORS[i];
}

export function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  const { toast } = useToast();

  // pick one pastel color per component instance
  const bgColor = useMemo(() => getRandomCardColor(), []);

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      );
      toast({ title: response.data.message });
      onMessageDelete(message._id);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ?? "Failed to delete message",
        variant: "destructive",
      });
    }
  };

  return (
    <Card
      className="border border-[#C8D8C8] rounded-2xl shadow-sm"
      style={{ backgroundColor: bgColor }}
    >
      <CardHeader className="space-y-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-[#144419] font-semibold text-lg md:text-xl">
            {message.content}
          </CardTitle>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="bg-[#144419] text-white hover:bg-[#A8E664] hover:text-[#144419] px-4 transition-colors"
              >
                <X className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="rounded-2xl bg-white border border-[#C8D8C8]">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-[#144419] font-semibold">
                  Are you absolutely sure?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-[#6B7B6B]">
                  This action cannot be undone. This will permanently delete
                  this message.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter className="flex space-x-2">
                <AlertDialogCancel className="text-[#144419] border border-[#C8D8C8] hover:bg-[#E6F4EA] px-4 py-2 transition-colors">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteConfirm}
                  className="bg-[#FF8C42] hover:bg-[#E65C00] text-white px-4 py-2 transition-colors"
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="text-sm text-[#6B7B6B]">
          {dayjs(message.createdAt).format("MMM D, YYYY h:mm A")}
        </div>
      </CardHeader>

      <CardContent className="text-[#144419]"></CardContent>
    </Card>
  );
}
