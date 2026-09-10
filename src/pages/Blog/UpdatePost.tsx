import { Spin } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
  useGetPostByIdQuery,
  useUpdatePostMutation,
} from "../../redux/features/blog/blogApi";
import BlogForm from "./BlogForm";

const UpdatePost = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useGetPostByIdQuery(id, { skip: !id });
  const [updatePost, { isLoading: saving }] = useUpdatePostMutation();

  const onSubmit = async (values: any) => {
    try {
      const res: any = await updatePost({ id, data: values }).unwrap();
      toast.success(res?.message || "Article updated");
      navigate("/blog");
    } catch (e: any) {
      toast.error(e?.data?.message || "Could not save the article");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spin />
      </div>
    );
  }

  return (
    <BlogForm
      heading="Edit article"
      submitLabel="Save changes"
      initial={data}
      saving={saving}
      onSubmit={onSubmit}
    />
  );
};

export default UpdatePost;
