"use server";

import { Database } from "types_db";
import { USER_ROLES } from "@/constants/auth";
import { raiseActionError, withActionResult } from "@/lib/action";
import { createClient } from "@/lib/supabase/server";
import {
  createPresignedDownloadUrl,
  createS3PresignedUploadUrl,
} from "@/lib/storage/s3";
import { generateMentoringId } from "@/lib/utils/mentoring-id";

export type MentoringStatus = Database["public"]["Enums"]["mentoring_status"];
export type MentoringRow = Database["public"]["Tables"]["mentoring"]["Row"];
export type MentoringRowInsert =
  Database["public"]["Tables"]["mentoring"]["Insert"];
export type MentoringRowUpdate =
  Database["public"]["Tables"]["mentoring"]["Update"];

export interface MentoringProgramSummary {
  id: number;
  name: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
}

export interface MentoringAssignment {
  company_id: number;
  company_name: string;
  company_description: string | null;
  representative_name: string | null;
  mentor_id: string | null;
  mentor_name: string | null;
  mentor_affiliation: string | null;
  mentor_position: string | null;
  claimed_at: string | null;
  is_mine: boolean;
  can_claim: boolean;
  session_count: number;
  last_mentored_at: string | null;
}

export interface MentoringSessionPhoto {
  id: number;
  photo_path: string;
  original_filename: string | null;
  sort_order: number;
  download_url: string | null;
}

export interface MentoringSession {
  id: number;
  company_id: number;
  company_name: string;
  mentor_id: string;
  mentor_name: string | null;
  mentor_affiliation: string | null;
  mentor_position: string | null;
  mentor_signature_url: string | null;
  session_no: number;
  mentored_at: string;
  place: string | null;
  content: string | null;
  created_at: string;
  updated_at: string;
  photos: MentoringSessionPhoto[];
  can_edit: boolean;
}

export interface MentoringListItem {
  id: string;
  status: MentoringStatus;
  program: MentoringProgramSummary;
  report_logo_url: string | null;
  number_of_companies: number;
  assigned_company_count: number;
  my_company_count: number;
  number_of_sessions: number;
  recent_mentored_at: string | null;
}

export interface MentoringListResult {
  items: MentoringListItem[];
  isAdminView: boolean;
  currentPage: number;
  totalPages: number;
  totalElements: number;
  totalActive: number;
  totalCompleted: number;
  totalPending: number;
  hasNextPage: boolean;
}

export interface MentoringWithStatus extends MentoringRow {
  program: MentoringProgramSummary;
  report_logo_url: string | null;
  number_of_companies: number;
  number_of_users: number;
  number_of_sessions: number;
  recent_mentored_at: string | null;
  assigned_company_count: number;
  my_company_count: number;
  isAdminView: boolean;
  assignments: MentoringAssignment[];
  sessions: MentoringSession[];
}

export interface MentoringManagementSummary extends MentoringRow {
  program: MentoringProgramSummary;
  report_logo_url: string | null;
  number_of_companies: number;
  number_of_users: number;
  number_of_sessions: number;
  recent_mentored_at: string | null;
  companies: MentoringAssignment[];
  mentors: {
    id: string;
    name: string;
    affiliation: string | null;
    assigned_company_count: number;
  }[];
  recent_sessions: Array<{
    id: number;
    company_id: number;
    company_name: string;
    mentor_name: string | null;
    session_no: number;
    mentored_at: string;
    place: string | null;
    content: string | null;
  }>;
}

type ViewerContext = {
  supabase: Awaited<ReturnType<typeof createClient>>;
  viewer: {
    id: string;
    name: string;
    role: string;
    affiliation: string | null;
  };
  isAdmin: boolean;
};

function normalizeProgram(
  program: Partial<MentoringProgramSummary> | null | undefined
): MentoringProgramSummary {
  return {
    id: program?.id ?? 0,
    name: program?.name ?? "",
    description: program?.description ?? null,
    start_date: program?.start_date ?? null,
    end_date: program?.end_date ?? null,
  };
}

async function safePresignedUrl(
  path: string | null | undefined,
  expiresInSeconds?: number
): Promise<string | null> {
  if (!path) return null;
  try {
    const result = await createPresignedDownloadUrl({
      objectPathOrUrl: path,
      ...(expiresInSeconds ? { expiresInSeconds } : {}),
    });
    return result.downloadUrl;
  } catch {
    return null;
  }
}

function takeFirstRelation<T>(value: unknown): T | null {
  if (Array.isArray(value)) {
    return (value[0] as T | undefined) ?? null;
  }
  return (value as T | null | undefined) ?? null;
}

