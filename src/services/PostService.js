const BASE_URL = "https://forrest-blog-backend.onrender.com";

export async function auth(email, password) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Login failed");
    }

    return res.json();
}
export async function togglePostPublishStatus(postId, newStatus) {
    const response = await fetch(`${BASE_URL}/admin/posts/${postId}/published`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ published: newStatus }),
    });
    if (!response.ok) {
        throw new Error("Failed to update post status.");
    }

    return response;
}

export async function deletePost(postId) {
    const response = await fetch(
        `http://localhost:3000/admin/posts/${postId}`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        },
    );
    return response;
}

export async function getPosts(token) {
    const res = await fetch("http://localhost:3000/admin/posts", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res;
}

export async function getPost(postId) {
    const res = await fetch(`http://localhost:3000/admin/posts/${postId}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });

    return res;
}

export async function deleteComment(commentId) {
    const res = await fetch(
        `http://localhost:3000/admin/comments/${commentId}`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        },
    );

    return res;
}

export async function createPost(title, content) {
    const res = await fetch("http://localhost:3000/admin/posts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ title, content }),
    });
    return res;
}

export async function editPost(id, title, content) {
    const res = await fetch(`http://localhost:3000/admin/posts/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ title, content }),
    });

    return res;
}
