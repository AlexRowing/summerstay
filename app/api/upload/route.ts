import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

// Issues short-lived upload tokens so the browser can send listing photos
// straight to Vercel Blob (big phone photos never pass through our server).
// Needs BLOB_READ_WRITE_TOKEN, which Vercel sets once a Blob store is
// connected to the project.
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        // Only signed-in hosts may upload, and only into the listings folder.
        const session = await auth();
        if (!session?.user?.id) throw new Error("Log in to upload photos.");
        if (!pathname.startsWith("listings/")) {
          throw new Error("Invalid upload path.");
        }
        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/webp"],
          maximumSizeInBytes: 10 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 },
    );
  }
}
