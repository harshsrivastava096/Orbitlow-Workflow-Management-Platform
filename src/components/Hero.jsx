import React, { useEffect, useRef, useState } from "react";
import Header from "./Header";

export default function Hero() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#E8F0FE] via-[#C7D7FF] to-[#FFFFFF]">
      <Header />

      <section className="min-h-screen overflow-hidden flex flex-col bg-gradient-to-br from-[#E8F0FE] via-[#C7D7FF] to-[#FFFFFF] items-center justify-center hero relative gap-10">
        <div className="relative mx-20 flex flex-row gap-10">
          <div className="flex flex-col gap-6 items-center md:p-10">
            <h1 className="font-bold text-5xl text-red-950">
              "Manage Tasks/Projects, Track Cases, Streamline Everything."
            </h1>
            <h2 className="font-serif text-xl text-black">
              A modern and efficient platform designed to simplify case, task,
              and project management. Users can create and track cases, organize
              tasks, set deadlines, upload documents, and monitor progress
              effortlessly. With a clean dashboard, real-time updates, and
              smooth navigation, it helps you stay organized and manage your
              workflow without any complexity.
            </h2>
          </div>

          <div className=" md:p-10">
            <img
              src="../Tasks.png"
              className="sm:max-w-xl rounded-3xl shadow-lg"
              alt=""
            />
          </div>
        </div>
      </section>
    </div>
  );
}
