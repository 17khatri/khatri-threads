import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/auth";
import { Prisma } from "@prisma/client";

function toSlug(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

async function getAdminError() {
    const user = await getCurrentUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "ADMIN") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return null;
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const adminError = await getAdminError();
    if (adminError) return adminError;

    const { id } = await params;
    const body = await req.json();
    const name = String(body.name || "").trim();
    const slug = toSlug(name);
    if (!name) {
        return NextResponse.json(
            { error: "Category name is required.", },
            { status: 400 }
        );
    }

    try {
        const category = await prisma.category.update({
            where: {
                id,
            },
            data: {
                name,
                slug,
            },
        });
        return NextResponse.json(category);
    } catch (error: unknown) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002"
        ) {
            return NextResponse.json(
                { error: "Category name already exists.", },
                { status: 400, }
            );
        }
        console.error(error);
        return NextResponse.json(
            { error: "Failed to update category.", },
            { status: 500, }
        );
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const adminError = await getAdminError();
    if (adminError) return adminError;

    const { id } = await params;

    await prisma.category.delete({
        where: {
            id,
        },
    });

    return NextResponse.json({
        success: true,
        message: "Category deleted successfully.",
    });
}
