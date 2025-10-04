"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { verifySchema } from "@/schemas/verifySchema";

export default function VerifyAccount() {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post<ApiResponse>(`/api/verify-code`, {
        username: params.username,
        code: data.code,
      });

      toast({
        title: "Success",
        description: response.data.message,
      });

      router.replace("/sign-in");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Verification Failed",
        description:
          axiosError.response?.data.message ??
          "An error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#E6F4EA]">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-[#144419] mb-2">
            Verify Your Account
          </h1>
          <p className="text-sm text-[#6B7B6B]">
            Enter the 6-digit verification code sent to your email
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#144419] text-sm">
                    Verification Code
                  </FormLabel>
                  <Input
                    {...field}
                    maxLength={6}
                    className="h-12 rounded-xl border border-[#C8D8C8] focus:border-[#A8E664] focus:ring-2 focus:ring-[#A8E664] px-4 text-[#144419] text-center tracking-widest placeholder:text-[#6B7B6B]"
                    placeholder="______"
                  />
                  <FormMessage className="text-red-500 text-xs mt-1" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full h-12 rounded-xl bg-[#144419] text-white font-medium hover:bg-[#A8E664] hover:text-[#144419] transition-colors"
            >
              Verify
            </Button>

            <p className="text-center text-sm text-[#144419]">
              Didn’t receive the code?{" "}
              <button
                type="button"
                className="text-[#FF8C42] font-medium hover:underline"
              >
                Tap to Resend
              </button>
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
}
