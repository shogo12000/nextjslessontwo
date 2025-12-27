"use client";

import { lusitana } from "@/ui/fonts/fonts";
import { Button } from "@/ui/Button";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/20/solid";
import { useActionState } from "react";
import { login } from "../lib/actions";
import { useEffect } from "react";
import Link from "next/link";
import { getUserLogin } from "@/ui/actions/actions";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [errorMessage, formAction] = useActionState(login, null);
  const router = useRouter();

  const userLogin = async () => {
    const getUser = await getUserLogin();

    if (getUser?.userType === "admin") {
      router.push("/admin"); 
    } else if (getUser?.userType === "employee") {
       router.push("/dashboard"); 
    }
  };
  useEffect(() => {
    if (errorMessage?.success) {
      userLogin();
    }
  }, [errorMessage]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form action={formAction} className="space-y-3">
        <div className="flex-1 max-w-96 min-w-80 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
          <h1 className={`${lusitana.className} mb-3 text-2xl`}>
            Please log in to continue.
          </h1>
          <div className="w-full flex flex-col gap-4">
            <div>
              <label
                className="mb-1  block text-sm font-medium text-gray-900"
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

            <div>
              <div className="relative">
                <label
                  className="mb-1  block text-sm font-medium text-gray-900"
                  htmlFor="password"
                >
                  Password
                </label>

                <input type="hidden" name="redirectTo" value={"/dashboard"} />

                <input
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter your Password"
                  required
                />
              </div>

              <Button className="mt-5 w-full">
                Login{" "}
                <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
              </Button>

              {errorMessage?.errors?.properties?.email?.errors?.[0] && (
                <>
                  <p className="text-sm text-red-500">
                    {errorMessage?.errors?.properties?.email?.errors?.[0]}
                  </p>
                </>
              )}

              {errorMessage?.errors?.properties?.password?.errors?.[0] && (
                <>
                  <p className="text-sm text-red-500">
                    {errorMessage?.errors?.properties?.password?.errors?.[0]}
                  </p>
                </>
              )}

              {errorMessage?.message && (
                <>
                  <p className="text-sm text-red-500">
                    {errorMessage?.message}
                  </p>
                </>
              )}
            </div>

            <div
              className="flex justify-end p-2 h-8 items-end space-x-1"
              aria-live="polite"
              aria-atomic="true"
            >
              <Link href="/register">Register</Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
