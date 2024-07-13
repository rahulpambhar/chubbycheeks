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
    const { id, action } = body

    let updatedProduct;

    const product = await prisma.products.findFirst({
      where: {
        id,
        isBlocked: false,
      },

    });

    if (product) {

      const data = {};

      if (action === 'topSelected') {
        data.topSelected = !product.topSelected;
      } else if (action === 'isNew') {
        data.isNew = !product.isNew;
      }

      updatedProduct = await prisma.products.update({
        where: {
          id: product.id,
        },
        data: data,
      });
     
    } else {
      console.log(`product with id ${id} not found.`);
    }


    return NextResponse.json({
      st: true,
      data: updatedProduct,
      msg: "Product updated successfully",
    });


  } catch (error) {
    console.log('error::: ', error);
    return NextResponse.json({
      st: false,
      msg: "something went wrong!!",
    });
  }
}