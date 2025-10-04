"use client";

import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CardHeader, CardContent, Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import * as z from "zod";
import { ApiResponse } from "@/types/ApiResponse";
import Link from "next/link";
import { useParams } from "next/navigation";
import { messageSchema } from "@/schemas/messageSchema";

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch("content");

  const handleMessageClick = (message: string) => {
    form.setValue("content", message);
  };

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        ...data,
        username,
      });

      toast({
        title: response.data.message,
        variant: "default",
      });

      form.reset({ content: "" });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ?? "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedMessages = async () => {
    setIsSuggestLoading(true);
    try {
      const res = await fetch("/api/suggest-messages", { method: "POST" });
      const data = await res.json();
      console.log("API Response:", data);

      const parsed = data.suggestion
        .split("||")
        .map((q: string) => q.trim())
        .filter(Boolean);

      setSuggestions(parsed);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setIsSuggestLoading(false);
    }
  };

  return (
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl ">
      <h1 className="text-4xl font-bold mb-6 text-center text-[#144419]">
        Public Profile Link
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#144419]">
                  Send Anonymous Message to @{username}
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here"
                    className="resize-none border border-[#C8D8C8] focus:border-[#A8E664] focus:ring-2 focus:ring-[#A8E664] text-[#144419] placeholder:text-[#6B7B6B]"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-xs mt-1" />
              </FormItem>
            )}
          />

          <div className="flex justify-center">
            {isLoading ? (
              <Button
                disabled
                className="bg-[#144419] text-white hover:bg-[#A8E664] hover:text-[#144419]"
              >
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={!messageContent}
                className="bg-[#144419] text-white hover:bg-[#A8E664] hover:text-[#144419]"
              >
                Send It
              </Button>
            )}
          </div>
        </form>
      </Form>

      <div className="space-y-4 my-8">
        <div className="space-y-2">
          <Button
            onClick={fetchSuggestedMessages}
            className="my-4 bg-[#144419] text-white hover:bg-[#A8E664] hover:text-[#144419]"
            disabled={isSuggestLoading}
          >
            {isSuggestLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Suggest Messages"
            )}
          </Button>
          <p className="text-[#6B7B6B]">
            Click on any message below to select it.
          </p>
        </div>

        <Card className="border border-[#C8D8C8]">
          <CardHeader>
            <h3 className="text-xl font-semibold text-[#144419]">Messages</h3>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            {suggestions.length === 0 ? (
              <p className="text-[#6B7B6B]">
                No suggestions yet. Click Suggest Messages.
              </p>
            ) : (
              suggestions.map((message, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="mb-2 border border-[#C8D8C8] text-[#144419] hover:bg-[#A8E664] hover:text-[#144419]"
                  onClick={() => handleMessageClick(message)}
                >
                  {message}
                </Button>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Separator className="my-6" />
      <div className="text-center">
        <div className="mb-4 text-[#144419]">Get Your Message Board</div>
        <Link href={"/sign-up"}>
          <Button className="bg-[#E65C00] text-white hover:bg-[#FF8C42] transition-colors">
            Create Your Account
          </Button>
        </Link>
      </div>
    </div>
  );
}
