import axios from "axios";

// Базовый инстанс axios
const api = axios.create({
    baseURL: "http://localhost:8080/api", // твой Spring Boot backend
    withCredentials: true, // важно: для JWT в httpOnly cookie
});

// Интерцептор на ошибки
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // если сервер вернул сообщение об ошибке
        if (error.response) {
            console.error("API Error:", error.response.data);
        } else {
            console.error("Network Error:", error.message);
        }
        return Promise.reject(error);
    }
);

export default api;
