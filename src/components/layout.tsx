import { ReactNode } from "react";
import { Inter } from "next/font/google";
import Head from "next/head";
import { useUserStateStore } from "@/modules/game/model/user-state-store";

const inter = Inter({ subsets: ["latin"] });

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { balance } = useUserStateStore();

  return (
    <div
      className={`flex flex-col text-black h-full bg-[#F0F0F0] ${inter.className}`}
    >
      <Head>
        <title>Беспощадные ставки</title>

        <link
          href="/favicon.ico"
          rel="shortcut icon"
          type="image/x-icon"
          data-rh="true"
        ></link>
      </Head>

      <header className="bg-primary flex-shrink-0 py-5 px-6 flex justify-end w-full relative overflow-hidden">
        <h1 className="text-base text-white leading-6 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          Беспощадные ставки
        </h1>

        <div className="flex-shrink-0 h-6 w-6 text-white">{balance}</div>
      </header>

      <main className="flex flex-col pb-10 h-full">{children}</main>
    </div>
  );
}

function BellIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.26237 3.26243C8.51886 2.00594 10.223 1.30005 12 1.30005C13.7769 1.30005 15.4811 2.00594 16.7376 3.26243C17.9941 4.51893 18.7 6.2231 18.7 8.00005C18.7 11.3969 19.4269 13.5293 20.1145 14.7899C20.4593 15.4219 20.7979 15.8419 21.0394 16.0968C21.1603 16.2244 21.2573 16.3111 21.3192 16.3627C21.3501 16.3885 21.3723 16.4055 21.3843 16.4144L21.3941 16.4216C21.6467 16.5936 21.7587 16.9099 21.6699 17.2029C21.5806 17.4981 21.3084 17.7 21 17.7H2.99998C2.69151 17.7 2.41941 17.4981 2.33002 17.2029C2.24131 16.9099 2.35329 16.5936 2.60583 16.4216L2.61567 16.4144C2.62765 16.4055 2.64982 16.3885 2.68076 16.3627C2.74262 16.3111 2.83964 16.2244 2.96056 16.0968C3.20204 15.8419 3.5407 15.4219 3.88545 14.7899C4.57303 13.5293 5.29998 11.3969 5.29998 8.00005C5.29998 6.2231 6.00587 4.51893 7.26237 3.26243ZM4.59411 16.3H19.4059C19.2364 16.0596 19.0604 15.7809 18.8855 15.4602C18.073 13.9708 17.3 11.6032 17.3 8.00005C17.3 6.5944 16.7416 5.24633 15.7476 4.25238C14.7537 3.25844 13.4056 2.70005 12 2.70005C10.5943 2.70005 9.24626 3.25844 8.25232 4.25238C7.25837 5.24633 6.69998 6.5944 6.69998 8.00005C6.69998 11.6032 5.92693 13.9708 5.11451 15.4602C4.93959 15.7809 4.76354 16.0596 4.59411 16.3Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.7 18.3V19C10.7 19.718 11.282 20.3 12 20.3C12.718 20.3 13.3 19.718 13.3 19V18.3H14.7V19C14.7 20.4912 13.4912 21.7 12 21.7C10.5088 21.7 9.29999 20.4912 9.29999 19V18.3H10.7Z"
        fill="white"
      />
    </svg>
  );
}
