import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useCreateAreaMutation } from "../../redux/features/area/areaApi";
import AreaForm from "./AreaForm";

/**
 * Full page for adding a new area.
 */
const CreateArea = () => {
  const navigate = useNavigate();
  const [createArea, { isLoading }] = useCreateAreaMutation();

  const onSubmit = async (values: any) => {
    try {
      const res: any = await createArea(values).unwrap();
      toast.success(res?.message || "Area created successfully");
      navigate("/areas");
    } catch (e: any) {
      toast.error(e?.data?.message || "Could not create the area");
    }
  };

  return (
    <AreaForm
      heading="Add new area"
      submitLabel="Create area"
      saving={isLoading}
      onSubmit={onSubmit}
    />
  );
};

export default CreateArea;
