import { Spin } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
  useGetProjectByIdQuery,
  useUpdateProjectMutation,
} from "../../redux/features/project/projectApi";
import ProjectForm from "./ProjectForm";

const UpdateProject = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useGetProjectByIdQuery(id, { skip: !id });
  const [updateProject, { isLoading: saving }] = useUpdateProjectMutation();

  const onSubmit = async (values: any) => {
    try {
      const res: any = await updateProject({ id, data: values }).unwrap();
      toast.success(res?.message || "Project updated");
      navigate("/projects");
    } catch (e: any) {
      toast.error(e?.data?.message || "Could not save the project");
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
    <ProjectForm
      heading="Edit project"
      submitLabel="Save changes"
      initial={data?.project}
      saving={saving}
      onSubmit={onSubmit}
    />
  );
};

export default UpdateProject;
