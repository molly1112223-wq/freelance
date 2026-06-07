import { getCurrentUser } from "@/lib/auth";
import { ok } from "@/lib/api";

export async function GET() {
  const user = await getCurrentUser();
  return ok(
    user
      ? {
          id: user.id,
          role: user.role,
          name: user.name,
          email: user.email,
          status: user.status,
          freelancerProfile: user.freelancerProfile
            ? {
                title: user.freelancerProfile.title,
                availability: user.freelancerProfile.availability,
                ratingAvg: user.freelancerProfile.ratingAvg
              }
            : null
        }
      : null
  );
}
