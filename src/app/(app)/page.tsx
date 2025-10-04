"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import messages from "@/messages.json";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const CARD_COLORS: readonly string[] = [
  "#FEC871",
  "#FD9B71",
  "#E4ED8F",
  "#B491FA",
  "#FF9CC3",
  "#00D4FF",
];

export default function Home() {
  return (
    <div className="container mx-auto my-2 p-4 bg-white rounded max-w-4xl">
      {/* Header */}
      <section className="text-center mb-8 md:mb-12">
        <h1 className="text-4xl font-bold text-[#144419]">
          Dive into the World of Anonymous Feedback
        </h1>
        <p className="mt-3 md:mt-4 text-base md:text-lg text-[#6B7B6B]">
          True Feedback - Where your identity remains a secret.
        </p>
      </section>

      {/* Carousel for Messages */}
<Carousel
  plugins={[Autoplay({ delay: 2500 })]}
  className="w-full max-w-2xl mx-auto"
>
  <CarouselContent>
    {messages.map((message, index) => {
      const bgColor = CARD_COLORS[index % CARD_COLORS.length];

      return (
        <CarouselItem key={index} className="p-4 flex justify-center">
          <Card
            className="w-full max-w-md rounded-2xl shadow-md py-5 px-6 flex flex-col gap-3"
            style={{ backgroundColor: bgColor, color: "#FFFFFF" }}
          >
            {/* Message title */}
            <p className="font-semibold text-base md:text-lg text-white text-left">
              Message from {message.title}
            </p>

            {/* Message content with icon */}
            <div className="flex flex-col items-start gap-1">
              <div className="flex items-center gap-3">
                <Mail className="h-6 w-6 text-white" />
                <p className="text-white text-sm md:text-base leading-snug">
                  {message.content}
                </p>
              </div>
              {/* Timestamp just below icon */}
              <p className="text-xs text-white opacity-80 pl-9">
                {message.received}
              </p>
            </div>
          </Card>
        </CarouselItem>
      );
    })}
  </CarouselContent>
</Carousel>


      {/* CTA Section */}
      <div className="text-center mt-10">
        <div className="mb-3 text-[#144419] font-medium">
          Get Your Message Board
        </div>
        <Link href={"/sign-up"}>
          <button className="bg-[#A8E664] text-[#144419] hover:bg-[#144419] hover:text-white transition-colors px-6 py-2 rounded-lg font-medium">
            Create Your Account
          </button>
        </Link>
      </div>

      {/* Footer */}
      <footer className="text-center mt-10 pt-4 border-t border-[#E5EAE5] text-[#6B7B6B] text-sm">
        <p>© 2023 True Feedback — All rights reserved.</p>
      </footer>
    </div>
  );
}
