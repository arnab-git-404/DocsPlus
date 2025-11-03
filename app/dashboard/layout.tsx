import Navbar from "@/components/Navbar";
import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import dbConnect from "@/lib/db";
import User from "@/models/User";

async function getUser() {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("token")?.value;

    if (!token) {
      return null;
    }

    const decoded = verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    ) as {
      userId: string;
      role: string;
    };

    await dbConnect();
    const user = await User.findById(decoded.userId).select("name email role");

    if (!user) {
      return null;
    }

    return {
      name: user.name,
      email: user.email,
      role: user.role,
    };
  } catch (error) {
    console.error("Auth error:", error);
    return null;
  }
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const user = await getUser(); --  remove this later

  // const { user, loading } = useAuth();
  // const router = useRouter();
  
  //     useEffect(() => {
  //   if (!loading && !user) {
  //     router.push('/login');
  //   }
  // }, [user, loading, router]);

  //   if (loading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  //     </div>
  //   );
  // }


  const user: { name: string; email: string; role: "ADMIN" | "EMPLOYEE" } = {
    name: "John Doe",
    email: "example@gmail.com",
    role: "ADMIN",
  };

  if (!user) {
    null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} />
      <main className="container mx-auto py-6 px-4">{children}</main>
    </div>
  );
}
