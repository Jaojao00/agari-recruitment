"use client";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Application } from "@/lib/firebase/models";
import Link from "next/link";

export default function ExpiredPage() {
  const [data, setData] = useState<Application[]>([]);

  useEffect(() => {
    fetch("/api/admin/applications?status=EXPIRED")
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((json) => {
        if (json.data) setData(json.data);
      })
      .catch((error) =>
        console.error("Failed to load expired applications:", error),
      );
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold">Hồ sơ đã hết hạn</h1>
        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
          Cảnh báo: Hồ sơ đã hết hạn
        </span>
      </div>
      <div className="bg-white p-4 border rounded shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã hồ sơ</TableHead>
              <TableHead>Họ tên</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày hết hạn</TableHead>
              <TableHead>Chi tiết</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((app) => (
              <TableRow key={app.id}>
                <TableCell className="font-medium text-red-700">
                  {app.applicationId}
                </TableCell>
                <TableCell>{app.fullName}</TableCell>
                <TableCell>Hết hạn</TableCell>
                <TableCell>
                  {app.expiredAt
                    ? new Date(
                        app.expiredAt._seconds * 1000,
                      ).toLocaleDateString("vi-VN")
                    : "-"}
                </TableCell>
                <TableCell>
                  <Link href={`/admin/applications/${app.id}`}>
                    <Button variant="outline" size="sm">
                      Xem
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
