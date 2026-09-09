import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useCreateProjectMutation } from "../../redux/features/project/projectApi";
import ProjectForm from "./ProjectForm";

const CreateProject = () => {
  const navigate = useNavigate();
  const [createProject, { isLoading }] = useCreateProjectMutation();

  const onSubmit = async (values: any) => {
    try {
      const res: any = await createProject(values).unwrap();
      toast.success(res?.message || "Project created");
      navigate("/projects");
    } catch (e: any) {
      toast.error(e?.data?.message || "Could not create the project");
    }
  };

  return (
    <ProjectForm
      heading="New project"
      submitLabel="Create project"
      saving={isLoading}
      onSubmit={onSubmit}
    />
  );
};

export default CreateProject;
