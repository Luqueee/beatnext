"use client";

const handleFav = async (id: number) => {
  const req = await fetch("/api/profile/fav", {
    method: "DELETE",
    body: JSON.stringify({ id }),
  });

  const res = await req.json();

  return res;
};

export default handleFav;
