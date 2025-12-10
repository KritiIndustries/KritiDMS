import axios from "axios";

export default async function fetchSAPData(apiUrl) {
    try {
        const response = await axios.get(apiUrl, {
            auth: {
                username: 'dev01',
                password: 'Kriti@12',
            },
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
            },
        });
        return response.data.d.results;
    } catch (err) {
        let errorMessage = 'Failed to fetch SAP data. Please try again later.';
        console.log(err);

        if (err.code === 'ERR_NETWORK') {
            errorMessage = 'Network error: Unable to connect to the API.';
        } else if (err.response?.status === 401) {
            errorMessage = 'Authentication failed: Invalid username or password.';
        } else if (err.response?.status) {
            errorMessage = `API error: ${err.response.status} - ${err.response.statusText}`;
        }
        throw new Error(errorMessage);
    }
}