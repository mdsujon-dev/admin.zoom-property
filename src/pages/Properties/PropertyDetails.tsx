import { Button, Descriptions, Image, Spin, Tag } from "antd";
import { Edit } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import PageHeader from "../../components/Common/PageHeader";
import PageMeta from "../../components/Common/PageMeta";
import PermissionGate from "../../components/Common/PermissionGate";
import RecordHistory from "../../components/shared/RecordHistory";
import { useGetPropertyByIdQuery } from "../../redux/features/property/propertyApi";
import { mediaSrc } from "../../utils/mediaSrc";
import { STATUS_COLOUR, money, typeLabel } from "./propertyMeta";

const PropertyDetails = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { data: p, isLoading } = useGetPropertyByIdQuery(id, { skip: !id });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spin />
      </div>
    );
  }

  if (!p) return null;

  return (
    <div>
      <PageMeta title={`${p.title} · Zoom Property Admin`} noindex />
      <PageHeader
        title={p.title}
        subtitle={`${p.referenceNo} · ${typeLabel(p.type)}${
          p.area?.name ? ` · ${p.area.name}` : ""
        }`}
        breadcrumbs={[
          { title: "Dashboard", path: "/" },
          { title: "Listings", path: "/properties" },
          { title: p.referenceNo },
        ]}
        extra={
          <PermissionGate module="Properties" action="Update">
            <Button
              type="primary"
              icon={<Edit className="h-4 w-4" />}
              onClick={() => navigate(`/properties/edit/${id}`)}
            >
              Edit
            </Button>
          </PermissionGate>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {(p.coverImage || (p.images || []).length > 0) && (
            <div className="rounded-xl border border-secondary-100 bg-white p-4">
              <Image.PreviewGroup>
                {p.coverImage && (
                  <Image
                    src={mediaSrc(p.coverImage)}
                    alt={p.title}
                    className="rounded-lg"
                  />
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  {(p.images || []).map((img: any) => (
                    <Image
                      key={img._id}
                      src={mediaSrc(img)}
                      alt=""
                      width={96}
                      height={72}
                      style={{ objectFit: "cover", borderRadius: 6 }}
                    />
                  ))}
                </div>
              </Image.PreviewGroup>
            </div>
          )}

          <div className="rounded-xl border border-secondary-100 bg-white p-5">
            <Descriptions
              column={{ xs: 1, sm: 2 }}
              size="small"
              items={[
                {
                  key: "status",
                  label: "Status",
                  children: (
                    <Tag color={STATUS_COLOUR[p.status]}>{p.status}</Tag>
                  ),
                },
                {
                  key: "purpose",
                  label: "Purpose",
                  children: p.purpose === "rent" ? "To rent" : "For sale",
                },
                {
                  key: "price",
                  label: p.purpose === "rent" ? "Rent" : "Price",
                  children: `৳ ${money(p.price)}${
                    p.purpose === "rent" ? " / month" : ""
                  }`,
                },
                {
                  key: "size",
                  label: "Size",
                  children: `${money(p.size)} sq ft`,
                },
                { key: "beds", label: "Beds", children: p.beds ?? "—" },
                { key: "baths", label: "Baths", children: p.baths ?? "—" },
                { key: "floor", label: "Floor", children: p.floor || "—" },
                {
                  key: "furnishing",
                  label: "Furnishing",
                  children: p.furnishing || "—",
                },
                {
                  key: "rajuk",
                  label: "RAJUK approved",
                  children: p.rajukApproved ? "Yes" : "No",
                },
                {
                  key: "handover",
                  label: "Handover",
                  children: p.handover || "—",
                },
                {
                  key: "project",
                  label: "Project",
                  children: p.project?.name || "—",
                },
                { key: "views", label: "Views", children: p.views ?? 0 },
              ]}
            />
          </div>

          {(p.description || []).length > 0 && (
            <div className="rounded-xl border border-secondary-100 bg-white p-5">
              <h3 className="mb-2 text-sm font-semibold text-secondary-700">
                Description
              </h3>
              {(p.description || []).map((para: string, i: number) => (
                <p key={i} className="mb-2 text-sm leading-6 text-secondary-600">
                  {para}
                </p>
              ))}
            </div>
          )}

          {(p.amenities || []).length > 0 && (
            <div className="rounded-xl border border-secondary-100 bg-white p-5">
              <h3 className="mb-2 text-sm font-semibold text-secondary-700">
                Amenities
              </h3>
              <div className="flex flex-wrap gap-2">
                {(p.amenities || []).map((a: any) => (
                  <Tag key={a._id}>{a.name}</Tag>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <RecordHistory entity="Property" id={id} />
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
