import axios from "axios"

const backendURL = import.meta.env.VITE_BACKEND_API;

const userRegister = async (userData) => {
    try {
        const result = await axios({
            url: `${backendURL}/api/user/register`,
            method: 'POST',
            data: userData
        });

        const data = result.data; // ✅ extract first

        if (result.status !== 200 && result.status !== 201) {
            // ✅ use `result.status` instead of result.ok
            throw new Error(data.message || 'Registration failed');
        }

        return data;
    } catch (error) {
        console.error('userRegister error:', error.response?.data?.message || error.message);
        throw error.response?.data?.message || error;
    }
};

const userLogin = async (loginData) => {
    try {
        const result = await axios({
            url: `${backendURL}/api/user/login`, // Make sure the route matches your backend
            method: 'POST',
            data: loginData
        });

        const data = result.data;

        if (result.status !== 200 && result.status !== 201) {
            throw new Error(data.message || 'Login failed');
        }

        // Optionally: store token in localStorage or cookie
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        return data;
    } catch (error) {
        console.log(error)
        console.error('userLogin error:', error.response?.data?.message || error.message);
        throw error.response?.data?.message || error;
    }
};

const fetchDataForLeaderBoard = async (token) => {
    let response = await axios({
        url: `${backendURL}/api/user/leader-board-data`,
        method: "get",
        headers: {
            authorization: `Bearer ${token}`,
        }
    })

    return response.data
}

const queryForTopicsToLearn = async (token, queryData, userId) => {
    let response = await axios({
        url: `${backendURL}/api/user/query-for-topic`,
        method: "post",
        headers: {
            authorization: `Bearer ${token}`,
        },
        data: { ...queryData, userId }  // ✅ flatten the body
    });
    return response.data;
};

const fetchDailyQuiz = async (token) => {
    const result = await axios.get(`${backendURL}/api/user/daily-quiz`, {
        headers: {
            authorization: `Bearer ${token}`
        }
    });

    return result.data;
};

// ✅ Store submitted quiz answers and calculate result
const storeAnswers = async (token, data) => {

    console.log("getting data to save : ", data)

    const response = await axios.post(`${backendURL}/api/user/store-answers`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

const updateUserPoints = async (userId, points) => {
    const token = localStorage.getItem("token");

    console.log("points to update : ", points)

    const res = await axios.put(`${backendURL}/api/user/update-points/${userId}`, {
        points
    }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return res.data;
};


export { userRegister, userLogin, fetchDataForLeaderBoard, queryForTopicsToLearn, fetchDailyQuiz, storeAnswers, updateUserPoints };
