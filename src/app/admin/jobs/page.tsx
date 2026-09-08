"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle2,
  Edit3,
  Eye,
  EyeOff,
  Loader2,
  Plus,
  Trash2,
  X,
} from "lucide-react";

type Job = {
  id: string;
  title: string;
  company?: string;
  location: string;
  salary?: string;
  schedule?: string;
  description: string;
  requirements?: string;
  benefits?: string;
  imageUrl?: string;
  applicationUrl?: string;
  isPublished: boolean;
};

type JobForm = Omit<Job, "id" | "isPublished"> & { isPublished: boolean };

const DEFAULT_JOB_IMAGE = "/job-default.svg";

const emptyForm: JobForm = {
  title: "",
  company: "",
  location: "",
  salary: "",
  schedule: "",
  description: "",
  requirements: "",
  benefits: "",
  imageUrl: DEFAULT_JOB_IMAGE,
  applicationUrl: "/ung-tuyen",
  isPublished: true,
};

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [form, setForm] = useState<JobForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/jobs");
      const body = await response.text();
      let result: { jobs?: Job[]; error?: string } = {};
      if (body.trim()) {
        result = JSON.parse(body) as { jobs?: Job[]; error?: string };
      }
      if (!response.ok) {
        throw new Error(
          result.error ||
            `Không thể tải danh sách tin (HTTP ${response.status}).`,
        );
      }
      setJobs(result.jobs || []);
    } catch (error) {
      console.error("Load jobs error:", error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => void fetchJobs(), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const updateField = (field: keyof JobForm, value: string | boolean) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (job: Job) => {
    setEditingId(job.id);
    setForm({
      title: job.title,
      company: job.company || "",
      location: job.location,
      salary: job.salary || "",
      schedule: job.schedule || "",
      description: job.description,
      requirements: job.requirements || "",
      benefits: job.benefits || "",
      imageUrl: job.imageUrl || DEFAULT_JOB_IMAGE,
      applicationUrl: job.applicationUrl || "/ung-tuyen",
      isPublished: job.isPublished,
    });
    setShowForm(true);
  };

  const saveJob = async () => {
    if (
      !form.title.trim() ||
      !form.location.trim() ||
      !form.description.trim()
    ) {
      alert("Vui lòng nhập tiêu đề, địa điểm và mô tả công việc.");
      return;
    }
    setSaving(true);
    try {
      const response = await fetch(
        editingId ? `/api/admin/jobs/${editingId}` : "/api/admin/jobs",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        },
      );
      const responseBody = await response.text();
      let responseResult: { error?: string } = {};
      if (responseBody.trim()) {
        responseResult = JSON.parse(responseBody) as { error?: string };
      }
      if (!response.ok) {
        throw new Error(
          responseResult.error || "Không thể lưu tin tuyển dụng.",
        );
      }
      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);
      await fetchJobs();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Có lỗi xảy ra.");
    } finally {
      setSaving(false);
    }
  };

  const togglePublished = async (job: Job) => {
    await fetch(`/api/admin/jobs/${job.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: !job.isPublished }),
    });
    await fetchJobs();
  };

  const deleteJob = async (job: Job) => {
    if (!confirm(`Xoá tin “${job.title}”?`)) return;
    await fetch(`/api/admin/jobs/${job.id}`, { method: "DELETE" });
    await fetchJobs();
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Quản lý tin tuyển dụng
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Tạo, cập nhật và kiểm soát trạng thái các tin đang tuyển.
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="bg-red-700 text-white hover:bg-red-800"
        >
          <Plus size={16} className="mr-2" /> Đăng tin mới
        </Button>
      </div>

      {showForm ? (
        <Card className="border-red-200">
          <CardHeader className="flex flex-row items-center justify-between border-b bg-red-50">
            <CardTitle>
              {editingId
                ? "Chỉnh sửa tin tuyển dụng"
                : "Đăng tin tuyển dụng mới"}
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowForm(false)}
              title="Đóng form"
            >
              <X size={18} />
            </Button>
          </CardHeader>
          <CardContent className="grid gap-4 p-5 md:grid-cols-2">
            <label className="space-y-1 text-sm font-medium">
              Tiêu đề tin *
              <Input
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="Ví dụ: Nhân viên kho SPX Full-time"
              />
            </label>
            <label className="space-y-1 text-sm font-medium">
              Đơn vị tuyển dụng
              <Input
                value={form.company}
                onChange={(e) => updateField("company", e.target.value)}
                placeholder="Ví dụ: AGARI / SPX"
              />
            </label>
            <label className="space-y-1 text-sm font-medium">
              Địa điểm *
              <Input
                value={form.location}
                onChange={(e) => updateField("location", e.target.value)}
                placeholder="KCN Bình Minh, Vĩnh Long"
              />
            </label>
            <label className="space-y-1 text-sm font-medium">
              Mức lương
              <Input
                value={form.salary}
                onChange={(e) => updateField("salary", e.target.value)}
                placeholder="250.000 - 300.000 VNĐ/ca"
              />
            </label>
            <label className="space-y-1 text-sm font-medium">
              Ca làm việc
              <Input
                value={form.schedule}
                onChange={(e) => updateField("schedule", e.target.value)}
                placeholder="Ca 1, Ca 2 hoặc Ca 3"
              />
            </label>
            <label className="space-y-1 text-sm font-medium">
              Link ảnh đại diện (tuỳ chọn)
              <Input
                value={form.imageUrl}
                onChange={(e) => updateField("imageUrl", e.target.value)}
                placeholder="Mặc định: ảnh AGARI tuyển dụng miền Tây"
              />
              <span className="text-xs font-normal text-gray-500">
                Để trống sẽ tự dùng ảnh mặc định theo mẫu tuyển dụng.
              </span>
            </label>
            <label className="space-y-1 text-sm font-medium md:col-span-2">
              Link trang ứng tuyển
              <Input
                value={form.applicationUrl}
                onChange={(e) => updateField("applicationUrl", e.target.value)}
                placeholder="/ung-tuyen?job=spx-fulltime"
              />
            </label>
            <label className="space-y-1 text-sm font-medium md:col-span-2">
              Mô tả công việc *
              <Textarea
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Mỗi ý một dòng"
                className="min-h-28"
              />
            </label>
            <label className="space-y-1 text-sm font-medium">
              Yêu cầu ứng viên
              <Textarea
                value={form.requirements}
                onChange={(e) => updateField("requirements", e.target.value)}
                placeholder="Mỗi yêu cầu một dòng"
                className="min-h-28"
              />
            </label>
            <label className="space-y-1 text-sm font-medium">
              Quyền lợi
              <Textarea
                value={form.benefits}
                onChange={(e) => updateField("benefits", e.target.value)}
                placeholder="Mỗi quyền lợi một dòng"
                className="min-h-28"
              />
            </label>
            <label className="flex items-center gap-2 text-sm font-medium md:col-span-2">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(e) => updateField("isPublished", e.target.checked)}
              />{" "}
              Đăng tin ngay sau khi lưu
            </label>
            <div className="flex gap-2 md:col-span-2">
              <Button
                onClick={saveJob}
                disabled={saving}
                className="bg-red-700 text-white hover:bg-red-800"
              >
                {saving ? (
                  <Loader2 size={16} className="mr-2 animate-spin" />
                ) : (
                  <CheckCircle2 size={16} className="mr-2" />
                )}{" "}
                Lưu tin
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Huỷ
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="animate-spin text-gray-400" />
        </div>
      ) : jobs.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-gray-500">
            Chưa có tin tuyển dụng. Hãy đăng tin đầu tiên.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {jobs.map((job) => (
            <Card key={job.id} className={!job.isPublished ? "opacity-60" : ""}>
              <CardContent className="p-5">
                <div
                  className="mb-4 h-32 rounded-lg bg-cover bg-center"
                  style={{
                    backgroundImage: `url("${job.imageUrl || DEFAULT_JOB_IMAGE}")`,
                  }}
                />
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${job.isPublished ? "bg-green-500" : "bg-gray-400"}`}
                      />
                      <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        {job.isPublished ? "Đang đăng" : "Đang ẩn"}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">
                      {job.title}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      {job.company ? `${job.company} · ` : ""}
                      {job.location}
                    </p>
                  </div>
                  <span className="rounded-md bg-red-50 px-2 py-1 text-xs font-bold text-red-700">
                    {job.salary || "Chưa cập nhật lương"}
                  </span>
                </div>
                <p className="mt-4 line-clamp-3 whitespace-pre-line text-sm text-gray-600">
                  {job.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-2 border-t pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEdit(job)}
                  >
                    <Edit3 size={14} className="mr-1" /> Sửa
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => togglePublished(job)}
                  >
                    {job.isPublished ? (
                      <EyeOff size={14} className="mr-1" />
                    ) : (
                      <Eye size={14} className="mr-1" />
                    )}
                    {job.isPublished ? "Ẩn tin" : "Đăng lại"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600"
                    onClick={() => deleteJob(job)}
                  >
                    <Trash2 size={14} className="mr-1" /> Xoá
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
