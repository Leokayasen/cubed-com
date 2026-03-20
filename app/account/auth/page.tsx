import AccountAuthPanel from "@/components/AccountAuthPanel";
import { getAccountFromSessionToken, SESSION_COOKIE_NAME } from "@/lib/server/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AccountAuthPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (token) {
        const session = await getAccountFromSessionToken(token);
        if (session) {
            redirect("/account");
        }
    }

    return (
        <div className="grid gap-6">
            <section className="container-soft p-6 md:p-10">
                <h1 className="text-3xl font-semibold">Account Access</h1>
                <p className="mt-2 max-w-2xl text-zinc-300">
                    Create your Cubed account or sign in to manage your profile, reserve your
                    in-game username, and access account tools.
                </p>
            </section>

            <section className="container-soft p-6 md:p-8">
                <AccountAuthPanel />
            </section>
        </div>
    );
}

