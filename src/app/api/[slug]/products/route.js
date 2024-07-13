import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { unlink } from "fs/promises";
import { parse } from "url";
import authOptions from "../../auth/[...nextauth]/auth";
import { getServerSession } from "next-auth";
import prisma from "../../../../../prisma/prismaClient";
import { getproductList ,getCategoryProducts} from "./functions";


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
    const categoryId = formData.get("categoryId");
    const subCategoryId = formData.get("subCategoryId");
    const name = formData.get("name");
    const batchNo = formData.get("batchNo");
    const uid = formData.get("uid");
    const price = formData.get("price");
    const discount = formData.get("discount");
    const description = formData.get("description");
    const brand = formData.get("brand");
    const qty = formData.get("qty");
    const avgRating = formData.get("avgRating");
    const numReviews = formData.get("numReviews");
    const type = formData.get("type");
    const discountType = formData.get("discountType");
    const hsn = formData.get("hsn");
    const productImages = formData.getAll("image");
    const video = formData.get("video");
    const imageIndex = formData.get("imageIndex");

    const product = await prisma.products.findFirst({
      where: {
        name,
      },
    });

    if (product && type === "add") {
      return NextResponse.json({
        st: false,
        data: [],
        msg: "product already exists",
      });
    } else {

      if (type === "add") {
        let data = {};

        if (productImages.length > 0) {
          const productImagePromises = productImages.map(
            async (image, index) => {
              if (image instanceof File && image.size > 0) {
                const bytes = await image.arrayBuffer();
                const buffer = Buffer.from(bytes);
                const imageName = `${Date.now()}_${index}_${image.name}`;
                const path = `${process.cwd()}/public/products/${imageName}`;
                await writeFile(path, buffer);
                return imageName;
              }
            }
          );
          const uploadedImages = await Promise.all(productImagePromises);
          data.images = uploadedImages.filter((imageName) => imageName);
        }

        if (video instanceof File && video.size > 0) {
          const bytes = await video.arrayBuffer();
          const buffer = Buffer.from(bytes);
          const videoName = `${Date.now()}_${video.name}`;
          const path = `${process.cwd()}/public/products/video/${videoName}`;
          await writeFile(path, buffer);
          data.videoName = videoName;
        }

        const products = await prisma.products.create({
          data: {
            batchNo,
            uid,
            name,
            price: Number(price),
            hsn,
            discount: Number(discount),
            discountType,
            description,
            brand,
            qty: Number(qty),
            image: data?.images,
            video: data?.videoName,
            userId,
            categoryId,
            subCategoryId,
          },
        });

        if (!products) {
          return NextResponse.json({
            st: false,
            data: {},
            msg: "no product created",
          });
        }

        return NextResponse.json({
          st: true,
          data: products,
          msg: "product created successfully",
        });
      } else if (type === "update") {
        let data = {};
        const productsId = formData.get("productsId");
        const updateImageIds = formData.get("updateImageIds");


        let products = await prisma.products.findFirst({
          where: {
            id: productsId,
          },
        });

        data.images = products.image;
        data.videoName = products.video;

        if (productImages[0].size > 0) {

          const productImagePromises = productImages.map(async (image, index) => {
            const bytes = await image.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const imageName = `${Date.now()}_${index}_${image.name}`;
            const path = `${process.cwd()}/public/products/${imageName}`;
            await writeFile(path, buffer);
            return imageName;
          })

          const uploadedImages = await Promise.all(productImagePromises);
          data.images = uploadedImages.filter((imageName) => imageName);

          if (updateImageIds) {
            const updateImageIdArray = updateImageIds.split(",");
            for (let updateImageId of updateImageIdArray) {
              const path = `${process.cwd()}/public/products/${updateImageId}`;

              data.images = data.images.concat(products.image.filter(image => !updateImageIds.includes(image)));
              await unlink(path);
            }
          }
        }

        if (video.size > 0) {
          const bytes = await video.arrayBuffer();
          const buffer = Buffer.from(bytes);
          const videoName = `${Date.now()}_${video.name}`;

          const path = `${process.cwd()}/public/products/video/${videoName}`;
          await writeFile(path, buffer);
          data.videoName = videoName;

          const path2 = `${process.cwd()}/public/products/${products.videoName}`;
          await unlink(path2);
        }

        const updatedProducts = await prisma.products.update({
          where: {
            id: productsId,
          },
          data: {
            batchNo,
            uid,
            name,
            price: Number(price),
            discount: Number(discount),
            description,
            brand,
            qty: Number(qty),
            image: data?.images,
            video: data?.videoName,
          },
        });

        // if (!updatedProducts) {
        //   return NextResponse.json({
        //     st: false,
        //     data: {},
        //     msg: "no product updated",
        //   });
        // }

        return NextResponse.json({
          st: true,
          // data: updatedProducts,
          msg: "product updated successfully",
        });
      }
    }
  } catch (error) {
    console.log('error::: ', error);
    return NextResponse.json({
      st: false,
      msg: "something went wrong!!",
    });
  }
}

export async function GET(request) {
  try {
    const { query } = parse(request.url, true);
    const { id, slug, categoryId } = query;
    let limit = parseInt(query?.limit) || 10
    let page = parseInt(query?.page) - 1 || 0
    let offset = page * limit;

    let count;
    let list;

    if (id) {
      const products = await prisma.products.findFirst({
        where: {
          id,
        },
      });

      if (!products) {
        return NextResponse.json({
          st: false,
          data: [],
          msg: "No products found",
        });
      }

      return NextResponse.json({
        st: true,
        data: products,
        msg: "products fetched successfully",
      });
    } else {
      if (slug === "getproductList") {

        const res = await getproductList(request)
        const { st, limit, current_page, total_pages, data, msg } = res;


        if (!res || st === false) {
          return NextResponse.json({
            st: false,
            data: [],
            msg: "Invalid response from getAllproducts",
          });
        }

        return NextResponse.json({
          st,
          limit,
          current_page,
          total_pages,
          data,
          msg,
        })

      } else if (slug === "getCategoryProducts") {
        const res = await getCategoryProducts(request)
        const { st, limit, current_page, total_pages, data, msg } = res;

        if (!res || st === false) {
          return NextResponse.json({
            st: false,
            data: [],
            msg: "Invalid response from getAllproducts",
          });
        }

        return NextResponse.json({
          st,
          limit,
          current_page,
          total_pages,
          data,
          msg,
        })

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
    const { productIds } = body

    let deletedProduct;

    for (let productId of productIds) {
      const product = await prisma.products.findFirst({
        where: {
          id: productId,
          isBlocked: false,
        },

      });

      if (product) {
        deletedProduct = await prisma.products.update({
          where: {
            id: productId,
          },
          data: {
            isBlocked: true,
          },
        });
        // const path = `${process.cwd()}/public/catagory/${category.image}`;
        // await unlink(path);
      } else {
        console.log(`product with id ${productId} not found.`);
      }
    }

    return NextResponse.json({
      st: true,
      data: deletedProduct,
      msg: "Product deleted successfully",
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
