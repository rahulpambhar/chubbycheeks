import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { unlink } from "fs/promises";
import { parse } from "url";
import authOptions from "../../auth/[...nextauth]/auth";
import { getServerSession } from "next-auth";
import prisma from "../../../../../prisma/prismaClient";
// import { getAllSubCategory } from "@/app/api/[slug]/subCategory/functions/index";
import { getAllSubCategory } from "./functions";


export async function POST(request) {
  try {
    let session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    const isAdmin = session?.user?.isAdmin;

    if (!session) {
      return NextResponse.json({
        st: false,
        msg: "You are not logged in",
      });
    }

    if (!isAdmin) {
      return NextResponse.json({
        st: false,
        msg: "You are not admin",
      });
    }

    const formData = await request.formData();
    const name = formData.get("name");
    const categoryId = formData.get("categoryId");
    const type = formData.get("type");
    const image = formData.get("image");

    const subCategory = await prisma.subCategory.findFirst({
      where: {
        name,
      },
    });

    if (subCategory && type === "add") {
      return NextResponse.json({
        st: false,
        data: {},
        msg: "subCategory already exists",
      });
    } else {
      if (!isAdmin) {
        return NextResponse.json({
          st: false,
          msg: "You are not admin",
        });
      }
      if (type === "add") {
        let data = {};
        if (image instanceof File && image.size > 0) {
          const bytes = await image.arrayBuffer();
          const buffer = Buffer.from(bytes);
          const imageName = `${Date.now()}_${image.name}`;

          const path = `${process.cwd()}/public/subCategory/${imageName}`;
          await writeFile(path, buffer);
          data.image = imageName;
        }

        const subCategory = await prisma.subCategory.create({
          data: {
            name,
            image: data?.image,
            userId,
            categoryId,
          },
        });

        if (!subCategory) {
          return NextResponse.json({
            st: false,
            data: [],
            msg: "no subCategory created",
          });
        }

        return NextResponse.json({
          st: true,
          data: subCategory,
          msg: "subCategory created successfully",
        });
      } else if (type === "update") {
        let data = {};
        const subCategoryId = formData.get("subCategoryId");

        if (image instanceof File && image.size > 0) {
          const bytes = await image.arrayBuffer();
          const buffer = Buffer.from(bytes);
          const imageName = `${Date.now()}_${image.name}`;

          const path = `${process.cwd()}/public/subCategory/${imageName}`;

          await writeFile(path, buffer);
          data.image = imageName;

          const subCatagory = await prisma.subCategory.findFirst({
            where: {
              id: subCategoryId,
            },
          });

          const path2 = `${process.cwd()}/public/subCategory/${subCatagory.image
            }`;
          await unlink(path2);
        }

        const subCatagory = await prisma.subCategory.update({
          where: {
            id: subCategoryId,
          },
          data: {
            name,
            image: data?.image,
          },
        });

        if (!subCatagory) {
          return NextResponse.json({
            st: false,
            data: {},
            msg: "no subCatagory updated",
          });
        }

        return NextResponse.json({
          st: true,
          data: subCatagory,
          msg: "subCatagory updated successfully",
        });
      }
    }
  } catch (error) {
    console.log("error::: ", error);
    return NextResponse.json({
      st: false,
      msg: "something went wrong!!",
    });
  }
}

export async function GET(request) {
  try {
    const { query } = parse(request.url, true);
    const { id } = query;

    if (id) {
      let limit = parseInt(query?.limit) || 10
      let page = parseInt(query?.page) - 1 || 0
      let offset = page * limit;

      let count;
      let list;

      list = await prisma.subCategory.findMany({
        where: {
          categoryId: id,
          isBlocked: false,
        },
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' }
      });

      if (list.length === 0) {
        return NextResponse.json({
          st: false,
          data: [],
          msg: "No subCategory found",
        });
      }

      return NextResponse.json({
        st: true,
        limit: limit,
        current_page: parseInt(query.page),
        total_pages: Math.ceil(count / limit),
        data: list,
        msg: "subCategory fetched successfully",
      });
    } else {

      if (1 === 1) {


        const res = await getAllSubCategory(request)
        const { st, limit, current_page, total_pages, data, msg } = res;

        if (!res || st === false) {
          return NextResponse.json({
            st: false,
            data: [],
            msg: "Invalid response from getAllSubCategory",
          });
        }

        return NextResponse.json({
          st,
          limit,
          current_page,
          total_pages,
          data,
          msg,
        });
      }
    }
  } catch (error) {
    console.log("error::: ", error);
    return NextResponse.json({
      st: false,
      data: [],
      msg: "something went wrong!!",
    });
  }
}

export async function DELETE(request) {
  try {
    let session = await getServerSession(authOptions);
    const isAdmin = session?.user?.isAdmin;


    if (!session) {
      return NextResponse.json({
        st: false,
        data: {},
        msg: "You are not logged in",
      });
    }

    if (!isAdmin) {
      return NextResponse.json({
        st: false,
        msg: "You are not admin",
      });
    }

    const body = await request.json();
    const { subCategoryIds } = body

    let deletedSubCategory;

    for (let subCategoryId of subCategoryIds) {
      const subCategory = await prisma.subCategory.findFirst({
        where: {
          id: subCategoryId,
        },
      });

      if (subCategory) {
        deletedSubCategory = await prisma.subCategory.update({
          where: {
            id: subCategoryId,
          },
          data: {
            isBlocked: true,
          },
        });

        // const path = `${process.cwd()}/public/catagory/${category.image}`;
        // await unlink(path);

      } else {
        console.log(`subCategory with id ${categoryId} not found.`);
      }
    }


    return NextResponse.json({
      st: true,
      data: deletedSubCategory,
      msg: "Subcategory deleted successfully",
    });
  } catch (error) {
    console.log('error::: ', error);
    return NextResponse.json({
      st: false,
      data: {},
      msg: "something went wrong!!",
    });
  }
}
