const BASE_URL = "http://localhost:3000";

export async function auth(email, password) {
    try {
        const res = await fetch(`${BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });
    } catch (err) {
        throw new Error(`Login failed: ${err.message}`);
    }

    const data = await res.json();

    return data;
}
