'use client'
import { QRCodeCanvas } from 'qrcode.react';

export default function QRCodeDisplay({ value }: { value: string }) {
  return (
    <div className="bg-white p-4 rounded-[2.5rem] inline-block shadow-inner border-[10px] border-white/10">
      <QRCodeCanvas value={value} size={180} level="H" />
    </div>
  );
}