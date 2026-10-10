"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

type ProductCardLinkProps = {
  href: string;
  children: ReactNode;
};

export default function ProductCardLink({
  href,
  children,
}: ProductCardLinkProps) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const handleClick = () => {
    if (isPending) return;

    if (!session) {
      router.push("/auth/sign-up");
      return;
    }

    router.push(href);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="block w-full cursor-pointer border-0 bg-transparent p-0 text-left disabled:cursor-wait"
    >
      {children}
    </button>
  );
}