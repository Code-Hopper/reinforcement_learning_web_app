import axios from "axios"

const backendURL = import.meta.env.VITE_BACKEND_API;

const userRegister = async (userData) => {
    console.log(userData);
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

export { userRegister };
