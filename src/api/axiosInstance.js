import axios from "axios";

let accessToken = localStorage.getItem("accessToken");

const api = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true
});

api.interceptors.request.use((config) =>  {
    if(accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`
    }
    return config;
})

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        console.log(error)

        console.log(error.response?.status)
        console.log(!originalRequest._retry)

        if(error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const res = await api.post("/auth/reissue");
                
                const newToken = res.data.accessToken;
                accessToken = newToken;
                localStorage.setItem("accessToken",accessToken);

                originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
                return api(originalRequest)
            } catch(reissueError) {
                console.error("재발급 실패", reissueError);
                return Promise.reject(reissueError);
            }
        }

        return Promise.reject(error);
    }
)

export default api