export const dynamic = "force-dynamic";

import Announcements from "@/components/Announcements";
import { role } from "@/lib/data";
import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";

const SingleStaffPage = async ({ params }: { params: { id: string } }) => {
    const staffId = params.id;

    // Fetch the staff member
    const staff = await prisma.staff.findUnique({
        where: { id: staffId },
    });

    if (!staff) {
        return <div className="p-4">Staff member not found</div>;
    }

    return (
        <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
            {/* LEFT */}
            <div className="w-full xl:w-2/3">
                {/* TOP */}
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* USER INFO CARD */}
                    <div className="bg-lamaSky py-6 px-4 rounded-md flex-1 flex gap-4">
                        <div className="w-1/3">
                            <Image
                                src={
                                    staff.photo ||
                                    "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1200"
                                }
                                alt=""
                                width={144}
                                height={144}
                                className="w-36 h-36 rounded-full object-cover"
                            />
                        </div>
                        <div className="w-2/3 flex flex-col justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <h1 className="text-xl font-semibold">
                                    {staff.firstName} {staff.lastName}
                                </h1>
                            </div>
                            <p className="text-sm text-gray-500">
                                Staff Member • Administrative Role
                            </p>
                            <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                    <Image src="/date.png" alt="" width={14} height={14} />
                                    <span>{staff.createdAt.toLocaleDateString()}</span>
                                </div>
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                    <Image src="/mail.png" alt="" width={14} height={14} />
                                    <span>{staff.email || "—"}</span>
                                </div>
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                    <Image src="/phone.png" alt="" width={14} height={14} />
                                    <span>{staff.phone || "—"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* SMALL CARDS */}
                    <div className="flex-1 flex gap-4 justify-between flex-wrap">
                        {/* CARD */}
                        <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                            <Image
                                src="/singleAttendance.png"
                                alt=""
                                width={24}
                                height={24}
                                className="w-6 h-6"
                            />
                            <div className="">
                                <h1 className="text-xl font-semibold">—</h1>
                                <span className="text-sm text-gray-400">Role</span>
                            </div>
                        </div>
                        {/* CARD */}
                        <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                            <Image
                                src="/singleBranch.png"
                                alt=""
                                width={24}
                                height={24}
                                className="w-6 h-6"
                            />
                            <div className="">
                                <h1 className="text-xl font-semibold">STAFF</h1>
                                <span className="text-sm text-gray-400">Access Level</span>
                            </div>
                        </div>
                        {/* CARD */}
                        <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                            <Image
                                src="/singleLesson.png"
                                alt=""
                                width={24}
                                height={24}
                                className="w-6 h-6"
                            />
                            <div className="">
                                <h1 className="text-xl font-semibold">Admin</h1>
                                <span className="text-sm text-gray-400">Permissions</span>
                            </div>
                        </div>
                        {/* CARD */}
                        <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                            <Image
                                src="/singleClass.png"
                                alt=""
                                width={24}
                                height={24}
                                className="w-6 h-6"
                            />
                            <div className="">
                                <h1 className="text-xl font-semibold">Active</h1>
                                <span className="text-sm text-gray-400">Status</span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* BOTTOM */}
                <div className="mt-4 bg-white rounded-md p-4">
                    <h1 className="text-xl font-semibold mb-4">About</h1>
                    <div className="space-y-2 text-sm text-gray-600">
                        <p><strong>Name:</strong> {staff.firstName} {staff.lastName}</p>
                        <p><strong>Email:</strong> {staff.email || "—"}</p>
                        <p><strong>Phone:</strong> {staff.phone || "—"}</p>
                        <p><strong>Joined:</strong> {staff.createdAt.toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
            {/* RIGHT */}
            <div className="w-full xl:w-1/3 flex flex-col gap-4">
                <div className="bg-white p-4 rounded-md">
                    <h1 className="text-xl font-semibold">Shortcuts</h1>
                    <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
                        <Link className="p-3 rounded-md bg-lamaSkyLight" href="/">
                            Pato Hornets
                        </Link>
                        <Link className="p-3 rounded-md bg-lamaSkyLight" href="/list/students">
                            All Players
                        </Link>
                        <Link className="p-3 rounded-md bg-lamaSkyLight" href="/list/teachers">
                            All Coaches
                        </Link>
                        <Link className="p-3 rounded-md bg-lamaSkyLight" href="/admin/admission">
                            Admissions
                        </Link>
                    </div>
                </div>
                <Announcements />
            </div>
        </div>
    );
};

export default SingleStaffPage;
