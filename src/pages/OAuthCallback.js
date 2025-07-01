// src/pages/OAuthCallback.jsx
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const code = query.get("code");

    if (code) {
      fetch("http://localhost:8080/login/oauth2/code/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("data : ",data);
          console.log("AccessToken:", data.accessToken);
          // 토큰 저장 (예: localStorage)
          localStorage.setItem("accessToken", data.accessToken);
          // 메인 페이지로 이동
          navigate("/");
        })
        .catch((err) => {
          console.error("로그인 실패", err);
          navigate("/login?error=true");
        });
    }
  }, []);

  return <div>로그인 처리 중입니다...</div>;
};

export default OAuthCallback;
