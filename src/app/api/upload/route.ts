import { NextRequest, NextResponse } from "next/server";
import formidable, { File } from "formidable";
import fs from "fs/promises";
import path from "path";
import { Readable } from "stream";
import type { IncomingMessage } from "http";

export const config = {
  api: {
    bodyParser: false, // 🔥 Necesario para manejar archivos en Next.js
  },
};

// 📂 **Verifica si la carpeta `/public/uploads` existe y créala si no**
const uploadDir = path.join(process.cwd(), "public/uploads");
async function ensureUploadDir() {
  try {
    await fs.mkdir(uploadDir, { recursive: true });
  } catch (error) {
    console.error("❌ Error creando la carpeta de uploads:", error);
  }
}

// ✅ **Convierte `NextRequest` a `IncomingMessage`**
async function toNodeRequest(req: NextRequest): Promise<IncomingMessage> {
  const bodyBuffer = await req.arrayBuffer();
  const stream = Readable.from(Buffer.from(bodyBuffer));

  const headers = new Headers(req.headers);
  headers.set("content-length", String(bodyBuffer.byteLength));

  return Object.assign(stream, {
    headers: Object.fromEntries(headers.entries()),
    method: req.method,
    url: req.url,
  }) as unknown as IncomingMessage;
}

// ✅ **Maneja la subida de imágenes con Formidable 1.2.6**
export async function POST(req: NextRequest) {
  await ensureUploadDir();
  const nodeReq = await toNodeRequest(req);

  const form = new formidable.IncomingForm();
  form.uploadDir = uploadDir; // 📂 Guardar en `/public/uploads`
  form.keepExtensions = true; // 🔥 Mantener extensión original
  form.multiples = false; // 📌 Asegurar que solo sube 1 archivo

  return new Promise((resolve) => {
    form.parse(nodeReq, async (err, fields, files) => {
      if (err) {
        console.error("❌ Error al subir archivo:", err);
        return resolve(NextResponse.json({ error: "Error al subir archivo" }, { status: 500 }));
      }

      console.log("📢 Archivos recibidos:", files);

      // **✅ Validar `files.file` correctamente**
      const fileArray = Array.isArray(files.file) ? files.file : [files.file];
      if (!fileArray || fileArray.length === 0 || !fileArray[0]) {
        console.error("❌ No se encontró `file.path` en los archivos:", files);
        return resolve(NextResponse.json({ error: "No se pudo determinar el nombre del archivo" }, { status: 500 }));
      }

      const file = fileArray[0] as File;

      console.log("📢 Información completa del archivo recibido:", file);

      // **✅ Usar `file.path` en lugar de `file.filepath`**
      if (!file.path) {
        console.error("❌ No se pudo determinar la ruta del archivo:", file);
        return resolve(NextResponse.json({ error: "No se pudo determinar la ruta del archivo" }, { status: 500 }));
      }

      const fileUrl = `/uploads/${path.basename(file.path)}`;
      console.log("📢 Archivo subido con éxito:", fileUrl);

      resolve(NextResponse.json({ url: fileUrl }, { status: 200 }));
    });
  });
}