function isWebpUpload(fileName: string, contentType?: string) {
  const normalizedType = contentType?.toLowerCase();
  const normalizedName = fileName.toLowerCase();

  return normalizedType === "image/webp" || normalizedName.endsWith(".webp");
}

function assertNonWebpUpload(fileName: string, contentType?: string) {
  if (isWebpUpload(fileName, contentType)) {
    throw new Error(
      "WEBP 이미지는 업로드할 수 없습니다. PNG 또는 JPG 파일을 사용해주세요."
    );
  }
}

async function getViewerContext(): Promise<ViewerContext> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("User not authenticated");
  }

  const { data: viewer, error: viewerError } = await supabase
    .from("user")
    .select("id, username, role, affiliation")
    .eq("id", user.id)
    .single();

  if (viewerError || !viewer) {
    raiseActionError(viewerError || new Error("사용자 정보를 찾을 수 없습니다."));
  }

  return {
    supabase,
    viewer: {
      id: viewer.id,
      name: viewer.username,
      role: viewer.role,
      affiliation: viewer.affiliation,
    },
    isAdmin: viewer.role === USER_ROLES.ADMIN,
  };
}

async function assertAdmin(context?: ViewerContext) {
  const resolved = context ?? (await getViewerContext());
  if (!resolved.isAdmin) {
    throw new Error("관리자만 접근할 수 있습니다.");
  }
  return resolved;
}

async function ensureMentoringParticipant(
  context: ViewerContext,
  mentoringId: string
) {
  const { data, error } = await context.supabase
    .from("mentoring_user")
    .select("id")
    .eq("mentoring_id", mentoringId)
    .eq("user_id", context.viewer.id)
    .maybeSingle();

  if (error) {
    raiseActionError(error);
  }

  if (!data) {
    throw new Error("해당 멘토링에 참여 권한이 없습니다.");
  }
}

async function getMentoringBase(
  supabase: Awaited<ReturnType<typeof createClient>>,
  mentoringId: string
) {
  const { data, error } = await supabase
    .from("mentoring")
    .select(
      `
      *,
      program:program_id (
        id,
        name,
        description,
        start_date,
        end_date
      )
    `
    )
    .eq("id", mentoringId)
    .single();

  if (error || !data) {
    raiseActionError(error || new Error("멘토링 정보를 불러오지 못했습니다."));
  }

  const reportLogoUrl = await safePresignedUrl(data.report_logo_path, 600);

  return {
    ...data,
    report_logo_url: reportLogoUrl,
    program: normalizeProgram(
      data.program as unknown as MentoringProgramSummary | null
    ),
  };
}

function buildAssignmentStats(
  assignments: Array<{
    company_id: number;
    mentor_id: string | null;
  }>,
  viewerId: string
) {
  const assignedCompanyCount = assignments.filter(
    (item) => item.mentor_id !== null
  ).length;
  const myCompanyCount = assignments.filter(
    (item) => item.mentor_id === viewerId
  ).length;

  return { assignedCompanyCount, myCompanyCount };
}

export async function ensureMentoringForProgram(
  programId: number
): Promise<MentoringRow> {
  const supabase = await createClient();

  const { data: existing, error: existingError } = await supabase
    .from("mentoring")
    .select("*")
    .eq("program_id", programId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (existingError) {
    raiseActionError(existingError);
  }

  if (existing) {
    return existing;
  }

  const { error: programError } = await supabase
    .from("program")
    .select("id")
    .eq("id", programId)
    .single();

  if (programError) {
    raiseActionError(programError);
  }

  const { data: created, error: createError } = await supabase
    .from("mentoring")
    .insert({
      id: generateMentoringId(),
      program_id: programId,
      status: "PENDING",
      created_at: new Date().toISOString(),
    })
    .select("*")
    .single();

  if (createError || !created) {
    raiseActionError(createError || new Error("멘토링 생성에 실패했습니다."));
  }

  return created;
}

export async function createMentoring(mentoring: MentoringRowInsert) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("mentoring")
    .insert({
      ...mentoring,
      id: generateMentoringId(),
      created_at: new Date().toISOString(),
      status: mentoring.status ?? "PENDING",
    })
    .select("*")
    .single();

  if (error) {
    raiseActionError(error);
  }

  return data;
}

export async function updateMentoring(mentoring: MentoringRowUpdate) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("mentoring")
    .update({
      ...mentoring,
    })
    .eq("id", mentoring.id!)
    .select("*")
    .single();

  if (error) {
    raiseActionError(error);
  }

  return data;
}

