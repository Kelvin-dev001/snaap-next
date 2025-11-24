import { useEffect, useState, ReactNode } from "react";
// import { useNavigate } from "react-router-dom"; // Not used in Next.js
import API from "../utils/apiService"; // adjust path if needed
import { getToken } from "../utils/apiService"; // import token getter
import { useRouter } from "next/navigation";

type RequireAdminProps = {
  children: ReactNode;
};

/**
 * Usage in Next.js: Wrap this around admin layout/page content.
 * The children will only be rendered if admin is authenticated.
 */
const RequireAdmin: React.FC<RequireAdminProps> = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    async function checkAdmin() {
      // If no token, don't bother calling backend
      const token = getToken?.();
      if (!token) {
        if (!cancelled) {
          setIsAdmin(false);
          setChecking(false);
          router.replace("/admin"); // Or "/admin/login"
        }
        return;
      }
      try {
        // The endpoint must return {isAdmin: true/false}
        const { data } = await API.checkAdmin();
        if (!cancelled) {
          setIsAdmin(data.isAdmin);
          setChecking(false);
          if (!data.isAdmin) {
            router.replace("/admin");
          }
        }
      } catch {
        if (!cancelled) {
          setIsAdmin(false);
          setChecking(false);
          router.replace("/admin");
        }
      }
    }
    checkAdmin();
    return () => { cancelled = true; };
    // eslint-disable-next-line
  }, [router]);

  if (checking) return null; // or a spinner

  return isAdmin ? <>{children}</> : null;
};

export default RequireAdmin;