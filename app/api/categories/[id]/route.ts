import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const body = await req.json();
    const name = String(body.name || "").trim();
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
