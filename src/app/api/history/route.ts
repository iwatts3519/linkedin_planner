import { NextResponse } from "next/server";
import { getHistory, getHistoryCount } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 100);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    const history = getHistory(limit, offset);
    const total = getHistoryCount();

    return NextResponse.json({
      history,
      total,
      hasMore: offset + history.length < total,
    });
  } catch (error) {
    console.error("Error fetching history:", error);

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
