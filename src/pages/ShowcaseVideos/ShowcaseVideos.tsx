import { Button, Input, Modal, Space, Switch, Tag, Tooltip } from "antd";
import { Edit, Play, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

import PageHeader from "../../components/Common/PageHeader";
import PageMeta from "../../components/Common/PageMeta";
import PermissionGate from "../../components/Common/PermissionGate";
import DataTable from "../../components/Table/DataTable";
import { mediaSrc } from "../../utils/mediaSrc";
import {
  useDeleteShowcaseVideoMutation,
  useGetShowcaseVideosQuery,
  useUpdateShowcaseVideoMutation,
} from "../../redux/features/showcaseVideo/showcaseVideoApi";
import ShowcaseVideoModal from "./ShowcaseVideoModal";

const { confirm } = Modal;

/**
 * The films on the home page carousel.
 *
 * Publishing is its own column rather than a field inside the form: putting a
 * film on the website is a different act from describing it, and the log
 * records who did it.
 */
const ShowcaseVideos = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const { data, isFetching } = useGetShowcaseVideosQuery({
    page,
    limit,
    searchTerm: search || undefined,
  });
  const [updateVideo] = useUpdateShowcaseVideoMutation();
  const [deleteVideo] = useDeleteShowcaseVideoMutation();

  const rows = data?.result ?? [];
  const total = data?.meta?.total ?? 0;

  const onDelete = (id: string, title: string) =>
    confirm({
      title: "Delete this video?",
      content: `"${title}" will be removed from the carousel.`,
      okText: "Yes, delete",
      okType: "danger",
      onOk: async () => {
        try {
          await deleteVideo(id).unwrap();
          toast.success("Video deleted");
        } catch (e: any) {
          toast.error(e?.data?.message || "Could not delete the video");
        }
      },
    });

  const columns = [
    {
      title: "Film",
      dataIndex: "title",
      key: "title",
      render: (title: string, r: any) => (
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative h-11 w-20 shrink-0 overflow-hidden rounded bg-secondary-100">
            {mediaSrc(r.poster) ? (
              <img
                src={mediaSrc(r.poster)}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <Play className="absolute inset-0 m-auto h-4 w-4 text-secondary-300" />
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium text-secondary-800">{title}</p>
            <p className="truncate text-xs text-secondary-500">
              {r.category ? `${r.category} · ` : ""}
              {r.location || "—"}
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      width: 100,
      align: "center" as const,
      render: (v: string) => v || "—",
    },
    {
      title: "Order",
      dataIndex: "order",
      key: "order",
      width: 80,
      align: "center" as const,
    },
    {
      title: "Home",
      dataIndex: "isHome",
      key: "isHome",
      width: 90,
      align: "center" as const,
      render: (isHome: boolean) =>
        isHome ? <Tag color="blue">Home</Tag> : <span className="text-secondary-300">—</span>,
    },
    {
      title: "Published",
      dataIndex: "isPublished",
      key: "isPublished",
      width: 110,
      render: (published: boolean, r: any) => (
        <PermissionGate
          module="Showcase Videos"
          action="Update"
          fallback={<span>{published ? "Yes" : "No"}</span>}
        >
          <Switch
            size="small"
            checked={published}
            onChange={() =>
              updateVideo({ id: r._id, data: { isPublished: !published } })
            }
          />
        </PermissionGate>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right" as const,
      width: 120,
      render: (_: unknown, r: any) => (
        <Space>
          <PermissionGate module="Showcase Videos" action="Update">
            <Tooltip title="Edit">
              <Button
                icon={<Edit className="h-4 w-4" />}
                onClick={() => {
                  setEditing(r);
                  setOpen(true);
                }}
              />
            </Tooltip>
          </PermissionGate>
          <PermissionGate module="Showcase Videos" action="Delete">
            <Tooltip title="Delete">
              <Button
                danger
                icon={<Trash2 className="h-4 w-4" />}
                onClick={() => onDelete(r._id, r.title)}
              />
            </Tooltip>
          </PermissionGate>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <PageMeta
        title="Showcase videos · Zoom Property Admin"
        description="The films on the home page video carousel."
        noindex
      />
      <PageHeader
        title="Showcase videos"
        subtitle="The films on the home page carousel"
        breadcrumbs={[
          { title: "Dashboard", path: "/" },
          { title: "Showcase videos" },
        ]}
        extra={
          <PermissionGate module="Showcase Videos" action="Create">
            <Button
              type="primary"
              icon={<Plus className="h-4 w-4" />}
              onClick={() => {
                setEditing(null);
                setOpen(true);
              }}
            >
              Add video
            </Button>
          </PermissionGate>
        }
      />

      <div className="mb-6">
        <Input
          allowClear
          placeholder="Search by title, category or location"
          prefix={<Search className="h-4 w-4 text-gray-400" />}
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="max-w-sm"
        />
      </div>

      <DataTable
        data={rows}
        columns={columns as any}
        currentPage={page}
        setCurrentPage={setPage}
        limit={limit}
        setLimit={setLimit}
        total={total}
        isPaginate={total > limit}
        loading={isFetching}
        rowKey="_id"
      />

      <ShowcaseVideoModal
        open={open}
        video={editing}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
      />
    </div>
  );
};

export default ShowcaseVideos;
