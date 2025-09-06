import { Link } from "react-router-dom";
import { SquarePen, BookOpenCheck, BookDashed, Trash } from "lucide-react";
import "../../styles/components/PostItem.css";

const PostItem = ({
    onPostClick,
    post,
    previewContent,
    onDeletePost,
    togglePublishStatus,
}) => {
    return (
        <div className="postItem" onClick={onPostClick}>
            <div className="postItem_header">
                <h1 className="postItem_title">{post.title}</h1>
                <div className="postItem_btns">
                    <Link
                        to={`/admin/posts/${post.id}/edit`}
                        className="btn --btn-edit --no-min-width"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <SquarePen />
                    </Link>
                    <button
                        className="btn --btn-publish --no-min-width"
                        onClick={(e) => {
                            e.stopPropagation();
                            togglePublishStatus(post.id);
                        }}
                    >
                        {post.published ? <BookDashed /> : <BookOpenCheck />}
                    </button>

                    <button
                        className="btn --btn-del --no-min-width"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDeletePost(post.id);
                        }}
                    >
                        <Trash />
                    </button>
                </div>
            </div>
            <div dangerouslySetInnerHTML={{ __html: previewContent }} />
        </div>
    );
};

export default PostItem;
