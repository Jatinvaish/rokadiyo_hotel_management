import { FastifyRequest } from 'fastify';

export async function parseMultipartRequest<T = any>(req: FastifyRequest) {
  const parts = req.parts();
  const fields: any = {};
  const files: any[] = [];

  for await (const part of parts) {
    if (part.type === 'file') {
      const buffer = await part.toBuffer();
      files.push({
        fieldname: part.fieldname,
        filename: part.filename,
        mimetype: part.mimetype,
        encoding: part.encoding,
        buffer: buffer,
      });
    } else {
      // It's a field
      fields[part.fieldname] = part.value;
    }
  }

  // Try to parse JSON fields if they look like JSON
  Object.keys(fields).forEach(key => {
    try {
      if (typeof fields[key] === 'string' && (fields[key].startsWith('{') || fields[key].startsWith('['))) {
        fields[key] = JSON.parse(fields[key]);
      }
    } catch (e) {
      // Ignore
    }
  });

  return { fields: fields as T, files };
}
