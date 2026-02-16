import { NextResponse } from "next/server";
import { getInputById, getIdeasByInputId, deleteInput } from "@/lib/db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const inputId = parseInt(id, 10);

    if (isNaN(inputId)) {
      return NextResponse.json(
        { error: "Invalid ID" },
        { status: 400 }
      );
    }

    const input = getInputById(inputId);
    if (!input) {
      return NextResponse.json(
        { error: "Input not found" },
        { status: 404 }
      );
    }

    const ideas = getIdeasByInputId(inputId);

    return NextResponse.json({
      input,
      ideas,
    });
  } catch (error) {
    console.error("Error fetching history item:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const inputId = parseInt(id, 10);

    if (isNaN(inputId)) {
      return NextResponse.json(
        { error: "Invalid ID" },
        { status: 400 }
      );
    }

    const deleted = deleteInput(inputId);
    if (!deleted) {
      return NextResponse.json(
        { error: "Input not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting history item:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
