import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";


export const useSession = async () => {
  const session = await getServerSession(authOptions);
  
  return session;
}