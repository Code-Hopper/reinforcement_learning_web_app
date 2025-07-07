import axios from 'axios';

const backendURL = import.meta.env.VITE_BACKEND_API;

export async function validateUser(token) {
    try {
        const response = await axios.get(`${backendURL}/api/user/dashboard`, {
            headers: {
                authorization: `Bearer ${token}`,
            },
        });
    
        console.log(response)

        // Assuming backend sends user data in `response.data.user`
        if (response.status === 200 && response.data.user) {
            return {
                success: true,
                user: response.data.user,
            };
        } else {
            return {
                success: false,
                error: 'Invalid response structure',
            };
        }
    } catch (error) {
        console.error('User validation failed:', error);

        return {
            success: false,
            error: error.response?.data?.message || 'Validation failed',
        };
    }
}
