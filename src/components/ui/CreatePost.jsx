import { Editor } from "@tinymce/tinymce-react";

const CreatePost = ({
    onBackClick,
    onSubmit,
    message,
    title,
    setTitle,
    content,
    setContent,
    submitting,
}) => {
    return (
        <div className="createPost">
            <button onClick={onBackClick}>← Back to Posts</button>
            {message && <div className="">{message}</div>}
            <form onSubmit={onSubmit}>
                <input
                    name="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Post title"
                    required
                />

                <Editor
                    apiKey={import.meta.env.VITE_API_KEY}
                    init={{
                        height: 400,
                        menubar: false,
                        plugins: [
                            "anchor",
                            "autolink",
                            "charmap",
                            "codesample",
                            "emoticons",
                            "link",
                            "lists",
                            "media",
                            "searchreplace",
                            "table",
                            "visualblocks",
                            "wordcount",
                        ],
                        toolbar:
                            "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link media table mergetags | " +
                            "addcomment showcomments | spellcheckdialog a11ycheck typography uploadcare | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
                    }}
                    value={content}
                    onEditorChange={(newValue) => setContent(newValue)}
                />

                <button className="btn" type="submit" disabled={submitting}>
                    {submitting ? "Creating post" : "Create Post"}
                </button>
            </form>
        </div>
    );
};

export default CreatePost;
