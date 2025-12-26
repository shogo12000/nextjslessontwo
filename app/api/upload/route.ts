import { NextResponse } from "next/server";
import cloudinary from "@/src/lib/cloudinary";
import { getUserLogin, savePhoto } from "@/ui/actions/actions";


export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const files = formData.getAll("files") as File[];
        const workAddress = formData.get("workAddress")?.toString() ?? "";

        console.log("wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww")
        console.log(workAddress);
        if (!files || files.length === 0) {
            return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
        }

        const uploadedFiles: { url: string; publicId: string; originalName: string }[] = [];

        const user = await getUserLogin();

        if (!user?.id) {
            return NextResponse.json(
                { error: "Usuário não autenticado" },
                { status: 401 }
            );
        }

        for (const file of files) {
            if (!file.type.startsWith("image/")) continue; // apenas imagens
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uploadResult: any = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { folder: "uploads" },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    }
                ).end(buffer);
            });

            const result = await savePhoto(uploadResult, file, user, workAddress);

            if (!result.success) {
                return NextResponse.json(
                    { error: "Erro ao salvar foto no banco" },
                    { status: 500 }
                );
            }
            uploadedFiles.push({
                url: uploadResult.secure_url,
                publicId: uploadResult.public_id,
                originalName: file.name,
            });
        }

        return NextResponse.json({ success: true, uploadedFiles });
    } catch (error) {
        console.log("Upload Error: ", error);
        return NextResponse.json(
            { error: "Erro Interno no upload" },
            { status: 500 })
    }
}


