'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-form-hooks'; // Wait, I use react-hook-form
import { useForm as useReactHookForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { applicationSchema, ApplicationFormValues } from '@/lib/validation/application';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Loader2 } from 'lucide-react';
// Note: Shadcn form needs these to be installed correctly.

export default function UngTuyenPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useReactHookForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      fullName: '',
      cccd: '',
      phone: '',
      permanentAddress: '',
      note: '',
    },
  });

  async function onSubmit(data: ApplicationFormValues) {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Có lỗi xảy ra. Vui lòng thử lại.');
      }

      // Redirect to success page with application ID
      router.push(`/thong-bao-thanh-cong?id=${result.applicationId}`);
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex items-center">
          <Link href="/" className="text-red-700 flex items-center gap-2 hover:underline font-medium">
            <ArrowLeft size={16} /> Về trang chủ
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-red-700 p-6 text-center text-white">
            <h1 className="text-2xl font-bold uppercase">Điền Thông Tin Ứng Tuyển</h1>
            <p className="text-red-100 mt-2 text-sm">Vui lòng điền đầy đủ và chính xác thông tin bên dưới</p>
          </div>

          <div className="p-6 md:p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ và tên *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập họ và tên của bạn" {...field} className="h-12" />
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
                        <Input type="date" {...field} className="h-12 block w-full" />
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
                          <Input type="number" placeholder="Nhập 12 số CCCD" {...field} className="h-12" />
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
                          <Input type="tel" placeholder="Nhập số điện thoại" {...field} className="h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

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
                            <FormLabel className="font-normal cursor-pointer">Nam</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Nữ" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">Nữ</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="permanentAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Địa chỉ thường trú *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Vui lòng ghi địa chỉ thường trú theo Căn cước công dân của bạn" 
                          {...field} 
                          className="min-h-[100px] resize-y"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                  <FormField
                    control={form.control}
                    name="education"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trình độ học vấn *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Chọn trình độ học vấn" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="9/12">9/12</SelectItem>
                            <SelectItem value="10/12">10/12</SelectItem>
                            <SelectItem value="11/12">11/12</SelectItem>
                            <SelectItem value="12/12">12/12</SelectItem>
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
                      <FormItem>
                        <FormLabel>Ca làm việc mong muốn *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Chọn ca làm việc" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Ca 1: 06:00 - 15:00">Ca 1: 06:00 - 15:00</SelectItem>
                            <SelectItem value="Ca 2: 15:00 - 22:00">Ca 2: 15:00 - 22:00</SelectItem>
                            <SelectItem value="Ca 3: 18:00 - 22:00">Ca 3: 18:00 - 22:00</SelectItem>
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
                      <FormLabel>Ngày có thể nhận việc *</FormLabel>
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
                    'GỬI HỒ SƠ ỨNG TUYỂN'
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