export async function updateMentoringStatus(
  mentoringId: string,
  status: MentoringStatus
) {
  return withActionResult(async () => {
    const context = await assertAdmin();

    const { data, error } = await context.supabase
      .from("mentoring")
      .update({ status })
      .eq("id", mentoringId)
      .select("*")
      .single();

    if (error) {
      raiseActionError(error);
    }

    return data;
  });
}

export async function getMentoringByProgramId(
  programId: number
): Promise<MentoringManagementSummary> {
  const context = await assertAdmin();
  const mentoring = await ensureMentoringForProgram(programId);
  const base = await getMentoringBase(context.supabase, mentoring.id);

  const [
    { data: companies, error: companiesError },
    { data: mentors, error: mentorsError },
    { data: sessions, error: sessionsError },
  ] = await Promise.all([
    context.supabase
      .from("mentoring_company")
      .select(
        `
          company_id,
          mentor_id,
          claimed_at,
          company:company_id (
            id,
            name,
            description,
            representative_name
          ),
          mentor:mentor_id (
            id,
            username,
            affiliation,
            position
          )
        `
      )
      .eq("mentoring_id", mentoring.id)
      .order("created_at", { ascending: true }),
    context.supabase
      .from("mentoring_user")
      .select(
        `
          user_id,
          user:user_id (
            id,
            username,
            affiliation
          )
        `
      )
      .eq("mentoring_id", mentoring.id)
      .order("created_at", { ascending: true }),
    context.supabase
      .from("mentoring_session")
      .select(
        `
          id,
          company_id,
          mentor_id,
          session_no,
          mentored_at,
          place,
          content,
          company:company_id (
            id,
            name
          ),
          mentor:mentor_id (
            id,
            username,
            affiliation,
            position
          )
        `
      )
      .eq("mentoring_id", mentoring.id)
      .order("mentored_at", { ascending: false }),
  ]);

  if (companiesError) raiseActionError(companiesError);
  if (mentorsError) raiseActionError(mentorsError);
  if (sessionsError) raiseActionError(sessionsError);

  const sessionStats = new Map<
    number,
    { count: number; lastMentoredAt: string | null }
  >();

  (sessions ?? []).forEach((session) => {
    const current = sessionStats.get(session.company_id) ?? {
      count: 0,
      lastMentoredAt: null,
    };
    current.count += 1;
    if (
      !current.lastMentoredAt ||
      session.mentored_at > current.lastMentoredAt
    ) {
      current.lastMentoredAt = session.mentored_at;
    }
    sessionStats.set(session.company_id, current);
  });

  const mentoringCompanies: MentoringAssignment[] = (companies ?? []).map(
    (item) => {
      const stats = sessionStats.get(item.company_id);
      const mentor = takeFirstRelation<{
        id: string;
        username: string;
        affiliation: string | null;
        position: string | null;
      }>(item.mentor as unknown);
      const company = takeFirstRelation<{
        id: number;
        name: string;
        description: string | null;
        representative_name: string | null;
      }>(item.company as unknown);

      return {
        company_id: item.company_id,
        company_name: company?.name ?? "",
        company_description: company?.description ?? null,
        representative_name: company?.representative_name ?? null,
        mentor_id: item.mentor_id,
        mentor_name: mentor?.username ?? null,
        mentor_affiliation: mentor?.affiliation ?? null,
        mentor_position: mentor?.position ?? null,
        claimed_at: item.claimed_at,
        is_mine: false,
        can_claim: false,
        session_count: stats?.count ?? 0,
        last_mentored_at: stats?.lastMentoredAt ?? null,
      };
    }
  );

  const assignedCounts = new Map<string, number>();
  mentoringCompanies.forEach((company) => {
    if (!company.mentor_id) return;
    assignedCounts.set(
      company.mentor_id,
      (assignedCounts.get(company.mentor_id) ?? 0) + 1
    );
  });

  const mentoringMentors = (mentors ?? []).map((item) => {
    const user = takeFirstRelation<{
      id: string;
      username: string;
      affiliation: string | null;
    }>(item.user as unknown);

    return {
      id: item.user_id,
      name: user?.username ?? "",
      affiliation: user?.affiliation ?? null,
      assigned_company_count: assignedCounts.get(item.user_id) ?? 0,
    };
  });

  return {
    ...base,
    number_of_companies: mentoringCompanies.length,
    number_of_users: mentoringMentors.length,
    number_of_sessions: sessions?.length ?? 0,
    recent_mentored_at: sessions?.[0]?.mentored_at ?? null,
    companies: mentoringCompanies,
    mentors: mentoringMentors,
    recent_sessions: (sessions ?? []).slice(0, 8).map((session) => ({
      id: session.id,
      company_id: session.company_id,
      company_name:
        takeFirstRelation<{ id: number; name: string }>(
          session.company as unknown
        )?.name ?? "",
      mentor_name:
        takeFirstRelation<{ id: string; username: string }>(
          session.mentor as unknown
        )?.username ?? null,
      session_no: session.session_no,
      mentored_at: session.mentored_at,
      place: session.place,
      content: session.content,
    })),
  };
}

