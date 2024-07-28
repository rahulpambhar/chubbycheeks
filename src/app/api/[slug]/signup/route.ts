import axios from "axios";
import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/prismaClient";
import { PrismaClient } from "@prisma/client";
import { hashSync, genSaltSync } from "bcrypt";
import { writeFile } from "fs/promises";
import { unlink } from "fs/promises";
import { parse } from "url";
import fast2sms from 'fast-two-sms';
import authOptions from "@/app/api/auth/[...nextauth]/auth";
import twilio from "twilio";
import { getServerSession } from "next-auth";

const twilioPharse = "Y196Y5G4X93JDVGZTGDHCZ4M"
const accountSid = "AC0e052bd904a903e8a0f93f7db125bd86";
const authToken = "4a476f0a099f0e598df00b5d9663955d";

export async function POST(request: Request) {

  let session: any = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const isAdmin = session?.user?.isAdmin;
  const { query } = parse(request.url, true);

  const formData = await request.formData();
  const name: any = formData.get("name");
  const email: any = formData.get("email");
  const gender: any = formData.get("gender");
  const profile_pic = formData.get("profile_pic");

  const country_code: any = formData.get("country_code");
  const mobile: any = formData.get("mobile");

  const address: any = formData.get("address");
  const city: any = formData.get("city");
  const state: any = formData.get("state");
  const country: any = formData.get("country");
  const pincode: any = formData.get("pincode");

  const password: any = formData.get("password");
  const type = formData.get("type");


  try {
    if (type === "add" && email && mobile) {

      const user = await prisma?.user?.findFirst({
        where: {
          OR: [{ email }, { mobile }],
        },
      });


      if (user) {

        return NextResponse.json({ st: false, data: {}, msg: "User already exists" }, { status: 200 });

      } else {
        let data: any = {};

        if (profile_pic instanceof File && profile_pic.size > 0) {
          const bytes = await profile_pic.arrayBuffer();
          const buffer = Buffer.from(bytes);
          const imageName = `${Date.now()}_${profile_pic.name}`;

          const path = `${process.cwd()}/public/users/${imageName}`;
          await writeFile(path, buffer);
          data.image = imageName;
        }

        const salt = genSaltSync(10);
        const encryptPassword: any = hashSync(password, salt);

        const result = await prisma.user.create({
          data: {
            name,
            email,
            gender,
            profile_pic: data?.image || "",

            country_code,
            mobile,

            address,
            city,
            state,
            country,
            pincode,

            password: encryptPassword,
          },
        });

        if (result) {

          return NextResponse.json(
            { st: true, data: result, msg: "Registered successfully" },
            { status: 200 }
          );

        } else {
          return NextResponse.json(
            { data: {}, msg: "Something went wrong" },
            { status: 500 }
          );
        }
      }
    } else {
      const email_: any = formData.get("email");
      const otp: any = formData.get("otp");
      let data: any = {};
      let result: any = {};
      let user: any = {}

      if (email_) {
        user = await prisma.user.findFirst({
          where: { email: email_?.email },
        });

        if (parseInt(otp) !== user?.otp) {
          return NextResponse.json({ st: false, data: {}, msg: "Invalid Access" }, { status: 200 });
        }
      } else {
        user = await prisma.user.findFirst({
          where: { id: userId },
        });

      }


      if (!user) return NextResponse.json({ st: false, data: {}, msg: "User not found" }, { status: 200 });

      if (profile_pic instanceof File && profile_pic.size > 0 && user && type === "updateProfilePic") {
        const bytes = await profile_pic.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const imageName = `${Date.now()}_${profile_pic.name}`;

        const path = `${process.cwd()}/public/users/${imageName}`;
        await writeFile(path, buffer);
        data.profile_pic = imageName;

        const path2 = `${process.cwd()}/public/users/${user.profile_pic}`;
        await unlink(path2);

      } else {
        if (type === "updatePassword") {
          const salt = genSaltSync(10);
          data.password = hashSync(password, salt);
          data.otp = null;
        } else {
          data.name = name
          data.email = email
          data.gender = gender

          data.country_code = country_code
          data.mobile = mobile

          data.address = address
          data.city = city
          data.state = state
          data.country = country
          data.pincode = pincode

        }
      }

      result = await prisma.user.update({
        where: { id: user?.id }, data
      });

      if (result) {
        return NextResponse.json(
          { st: true, data: result, msg: "Updated successfully!!" },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { st: false, data: {}, msg: "Updating failed" },
          { status: 500 }
        );
      }
    }


  } catch (error) {
    console.log("error::: ", error);
    return NextResponse.json(
      { st: false, data: {}, msg: error },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {

  try {
    let session: any = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({
        st: false,
        data: [],
        msg: "Login first.",
      });
    }

    const { query }: any = parse(request.url, true);
    let { id, }: any = query;


    const user = await prisma.user.findFirst({
      where: { id, isBlocked: false },
      select: {
        name: true, email: true, gender: true, profile_pic: true, country_code: true, mobile: true, address: true, city: true, state: true, country: true, pincode: true,
      },

    });

    if (user) {

      return NextResponse.json({ st: true, data: user, msg: "User found" }, { status: 200 });
    } else {

      return NextResponse.json({ st: false, data: {}, msg: "User not found" }, { status: 404 });
    }



  } catch (error) {

    return NextResponse.json({ st: false, data: {}, msg: error }, { status: 500 });
  }
}

