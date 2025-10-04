"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { User } from "next-auth";

function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user;

  return (
    <nav className="py-2 md:py-3 bg-white text-[#144419] shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        {/* Left: Logo */}
        <a
          href="#"
          className="text-2xl md:text-2xl font-bold hover:text-[#A8E664] transition-colors"
        >
          True Feedback
        </a>

        {/* Center: Welcome username */}
        {session && (
          <span className="font-medium text-center text-[#144419]">
            Welcome, {user.username || user.email}
          </span>
        )}

        {/* Right: Logout button */}
        {session ? (
          <Button
            onClick={() => signOut()}
            className="bg-[#FF8C42] text-white hover:bg-[#E65C00] transition-colors rounded-lg px-6 py-2 font-medium"
          >
            Logout
          </Button>
        ) : (
          <Link href="/sign-in">
            <Button className="bg-[#FF8C42] text-white hover:bg-[#E65C00] transition-colors rounded-lg px-6 py-2 font-medium">
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
