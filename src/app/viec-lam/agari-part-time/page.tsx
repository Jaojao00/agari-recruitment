"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Gift,
  MapPin,
  Phone,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const shifts = [
  ["06:00 - 15:00", "230.000 VNÄ/ca"],
  ["13:00 - 22:00", "230.000 VNÄ/ca"],
  ["22:00 - 06:00 Â· Ca Ä‘Ãªm", "280.000 VNÄ/ca"],
  ["18:00 - 22:00 Â· 4 tiáº¿ng", "125.000 VNÄ/ca"],
  ["06:00 - 11:00 Â· 5 tiáº¿ng", "155.000 VNÄ/ca"],
];

export default function AgariPartTimePage() {
  return (
    <div className="min-h-screen bg-[#fff8f5] pb-28 text-slate-900">
      <header className="border-b border-red-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-red-700"
          >
            <ArrowLeft size={17} /> Vá» trang tuyá»ƒn dá»¥ng
          </Link>
          <span className="text-right text-sm font-black uppercase tracking-tight text-[#d90012] md:text-base">
            AGARI - TUYá»‚N Dá»¤NG KV MIá»€N TÃ‚Y
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
        <section className="relative overflow-hidden rounded-3xl bg-[#e32620] px-6 py-12 text-white shadow-xl md:px-12 md:py-16">
          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full border-[26px] border-yellow-400/30" />
          <div className="relative max-w-3xl">
            <p className="inline-flex rounded-full bg-yellow-400 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-red-900">
              Æ¯u tiÃªn ngÆ°á»i Ä‘i lÃ m ngay
            </p>
            <h1 className="mt-5 text-4xl font-black uppercase leading-tight md:text-6xl">
              Lao Ä‘á»™ng phá»• thÃ´ng{" "}
              <span className="block text-yellow-300">Part-time</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-red-50 md:text-lg">
              ÄÄƒng kÃ½ lá»‹ch lÃ m viá»‡c linh hoáº¡t theo tuáº§n, cÃ´ng viá»‡c Ä‘Æ¡n giáº£n vÃ 
              Ä‘Æ°á»£c quáº£n lÃ½ hÆ°á»›ng dáº«n tá»« A-Z.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm font-semibold">
              <span className="inline-flex items-center gap-2 rounded-full bg-black/25 px-4 py-2">
                <MapPin size={16} /> KCN BÃ¬nh Minh, VÄ©nh Long
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-black/25 px-4 py-2">
                <Clock3 size={16} /> Nháº­n lÆ°Æ¡ng vÃ o thá»© 6
              </span>
            </div>
          </div>
        </section>

        <section className="-mt-6 relative z-10 grid gap-4 px-2 md:grid-cols-3 md:px-8">
          <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-lg">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Thu nháº­p theo ca
            </p>
            <p className="mt-2 text-2xl font-black text-red-700">
              125.000 - 280.000
            </p>
            <p className="text-sm text-slate-500">VNÄ / ca</p>
          </div>
          <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-lg">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Lá»‹ch lÃ m viá»‡c
            </p>
            <p className="mt-2 text-2xl font-black text-red-700">Linh hoáº¡t</p>
            <p className="text-sm text-slate-500">Ä‘Äƒng kÃ½ theo tuáº§n</p>
          </div>
          <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-lg">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Tráº£ lÆ°Æ¡ng
            </p>
            <p className="mt-2 text-2xl font-black text-red-700">Thá»© 6</p>
            <p className="text-sm text-slate-500">cá»§a tuáº§n káº¿ tiáº¿p</p>
          </div>
        </section>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="space-y-8">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-red-50 p-3 text-red-700">
                  <Clock3 size={22} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-red-700">
                    Thá»i gian & má»©c lÆ°Æ¡ng
                  </p>
                  <h2 className="text-2xl font-bold">
                    Chá»n lá»‹ch phÃ¹ há»£p má»—i tuáº§n
                  </h2>
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {shifts.map(([time, pay]) => (
                  <div
                    key={time}
                    className="flex items-center justify-between gap-3 rounded-xl border border-red-100 bg-red-50 p-4"
                  >
                    <span className="text-sm font-semibold text-slate-700">
                      Ca {time}
                    </span>
                    <span className="whitespace-nowrap font-black text-red-700">
                      {pay}
                    </span>
                  </div>
                ))}
              </div>
            </section>
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-yellow-50 p-3 text-yellow-700">
                  <Gift size={22} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-red-700">
                    Cháº¿ Ä‘á»™ lÆ°Æ¡ng hÃ ng tuáº§n
                  </p>
                  <h2 className="text-2xl font-bold">Cá»±c ká»³ uy tÃ­n</h2>
                </div>
              </div>
              <div className="space-y-4 text-sm leading-6 text-slate-600">
                <p className="flex gap-3">
                  <CheckCircle2
                    className="mt-1 shrink-0 text-green-600"
                    size={18}
                  />
                  Chá»‘t cÃ´ng lÃ m viá»‡c tá»« Thá»© 2 Ä‘áº¿n Chá»§ nháº­t háº±ng tuáº§n.
                </p>
                <p className="flex gap-3">
                  <CheckCircle2
                    className="mt-1 shrink-0 text-green-600"
                    size={18}
                  />
                  Nháº­n lÆ°Æ¡ng Ä‘á»u Ä‘áº·n vÃ o Thá»© 6 tuáº§n káº¿ tiáº¿p.
                </p>
              </div>
            </section>
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
                  <CheckCircle2 size={22} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-red-700">
                    MÃ´ táº£ cÃ´ng viá»‡c
                  </p>
                  <h2 className="text-2xl font-bold">CÃ´ng viá»‡c Ä‘Æ¡n giáº£n</h2>
                </div>
              </div>
              <ul className="space-y-4 text-sm leading-6 text-slate-600">
                <li className="flex gap-3">
                  <CheckCircle2
                    className="mt-1 shrink-0 text-red-600"
                    size={18}
                  />
                  Há»— trá»£ lÃªn/xuá»‘ng hÃ ng hÃ³a.
                </li>
                <li className="flex gap-3">
                  <CheckCircle2
                    className="mt-1 shrink-0 text-red-600"
                    size={18}
                  />
                  QuÃ©t mÃ£ Ä‘Æ¡n hÃ ng vÃ  phÃ¢n loáº¡i bÆ°u kiá»‡n táº¡i kho.
                </li>
                <li className="flex gap-3">
                  <CheckCircle2
                    className="mt-1 shrink-0 text-red-600"
                    size={18}
                  />
                  KhÃ´ng yÃªu cáº§u kinh nghiá»‡m, vÃ o lÃ m Ä‘Æ°á»£c quáº£n lÃ½ hÆ°á»›ng dáº«n tá»«
                  A-Z.
                </li>
              </ul>
            </section>
          </div>
          <aside className="h-fit space-y-5 lg:sticky lg:top-6">
            <section className="rounded-2xl bg-slate-900 p-6 text-white shadow-xl md:p-7">
              <div className="mb-5 flex items-center gap-3">
                <UserRound className="text-yellow-400" />
                <h2 className="text-xl font-bold">YÃªu cáº§u Ä‘Æ¡n giáº£n</h2>
              </div>
              <ul className="space-y-4 text-sm leading-6 text-slate-200">
                <li>Nam/Ná»¯ tá»« 18 - 35 tuá»•i, sá»©c khá»e tá»‘t.</li>
                <li>Báº¯t buá»™c cÃ³ CCCD gá»‘c vÃ  VNeID má»©c 2.</li>
              </ul>
            </section>
            <section className="rounded-2xl border border-red-100 bg-red-50 p-6 md:p-7">
              <div className="mb-4 flex items-center gap-3">
                <MapPin className="text-red-700" />
                <h2 className="text-xl font-bold">Äá»‹a Ä‘iá»ƒm lÃ m viá»‡c</h2>
              </div>
              <p className="text-sm leading-6 text-slate-600">
                LÃ´ 01, kho sá»‘ A01, KCN BÃ¬nh Minh, áº¤p Má»¹ Lá»£i, XÃ£ Má»¹ HoÃ , Tá»‰nh
                VÄ©nh Long.
              </p>
              <a
                className="mt-4 block text-sm font-semibold text-red-700 hover:underline"
                href="https://maps.google.com/?cid=88199021133819884"
                target="_blank"
                rel="noreferrer"
              >
                Má»Ÿ báº£n Ä‘á»“ KCN BÃ¬nh Minh
              </a>
              <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-red-700">
                <Phone size={17} /> Zalo: 0586.482.344 (Gáº·p TÃ i)
              </div>
            </section>
          </aside>
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-red-100 bg-white/95 p-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] backdrop-blur md:p-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-1 md:px-6">
          <div className="hidden text-sm md:block">
            <span className="font-bold">Lao Ä‘á»™ng phá»• thÃ´ng Part-time</span>
            <span className="ml-2 text-slate-500">KCN BÃ¬nh Minh</span>
          </div>
          <Link
            href="/ung-tuyen?job=agari-part-time"
            className="ml-auto w-full md:w-auto"
          >
            <Button className="h-12 w-full bg-[#d90012] px-8 font-bold text-white hover:bg-red-800 md:w-auto">
              ÄÄ‚NG KÃ ÄI LÃ€M
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
