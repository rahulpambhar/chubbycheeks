import axios from "axios";
import { NextResponse } from "next/server";
import  prisma  from "../../../../../prisma/prismaClient";
import { PrismaClient } from "@prisma/client";
import { hashSync, genSaltSync } from "bcrypt";
import { writeFile } from "fs/promises";
import { unlink } from "fs/promises";
import { parse } from "url";
import fast2sms from 'fast-two-sms';
import authOptions from "@/app/api/auth/[...nextauth]/auth";
import twilio from "twilio";

const twilioPharse = "Y196Y5G4X93JDVGZTGDHCZ4M"
const accountSid = "AC0e052bd904a903e8a0f93f7db125bd86";
const authToken = "4a476f0a099f0e598df00b5d9663955d";

export async function POST(request: Request) {

  const userId = "6583359361dcddf7afe7e355";
  const isAdmin = true;

  const formData = await request.formData();
  const name: any = formData.get("name");
  const email: any = formData.get("email");

  const country_code: any = formData.get("country_code");
  const mobile: any = formData.get("mobile");

  const city: any = formData.get("city");
  const country: any = formData.get("country");
  const address: any = formData.get("address");
  const pincode: any = formData.get("pincode");

  const gender: any = formData.get("gender");
  const password: any = formData.get("password");
  const type = formData.get("type");
  const profile_pic = formData.get("profile_pic");


  try {
    if (type === "add" && email && mobile) {

      const user = await prisma?.user?.findFirst({
        where: {
          OR: [{ email }, { mobile }],
        },
      });

      if (user) {

        return NextResponse.json(
          { st: false, data: {}, message: "user already exists" },
          { status: 200 }
        );

      } else {
        let data: any = {};

        if (profile_pic instanceof File && profile_pic.size > 0) {
          const bytes = await profile_pic.arrayBuffer();
          const buffer = Buffer.from(bytes);
          const imageName = `${Date.now()}_${profile_pic.name}`;

          const path = `${process.cwd()}/public/users/${imageName}`;
          await writeFile(path, buffer);
          // data.image = imageName;
        }

        const salt = genSaltSync(10);
        const encryptPassword: any = hashSync(password, salt);

        const result = await prisma.user.create({
          data: {
            email,
            name,

            country_code,
            mobile,

            city,
            country,
            address,
            pincode,
            street: '',
            state: '',

            gender,
            profile_pic: data?.image || "",
            password: encryptPassword,
          },
        });

        if (result) {

          return NextResponse.json(
            { st: true, data: result, message: "user registered successfully" },
            { status: 200 }
          );

        } else {
          return NextResponse.json(
            { data: {}, message: "user registered unsuccessfully" },
            { status: 500 }
          );
        }
      }
    }
    // else if (type === "update") {
    //   let data = {};
    //   const user = await prisma.user.findFirst({
    //     where: { id: userId },
    //   });

    //   if (profile_pic instanceof File && profile_pic.size > 0) {
    //     const bytes = await profile_pic.arrayBuffer();
    //     const buffer = Buffer.from(bytes);
    //     const imageName = `${Date.now()}_${profile_pic.name}`;

    //     const path = `${process.cwd()}/public/users/${imageName}`;
    //     await writeFile(path, buffer);
    //     data.image = imageName;

    //     const path2 = `${process.cwd()}/public/users/${user.profile_pic}`;
    //     await unlink(path2);
    //   }

    //   if (user) {
    //     const result = await prisma.user.update({
    //       where: { id: userId },
    //       data: {
    //         email,
    //         name,
    //         mobile,
    //         country_code,
    //         gender,
    //         profile_pic: data?.image,
    //       },
    //     });

    //     if (result) {
    //       return NextResponse.json(
    //         { st: true, data: result, message: "user updated successfully!!" },
    //         { status: 200 }
    //       );
    //     } else {
    //       return NextResponse.json(
    //         { st: false, data: {}, message: "user not updated" },
    //         { status: 500 }
    //       );
    //     }
    //   } else {
    //     return NextResponse.json(
    //       { st: false, data: {}, message: "user not found" },
    //       { status: 404 }
    //     );
    //   }
    // }

  } catch (error) {
    console.log("error::: ", error);
    return NextResponse.json(
      { st: false, data: {}, message: error },
      { status: 500 }
    );
  }
}
