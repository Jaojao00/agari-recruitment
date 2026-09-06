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

export default function RecruitedPage() {
  const [data, setData] = useState<Application[]>([]);

  useEffect(() => {
    fetch("/api/admin/applications?status=HIRED")
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((json) => {
        if (json.data) setData(json.data);
      })
      .catch((error) =>
        console.error("Failed to load recruited applications:", error),
      );
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Danh sách đã trúng tuyển</h1>
      <div className="bg-white p-4 border rounded shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã hồ sơ</TableHead>
              <TableHead>Họ tên</TableHead>
              <TableHead>Ca làm</TableHead>
              <TableHead>Ngày trúng tuyển</TableHead>
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
                <TableCell>{app.preferredShift}</TableCell>
                <TableCell>
                  {app.hiredAt
                    ? new Date(app.hiredAt._seconds * 1000).toLocaleDateString(
                        "vi-VN",
                      )
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
