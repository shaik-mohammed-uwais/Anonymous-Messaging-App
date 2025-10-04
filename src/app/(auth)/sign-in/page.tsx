"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { signIn } from "next-auth/react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { signInSchema } from "@/schemas/signInSchema";

export default function SignInForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const { toast } = useToast();
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      if (result.error === "CredentialsSignin") {
        toast({
          title: "Login Failed",
          description: "Incorrect username or password",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    }

    if (result?.url) {
      router.replace("/dashboard");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#E6F4EA]">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-[#144419] mb-2">
            Welcome Back to True Feedback
          </h1>
          <p className="text-sm text-[#6B7B6B]">
            Sign in to continue your secret conversations
          </p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#144419] text-sm">
                    Email / Username
                  </FormLabel>
                  <Input
                    {...field}
                    className="h-12 rounded-xl border border-[#C8D8C8] focus:border-[#A8E664] focus:ring-2 focus:ring-[#A8E664] px-4 text-[#144419] placeholder:text-[#6B7B6B]"
                    placeholder="Enter your email or username"
                  />
                  <FormMessage className="text-red-500 text-xs mt-1" />
                </FormItem>
              )}
            />

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
                    placeholder="Enter your password"
                  />
                  <FormMessage className="text-red-500 text-xs mt-1" />
                </FormItem>
              )}
            />

            <Button
              className="w-full h-12 rounded-xl bg-[#144419] text-white font-medium hover:bg-[#A8E664] hover:text-[#144419] transition-colors"
              type="submit"
            >
              Sign In
            </Button>
          </form>
        </Form>

        {/* Footer */}
        <div className="text-center mt-4">
          <p className="text-sm text-[#144419]">
            Not a member yet?{" "}
            <Link
              href="/sign-up"
              className="text-[#FF8C42] font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
