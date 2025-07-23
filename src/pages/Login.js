const Login = () => {
  const handleGoogleLogin = () => {
    const clientId = "639506784430-mvf0oth3lt0jc4nab5dbjq18ki7nggsv.apps.googleusercontent.com";
    const redirectUri = "http://localhost:3000/oauth/callback";
    // const scope = "email profile";
    const scope = "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/calendar"
    const responseType = "code";

    const url = `https://accounts.google.com/o/oauth2/v2/auth?response_type=${responseType}&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&prompt=consent&access_type=offline`;

    window.location.href = url; // 구글 로그인 페이지로 이동
  };

  return (
    <div>
      <h1>로그인 페이지</h1>
      <button onClick={handleGoogleLogin}>Google로 로그인</button>
    </div>
  );
};

export default Login;
