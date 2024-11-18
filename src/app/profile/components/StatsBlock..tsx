"use client";

import Image from "next/image";
import { useStats } from "../hooks";
import type { session } from "@/auth";
import { useConfig } from "@/store";
import { useEffect } from "react";
import { createUser, getUser } from "@/db/user";
export default function StatsBlock({ session }: { session: session }) {
  const { statsSongs } = useStats(session);
  const { getUserCreated, setUserCreated } = useConfig((state) => state);

  useEffect(() => {
    if (!getUserCreated()) {
      console.log("Creating user");
      getUser(session).then((user) => {
        console.log({ user });
        if (user) {
          setUserCreated(true);
        } else {
          createUser({
            name: session?.user?.name as string,
            email: session?.user?.email as string,
            image: (session?.user?.image as string) ?? "",
          }).then((res) => {
            if (!res) return;
            console.log(res);
            setUserCreated(true);
          });
        }
      });
    } else {
      console.log("User already created");
    }
  }, [session]);

  return (
    <div className=" py-8">
      {statsSongs?.map((stat, index) => (
        <div
          key={stat.id}
          className="grid grid-cols-[30px_1fr] gap-8 items-center"
        >
          <div>
            <p className=" text-4xl">{index + 1}</p>
          </div>
          <div className=" border inline-flex gap-4 border-white p-2">
            <Image
              src={stat.album.images[0].url}
              width={100}
              height={100}
              alt={stat.album.name}
              draggable={false}
              className=" rounded-lg"
            />
            <div>
              <h1>{stat.name}</h1>
              <p>{stat.artists.map((artist) => artist.name).join(", ")}</p>
              <p>{stat.popularity}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
