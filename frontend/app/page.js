import Image from "next/image";
import Link from "next/link";
import Tasks from "./components/tasks";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
        <Tasks/>
        <Link href="/auth/login">Login</Link>
        <Link href="/auth/register">Register</Link>
    </div>
  );
}
