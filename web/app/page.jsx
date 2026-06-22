"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Next.js 라우터 가져오기

export default function Coverflow() {
  
  return (
    <div>
      <h1>Coverflow</h1>

      <div id="container">
        <div id="coverflow-container">
          <div className="title">
            한국 <br />
            오페라
            <br />
            첫 15년의 <br />
            궤적 <br />
            1948-1962
          </div>
        </div>
      </div>
    </div>
  );
}
