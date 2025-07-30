// src/pages/OAuthCallback.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const OAuthCallback = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Google OAuth 2.0 설정 - 운영 서버용
    const clientId = "639506784430-mvf0oth3lt0jc4nab5dbjq18ki7nggsv.apps.googleusercontent.com";
    const redirectUri = "http://localhost:3000/oauth/callback";
    // const scope = "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/calendar";
    // const responseType = "code";

    // 운영 서버 API Base URL
    const API_BASE_URL = 'http://localhost:8090';

    const navigate = useNavigate();
    const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const errorParam = urlParams.get('error');

    if (errorParam) {
      // OAuth 에러 처리
      console.error('OAuth 에러:', errorParam);
      if (errorParam === 'access_denied') {
        setError('Google 로그인 권한이 거부되었습니다.');
      } else {
        setError('Google 로그인 중 오류가 발생했습니다.');
      }
      // URL에서 에러 파라미터 제거
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    if (code) {
      // Authorization code가 있으면 토큰 교환 처리
      handleAuthorizationCode(code);
      // URL에서 code 파라미터 제거
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

   // Authorization Code를 Access Token으로 교환
  const handleAuthorizationCode = async (code) => {
    console.log('Authorization Code 받음:', code);
    setIsLoading(true);
    setError('');

    try {
      // 스프링 백엔드에 authorization code 전송하여 토큰 교환 및 사용자 정보 가져오기
      const response = await fetch(`${API_BASE_URL}/login/oauth2/code/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        // CORS 설정
        mode: 'cors',
        credentials: 'include', // 쿠키/세션 정보 포함
        body: JSON.stringify({
            // authorizationCode 스프링히고 클라이언트랑 이름 매핑해줘야됨 
            // 서버에서는 변수명이 code 로 되어있음 
            // 클라는 authorizationCode 여서 불일치
            // 그래서 임시로 일단은 json 값에 필드를 code 로 바꿔놓음 
            // authorizationCode: code,
          code
        })
      });

      // HTTP 상태 코드 확인
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`스프링 서버 오류 [${response.status}]:`, errorText);
        throw new Error(`서버 인증 실패: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ 스프링 백엔드 응답:', data);

      // 스프링 응답 구조에 따른 처리
      if (data.success === true || data.status === 'SUCCESS' || response.status === 200) {
        // 로그인 성공 - 사용자 정보 및 토큰 저장
        const userData = data.data || data.user || data;
        
        console.log('✅ 로그인 성공 - 사용자 정보:', userData);
        
        // JWT 토큰이 있다면 localStorage에 저장
        if (data.accessToken || data.token || data.jwt) {
          const token = data.accessToken || data.token || data.jwt;
          localStorage.setItem('accessToken', token);
          console.log('✅ JWT 토큰 저장됨');
        }
        
        // Refresh Token 저장 (있는 경우)
        // Refresh Token 은 localStroage 에 저장하면 안됨
        // 이유는 localstroage 에 저장되면 값을 수정 할수있어서
        // 쿠키에 저장함 서버에서 쿠키 설정하면 자바스크립트에서 접근 불가
        // 클라이언트에서 특정(서버가 지정한) 경로에 요청을 서버에 보내면 자동
        // 으로 쿠키 값이 서버에 전달된다.
        // if (data.refreshToken) {
        //   localStorage.setItem('refreshToken', data.refreshToken);
        //   console.log('✅ Refresh Token 저장됨');
        // }
        
        // 사용자 정보 저장
        // if (userData) {
        //   localStorage.setItem('userInfo', JSON.stringify({
        //     id: userData.id || userData.userId,
        //     name: userData.name || userData.displayName,
        //     email: userData.email,
        //     picture: userData.picture || userData.profileImage,
        //     provider: 'google'
        //   }));
        // }
        
        // alert(`🎉 로그인 성공!\n이름: ${userData.name || userData.displayName}\n이메일: ${userData.email}`);
        
        // 메인 페이지로 리다이렉트
        // setTimeout(() => {
        //   window.location.href = '/main'; // 또는 원하는 페이지로
        // }, 1500);
        
      window.location.href = '/main';

      } else {
        // 스프링에서 실패 응답을 보낸 경우
        throw new Error(data.message || data.error || '인증 처리 실패');
      }

    } catch (error) {
      console.error('❌ 스프링 서버 연동 오류:', error);
      
      // 구체적인 에러 처리
      if (error.message.includes('Failed to fetch')) {
        setError('🔌 서버 연결 실패: emojournal.djloghub.com 서버가 실행 중인지 확인해주세요.');
      } else if (error.message.includes('CORS')) {
        setError('🚫 CORS 오류: 서버에서 CORS 설정을 확인해주세요.');
      } else if (error.message.includes('404')) {
        setError('🔍 API 엔드포인트 없음: /api/v1/auth/google/callback 경로를 확인해주세요.');
      } else if (error.message.includes('400')) {
        setError('📝 잘못된 요청: authorization code가 만료되었거나 잘못되었습니다.');
      } else if (error.message.includes('401')) {
        setError('🔐 인증 실패: Google OAuth 설정을 확인해주세요.');
      } else if (error.message.includes('500')) {
        setError('🛠️ 서버 내부 오류: 스프링 서버 로그를 확인해주세요.');
      } else {
        setError(`❌ 로그인 처리 중 오류: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };


  return <div>로그인 처리 중입니다...</div>;
};

export default OAuthCallback;
