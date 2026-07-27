import NextAuth from "next-auth";

import { authOptions } from "@/lib/auth";

// يوصل NextAuth تلقائيًا بمسارات /api/auth/* (signin, callback, session...)
// Wires NextAuth to /api/auth/* automatically (signin, callback, session...).
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
