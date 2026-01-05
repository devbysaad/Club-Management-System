// INSTRUCTION: Replace src/app/(dashboard)/list/teachers/page.tsx with this

import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role } from "@/lib/data";
import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Prisma } from "@prisma/client";
import { ITEM_PER_PAGE } from "@/lib/setting";



type CoachList = {
  id: string;
  name: string;
  email: string | null;
  photo: string | null;
  displayId: string | null;
  specialization: string[];
  ageGroups: { ageGroup: { name: string } }[];
  phone: string | null;
  address: string | null;
};

const columns = [
  {
    header: "Info",
    accessor: "info",
  },
  {
    header: "Coach ID",
    accessor: "teacherId",
    className: "hidden md:table-cell",
  },
  {
    header: "Specialization",
    accessor: "subjects",
    className: "hidden md:table-cell",
  },
  {
    header: "Age Groups",
    accessor: "classes",
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


const renderRow = (item: CoachList) => (
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
    <td className="hidden md:table-cell">
      <span className="px-2 py-1 rounded-lg bg-fcBlue/20 text-fcBlue text-xs font-medium">
        {item.displayId || item.id.slice(0, 8).toUpperCase()}
      </span>
    </td>
    <td className="hidden md:table-cell">
      <div className="flex flex-wrap gap-1">
        {item.specialization.map((spec, index) => (
          <span
            key={index}
            className="px-2 py-1 rounded-lg bg-fcGreen/20 text-fcGreen text-xs font-medium"
          >
            {spec}
          </span>
        ))}
      </div>
    </td>
    <td className="hidden md:table-cell">
      <div className="flex flex-wrap gap-1">
        {item.ageGroups.slice(0, 3).map((ag, index) => (
          <span
            key={index}
            className="px-2 py-1 rounded-lg bg-fcGarnet/20 text-fcGarnet text-xs font-medium"
          >
            {ag.ageGroup.name}
          </span>
        ))}
        {item.ageGroups.length > 3 && (
          <span className="text-xs text-fcTextDim">+{item.ageGroups.length - 3}</span>
        )}
      </div>
    </td>
    <td className="hidden lg:table-cell text-fcTextMuted">{item.phone || "—"}</td>
    <td>
      <div className="flex items-center gap-2">
        <Link href={`/list/teachers/${item.id}`}>
          <button className="w-7 h-7 flex items-center justify-center rounded-full bg-fcSky">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        </Link>
        {role === "admin" && (
          <FormModal table="teacher" type="delete" id={item.id} />
        )}
      </div>
    </td>
  </tr>
);


const CoachListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  // Build query conditions
  const query: Prisma.CoachWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "ageGroupId":
            query.ageGroups = {
              some: {
                ageGroupId: value,
              },
            };
            break;
          case "search":
            if (value) {
              const searchTerms = value.trim().split(/\s+/); // Split by whitespace

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
                      contains: value,
                      mode: "insensitive",
                    },
                  },
                  {
                    lastName: {
                      contains: value,
                      mode: "insensitive",
                    },
                  },
                  // OR email/phone contains the full search
                  {
                    email: {
                      contains: value,
                      mode: "insensitive",
                    },
                  },
                  {
                    phone: {
                      contains: value,
                      mode: "insensitive",
                    },
                  },
                ];
              }
            }
            break;
          default:
            break;
        }
      }
    }
  }

  // Fetch coaches with pagination
  const [data, count] = await prisma.$transaction([
    prisma.coach.findMany({
      where: query,
      include: {
        ageGroups: {
          include: {
            ageGroup: true,
          },
        },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
      orderBy: {
        firstName: "asc",
      },
    }),
    prisma.coach.count({ where: query }),
  ]);

 

  // Transform data for rendering
  const coachesData = data.map((coach) => ({
    id: coach.id,
    name: `${coach.firstName} ${coach.lastName}`,
    email: coach.email,
    photo: coach.photo,
    displayId: coach.displayId,
    specialization: coach.specialization,
    ageGroups: coach.ageGroups,
    phone: coach.phone,
    address: coach.address,
  }));

  return (
    <div className="glass-card rounded-2xl flex-1 m-4 mt-0 p-6">
      {/* TOP */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-heading font-bold text-white">
            All Coaches
          </h1>
          <p className="text-sm text-fcTextMuted mt-1">
            Manage coaching staff • {count} coaches
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
            {role === "admin" && <FormModal table="teacher" type="create" />}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={coachesData} />
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default CoachListPage;