"use client";

import { useEffect, useState, type FormEvent, type ChangeEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;

  const [name, setName] = useState(() => user?.name ?? "");
  const [avatar, setAvatar] = useState(() => user?.image ?? "");
  const [updating, setUpdating] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/auth/sign-in?callbackURL=%2Fprofile");
    }
  }, [session, isPending, router]);

  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("একটি সঠিক ছবি নির্বাচন করুন।");
      event.target.value = "";
      return;
    }

    if (file.size > 1024 * 1024) {
      toast.error("ছবির সাইজ ১ MB-এর কম হতে হবে।");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setAvatar(reader.result);
        toast.info("ছবি নির্বাচন করা হয়েছে। সংরক্ষণ করতে আপডেট চাপুন।");
      }
    };

    reader.onerror = () => {
      toast.error("ছবিটি পড়া যায়নি। আবার চেষ্টা করুন।");
    };

    reader.readAsDataURL(file);
  };

  const handleUpdate = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!name.trim()) {
      toast.error("আপনার নাম লিখুন।");
      return;
    }

    setUpdating(true);

    try {
      const result = await authClient.updateUser({
        name: name.trim(),
        image: avatar || "",
      });

      if (result.error) {
        toast.error(
          result.error.message ||
            "তথ্য আপডেট করা যায়নি। আবার চেষ্টা করুন।"
        );
        return;
      }

      toast.success("আপনার প্রোফাইল সফলভাবে আপডেট হয়েছে!");
      router.refresh();
    } catch {
      toast.error("সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setUpdating(false);
    }
  };

  const handleSignOut = async () => {
    setSigningOut(true);

    try {
      const result = await authClient.signOut();

      if (result.error) {
        toast.error("সাইন আউট করা যায়নি। আবার চেষ্টা করুন।");
        return;
      }

      toast.success("আপনি সফলভাবে লগআউট করেছেন!");
      router.replace("/");
      router.refresh();
    } catch {
      toast.error("সাইন আউট করার সময় সমস্যা হয়েছে।");
    } finally {
      setSigningOut(false);
    }
  };

  if (isPending || !session || !user) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-4">
        <p className="text-sm text-gray-500">
          প্রোফাইল লোড হচ্ছে...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-[65vh] bg-gray-50 px-4 py-10 sm:py-14">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            আমার প্রোফাইল
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন ও পরিবর্তন করুন।
          </p>
        </div>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <label
                htmlFor="profile-image"
                className="flex h-16 w-16 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-green-100 bg-green-100 text-xl font-bold text-green-700"
                title="ছবি পরিবর্তন করুন"
              >
                {avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatar}
                    alt="প্রোফাইল ছবি"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  (user.name || user.email || "U")
                    .charAt(0)
                    .toUpperCase()
                )}
              </label>

              <div className="min-w-0">
                <h2 className="truncate font-semibold text-gray-900">
                  {user.name || "ব্যবহারকারী"}
                </h2>

                <p className="mt-1 break-all text-sm text-gray-500">
                  {user.email}
                </p>

                <label
                  htmlFor="profile-image"
                  className="mt-2 inline-block cursor-pointer text-sm font-medium text-green-700 hover:underline"
                >
                  ছবি পরিবর্তন করুন
                </label>

                <input
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              disabled={signingOut}
              className="shrink-0 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60"
            >
              {signingOut ? "সাইন আউট হচ্ছে..." : "↩ সাইন আউট"}
            </button>
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="mb-5 text-lg font-semibold text-gray-900">
            তথ্য পরিবর্তন
          </h2>

          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label
                htmlFor="profile-name"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                নাম
              </label>

              <input
                id="profile-name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="আপনার নাম লিখুন"
                className="h-12 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div>
              <label
                htmlFor="profile-email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                ইমেইল
              </label>

              <input
                id="profile-email"
                type="email"
                value={user.email || ""}
                readOnly
                className="h-12 w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-500"
              />

              <p className="mt-1 text-xs text-gray-400">
                এই ফর্ম থেকে ইমেইল পরিবর্তন করা যাবে না।
              </p>
            </div>

            <button
              type="submit"
              disabled={updating}
              className="flex h-12 w-full items-center justify-center rounded-lg bg-green-600 px-4 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {updating ? "আপডেট হচ্ছে..." : "আপডেট"}
            </button>
          </form>
        </section>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-gray-500 transition hover:text-green-700"
          >
            ← হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>
    </main>
  );
}