import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import OAuthCallback from "./pages/OAuthCallback";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Calendar from "./pages/Calendar";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />
        <Route path="/calendar" element={<Calendar/>}/>
      </Routes>
    </Router>
  );
}

export default App;
