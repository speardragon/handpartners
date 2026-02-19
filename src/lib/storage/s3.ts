import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const S3_ENV_KEYS = {
  bucket: ["AWS_S3_BUCKET"] as const,
  // AWS_S3_* 를 우선 체크: Vercel/Lambda 환경에서 AWS_REGION, AWS_ACCESS_KEY_ID 등은
  // Lambda 런타임이 자동 주입하는 예약 변수라 사용자 설정이 덮어씌워짐
  region: ["AWS_S3_REGION", "AWS_REGION"] as const,
  accessKeyId: ["AWS_S3_ACCESS_KEY_ID", "AWS_ACCESS_KEY_ID"] as const,
  secretAccessKey: [
    "AWS_S3_SECRET_ACCESS_KEY",
    "AWS_SECRET_ACCESS_KEY",
  ] as const,
};

function resolveEnvValue(keys: readonly string[]): string {
  for (const key of keys) {
    const value = process.env[key];
    if (value && value.trim()) {
      return value.trim();
    }
  }

  return "";
}

function getS3ClientAndConfig() {
  const bucket = resolveEnvValue(S3_ENV_KEYS.bucket);
  const region = resolveEnvValue(S3_ENV_KEYS.region);
  const accessKeyId = resolveEnvValue(S3_ENV_KEYS.accessKeyId);
  const secretAccessKey = resolveEnvValue(S3_ENV_KEYS.secretAccessKey);
  const endpoint = process.env.AWS_S3_ENDPOINT;
  const publicUrlBase = process.env.AWS_S3_PUBLIC_URL_BASE;

  if (!bucket) {
    throw new Error("Missing env.AWS_S3_BUCKET");
  }
  if (!region) {
    throw new Error("Missing env.AWS_REGION (or AWS_S3_REGION)");
  }
  if (!accessKeyId) {
    throw new Error("Missing env.AWS_ACCESS_KEY_ID (or AWS_S3_ACCESS_KEY_ID)");
  }
  if (!secretAccessKey) {
    throw new Error(
      "Missing env.AWS_SECRET_ACCESS_KEY (or AWS_S3_SECRET_ACCESS_KEY)"
    );
  }

  const client = new S3Client({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    ...(endpoint
      ? {
          endpoint,
          forcePathStyle: true,
        }
      : {}),
  });

  return {
    client,
    bucket,
    region,
    publicUrlBase: publicUrlBase ?? "",
  };
}

function encodeS3KeyPath(key: string) {
  return key
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

function getPublicUrl(
  bucket: string,
  region: string,
  publicUrlBase: string,
  key: string
) {
  const base = publicUrlBase
    ? publicUrlBase.replace(/\/+$/, "")
    : `https://${bucket}.s3.${region}.amazonaws.com`;

  return `${base}/${encodeS3KeyPath(key)}`;
}

export async function uploadPdfToS3(
  file: File,
  objectKey: string
): Promise<string> {
  const { client, bucket, region, publicUrlBase } = getS3ClientAndConfig();
  const body = new Uint8Array(await file.arrayBuffer());

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: objectKey,
      Body: body,
      ContentType: file.type || "application/pdf",
    })
  );

  return getPublicUrl(bucket, region, publicUrlBase, objectKey);
}

export async function createPresignedUploadUrl(args: {
  objectKey: string;
  contentType?: string;
  expiresInSeconds?: number;
}) {
  const envExpiresRaw = process.env.AWS_S3_PRESIGNED_EXPIRES_IN;
  const envExpires = Number(envExpiresRaw);
  const defaultExpiresIn =
    Number.isFinite(envExpires) && envExpires > 0 ? envExpires : 300;
  const { objectKey, contentType, expiresInSeconds = defaultExpiresIn } = args;
  const { client, bucket, region, publicUrlBase } = getS3ClientAndConfig();

  const uploadUrl = await getSignedUrl(
    client,
    new PutObjectCommand({
      Bucket: bucket,
      Key: objectKey,
      ContentType: contentType || "application/pdf",
    }),
    { expiresIn: expiresInSeconds }
  );

  return {
    uploadUrl,
    publicUrl: getPublicUrl(bucket, region, publicUrlBase, objectKey),
    objectKey,
  };
}

function extractObjectKeyFromPath(bucket: string, objectPathOrUrl: string) {
  const raw = objectPathOrUrl.trim();
  if (!raw) return "";

  if (!/^https?:\/\//i.test(raw)) {
    return raw;
  }

  try {
    const parsed = new URL(raw);
    const decodedPath = decodeURIComponent(parsed.pathname || "");
    const path = decodedPath.replace(/^\/+/, "");
    const bucketPrefix = `${bucket}/`;

    if (path.startsWith(bucketPrefix)) {
      return path.slice(bucketPrefix.length);
    }

    return path;
  } catch {
    return raw;
  }
}

export async function createPresignedDownloadUrl(args: {
  objectPathOrUrl: string;
  expiresInSeconds?: number;
}) {
  const envExpiresRaw = process.env.AWS_S3_PRESIGNED_GET_EXPIRES_IN;
  const envExpires = Number(envExpiresRaw);
  const defaultExpiresIn =
    Number.isFinite(envExpires) && envExpires > 0 ? envExpires : 300;

  const { objectPathOrUrl, expiresInSeconds = defaultExpiresIn } = args;
  const { client, bucket, region, publicUrlBase } = getS3ClientAndConfig();
  const objectKey = extractObjectKeyFromPath(bucket, objectPathOrUrl);

  if (!objectKey) {
    throw new Error("Missing object key for S3 download URL");
  }

  const downloadUrl = await getSignedUrl(
    client,
    new GetObjectCommand({
      Bucket: bucket,
      Key: objectKey,
    }),
    {
      expiresIn: expiresInSeconds,
    }
  );

  return {
    downloadUrl,
    objectKey,
    publicUrl: getPublicUrl(bucket, region, publicUrlBase, objectKey),
  };
}
