"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import {
  applicationSchema,
  ApplicationFormValues,
  normalizeApplicationPayload,
} from "@/lib/validation/application";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2, MapPin } from "lucide-react";

interface Location {
  id: string;
  name: string;
  address?: string;
}

const jobOptions = {
  "warehouse-rotating-shift": {
    title: "Nhân viên kho - Ca xoay",
    schedule: "Ca xoay theo lịch công ty",
  },
  "spx-fulltime": {
    title: "Nhân viên kho SPX Full-time",
    schedule: "Ca cố định: 06:00 - 15:00, 13:00 - 22:00 hoặc 22:00 - 06:00",
  },
  "agari-part-time": {
    title: "Lao động phổ thông AGARI Part-time",
    schedule: "Đăng ký lịch làm việc linh hoạt theo tuần",
  },
} as const;

const defaultLocations: Location[] = [
  {
    id: "default-sw-soc-binh-minh",
    name: "SW SOC - KCN BÌNH MINH VINH LONG",
  },
  {
    id: "default-flm-binh-tan",
    name: "FLM - BÌNH TAN, TP HCM",
  },
];

function normalizeLocationName(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

async function readJsonResponse<T>(response: Response): Promise<T> {
  const body = await response.text();

  if (!body.trim()) {
    throw new Error(`Máy chủ không trả về dữ liệu (HTTP ${response.status}).`);
  }

  try {
    return JSON.parse(body) as T;
  } catch {
    throw new Error(
      `Máy chủ trả về dữ liệu không hợp lệ (HTTP ${response.status}).`,
    );
  }
}

export default function UngTuyenPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locations, setLocations] = useState<Location[]>(defaultLocations);
  const [locationsLoading, setLocationsLoading] = useState(true);
  const [jobId, setJobId] = useState<keyof typeof jobOptions>(
    "warehouse-rotating-shift",
  );

  useEffect(() => {
    fetch("/api/locations")
      .then((response) =>
        readJsonResponse<{ locations?: Location[] }>(response),
      )
      .then(({ locations: fetchedLocations = [] }) => {
        const knownNames = new Set<string>();
        const mergedLocations = [
          ...defaultLocations,
          ...fetchedLocations,
        ].filter((location) => {
          const normalizedName = normalizeLocationName(location.name);
          if (!normalizedName || knownNames.has(normalizedName)) return false;
          knownNames.add(normalizedName);
          return true;
        });
        setLocations(mergedLocations);
      })
      .catch(() => {
        setLocations(defaultLocations);
      })
      .finally(() => setLocationsLoading(false));
  }, []);

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      fullName: "",
      cccd: "",
      phone: "",
      permanentAddress: "",
      preferredLocation: "",
      note: "",
      opsCode: "",
      jobId: "warehouse-rotating-shift",
      jobTitle: jobOptions["warehouse-rotating-shift"].title,
      workSchedule: jobOptions["warehouse-rotating-shift"].schedule,
    },
  });

  useEffect(() => {
    const requestedJob = new URLSearchParams(window.location.search).get("job");
    if (requestedJob === "spx-fulltime" || requestedJob === "agari-part-time") {
      const timer = window.setTimeout(() => {
        setJobId(requestedJob);
        form.setValue("jobId", requestedJob);
        form.setValue("jobTitle", jobOptions[requestedJob].title);
        form.setValue("workSchedule", "");
      }, 0);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [form]);

  async function onSubmit(data: ApplicationFormValues) {
    if (
      (jobId === "spx-fulltime" || jobId === "agari-part-time") &&
      !data.workSchedule
    ) {
      setError("Vui lòng chọn ca cố định muốn đăng ký.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const payload = normalizeApplicationPayload(data);
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await readJsonResponse<{
        error?: string;
        applicationId?: string;
      }>(response);

      if (!response.ok) {
        throw new Error(result.error || "Có lỗi xảy ra. Vui lòng thử lại.");
      }

      // Redirect to success page with application ID
      router.push(`/thong-bao-thanh-cong?id=${result.applicationId}`);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Có lỗi xảy ra. Vui lòng thử lại.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex items-center">
          <Link
            href="/"
            className="text-red-700 flex items-center gap-2 hover:underline font-medium"
          >
            <ArrowLeft size={16} /> Về trang chủ
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-red-700 p-6 text-center text-white">
            <h1 className="text-2xl font-bold uppercase">
              Điền Thông Tin Ứng Tuyển
            </h1>
            <p className="text-red-100 mt-2 text-sm">
              Vui lòng điền đầy đủ và chính xác thông tin bên dưới
            </p>
            <div className="mt-4 rounded-lg bg-white/15 px-4 py-3 text-left">
              <p className="text-xs uppercase text-red-100">Vị trí ứng tuyển</p>
              <p className="font-bold">{jobOptions[jobId].title}</p>
              <p className="text-sm text-red-100">
                {jobOptions[jobId].schedule}
              </p>
            </div>
          </div>

          <div className="p-6 md:p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ và tên *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập họ và tên của bạn"
                          {...field}
                          className="h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày - Tháng - Năm sinh *</FormLabel>
                      <FormControl>
                        {/* Using simple date input for mobile optimization */}
                        <Input
                          type="date"
                          {...field}
                          className="h-12 block w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="cccd"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số CCCD *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Nhập 12 số CCCD"
                            {...field}
                            className="h-12"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số điện thoại Zalo *</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="Nhập số điện thoại"
                            {...field}
                            className="h-12"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className={`grid gap-6 ${(jobId === "warehouse-rotating-shift" || jobId === "spx-fulltime") ? "md:grid-cols-2" : ""}`}>
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Giới tính *</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex space-x-6"
                          >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="Nam" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                Nam
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="Nữ" />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                Nữ
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {(jobId === "warehouse-rotating-shift" || jobId === "spx-fulltime") && (
                    <FormField
                      control={form.control}
                      name="opsCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mã Ops của nhân viên <span className="text-muted-foreground font-normal italic text-xs">(Tùy chọn)</span></FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nhập mã Ops (không bắt buộc)"
                              {...field}
                              value={field.value || ""}
                              className="h-12"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                <FormField
                  control={form.control}
                  name="permanentAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Địa chỉ *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập địa chỉ hiện tại của bạn"
                          {...field}
                          className="h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="preferredLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        <MapPin size={14} className="text-red-600" />
                        Khu vực muốn ứng tuyển *
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={locationsLoading}
                        >
                          <SelectTrigger className="h-auto min-h-12 w-full whitespace-normal">
                            <SelectValue
                              className="whitespace-normal break-words line-clamp-none"
                              placeholder={
                                locationsLoading
                                  ? "Đang tải danh sách khu vực..."
                                  : "Chọn khu vực muốn ứng tuyển"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent className="max-w-[calc(100vw-2rem)]">
                            {locations.map((location) => (
                              <SelectItem
                                key={location.id}
                                value={location.name}
                                className="whitespace-normal py-2"
                              >
                                <span className="whitespace-normal break-words">
                                  {location.name}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {jobId === "spx-fulltime" || jobId === "agari-part-time" ? (
                  <FormField
                    control={form.control}
                    name="workSchedule"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ca muốn đăng ký *</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger className="h-12 w-full">
                              <SelectValue placeholder="Chọn ca cố định" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="w-[min(30rem,calc(100vw-2rem))]">
                            <SelectItem value="Ca 1: 06:00 - 15:00">
                              Ca 1 · 06:00 - 15:00 · 250.000 VNĐ/ca
                            </SelectItem>
                            <SelectItem value="Ca 2: 13:00 - 22:00">
                              Ca 2 · 13:00 - 22:00 · 250.000 VNĐ/ca
                            </SelectItem>
                            <SelectItem value="Ca 3: 22:00 - 06:00">
                              Ca 3 · 22:00 - 06:00 · 300.000 VNĐ/ca
                            </SelectItem>
                            {jobId === "agari-part-time" ? (
                              <>
                                <SelectItem value="Ca 4: 18:00 - 22:00">
                                  Ca 4 · 18:00 - 22:00 · 125.000 VNĐ/ca
                                </SelectItem>
                                <SelectItem value="Ca 5: 06:00 - 11:00">
                                  Ca 5 · 06:00 - 11:00 · 155.000 VNĐ/ca
                                </SelectItem>
                              </>
                            ) : null}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : null}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                  <FormField
                    control={form.control}
                    name="education"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trình độ học vấn *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Chọn trình độ học vấn" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="9/12">9/12</SelectItem>
                            <SelectItem value="12/12">12/12</SelectItem>
                            <SelectItem value="Đã Tốt Nghiệp">
                              Đã Tốt Nghiệp
                            </SelectItem>
                            <SelectItem value="Khác">Khác</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="preferredShift"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Dành cho ứng viên mới *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-auto min-h-12 w-full whitespace-normal">
                              <SelectValue
                                className="whitespace-normal break-words line-clamp-none"
                                placeholder="Chọn kinh nghiệm làm việc liên quan đến vị trí ứng tuyển"
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-w-[calc(100vw-2rem)]">
                            <SelectItem
                              value="Tôi Đã Từng làm việc dưới 1 tháng"
                              className="whitespace-normal py-2"
                            >
                              Tôi Đã Từng làm việc dưới 1 tháng
                            </SelectItem>
                            <SelectItem
                              value="Tôi Đã Từng làm việc từ 1 tháng trở lên"
                              className="whitespace-normal py-2"
                            >
                              Tôi Đã Từng làm việc từ 1 tháng trở lên
                            </SelectItem>
                            <SelectItem
                              value="Tôi chưa từng làm việc liên quan đến vị trí ứng tuyển"
                              className="whitespace-normal py-2"
                            >
                              Tôi chưa từng làm việc liên quan đến vị trí ứng
                              tuyển
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="availableStartDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày có thể nhận Việc *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} className="h-12" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ghi chú (không bắt buộc)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Nhập ghi chú khác (nếu có)"
                          {...field}
                          className="min-h-[100px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-14 text-lg font-bold bg-red-700 hover:bg-red-800 text-white rounded-full mt-8"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      ĐANG GỬI HỒ SƠ...
                    </>
                  ) : (
                    "GỬI HỒ SƠ ỨNG TUYỂN"
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
