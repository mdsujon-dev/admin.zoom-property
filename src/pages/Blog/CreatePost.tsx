import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useCreatePostMutation } from "../../redux/features/blog/blogApi";
import BlogForm from "./BlogForm";

const CreatePost = () => {
  const navigate = useNavigate();
  const [createPost, { isLoading }] = useCreatePostMutation();

  const onSubmit = async (values: any) => {
    try {
      const res: any = await createPost(values).unwrap();
      toast.success(res?.message || "Article created");
      navigate("/blog");
    } catch (e: any) {
      toast.error(e?.data?.message || "Could not create the article");
    }
  };

  return (
    <BlogForm
      heading="Write an article"
      submitLabel="Create article"
      saving={isLoading}
      onSubmit={onSubmit}
    />
  );
};

export default CreatePost;
