import { useNavigate } from "react-router-dom";
import PostItem from "../ui/PostItem";

const PostItemContainer = ({ post, togglePublishStatus, onDeletePost }) => {
    const navigate = useNavigate();

    const stripHtmlTags = (html) => {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;

        // Find first non-empty block (p or div), skip headers
        const block = [...tempDiv.querySelectorAll("p, div")].find(
            (el) => !/^H[1-6]$/i.test(el.tagName) && el.textContent.trim(),
        );

        let text = block
            ? block.textContent.trim()
            : tempDiv.textContent.trim();
        if (!text) return "";

        // First sentence only
        let firstSentence =
            text
                .split(/[.!?]/)
                .map((s) => s.trim())
                .filter(Boolean)[0] || "";
        return firstSentence.length > 100
            ? firstSentence.substring(0, 100) + "..."
            : firstSentence + ".";
    };

    const previewContent = stripHtmlTags(post.content);

    const handlePostClick = () => {
        navigate(`admin/posts/${post.id}/edit`);
    };

    return (
        <PostItem
            onPostClick={handlePostClick}
            post={post}
            previewContent={previewContent}
            onDeletePost={onDeletePost}
            togglePublishStatus={togglePublishStatus}
        />
    );
};

export default PostItemContainer;
