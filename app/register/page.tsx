"use client";

import { lusitana } from "@/ui/fonts/fonts";
import { Button } from "@/ui/Button";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/20/solid";
import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "../lib/actions";
import Link from "next/link";
import { error } from "console";

export default function LoginForm() {
  const router = useRouter();
  const [errorMessage, formAction, isPending] = useActionState(register, null);
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    passwordrepeat: "",
  });

  return (
    <div className="flex min-h-screen items-center justify-center">
      {errorMessage?.success ? (
        <div className="flex-1   max-w-96 min-w-80 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
          <h1 className={`${lusitana.className} mb-3 text-2xl`}>
            Your registration was successful.
          </h1>
          <Button className="  w-full" disabled={isPending}  onClick={()=> router.push("/login")}>
            Login <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
          </Button>
        </div>
      ) : (
        <form action={formAction} className="space-y-3">
          <div className="flex-1   max-w-96 min-w-80 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
            <h1 className={`${lusitana.className} mb-3 text-2xl`}>
              Please Register.
            </h1>
            <div className="w-full flex flex-col gap-4">
              <div>
                <label
                  className="mb-1 block text-sm font-medium text-gray-900"
                  htmlFor="email"
                >
                  Name
                </label>

                <div className="relative">
                  <input
                    className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                    id="name"
                    type="text"
                    name="name"
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                    placeholder="Enter your name"
                    value={user.name}
                    required
                  />
                </div>
                {errorMessage?.errors?.properties?.name?.errors?.[0] && (
                  <>
                    <p className="text-sm text-red-500">
                      {errorMessage.errors.properties.name.errors?.[0]}
                    </p>
                  </>
                )}
              </div>

              <div>
                <label
                  className="mb-1 block text-sm font-medium text-gray-900"
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
                    onChange={(e) =>
                      setUser({ ...user, email: e.target.value })
                    }
                    value={user.email}
                    required
                  />
                </div>
                {errorMessage?.errors?.properties?.email?.errors?.[0] && (
                  <>
                    <p className="text-sm text-red-500">
                      {errorMessage.errors.properties.email.errors?.[0]}
                    </p>
                  </>
                )}
              </div>

              <div>
                <label
                  className="mb-1 block text-sm font-medium text-gray-900"
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
                {errorMessage?.errors?.properties?.password?.errors?.[0] && (
                  <>
                    <p className="text-sm text-red-500">
                      {errorMessage.errors.properties.password.errors?.[0]}
                    </p>
                  </>
                )}
              </div>

              <div>
                <label
                  className="mb-1 block text-sm font-medium text-gray-900"
                  htmlFor="password"
                >
                  Password
                </label>
 
                <div className="relative">
                  <input
                    className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                    id="passwordrepeat"
                    type="password"
                    name="passwordrepeat"
                    placeholder="Enter your Password"
                    required
                  />
                </div>

                {errorMessage?.errors?.properties?.passwordrepeat
                  ?.errors?.[0] && (
                  <>
                    <p className="text-sm text-red-500">
                      {
                        errorMessage.errors.properties.passwordrepeat
                          .errors?.[0]
                      }
                    </p>
                  </>
                )}

                {errorMessage?.message && (
                  <>
                    <p className="text-sm text-red-500">
                      {errorMessage.message}
                    </p>
                  </>
                )}
              </div>

              <Button className="  w-full" disabled={isPending}>
                Register{" "}
                <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
              </Button>

              <div
                className="flex h-8 items-end justify-end space-x-1 p-2"
                aria-live="polite"
                aria-atomic="true"
              >
                <Link href="/login">Login</Link>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
