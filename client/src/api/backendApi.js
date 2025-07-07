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


export { userRegister, userLogin };
