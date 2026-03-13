
import { redirect } from 'next/navigation';

export default function Home() {
  // Redirige la racine du domaine vers ton interface Hugging Face
  redirect('https://baadjis-utilitybox.hf.space');
}