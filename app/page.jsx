"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "./_components/Header";
import Hero from "./_components/Hero";
import { 
  ArrowRight, 
  LineChart, 
  Wallet, 
  PiggyBank, 
  Tag
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  
  // Redirect directly to dashboard
  useEffect(() => {
    router.push("/dashboard");
  }, [router]);

  return (
    <div>
      <Header />
      <Hero />
    </div>
  );
} 