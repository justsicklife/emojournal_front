// src/pages/MyInformationPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../api/axiosInstance';
import axios from 'axios';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 118px);
  padding: 30px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 20px 10px;
  }
`;

const ProfileCard = styled.div`
  width: 900px;
  min-height: 681px;
  background: linear-gradient(135deg, #f8e8f0 0%, #e8d5e8 100%);
  border-radius: 24px;
  padding: 45px;
  box-sizing: border-box;
  font-family: '온글잎 의연체', sans-serif;
  position: relative;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

  @media (max-width: 1200px) {
    width: 90%;
    max-width: 1100px;
    height: auto;
    min-height: 780px;
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 40px 30px;
  }
`;

const ProfileHeader = styled.div`
  text-align: center;
  margin-bottom: 5px;
`;

const ProfileAvatar = styled.div`
  margin-bottom: 10px;
`;

const AvatarCircle = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: white;
  border: 4px solid #333;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
  }
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const AvatarEmoji = styled.span`
  font-size: 36px;

  @media (max-width: 768px) {
    font-size: 36px;
  }
`;

const Greeting = styled.h1`
  font-size: 64px;
  color: #333;
  font-weight: bold;
  margin: 0;
  letter-spacing: 1px;

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 60px;
`;

const InfoItem = styled.div`
  background: white;
  border-radius: 12px;
  padding: 15px 25px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.1);
`;

const InfoText = styled.span`
  font-size: 40px;
  color: #333;
  font-weight: 500;
  letter-spacing: 0.5px;
  display: block;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 22px;
  }
`;

const ProfileFooter = styled.div`
  position: absolute;
  bottom: 30px;
  right: 45px;
`;

const EditButton = styled.button`
  background: #ffffff;
  border: 2px solid #ccc;
  border-radius: 12px;
  padding: 3px 30px;
  font-size: 32px;
  color: #363434;
  cursor: pointer;
  font-family: '온글잎 의연체', sans-serif;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: #e8e8e8;
    border-color: #999;
  }

  &:active {
    transform: translateY(1px);
  }

   &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: #f5f5f5;
    border-color: #ddd;
  }
`;

const MyInformationPage = () => {
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState('');
  const [mbti, setMbti] = useState('');

  const isMemberChange = () => {
    if(member.nickname !== nickname || 
      member.gender !== gender ||
      member.mbti !== mbti
    ) {
      if(gender !== "" && mbti !== "" && nickname !== "") {
        return true
      }
    }

    return false
  }

  const logoutButton = () => {
      api.post("/auth/logout",null , {
        withCredentials: true,
      }).then((response) => {
        localStorage.removeItem("accessToken");
        console.log("로그아웃 완료")
        window.location.href = "/LoginPageOauth"
      }).catch((error) => {
        console.error("로그아웃 실패")
      })      
  } 

  const getMemberInfo = async () => {
    try {
      if(localStorage.getItem("accessToken")) {
        const res = await api.get("/member")
        console.log("회원 정보: ", res.data);

        const cleanedData = { ...res.data };

        for (let key in cleanedData) {
          if (cleanedData[key] === null) {
            cleanedData[key] = "";
          }
        }


        console.log(cleanedData)
        setMember(cleanedData);
        setGender(cleanedData.gender)
        setNickname(cleanedData.nickname)
        setMbti(cleanedData.mbti)
      }
    } catch(err) {
      console.error("요청  실패 : " , err);
    }
  }

  useEffect(() => {
    // 로컬스토리지에서 member 정보 가져오기
    getMemberInfo()
  }, []);

  const handleEditClick = async () => {
    console.log('수정 버튼 클릭됨');
    // 예) 수정 페이지로 이동
    // navigate('/edit-profile');
    
    // 그냥 페이지로 이동 하지 말고 
    // 유저정보 페이지에서 수정 하는 걸로?

    if(isMemberChange()) {
      const res = await api.put("/member",
        {
          nickname,
          gender,
          mbti
        }
      )

      window.location.href = "/MyInformationPage"

    }
  
  };

  if (!member) {
    return (
      <Container>
        <p>사용자 정보를 불러오는 중입니다... 또는 로그인이 필요합니다.</p>
      </Container>
    );
  }

  return (
    <>
      {/* 필요하면 Header, Footer 포함 */}
      {/* <Header /> */}

      <Container>
        <ProfileCard>
        <div>
        <button onClick={logoutButton}>로그아웃</button>
      </div>
          <ProfileHeader>
            <ProfileAvatar>
              <AvatarCircle>
                {member.picture ? (
                  <AvatarImage src={member.picture} alt="프로필 사진" />
                ) : (
                  <AvatarEmoji>🙂</AvatarEmoji>
                )}
              </AvatarCircle>
            </ProfileAvatar>
            <Greeting>안녕하세요 {member.nickname}님</Greeting>
          </ProfileHeader>

          <ProfileInfo>

          <InfoItem>
            <InfoText>
              이메일 : {member.email}
            </InfoText>
          </InfoItem>

          <InfoItem>
          
            <InfoText>
              닉네임 : 
              <input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                style={{ fontSize: "24px", marginLeft: "10px" }}
              />
            </InfoText>
            
          </InfoItem>

          <InfoItem>
              <InfoText>
                성별 : 
                <select value={gender} onChange={(e) => setGender(e.target.value)} style={{ fontSize: "24px", marginLeft: "10px" }}>
                  <option value="">선택</option>
                  <option value="MALE">남성</option>
                  <option value="FEMALE">여성</option>
                </select>
              </InfoText>
            
          </InfoItem>

          <InfoItem>
              <InfoText>
                MBTI :
                <select value={mbti} onChange={(e) => setMbti(e.target.value)} style={{ fontSize: "24px", marginLeft: "10px" }}>
                  <option>선택</option>
                  {["INTJ", "INTP", "ENTJ", "ENTP", "INFJ", "INFP", "ENFJ", "ENFP",
                    "ISTJ", "ISFJ", "ESTJ", "ESFJ", "ISTP", "ISFP", "ESTP", "ESFP"]
                    .map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                </select>
              </InfoText>
            
          </InfoItem>

          <InfoItem>
            <InfoText>
              가입한 날 : {member.createDate?.split('T')[0]}
            </InfoText>
          </InfoItem>
          </ProfileInfo>

          <ProfileFooter>
            <EditButton 
            disabled={!isMemberChange()}
            onClick={handleEditClick}>
              수정  
            </EditButton>
          </ProfileFooter>
        </ProfileCard>
      </Container>

      {/* <Footer /> */}
    </>
  );
};

export default MyInformationPage;
