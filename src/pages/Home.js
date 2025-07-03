import { useEffect, useState } from "react";

const Home = () => {

  const [member,setMember] = useState({});

  useEffect(() => {

    const accessToken = localStorage.getItem("accessToken");

    fetch("http://localhost:8080/member",{
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + accessToken
      },
      credentials: "include"
    })
    .then((res) => res.json())
    .then((data) => {
      setMember(data);
    })
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
