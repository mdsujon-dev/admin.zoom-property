import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useCreatePropertyMutation } from "../../redux/features/property/propertyApi";
import PropertyForm from "./PropertyForm";

const CreateProperty = () => {
  const navigate = useNavigate();
  const [createProperty, { isLoading }] = useCreatePropertyMutation();

  const onSubmit = async (values: any) => {
    try {
      const res: any = await createProperty(values).unwrap();
      toast.success(res?.message || "Listing created");
      // Straight to the record rather than back to the list: the next thing
      // anybody does with a new listing is look at it.
      navigate(`/properties/view/${res?.data?._id ?? ""}`);
    } catch (e: any) {
      toast.error(e?.data?.message || "Could not create the listing");
    }
  };

  return (
    <PropertyForm
      heading="New listing"
      submitLabel="Create listing"
      saving={isLoading}
      onSubmit={onSubmit}
    />
  );
};

export default CreateProperty;
