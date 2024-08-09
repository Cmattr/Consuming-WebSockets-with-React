import { useState } from "react";
import { Button, Form, Card } from "react-bootstrap";
import './Post.css'

type PostProps = {
    socket: any; 
};

type PostData = {
    id: string; // Assuming each post has a unique id
    title: string;
    body: string;
    timestamp: number; // To help with sorting
};

const Post: React.FC<PostProps> = ({ socket }) => {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [posts, setPosts] = useState<PostData[]>([]);

    const sendPost = () => {
        if (title && body) {
            // Create a new post object with a timestamp
            const newPost: PostData = {
                id: Date.now().toString(), // Example ID, replace with your logic
                title,
                body,
                timestamp: Date.now()
            };

            // Emit the new post to the server (optional if needed)
            socket.emit("CreatePost", newPost);

            // Update the local posts state with the new post
            setPosts([newPost, ...posts]);

            // Clear the input fields
            setTitle("");
            setBody("");
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        sendPost();
    };

    return (
        <div>    
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId='formTitle'>
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId='formBody'>
                    <Form.Label>Body</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Enter Body"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Create Post
                </Button>
            </Form>

            <div className="posts-list mt-4">
                <h2>Posts</h2>
                {posts
                    .slice() // Create a copy of the array to avoid mutating the state directly
                    .sort((a, b) => b.timestamp - a.timestamp) // Sort in descending order by timestamp
                    .map(post => (
                        <Card key={post.id} className="mb-3">
                            <Card.Body>
                                <Card.Title>Title: {post.title}</Card.Title>
                                <Card.Text>Body: {post.body}</Card.Text>
                            </Card.Body>
                        </Card>
                    ))
                }
            </div>
        </div>
    );
};

export default Post;
