import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { ITEM_PER_PAGE } from "@/lib/setting";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import Link from "next/link";

type Parent = {
  id: string;
  name: string;
  email?: string;
  students: string[];
  phone: string;
  address: string;
};

const columns = [
  {
    header: "Parent Info",
    accessor: "info",
  },
  {
    header: "Players",
    accessor: "students",
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

const ParentListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { coachId, page, search } = searchParams;
  const currentPage = page ? parseInt(page) : 1;

  // Get user role from Clerk session claims
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  // Build query
  const query: any = {};

  // Add search functionality with improved multi-word search
  if (search) {
    const searchTerms = search.trim().split(/\s+/); // Split by whitespace

    if (searchTerms.length === 1) {
      // Single word search - search in firstName, lastName, email, phone
      query.OR = [
        {
          firstName: {
            contains: searchTerms[0],
            mode: "insensitive",
          },
        },
        {
          lastName: {
            contains: searchTerms[0],
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: searchTerms[0],
            mode: "insensitive",
          },
        },
        {
          phone: {
            contains: searchTerms[0],
            mode: "insensitive",
          },
        },
      ];
    } else {
      // Multi-word search - assume first word is firstName, rest is lastName
      const [firstTerm, ...restTerms] = searchTerms;
      const lastTerm = restTerms.join(" ");

      query.OR = [
        // firstName contains first term AND lastName contains rest
        {
          AND: [
            {
              firstName: {
                contains: firstTerm,
                mode: "insensitive",
              },
            },
            {
              lastName: {
                contains: lastTerm,
                mode: "insensitive",
              },
            },
          ],
        },
        // OR lastName contains first term AND firstName contains rest
        {
          AND: [
            {
              lastName: {
                contains: firstTerm,
                mode: "insensitive",
              },
            },
            {
              firstName: {
                contains: lastTerm,
                mode: "insensitive",
              },
            },
          ],
        },
        // OR full name in either field (fallback)
        {
          firstName: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          lastName: {
            contains: search,
            mode: "insensitive",
          },
        },
        // OR email/phone contains the full search
        {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          phone: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }
  }

  // Filter by coach - get parents whose students are in coach's age groups
  if (coachId) {
    const coachAgeGroups = await prisma.coachAgeGroup.findMany({
      where: { coachId },
      select: { ageGroupId: true },
    });

    const ageGroupIds = coachAgeGroups.map((cag) => cag.ageGroupId);

    query.students = {
      some: {
        ageGroupId: {
          in: ageGroupIds,
        },
      },
    };
  }

  // Fetch real parents from database with pagination
  const [parents, totalCount] = await prisma.$transaction([
    prisma.parent.findMany({
      where: query,
      include: {
        students: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        firstName: "asc",
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (currentPage - 1),
    }),
    prisma.parent.count({ where: query }),
  ]);

  const totalPages = Math.ceil(totalCount / ITEM_PER_PAGE);

  const renderRow = (item: Parent, role?: string) => (
    <tr
      key={item.id}
      className="border-b border-fcBorder hover:bg-fcSurfaceLight/50 text-sm transition-colors"
    >
      <td className="flex items-center gap-4 p-4">
        <div className="w-10 h-10 rounded-xl bg-fcGold/20 flex items-center justify-center">
          <span className="text-lg">👤</span>
        </div>
        <div className="flex flex-col">
          <h3 className="font-heading font-semibold text-white">{item.name}</h3>
          <p className="text-xs text-fcTextMuted">{item?.email || "—"}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">
        <div className="flex flex-wrap gap-1">
          {item.students.map((student, idx) => (
            <span
              key={idx}
              className="px-2 py-1 rounded-lg bg-fcBlue/20 text-fcBlue text-xs font-medium"
            >
              {student}
            </span>
          ))}
        </div>
      </td>
      <td className="hidden lg:table-cell text-fcTextMuted">{item.phone || "—"}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link
            href={`/list/parents/${item.id}`}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-fcSky"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </Link>
          {role === "admin" && (
            <>
              <FormModal table="parent" type="update" data={item} />
              <FormModal table="parent" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  // Transform data for rendering
  const parentsData = parents.map((parent) => ({
    id: parent.id,
    name: `${parent.firstName} ${parent.lastName}`,
    email: parent.email,
    students: parent.students.map((s) => `${s.firstName} ${s.lastName}`),
    phone: parent.phone || "—",
    address: parent.address || "—",
  }));

  return (
    <div className="glass-card rounded-2xl flex-1 m-4 mt-0 p-6">
      {/* TOP */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-heading font-bold text-white">
            Parents & Guardians {coachId ? "(Coach's Parents)" : ""}
          </h1>
          <p className="text-sm text-fcTextMuted mt-1">
            Player family contacts • {totalCount} parents
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
            {role === "admin" && <FormModal table="parent" type="create" />}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={(item) => renderRow(item, role)} data={parentsData} />
      {/* PAGINATION */}
      <Pagination totalPages={totalPages} />
    </div>
  );
};

export default ParentListPage;