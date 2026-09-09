import { Spin } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
  useGetPropertyByIdQuery,
  useUpdatePropertyMutation,
} from "../../redux/features/property/propertyApi";
import PropertyForm from "./PropertyForm";

const UpdateProperty = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useGetPropertyByIdQuery(id, { skip: !id });
  const [updateProperty, { isLoading: saving }] = useUpdatePropertyMutation();

  const onSubmit = async (values: any) => {
    try {
      const res: any = await updateProperty({ id, data: values }).unwrap();
      toast.success(res?.message || "Listing updated");
      navigate(`/properties/view/${id}`);
    } catch (e: any) {
      toast.error(e?.data?.message || "Could not save the listing");
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
    <PropertyForm
      heading="Edit listing"
      submitLabel="Save changes"
      initial={data}
      saving={saving}
      onSubmit={onSubmit}
    />
  );
};

export default UpdateProperty;
