import { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import axios from "axios";

const Home = () => {

  const [member,setMember] = useState({});

  const getMemberInfo = async () => {
    try {
      if(localStorage.getItem("accessToken")) {
        const res = await api.get("/member")
        console.log("회원 정보: ", res.data);
        setMember(res.data);
      }
    } catch(err) {
      console.error("요청  실패 : " , err);
    }
  }

  const logoutButton = () => {
    try {

      axios.post("http://localhost:8080/auth/logout",null , {
        withCredentials: true,
      });
      
      localStorage.removeItem("accessToken");
      
      console.log("로그아웃 완료")
    } catch(err) {
      console.error("로그아웃 실패")
    }
  } 

  useEffect(() => {
    getMemberInfo()
  },[]);

  return (
    <div>
      <div>
        <button onClick={logoutButton}>로그아웃</button>
      </div>
      <h1>홈페이지</h1>
      <p>환영합니다! 구글 로그인에 성공하셨습니다.</p>
      <div>
          {member.email}
      </div>
      <div>
        {member.nickname}
      </div>
    </div>
  );
};

export default Home;