export async function getAllMentorings(
  page = 1,
  size = 12,
  search?: string
): Promise<MentoringListResult> {
  const context = await getViewerContext();

  let query = context.supabase
    .from("mentoring")
    .select(
      `
      id,
      status,
      created_at,
      report_logo_path,
      program:program_id (
        id,
        name,
        description,
        start_date,
        end_date
      ),
      companies:mentoring_company (
        company_id,
        mentor_id
      ),
      sessions:mentoring_session (
        id,
        mentored_at
      )
    `
    )
    .order("created_at", { ascending: false });

  if (!context.isAdmin) {
    query = context.supabase
      .from("mentoring")
      .select(
        `
        id,
        status,
        created_at,
        report_logo_path,
        program:program_id (
          id,
          name,
          description,
          start_date,
          end_date
        ),
        companies:mentoring_company (
          company_id,
          mentor_id
        ),
        sessions:mentoring_session (
          id,
          mentored_at
        ),
        mentoring_user!inner(
          user_id
        )
      `
      )
      .eq("mentoring_user.user_id", context.viewer.id)
      .order("created_at", { ascending: false });
  }

  const normalizedSearch = search?.trim();

  if (normalizedSearch) {
    const { data: programs, error: programError } = await context.supabase
      .from("program")
      .select("id")
      .ilike("name", `%${normalizedSearch}%`);

    if (programError) {
      raiseActionError(programError);
    }

    const matchedProgramIds = (programs ?? []).map((program) => program.id);
    const orClauses = [`id.ilike.%${normalizedSearch}%`];

    if (matchedProgramIds.length > 0) {
      orClauses.push(`program_id.in.(${matchedProgramIds.join(",")})`);
    }

    query = query.or(orClauses.join(","));
  }

  const { data, error } = await query;

  if (error) {
    raiseActionError(error);
  }

  const items = (
    (data ?? []) as Array<{
      id: string;
      status: MentoringStatus;
      created_at: string;
      report_logo_path: string | null;
      program: Partial<MentoringProgramSummary> | null;
      companies: Array<{ company_id: number; mentor_id: string | null }>;
      sessions: Array<{ id: number; mentored_at: string }>;
    }>
  ).map(async (item) => {
    const { assignedCompanyCount, myCompanyCount } = buildAssignmentStats(
      item.companies ?? [],
      context.viewer.id
    );
    const recentMentoredAt =
      (item.sessions ?? []).reduce<string | null>((latest, session) => {
        if (!latest || session.mentored_at > latest) {
          return session.mentored_at;
        }
        return latest;
      }, null) ?? null;

    const reportLogoUrl = await safePresignedUrl(item.report_logo_path, 600);

    return {
      id: item.id,
      status: item.status,
      program: normalizeProgram(item.program),
      report_logo_url: reportLogoUrl,
      number_of_companies: item.companies?.length ?? 0,
      assigned_company_count: assignedCompanyCount,
      my_company_count: myCompanyCount,
      number_of_sessions: item.sessions?.length ?? 0,
      recent_mentored_at: recentMentoredAt,
      created_at: item.created_at,
    };
  });

  const resolvedItems = await Promise.all(items);

  let totalActive = 0;
  let totalCompleted = 0;
  let totalPending = 0;

  resolvedItems.forEach((item) => {
    if (item.status === "IN_PROGRESS") totalActive += 1;
    else if (item.status === "COMPLETED") totalCompleted += 1;
    else totalPending += 1;
  });

  resolvedItems.sort((a, b) => {
    const aSource =
      a.recent_mentored_at ?? a.program.start_date ?? a.created_at;
    const bSource =
      b.recent_mentored_at ?? b.program.start_date ?? b.created_at;

    return bSource.localeCompare(aSource);
  });

  const normalizedResolvedItems: MentoringListItem[] = resolvedItems.map(
    ({ created_at: _createdAt, ...item }) => item
  );

  const totalElements = normalizedResolvedItems.length;
  const totalPages = Math.max(1, Math.ceil(totalElements / size));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const pagedItems = normalizedResolvedItems.slice(
    (safePage - 1) * size,
    safePage * size
  );

  return {
    items: pagedItems,
    isAdminView: context.isAdmin,
    currentPage: safePage,
    totalPages,
    totalElements,
    totalActive,
    totalCompleted,
    totalPending,
    hasNextPage: safePage < totalPages,
  };
}

