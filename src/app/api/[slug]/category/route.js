import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { unlink } from "fs/promises";
import { parse } from "url";

import authOptions from "../../auth/[...nextauth]/auth";
import { getServerSession } from "next-auth";
import prisma from "../../../../../prisma/prismaClient";

export async function POST(request) {
  try {
    let session = await getServerSession(authOptions);
    const userId = session?.user?.id;
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

    const formData = await request.formData();
    const name = formData.get("name");
    const type = formData.get("type");
    const image = formData.get("image");

    const isCategory = await prisma?.category.findFirst({
      where: {
        name,
      },
    });

    if (isCategory && type === "add") {
      return NextResponse.json({
        st: false,
        data: {},
        msg: "Category already exists",
      });
    } else {

      if (type === "add") {
        let data = {};

        if (image instanceof File && image.size > 0) {
          const bytes = await image.arrayBuffer();
          const buffer = Buffer.from(bytes);
          const imageName = `${Date.now()}_${image.name}`;

          const path = `${process.cwd()}/public/catagory/${imageName}`;
          await writeFile(path, buffer);
          data.image = imageName;
        }

        const category = await prisma?.category.create({
          data: {
            name,
            image: data?.image,
            userId,
            createdAt : new Date(),
            createdBy: userId,
          },
        });

        return NextResponse.json({
          st: true,
          data: category,
          msg: "Category created successfully",
        });
      } else if (type === "update") {
        let data = {};
        const categoryId = formData.get("categoryId");

        if (image instanceof File && image.size > 0) {
          const bytes = await image.arrayBuffer();
          const buffer = Buffer.from(bytes);
          const imageName = `${Date.now()}_${image.name}`;

          const path = `${process.cwd()}/public/catagory/${imageName}`;
          await writeFile(path, buffer);
          data.image = imageName;

          const catagory = await prisma?.category.findFirst({
            where: {
              id: categoryId,
            },
          });

          const path2 = `${process.cwd()}/public/catagory/${catagory.image}`;
          await unlink(path2);
        }

        const category = await prisma?.category.update({
          where: {
            id: categoryId,
          },
          data: {
            name,
            image: data?.image,
            updatedAt: new Date(),
            updatedBy: userId,
          },
        });

        if (!category) {
          return NextResponse.json({
            st: false,
            msg: "no category updated",
          });
        }

        return NextResponse.json({
          st: true,
          data: category,
          msg: "Category updated successfully",
        });
      }
    }
  } catch (error) {
    console.log('error::: ', error);
    return NextResponse.json({
      st: false,
      data: {},
      error,
      msg: "something went wrong!!",
    });
  }
}

export async function GET(request) {
  try {
    const { query } = parse(request.url, true);
    let { id, } = query;

    let limit = parseInt(query?.limit) || 10
    let page = parseInt(query?.page) - 1 || 0
    let offset = page * limit;

    if (id) {
      const category = await prisma?.category.findFirst({
        where: {
          id,
        },
      });

      if (!category) {
        return NextResponse.json({
          st: false,
          data: [],
          msg: "No Category found",
        });
      }

      return NextResponse.json({
        st: true,
        data: category,
        msg: "Category fetched successfully",
      });
    } else {

      let count;
      let list;

      count = await prisma?.category?.count({
        where: {
          isBlocked: false,
        },
      });

      list = await prisma?.category?.findMany({
        where: {
          isBlocked: false,
        },
        include: {
          SubCategory: {
            include: {
              products: {
                where: {
                  isBlocked: false
                }
              },
            },
          },
        },

        take: limit,
        skip: offset,
        orderBy: { createdAt: 'desc' }
      });

      if (list.length === 0) {
        return NextResponse.json({
          st: false,
          data: [],
          msg: "No Category found",
        });
      }

      return NextResponse.json({
        st: true,
        limit: limit,
        current_page: parseInt(query.page),
        total_pages: Math.ceil(count / limit),
        data: list,
        msg: "all Category fetched successfully",
      });

    }
  } catch (error) {
    console.log('error::: ', error);
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
    const { categoryIds } = body

    let deletedCategory;

    for (let categoryId of categoryIds) {
      const category = await prisma?.category.findFirst({
        where: {
          id: categoryId,
        },
      });

      if (category) {
        deletedCategory = await prisma?.category.update({
          where: {
            id: categoryId,
          },
          data: {
            isBlocked: true,
            updatedBy: session?.user?.id,
            updatedAt: new Date(),
          },
        });     

      } else {
        console.log(`Category with id ${categoryId} not found.`);
      }
    }

    return NextResponse.json({
      st: true,
      data: deletedCategory,
      msg: "Category deleted successfully",
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


