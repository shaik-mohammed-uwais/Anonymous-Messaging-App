"use client";

import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDebounce } from "usehooks-ts";
import * as z from "zod";

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
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";

export default function SignUpForm() {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debouncedUsername = useDebounce(username, 300);

  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (debouncedUsername) {
        setIsCheckingUsername(true);
        setUsernameMessage(""); // Reset message
        try {
          const response = await axios.get<ApiResponse>(
            `/api/check-username-unique?username=${debouncedUsername}`
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking username"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [debouncedUsername]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);

      toast({
        title: "Success",
        description: response.data.message,
      });

      router.replace(`/verify/${username}`);

      setIsSubmitting(false);
    } catch (error) {
      console.error("Error during sign-up:", error);

      const axiosError = error as AxiosError<ApiResponse>;

      // Default error message
      let errorMessage = axiosError.response?.data.message;
      ("There was a problem with your sign-up. Please try again.");

      toast({
        title: "Sign Up Failed",
        description: errorMessage,
        variant: "destructive",
      });

      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#E6F4EA]">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-[#144419] mb-2">
            Join True Feedback
          </h1>
          <p className="text-sm text-[#6B7B6B]">
            Sign up to start your anonymous adventure
          </p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Username Field */}
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#144419] text-sm">
                    Username
                  </FormLabel>
                  <Input
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setUsername(e.target.value);
                    }}
                    className="h-12 rounded-xl border border-[#C8D8C8] focus:border-[#A8E664] focus:ring-2 focus:ring-[#A8E664] px-4 text-[#144419] placeholder:text-[#6B7B6B]"
                    placeholder="Choose a username"
                  />
                  {isCheckingUsername && (
                    <Loader2 className="animate-spin text-[#144419] mt-1 h-4 w-4" />
                  )}
                  {!isCheckingUsername && usernameMessage && (
                    <p
                      className={`text-xs mt-1 ${
                        usernameMessage === "Username is unique"
                          ? "text-[#144419]"
                          : "text-red-500"
                      }`}
                    >
                      {usernameMessage}
                    </p>
                  )}
                  <FormMessage className="text-red-500 text-xs mt-1" />
                </FormItem>
              )}
            />

            {/* Email Field */}
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#144419] text-sm">
                    Email
                  </FormLabel>
                  <Input
                    {...field}
                    className="h-12 rounded-xl border border-[#C8D8C8] focus:border-[#A8E664] focus:ring-2 focus:ring-[#A8E664] px-4 text-[#144419] placeholder:text-[#6B7B6B]"
                    placeholder="Enter your email"
                  />
                  <p className="text-[#6B7B6B] text-xs mt-1">
                    We will send you a verification code
                  </p>
                  <FormMessage className="text-red-500 text-xs mt-1" />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#144419] text-sm">
                    Password
                  </FormLabel>
                  <Input
                    type="password"
                    {...field}
                    className="h-12 rounded-xl border border-[#C8D8C8] focus:border-[#A8E664] focus:ring-2 focus:ring-[#A8E664] px-4 text-[#144419] placeholder:text-[#6B7B6B]"
                    placeholder="Create a password"
                  />
                  <FormMessage className="text-red-500 text-xs mt-1" />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 rounded-xl bg-[#144419] text-white font-medium hover:bg-[#A8E664] hover:text-[#144419] transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>

        {/* Footer */}
        <div className="text-center mt-4">
          <p className="text-sm text-[#144419]">
            Already a member?{" "}
            <Link
              href="/sign-in"
              className="text-[#FF8C42] font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