export async function getMentoringDetail(
  mentoringId: string
): Promise<MentoringWithStatus> {
  const context = await getViewerContext();
  const base = await getMentoringBase(context.supabase, mentoringId);

  if (!context.isAdmin) {
    await ensureMentoringParticipant(context, mentoringId);
  }

  const [
    { data: assignments, error: assignmentsError },
    { data: sessions, error: sessionsError },
    { data: mentors, error: mentorsError },
  ] = await Promise.all([
    context.supabase
      .from("mentoring_company")
      .select(
        `
          company_id,
          mentor_id,
          claimed_at,
          company:company_id (
            id,
            name,
            description,
            representative_name
          ),
          mentor:mentor_id (
            id,
            username,
            affiliation
          )
        `
      )
      .eq("mentoring_id", mentoringId)
      .order("created_at", { ascending: true }),
    context.supabase
      .from("mentoring_session")
      .select(
        `
          id,
          company_id,
          mentor_id,
          session_no,
          mentored_at,
          place,
          content,
          created_at,
          updated_at,
          company:company_id (
            id,
            name
          ),
          mentor:mentor_id (
            id,
            username,
            affiliation,
            position,
            signature_url
          ),
          photos:mentoring_session_photo (
            id,
            photo_path,
            original_filename,
            sort_order
          )
        `
      )
      .eq("mentoring_id", mentoringId)
      .order("mentored_at", { ascending: false }),
    context.supabase
      .from("mentoring_user")
      .select("user_id")
      .eq("mentoring_id", mentoringId),
  ]);

  if (assignmentsError) raiseActionError(assignmentsError);
  if (sessionsError) raiseActionError(sessionsError);
  if (mentorsError) raiseActionError(mentorsError);

  const availableMentorIds = new Set(
    (mentors ?? []).map((item) => item.user_id)
  );
  const isParticipant = availableMentorIds.has(context.viewer.id);
  const isAdminView = context.isAdmin && !isParticipant;

  const allAssignments = (assignments ?? []).map((item) => {
    const mentor = takeFirstRelation<{
      id: string;
      username: string;
      affiliation: string | null;
      position: string | null;
    }>(item.mentor as unknown);
    const company = takeFirstRelation<{
      id: number;
      name: string;
      description: string | null;
      representative_name: string | null;
    }>(item.company as unknown);

    return {
      company_id: item.company_id,
      company_name: company?.name ?? "",
      company_description: company?.description ?? null,
      representative_name: company?.representative_name ?? null,
      mentor_id: item.mentor_id,
      mentor_name: mentor?.username ?? null,
      mentor_affiliation: mentor?.affiliation ?? null,
      mentor_position: mentor?.position ?? null,
      claimed_at: item.claimed_at,
    };
  });

  const visibleAssignments = isAdminView
    ? allAssignments
    : allAssignments.filter(
        (item) =>
          item.mentor_id === context.viewer.id || item.mentor_id === null
      );
  const visibleCompanyIds = new Set(
    visibleAssignments.map((item) => item.company_id)
  );

  const sessionStats = new Map<
    number,
    { count: number; lastMentoredAt: string | null }
  >();

  const visibleSessionsRaw = (sessions ?? []).filter(
    (session) => context.isAdmin || visibleCompanyIds.has(session.company_id)
  );

  visibleSessionsRaw.forEach((session) => {
    const current = sessionStats.get(session.company_id) ?? {
      count: 0,
      lastMentoredAt: null,
    };
    current.count += 1;
    if (
      !current.lastMentoredAt ||
      session.mentored_at > current.lastMentoredAt
    ) {
      current.lastMentoredAt = session.mentored_at;
    }
    sessionStats.set(session.company_id, current);
  });

  const enrichedAssignments: MentoringAssignment[] = visibleAssignments.map(
    (item) => {
      const stats = sessionStats.get(item.company_id);
      return {
        ...item,
        is_mine: item.mentor_id === context.viewer.id,
        can_claim:
          !isAdminView &&
          base.status !== "COMPLETED" &&
          item.mentor_id === null &&
          availableMentorIds.has(context.viewer.id),
        session_count: stats?.count ?? 0,
        last_mentored_at: stats?.lastMentoredAt ?? null,
      };
    }
  );

  const mentoringSessions: MentoringSession[] = await Promise.all(
    visibleSessionsRaw.map(async (session) => {
      const photos = Array.isArray(session.photos)
        ? await Promise.all(
            session.photos.map(async (photo) => {
              return {
                id: photo.id,
                photo_path: photo.photo_path,
                original_filename: photo.original_filename,
                sort_order: photo.sort_order,
                download_url: await safePresignedUrl(photo.photo_path),
              };
            })
          )
        : [];

      const mentor = takeFirstRelation<{
        id: string;
        username: string;
        affiliation: string | null;
        position: string | null;
        signature_url: string | null;
      }>(session.mentor as unknown);
      const mentorSignatureUrl = await safePresignedUrl(
        mentor?.signature_url,
        600
      );

      return {
        id: session.id,
        company_id: session.company_id,
        company_name:
          takeFirstRelation<{ id: number; name: string }>(
            session.company as unknown
          )?.name ?? "",
        mentor_id: session.mentor_id,
        mentor_name: mentor?.username ?? null,
        mentor_affiliation: mentor?.affiliation ?? null,
        mentor_position: mentor?.position ?? null,
        mentor_signature_url: mentorSignatureUrl,
        session_no: session.session_no,
        mentored_at: session.mentored_at,
        place: session.place,
        content: session.content,
        created_at: session.created_at,
        updated_at: session.updated_at,
        photos: photos.sort((a, b) => a.sort_order - b.sort_order),
        can_edit:
          !isAdminView &&
          base.status !== "COMPLETED" &&
          session.mentor_id === context.viewer.id,
      };
    })
  );

  const { assignedCompanyCount, myCompanyCount } = buildAssignmentStats(
    allAssignments,
    context.viewer.id
  );

  return {
    ...base,
    number_of_companies: allAssignments.length,
    number_of_users: mentors?.length ?? 0,
    number_of_sessions: visibleSessionsRaw.length,
    recent_mentored_at: visibleSessionsRaw[0]?.mentored_at ?? null,
    assigned_company_count: assignedCompanyCount,
    my_company_count: myCompanyCount,
    isAdminView,
    assignments: enrichedAssignments,
    sessions: mentoringSessions,
  };
}

