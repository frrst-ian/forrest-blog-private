import { Routes, Route, Navigate } from "react-router-dom";
import LogInContainer from "./components/containers/LogInContainer";
import PostListContainer from "./components/containers/PostListContainer";
import PostDetailContainer from "./components/containers/PostDetailContainer";
import EditPostContainer from "./components/containers/EditPostContainer";
import CreatePostContainer from "./components/containers/CreatePostContainer";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/auth/login" element={<LogInContainer />} />
            <Route path="/" element={<Navigate to="/auth/login" replace />} />
            <Route path="/admin/posts" element={<PostListContainer />} />
            <Route path="/admin/posts/new" element={<CreatePostContainer />} />
            <Route
                path="/admin/posts/:id/edit"
                element={<EditPostContainer />}
            />
            <Route path="/admin/posts/:id" element={<PostDetailContainer />} />
        </Routes>
    );
};

export default AppRoutes;
