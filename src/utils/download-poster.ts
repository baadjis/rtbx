/* eslint-disable @typescript-eslint/no-explicit-any */
import { toPng } from "@jpinsonneau/html-to-image";

export const downloadPoster = async (ref: any, filename: string) => {
  if (!ref.current) return;
  try {
    await document.fonts.ready;
    const dataUrl = await toPng(ref.current, { 
      cacheBust: true, 
      pixelRatio: 3, 
      backgroundColor: '#ffffff' 
    });
    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = dataUrl;
    link.click();
  } catch (err) {
    console.error("Poster rendering error", err);
    alert("Error creating poster.");
  }
};