export async function updateMentoringCompanies(args: {
  mentoringId: string;
  companyIds: number[];
}) {
  return withActionResult(async () => {
    const context = await assertAdmin();
    const companyIds = Array.from(new Set(args.companyIds));

    const { data: existing, error: existingError } = await context.supabase
      .from("mentoring_company")
      .select("company_id")
      .eq("mentoring_id", args.mentoringId);

    if (existingError) {
      raiseActionError(existingError);
    }

    const existingIds = new Set((existing ?? []).map((item) => item.company_id));
    const nextIds = new Set(companyIds);
    const toAdd = companyIds.filter((id) => !existingIds.has(id));
    const toRemove = Array.from(existingIds).filter((id) => !nextIds.has(id));

    if (toRemove.length > 0) {
      const { count, error: sessionError } = await context.supabase
        .from("mentoring_session")
        .select("id", { count: "exact", head: true })
        .eq("mentoring_id", args.mentoringId)
        .in("company_id", toRemove);

      if (sessionError) {
        raiseActionError(sessionError);
      }

      if ((count ?? 0) > 0) {
        throw new Error("멘토링 기록이 있는 기업은 대상에서 제거할 수 없습니다.");
      }

      const { error: deleteError } = await context.supabase
        .from("mentoring_company")
        .delete()
        .eq("mentoring_id", args.mentoringId)
        .in("company_id", toRemove);

      if (deleteError) {
        raiseActionError(deleteError);
      }
    }

    if (toAdd.length > 0) {
      const { error: insertError } = await context.supabase
        .from("mentoring_company")
        .insert(
          toAdd.map((companyId) => ({
            mentoring_id: args.mentoringId,
            company_id: companyId,
            created_at: new Date().toISOString(),
          }))
        );

      if (insertError) {
        raiseActionError(insertError);
      }
    }

    return undefined;
  });
}

