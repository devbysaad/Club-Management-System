import { getLandingPageData } from "@/lib/landing-data";
import LandingContent from "@/components/landing/LandingContent";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Homepage() {
    const data = await getLandingPageData();

    return <LandingContent data={data} />;
}
