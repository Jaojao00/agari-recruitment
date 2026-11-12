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
    title: "Nhân viên kho SPX Full-time (BPO Cố định) - [TẠM NGƯNG TUYỂN DỤNG]",
    schedule: "Tạm ngưng nhận hồ sơ (Đã đủ chỉ tiêu)",
    isPaused: true,
    pauseNotice:
      "Vị trí Full-time BPO Cố định tại kho SW SOC Vĩnh Long hiện đã đủ chỉ tiêu và đang tạm ngưng nhận hồ sơ. Vui lòng chọn vị trí Part-time hoặc tuyển dụng tại TP.HCM.",
  },
  "agari-part-time": {
    title: "Nhân viên kho part-time",
    schedule: "Đăng ký lịch làm việc linh hoạt theo tuần",
  },
  "lap-vo-dong-thap": {
    title: "Nhân sự kho phân loại - Đồng Tháp - [ĐÃ TUYỂN ĐỦ]",
    schedule: "Đã tuyển đủ chỉ tiêu đợt này",
    isPaused: true,
    pauseNotice:
      "Khu vực Đồng Tháp hiện đã tuyển đủ chỉ tiêu cho đợt tuyển dụng này.",
  },
  "thot-not-can-tho": {
    title: "Nhân viên kho Full-time (BPO) - Thốt Nốt - [ĐÃ TUYỂN ĐỦ]",
    schedule: "Đã tuyển đủ chỉ tiêu đợt này",
    isPaused: true,
    pauseNotice:
      "Khu vực Thốt Nốt, Cần Thơ hiện đã tuyển đủ chỉ tiêu cho đợt tuyển dụng này.",
  },
  "hcm-fulltime": {
    title: "Nhân viên chính thức kho SPX-Express - Khu vực TP.HCM",
    schedule: "Xoay ca (Luân chuyển giữa 5 ca làm việc chính)",
  },
  "hcm-binh-tan": {
    title: "Nhân viên chính thức kho SPX-Express - Quận Bình Tân (TP.HCM)",
    schedule: "Xoay ca (Luân chuyển giữa 5 ca làm việc chính)",
  },
  "hcm-tan-phu": {
    title: "Nhân viên chính thức kho SPX-Express - Quận Tân Phú (TP.HCM)",
    schedule: "Xoay ca (Luân chuyển giữa 5 ca làm việc chính)",
  },
} as const;

const hcmLocations = [
  "Quận Bình Tân (Tuyển chính): 754/8 Tân Kỳ Tân Quý, P. Bình Hưng Hòa B, Q. Bình Tân",
  "Quận Tân Phú (Tuyển chính): 549/32 Tân Kỳ Tân Quý, P. Bình Hưng Hòa B, Q. Bình Tân",
  "50-HCM | Tan Phu/Tan Quy Hub - Quận Tân Phú",
  "51-HCM | DS/Phu Dinh Hub - Phú Định (Quận 8)",
  "51-HCM | Binh Chanh/Vinh Loc A Hub - Huyện Bình Chánh",
  "52-HCM | SDD-01 Hub - Kho SDD-01",
  "51-HCM | Tan Phu/Tan Son Nhi Hub - Quận Tân Phú",
  "51-HCM | Tan Binh/Tan Son Hoa Hub - Quận Tân Bình",
  "51-HCM | Tan Binh/Tan Son Nhat Hub - Quận Tân Bình",
  "51-HCM | Binh Thanh/Phuong 12 Hub - Quận Bình Thạnh",
  "51-HCM | D12/Le Van Khuong Hub - Quận 12",
  "51-HCM | Hoc Mon/Thoi Tam Thon Hub - Huyện Hóc Môn",
  "51-HCM | Nha Be/Phuoc Kien Hub - Huyện Nhà Bè",
  "50-HCM | Can Gio Hub - Huyện Cần Giờ",
  "50-HCM | Binh Chanh/Vinh Loc Hub - Huyện Bình Chánh",
  "51-HCM | Binh Tan Binh Hung Hoa B Hub - Quận Bình Tân",
  "54-HCM | FM 01 Hub - Trạm FM 01",
  "51-HCM | D8/Pham The Hien Hub - Quận 8",
  "50-HCM | Phu Nhuan/Phuong 4 Hub - Quận Phú Nhuận",
];

