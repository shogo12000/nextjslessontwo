"use client";

import { lusitana } from "@/ui/fonts/fonts";
import { Button } from "@/ui/Button";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/20/solid";
import { useActionState } from "react";
import { authenticate } from "../lib/actions"; 
 

export default function LoginForm() {

  const [errorMessage, formAction] = useActionState(authenticate, null);
 
 
  return (
    <div className="flex min-h-screen items-center justify-center">
      <form action={formAction} className="space-y-3">
        <div className="flex-1 max-w-96 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
          <h1 className={`${lusitana.className} mb-3 text-2xl`}>
            Please log in to continue.
          </h1>
          <div className="w-full">
            <div>
              <label
                className="mb-1 mt-5 block text-sm font-medium text-gray-900"
                htmlFor="email"
              >
                Email
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  required
                />
              </div>
            </div>

            <div className="mt-4">
              <label
                className="mb-1 mt-5 block text-sm font-medium text-gray-900"
                htmlFor="password"
              >
                Password
              </label>

              <input type="hidden" name="redirectTo" value={"/dashboard"} />
              
              <div className="relative">
                <input
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter your Password"
                  required
                />
              </div>

              {errorMessage && (
                <> 
                  <p className="text-sm text-red-500">{errorMessage}</p>
                </>
              )}

              <Button className="mt-5 w-full">
                Login{" "}
                <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
              </Button>
            </div>
          </div>

          <div
            className="flex h-8 items-end space-x-1"
            aria-live="polite"
            aria-atomic="true"
          ></div>
        </div>
      </form>
    </div>
  );
}
