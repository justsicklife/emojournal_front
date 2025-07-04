import { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import axios from "axios";

const Home = () => {

  const [member,setMember] = useState({});

  const getMemberInfo = async () => {
    console.log("aaa");
    try {
      const res = await api.get("/member")
      console.log("회원 정보: ", res.data);
      setMember(res.data);
    } catch(err) {
      console.error("요청  실패 : " , err);
    }
  }



  useEffect(() => {
    getMemberInfo()
  },[]);

  return (
    <div>
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
