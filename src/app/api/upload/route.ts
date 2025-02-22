import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export const config = {
  api: {
    bodyParser: false, // Necesario para manejar archivos en Next.js
  },
};

// Verifica si la carpeta `/public/uploads` existe y créala si no
const uploadDir = path.join(process.cwd(), "public/uploads");
async function ensureUploadDir() {
  try {
    await fs.mkdir(uploadDir, { recursive: true });
  } catch (error) {
    console.error("Error creando la carpeta de uploads:", error);
  }
}

export async function POST(req: NextRequest) {
  await ensureUploadDir();

  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No se encontró el archivo" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filePath = path.join(uploadDir, file.name);

  try {
    await fs.writeFile(filePath, buffer);
    const fileUrl = `/uploads/${file.name}`;
    console.log("Archivo subido con éxito:", fileUrl);
    return NextResponse.json({ url: fileUrl }, { status: 200 });
  } catch (error) {
    console.error("Error al guardar el archivo:", error);
    return NextResponse.json({ error: "Error al guardar el archivo" }, { status: 500 });
  }
}