export async function updateMentoringUsers(args: {
  mentoringId: string;
  userIds: string[];
}) {
  return withActionResult(async () => {
    const context = await assertAdmin();
    const userIds = Array.from(new Set(args.userIds));

    const { data: existing, error: existingError } = await context.supabase
      .from("mentoring_user")
      .select("user_id")
      .eq("mentoring_id", args.mentoringId);

    if (existingError) {
      raiseActionError(existingError);
    }

    const existingIds = new Set((existing ?? []).map((item) => item.user_id));
    const nextIds = new Set(userIds);
    const toAdd = userIds.filter((id) => !existingIds.has(id));
    const toRemove = Array.from(existingIds).filter((id) => !nextIds.has(id));

    if (toRemove.length > 0) {
      const [
        { count: assignmentCount, error: assignmentError },
        { count: sessionCount, error: sessionError },
      ] = await Promise.all([
        context.supabase
          .from("mentoring_company")
          .select("id", { count: "exact", head: true })
          .eq("mentoring_id", args.mentoringId)
          .in("mentor_id", toRemove),
        context.supabase
          .from("mentoring_session")
          .select("id", { count: "exact", head: true })
          .eq("mentoring_id", args.mentoringId)
          .in("mentor_id", toRemove),
      ]);

      if (assignmentError) raiseActionError(assignmentError);
      if (sessionError) raiseActionError(sessionError);

      if ((assignmentCount ?? 0) > 0 || (sessionCount ?? 0) > 0) {
        throw new Error(
          "배정 또는 기록이 있는 멘토는 대상에서 제거할 수 없습니다."
        );
      }

      const { error: deleteError } = await context.supabase
        .from("mentoring_user")
        .delete()
        .eq("mentoring_id", args.mentoringId)
        .in("user_id", toRemove);

      if (deleteError) {
        raiseActionError(deleteError);
      }
    }

    if (toAdd.length > 0) {
      const { error: insertError } = await context.supabase
        .from("mentoring_user")
        .insert(
          toAdd.map((userId) => ({
            mentoring_id: args.mentoringId,
            user_id: userId,
            created_at: new Date().toISOString(),
          }))
        );

      if (insertError) {
        raiseActionError(insertError);
      }
    }

    return undefined;
  });
}

export async function assignMentoringCompanyByAdmin(args: {
  mentoringId: string;
  companyId: number;
  mentorId: string | null;
}) {
  return withActionResult(async () => {
    const context = await assertAdmin();

    if (args.mentorId) {
      const { data: mentor, error: mentorError } = await context.supabase
        .from("mentoring_user")
        .select("id")
        .eq("mentoring_id", args.mentoringId)
        .eq("user_id", args.mentorId)
        .maybeSingle();

      if (mentorError) {
        raiseActionError(mentorError);
      }

      if (!mentor) {
        throw new Error("멘토링 참여 멘토만 배정할 수 있습니다.");
      }
    }

    const { data, error } = await context.supabase
      .from("mentoring_company")
      .update({
        mentor_id: args.mentorId,
        claimed_at: args.mentorId ? new Date().toISOString() : null,
      })
      .eq("mentoring_id", args.mentoringId)
      .eq("company_id", args.companyId)
      .select("id")
      .maybeSingle();

    if (error) {
      raiseActionError(error);
    }

    if (!data) {
      throw new Error("멘토링 대상 기업을 찾을 수 없습니다.");
    }

    return undefined;
  });
}

export async function claimMentoringCompany(args: {
  mentoringId: string;
  companyId: number;
}) {
  return withActionResult(async () => {
    const context = await getViewerContext();

    await ensureMentoringParticipant(context, args.mentoringId);

    const { data: mentoringStatus, error: mentoringStatusError } =
      await context.supabase
        .from("mentoring")
        .select("status")
        .eq("id", args.mentoringId)
        .single();
    if (mentoringStatusError) raiseActionError(mentoringStatusError);
    if (mentoringStatus?.status === "COMPLETED") {
      throw new Error("종료된 멘토링에서는 기업을 선택할 수 없습니다.");
    }

    const { data, error } = await context.supabase
      .from("mentoring_company")
      .update({
        mentor_id: context.viewer.id,
        claimed_at: new Date().toISOString(),
      })
      .eq("mentoring_id", args.mentoringId)
      .eq("company_id", args.companyId)
      .is("mentor_id", null)
      .select("id")
      .maybeSingle();

    if (error) {
      raiseActionError(error);
    }

    if (!data) {
      throw new Error("이미 다른 멘토가 선택한 기업입니다.");
    }

    return undefined;
  });
}

export async function createMentoringSessionPhotoUploadUrl(args: {
  fileName: string;
  contentType?: string;
}) {
  return withActionResult(async () => {
    assertNonWebpUpload(args.fileName, args.contentType);

    return createS3PresignedUploadUrl({
      fileName: args.fileName,
      keyPrefix: "mentoring-session-images",
      contentType: args.contentType,
      defaultContentType: "image/jpeg",
    });
  });
}

export async function createMentoringReportLogoUploadUrl(args: {
  fileName: string;
  contentType?: string;
}) {
  return withActionResult(async () => {
    assertNonWebpUpload(args.fileName, args.contentType);

    return createS3PresignedUploadUrl({
      fileName: args.fileName,
      keyPrefix: "mentoring-report-logos",
      contentType: args.contentType,
      defaultContentType: "image/png",
    });
  });
}

