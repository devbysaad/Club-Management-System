import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Prisma } from "@prisma/client";
import { ITEM_PER_PAGE } from "@/lib/setting";

type StaffList = {
    id: string;
    name: string;
    email: string | null;
    photo: string | null;
    phone: string | null;
    address: string | null;
};

const columns = [
    {
        header: "Info",
        accessor: "info",
    },
    {
        header: "Email",
        accessor: "email",
        className: "hidden md:table-cell",
    },
    {
        header: "Phone",
        accessor: "phone",
        className: "hidden lg:table-cell",
    },
    {
        header: "Actions",
        accessor: "action",
    },
];

const renderRow = (item: StaffList, role?: string) => {
    return (
        <tr
            key={item.id}
            className="border-b border-fcBorder hover:bg-fcSurfaceLight/50 text-sm transition-colors"
        >
            <td className="flex items-center gap-4 p-4">
                <Image
                    src={item.photo || "/noAvatar.png"}
                    alt=""
                    width={40}
                    height={40}
                    className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
                />
                <div className="flex flex-col">
                    <h3 className="font-heading font-semibold text-white">{item.name}</h3>
                    <p className="text-xs text-fcTextMuted">{item.email || "—"}</p>
                </div>
            </td>
            <td className="hidden md:table-cell text-fcTextMuted">{item.email || "—"}</td>
            <td className="hidden lg:table-cell text-fcTextMuted">{item.phone || "—"}</td>
            <td>
                <div className="flex items-center gap-2">
                    <Link href={`/list/staff/${item.id}`}>
                        <button className="w-7 h-7 flex items-center justify-center rounded-full bg-fcSky">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </button>
                    </Link>
                    {(role === "admin" || role === "staff") && (
                        <>
                            {/* <FormModal table="staff" type="update" data={item} /> */}
                            {/* <FormModal table="staff" type="delete" id={item.id} /> */}
                        </>
                    )}
                </div>
            </td>
        </tr>
    );
};

const StaffListPage = async ({
    searchParams,
}: {
    searchParams: { [key: string]: string | undefined };
}) => {
    const { page, ...queryParams } = searchParams;
    const p = page ? parseInt(page) : 1;

    // Get user role from Clerk session claims
    const user = await currentUser();
    const role = (user?.publicMetadata?.role as string)?.toLowerCase();

    // Build query conditions
    const query: Prisma.StaffWhereInput = {};

    if (queryParams.search) {
        const searchTerms = queryParams.search.trim().split(/\s+/);

        if (searchTerms.length === 1) {
            query.OR = [
                { firstName: { contains: searchTerms[0], mode: "insensitive" } },
                { lastName: { contains: searchTerms[0], mode: "insensitive" } },
                { email: { contains: searchTerms[0], mode: "insensitive" } },
                { phone: { contains: searchTerms[0], mode: "insensitive" } },
            ];
        } else {
            const [firstTerm, ...restTerms] = searchTerms;
            const lastTerm = restTerms.join(" ");

            query.OR = [
                {
                    AND: [
                        { firstName: { contains: firstTerm, mode: "insensitive" } },
                        { lastName: { contains: lastTerm, mode: "insensitive" } },
                    ],
                },
                {
                    AND: [
                        { lastName: { contains: firstTerm, mode: "insensitive" } },
                        { firstName: { contains: lastTerm, mode: "insensitive" } },
                    ],
                },
                { firstName: { contains: queryParams.search, mode: "insensitive" } },
                { lastName: { contains: queryParams.search, mode: "insensitive" } },
                { email: { contains: queryParams.search, mode: "insensitive" } },
                { phone: { contains: queryParams.search, mode: "insensitive" } },
            ];
        }
    }

    // Fetch staff members
    const [data, count] = await prisma.$transaction([
        prisma.staff.findMany({
            where: { ...query, isDeleted: false },
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1),
            orderBy: {
                firstName: "asc",
            },
        }),
        prisma.staff.count({ where: { ...query, isDeleted: false } }),
    ]);

    // Transform data for rendering
    const staffData = data.map((staff) => ({
        id: staff.id,
        userId: staff.userId,
        firstName: staff.firstName,
        lastName: staff.lastName,
        name: `${staff.firstName} ${staff.lastName}`,
        email: staff.email,
        photo: staff.photo,
        phone: staff.phone,
        address: staff.address,
    }));

    const totalPages = Math.ceil(count / ITEM_PER_PAGE);

    return (
        <div className="glass-card rounded-2xl flex-1 m-4 mt-0 p-6">
            {/* TOP */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-xl font-heading font-bold text-white">
                        All Staff
                    </h1>
                    <p className="text-sm text-fcTextMuted mt-1">
                        Manage staff members • {count} staff
                    </p>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <TableSearch />
                    <div className="flex items-center gap-2">
                        <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-fcSurface border border-fcBorder hover:border-fcGold/50 transition-colors">
                            <svg className="w-4 h-4 text-fcTextMuted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                        </button>
                        <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-fcSurface border border-fcBorder hover:border-fcGold/50 transition-colors">
                            <svg className="w-4 h-4 text-fcTextMuted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                            </svg>
                        </button>
                        {/* Create staff button - note: no form exists yet, this is a placeholder */}
                        {(role === "admin" || role === "staff") && (
                            <button
                                className="w-auto px-4 h-9 flex items-center justify-center gap-2 rounded-lg bg-fcBlue hover:bg-fcBlue/80 transition-colors text-white font-medium text-sm"
                                disabled
                                title="Staff creation form not yet implemented"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                <span className="hidden md:inline">Create Staff</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
            {/* LIST */}
            <Table
                columns={columns}
                renderRow={(item) => renderRow(item, role)}
                data={staffData}
            />
            {/* PAGINATION */}
            <Pagination totalPages={totalPages} />
        </div>
    );
};

export default StaffListPage;