function isHcmJob(jobId: string) {
  return (
    jobId === "hcm-fulltime" ||
    jobId === "hcm-binh-tan" ||
    jobId === "hcm-tan-phu"
  );
}

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
    "spx-fulltime",
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
      email: "",
      permanentAddress: "",
      preferredLocation: "",
      note: "",
      opsCode: "",
      jobId: "spx-fulltime",
      jobTitle: jobOptions["spx-fulltime"].title,
      workSchedule: "",
    },
  });

  useEffect(() => {
    // Tự động điền thông tin từ Hồ sơ Online đã lưu trên trình duyệt (nếu có)
    try {
      const savedRaw = window.localStorage.getItem("agari_candidate_profile");
      if (savedRaw) {
        const saved = JSON.parse(savedRaw);
        if (saved.fullName) form.setValue("fullName", saved.fullName);
        if (saved.phone) form.setValue("phone", saved.phone);
        if (saved.email) form.setValue("email", saved.email);
        if (saved.cccd) form.setValue("cccd", saved.cccd);
        if (saved.dateOfBirth) form.setValue("dateOfBirth", saved.dateOfBirth);
        if (saved.gender === "Nam" || saved.gender === "Nữ") {
          form.setValue("gender", saved.gender);
        }
        if (saved.opsCode) form.setValue("opsCode", saved.opsCode);
        if (saved.permanentAddress) {
          form.setValue("permanentAddress", saved.permanentAddress);
        }
        if (saved.education) form.setValue("education", saved.education);
        if (saved.preferredShift) {
          form.setValue("preferredShift", saved.preferredShift);
        }
        if (saved.availableStartDate) {
          form.setValue("availableStartDate", saved.availableStartDate);
        }
      }
    } catch {
      // ignore
    }

    const requestedJob = new URLSearchParams(window.location.search).get("job");
    if (requestedJob && requestedJob in jobOptions) {
      const validJob = requestedJob as keyof typeof jobOptions;
      const timer = window.setTimeout(() => {
        setJobId(validJob);
        form.setValue("jobId", validJob);
        form.setValue("jobTitle", jobOptions[validJob].title);
        if (validJob === "hcm-binh-tan") {
          form.setValue("preferredLocation", hcmLocations[0]);
          form.setValue("workSchedule", "Xoay ca luân chuyển (5 ca làm việc chính)");
        } else if (validJob === "hcm-tan-phu") {
          form.setValue("preferredLocation", hcmLocations[1]);
          form.setValue("workSchedule", "Xoay ca luân chuyển (5 ca làm việc chính)");
        } else if (validJob === "hcm-fulltime") {
          form.setValue("workSchedule", "Xoay ca luân chuyển (5 ca làm việc chính)");
        } else {
          form.setValue("workSchedule", "");
        }
      }, 0);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [form]);

  async function onSubmit(data: ApplicationFormValues) {
    const currentJobConfig = jobOptions[jobId] as { isPaused?: boolean; pauseNotice?: string };
    if (currentJobConfig?.isPaused) {
      setError(
        currentJobConfig.pauseNotice ||
          "Vị trí này hiện đã đủ chỉ tiêu và đang tạm ngưng nhận hồ sơ. Vui lòng chọn vị trí khác.",
      );
      return;
    }

    if (jobId !== "warehouse-rotating-shift" && !data.workSchedule) {
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

      try {
        window.localStorage.setItem(
          "agari_candidate_profile",
          JSON.stringify(payload),
        );
        window.dispatchEvent(new Event("agari-profile-updated"));
      } catch {
        // ignore
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
        <div className="mb-6 flex items-center justify-between gap-2">
          <Link
            href="/"
            className="text-red-700 flex items-center gap-2 hover:underline font-medium"
          >
            <ArrowLeft size={16} /> Về trang chủ
          </Link>
          <Link
            href="/ho-so-online"
            className="text-xs md:text-sm font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-3.5 py-1.5 rounded-full transition"
          >
            ⚡ Hồ sơ Online & Tra cứu trạng thái
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
              {"isPaused" in jobOptions[jobId] && (jobOptions[jobId] as { isPaused?: boolean; pauseNotice?: string }).isPaused && (
                <div className="mt-3 p-3 rounded-lg bg-amber-400 text-slate-900 font-bold text-xs shadow-xs">
                  ⚠️ {(jobOptions[jobId] as { pauseNotice?: string }).pauseNotice}
                </div>
              )}
              {(jobId === "warehouse-rotating-shift" || jobId === "spx-fulltime" || isHcmJob(jobId)) && (
                <p className="text-sm italic text-yellow-100 border-t border-white/20 mt-2 pt-2">
                  {isHcmJob(jobId)
                    ? "* Khu vực TP.HCM: Mang theo CCCD gắn chip khi tham gia phỏng vấn trực tiếp. Tối thiểu 23 công/tháng, nghỉ xoay tuần. (Nếu đã có mã Ops nhân viên vui lòng điền bên dưới)."
                    : "* Đối với các bạn nhân viên đã có mã nhân viên thì hãy điền vào nhé."}
                </p>
              )}
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

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Địa chỉ Gmail (để nhận thông báo kết quả & lịch phỏng vấn) *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Ví dụ: tenban@gmail.com"
                          {...field}
                          className="h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className={`grid gap-6 ${(jobId === "warehouse-rotating-shift" || jobId === "spx-fulltime" || isHcmJob(jobId)) ? "md:grid-cols-2" : ""}`}>
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

                  {(jobId === "warehouse-rotating-shift" || jobId === "spx-fulltime" || isHcmJob(jobId)) && (
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
                        {isHcmJob(jobId)
                          ? "Kho / Hub ứng tuyển tại TP.HCM *"
                          : "Khu vực muốn ứng tuyển *"}
                      </FormLabel>
                      {isHcmJob(jobId) && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                          <button
                            type="button"
                            onClick={() => field.onChange(hcmLocations[0])}
                            className={`text-left p-2.5 rounded-lg border text-xs transition-all ${
                              field.value === hcmLocations[0]
                                ? "bg-red-50 border-red-600 text-red-900 font-semibold ring-1 ring-red-600"
                                : "bg-gray-50 border-gray-200 text-gray-700 hover:border-red-300"
                            }`}
                          >
                            <div className="font-bold text-red-700">1. Quận Bình Tân (Tuyển chính - SL: 5)</div>
                            <div className="mt-0.5 text-[11px] text-gray-600">754/8 Tân Kỳ Tân Quý, P. Bình Hưng Hòa B</div>
                          </button>
                          <button
                            type="button"
                            onClick={() => field.onChange(hcmLocations[1])}
                            className={`text-left p-2.5 rounded-lg border text-xs transition-all ${
                              field.value === hcmLocations[1]
                                ? "bg-red-50 border-red-600 text-red-900 font-semibold ring-1 ring-red-600"
                                : "bg-gray-50 border-gray-200 text-gray-700 hover:border-red-300"
                            }`}
                          >
                            <div className="font-bold text-red-700">2. Quận Tân Phú (Tuyển chính - SL: 1)</div>
                            <div className="mt-0.5 text-[11px] text-gray-600">549/32 Tân Kỳ Tân Quý, P. Bình Hưng Hòa B</div>
                          </button>
                        </div>
                      )}
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={!isHcmJob(jobId) && locationsLoading}
                        >
                          <SelectTrigger className="h-auto min-h-12 w-full whitespace-normal">
                            <SelectValue
                              className="whitespace-normal break-words line-clamp-none"
                              placeholder={
                                !isHcmJob(jobId) && locationsLoading
                                  ? "Đang tải danh sách khu vực..."
                                  : isHcmJob(jobId)
                                    ? "Chọn địa điểm phỏng vấn chính hoặc Hub SPX TP.HCM"
                                    : "Chọn khu vực muốn ứng tuyển"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent className="max-w-[calc(100vw-2rem)]">
                            {isHcmJob(jobId) ? (
                              hcmLocations.map((loc) => (
                                <SelectItem key={loc} value={loc} className="whitespace-normal py-2">
                                  <span className="whitespace-normal break-words">{loc}</span>
                                </SelectItem>
                              ))
                            ) : jobId === "thot-not-can-tho" ? (
                              ["78-CTO Co Do 02 Hub: Ấp Tân Lợi 1, Xã Thuận Hưng, Huyện Thốt Nốt, Cần Thơ."].map(loc => (
                                <SelectItem key={loc} value={loc} className="whitespace-normal py-2">
                                  <span className="whitespace-normal break-words">{loc}</span>
                                </SelectItem>
                              ))
                            ) : jobId === "lap-vo-dong-thap" ? (
                              ["71-DTP Cao Lanh 03 Hub", "71-DTP Lap Vo 02 Hub", "71-DTP Sa Dec Hub", "71-DTP Tan Binh Hub", "71-DTP Tan Thanh Hub"].map(loc => (
                                <SelectItem key={loc} value={loc} className="whitespace-normal py-2">
                                  <span className="whitespace-normal break-words">{loc}</span>
                                </SelectItem>
                              ))
                            ) : (
                              locations.map((location) => (
                                <SelectItem
                                  key={location.id}
                                  value={location.name}
                                  className="whitespace-normal py-2"
                                >
                                  <span className="whitespace-normal break-words">
                                    {location.name}
                                  </span>
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {jobId === "spx-fulltime" || jobId === "agari-part-time" || jobId === "lap-vo-dong-thap" || jobId === "thot-not-can-tho" || isHcmJob(jobId) ? (
                  <FormField
                    control={form.control}
                    name="workSchedule"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {isHcmJob(jobId)
                            ? "Chế độ xoay ca / Khung ca đăng ký (TP.HCM) *"
                            : "Ca muốn đăng ký *"}
                        </FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger className="h-12 w-full">
                              <SelectValue
                                placeholder={
                                  isHcmJob(jobId)
                                    ? "Chọn chế độ xoay ca (TP.HCM)"
                                    : jobId === "spx-fulltime"
                                      ? "Chọn ca cố định"
                                      : "Chọn ca đăng ký"
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="w-[min(30rem,calc(100vw-2rem))]">
                            {isHcmJob(jobId) ? (
                              <>
                                <SelectItem value="Xoay ca luân chuyển (5 ca làm việc chính)">
                                  Xoay ca luân chuyển (5 ca làm việc chính) • Theo phân công quản lý
                                </SelectItem>
                                <SelectItem value="Ca sáng sớm (Ca 1): 05:00 - 14:00">
                                  Ca sáng sớm (Ca 1) • 05:00 - 14:00
                                </SelectItem>
                                <SelectItem value="Ca trưa - chiều (Ca 2 & 3): 11:00 - 20:00 & 12:00 - 21:00">
                                  Ca trưa - chiều (Ca 2 & 3) • 11:00 - 20:00 & 12:00 - 21:00
                                </SelectItem>
                                <SelectItem value="Ca chiều - tối (Ca 4 & 5): 14:00 - 23:00 & 15:00 - 24:00">
                                  Ca chiều - tối (Ca 4 & 5) • 14:00 - 23:00 & 15:00 - 24:00
                                </SelectItem>
                              </>
                            ) : jobId === "thot-not-can-tho" ? (
                              <>
                                <SelectItem value="09:00 - 18:00 (Giờ hành chính)">
                                  09:00 - 18:00 (Giờ hành chính)
                                </SelectItem>
                              </>
                            ) : jobId === "lap-vo-dong-thap" ? (
                              <>
                                <SelectItem value="Ca Sáng: 08:00 - 12:00">
                                  Ca Sáng • 08:00 - 12:00 • 140.000 VNĐ/ca
                                </SelectItem>
                                <SelectItem value="Ca Chiều: 15:00 - 19:00">
                                  Ca Chiều • 15:00 - 19:00 • 140.000 VNĐ/ca
                                </SelectItem>
                                <SelectItem value="Làm cả 2 ca (Sáng & Chiều)">
                                  Làm cả 2 ca (Sáng & Chiều) • 280.000 VNĐ/ngày
                                </SelectItem>
                              </>
                            ) : (
                              <>
                                <SelectItem value="Ca 1: 06:00 - 15:00">
                                  Ca 1 • 06:00 - 15:00 • 250.000 VNĐ/ca
                                </SelectItem>
                                <SelectItem value="Ca 2: 13:00 - 22:00">
                                  Ca 2 • 13:00 - 22:00 • 250.000 VNĐ/ca
                                </SelectItem>
                                <SelectItem value="Ca 3: 22:00 - 06:00">
                                  Ca 3 • 22:00 - 06:00 • 300.000 VNĐ/ca
                                </SelectItem>
                                {jobId === "agari-part-time" ? (
                                  <>
                                    <SelectItem value="Ca 4: 18:00 - 22:00">
                                      Ca 4 • 18:00 - 22:00 • 125.000 VNĐ/ca
                                    </SelectItem>
                                    <SelectItem value="Ca 5: 06:00 - 11:00">
                                      Ca 5 • 06:00 - 11:00 • 155.000 VNĐ/ca
                                    </SelectItem>
                                  </>
                                ) : null}
                              </>
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : null}

                {jobId !== "lap-vo-dong-thap" && jobId !== "thot-not-can-tho" && (
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
                )}
                
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
                  className="w-full h-14 text-lg font-bold bg-red-700 hover:bg-red-800 text-white rounded-full mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={
                    isSubmitting ||
                    Boolean((jobOptions[jobId] as { isPaused?: boolean })?.isPaused)
                  }
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      ĐANG GỬI HỒ SƠ...
                    </>
                  ) : (jobOptions[jobId] as { isPaused?: boolean })?.isPaused ? (
                    "VỊ TRÍ NÀY ĐANG TẠM NGƯNG NHẬN HỒ SƠ"
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