export async function updateMentoringReportLogo(args: {
  mentoringId: string;
  reportLogoPath: string | null;
}) {
  return withActionResult(async () => {
    const context = await assertAdmin();

    const { data, error } = await context.supabase
      .from("mentoring")
      .update({
        report_logo_path: args.reportLogoPath,
      })
      .eq("id", args.mentoringId)
      .select("id")
      .maybeSingle();

    if (error) {
      raiseActionError(error);
    }

    if (!data) {
      throw new Error("멘토링 정보를 찾을 수 없습니다.");
    }

    return undefined;
  });
}

export async function upsertMentoringSession(args: {
  id?: number;
  mentoringId: string;
  companyId: number;
  sessionNo: number;
  mentoredAt: string;
  place?: string | null;
  content?: string | null;
  photos: Array<{
    photo_path: string;
    original_filename?: string | null;
    sort_order?: number;
  }>;
}) {
  return withActionResult(async () => {
    const context = await getViewerContext();

    await ensureMentoringParticipant(context, args.mentoringId);

    const { data: mentoringStatus, error: mentoringStatusError } =
      await context.supabase
        .from("mentoring")
        .select("status")
        .eq("id", args.mentoringId)
        .single();
    if (mentoringStatusError) raiseActionError(mentoringStatusError);
    if (mentoringStatus?.status === "COMPLETED") {
      throw new Error("종료된 멘토링에서는 기록을 수정할 수 없습니다.");
    }

    const { data: assignment, error: assignmentError } = await context.supabase
      .from("mentoring_company")
      .select("mentor_id")
      .eq("mentoring_id", args.mentoringId)
      .eq("company_id", args.companyId)
      .maybeSingle();

    if (assignmentError) {
      raiseActionError(assignmentError);
    }

    if (!assignment || assignment.mentor_id !== context.viewer.id) {
      throw new Error(
        "현재 담당 기업에 대해서만 멘토링 기록을 작성할 수 있습니다."
      );
    }

    const payload = {
      mentoring_id: args.mentoringId,
      company_id: args.companyId,
      mentor_id: context.viewer.id,
      session_no: args.sessionNo,
      mentored_at: args.mentoredAt,
      place: args.place?.trim() || null,
      content: args.content?.trim() || null,
      updated_at: new Date().toISOString(),
    };

    let sessionId = args.id;

    if (args.id) {
      const { data: existing, error: existingError } = await context.supabase
        .from("mentoring_session")
        .select("id, mentor_id")
        .eq("id", args.id)
        .eq("mentoring_id", args.mentoringId)
        .maybeSingle();

      if (existingError) {
        raiseActionError(existingError);
      }

      if (!existing || existing.mentor_id !== context.viewer.id) {
        throw new Error("작성한 멘토링 기록만 수정할 수 있습니다.");
      }

      const { error: updateError } = await context.supabase
        .from("mentoring_session")
        .update(payload)
        .eq("id", args.id);

      if (updateError) {
        if ("code" in updateError && updateError.code === "23505") {
          throw new Error("같은 기업에 동일한 회차가 이미 존재합니다.");
        }
        raiseActionError(updateError);
      }
    } else {
      const { data: created, error: createError } = await context.supabase
        .from("mentoring_session")
        .insert({
          ...payload,
          created_at: new Date().toISOString(),
        })
        .select("id")
        .single();

      if (createError || !created) {
        if (
          createError &&
          "code" in createError &&
          createError.code === "23505"
        ) {
          throw new Error("같은 기업에 동일한 회차가 이미 존재합니다.");
        }
        raiseActionError(createError || new Error("멘토링 기록 저장에 실패했습니다."));
      }

      sessionId = created.id;
    }

    if (!sessionId) {
      return { sessionId };
    }

    if (args.id) {
      const { error: deletePhotoError } = await context.supabase
        .from("mentoring_session_photo")
        .delete()
        .eq("mentoring_session_id", sessionId);

      if (deletePhotoError) {
        raiseActionError(deletePhotoError);
      }
    }

    if (args.photos.length > 0) {
      const { error: insertPhotoError } = await context.supabase
        .from("mentoring_session_photo")
        .insert(
          args.photos.map((photo, index) => ({
            mentoring_session_id: sessionId,
            photo_path: photo.photo_path,
            original_filename: photo.original_filename ?? null,
            sort_order: photo.sort_order ?? index + 1,
            created_at: new Date().toISOString(),
          }))
        );

      if (insertPhotoError) {
        raiseActionError(insertPhotoError);
      }
    }

    return { sessionId };
  });
}
