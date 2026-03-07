"use client";

import {
  Document,
  Font,
  Image as PImage,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

Font.register({
  family: "Pretendard",
  fonts: [
    {
      src: "../../../../../../fonts/Pretendard-Regular.ttf",
      fontWeight: "normal" as "normal",
    },
    {
      src: "../../../../../../fonts/Pretendard-SemiBold.ttf",
      fontWeight: "semibold" as "semibold",
    },
    {
      src: "../../../../../../fonts/Pretendard-Bold.ttf",
      fontWeight: "bold" as "bold",
    },
  ],
});

type Props = {
  programName: string;
  companyName: string;
  companyDescription: string | null;
  representativeName: string | null;
  mentorName: string | null;
  mentorAffiliation: string | null;
  mentorPosition: string | null;
  mentorSignatureUrl: string | null;
  logoUrl: string | null;
  sessionNo: number;
  mentoredAt: string;
  place: string | null;
  content: string | null;
  photos: Array<{
    id: number;
    photo_path: string;
    original_filename: string | null;
    download_url: string | null;
  }>;
};

function formatDateTime(dateString: string) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function formatSubmitDate(dateString: string) {
  const date = new Date(dateString);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

function splitLines(value: string | null | undefined) {
  return (value ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function buildBulletLines(content: string | null) {
  const contentLines = splitLines(content);

  return [
    {
      title: "멘토링 내용",
      items: contentLines.length > 0 ? contentLines : ["기록된 멘토링 내용이 없습니다."],
    },
  ];
}

function chunkPhotos<T>(items: T[], size: number) {
  const chunks: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
}

export default function MentoringSessionDocument({
  programName,
  companyName,
  companyDescription,
  representativeName,
  mentorName,
  mentorAffiliation,
  mentorPosition,
  mentorSignatureUrl,
  logoUrl,
  sessionNo,
  mentoredAt,
  place,
  content,
  photos,
}: Props) {
  const bulletSections = buildBulletLines(content);
  const mentorOrgTitle = [mentorAffiliation, mentorPosition].filter(Boolean).join(" / ") || "-";
  const itemName = companyDescription?.trim() || companyName;
  const photoPages = chunkPhotos(photos, 2);
  const photoImageStyle = logoUrl
    ? [styles.photoImage, styles.photoImageWithLogo]
    : styles.photoImage;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {logoUrl ? (
          <View style={styles.logoHeader}>
            <View style={styles.logoRow}>
              <PImage src={logoUrl} style={styles.logoImage} />
            </View>
            <View style={styles.logoDivider} />
          </View>
        ) : null}
        <Text style={styles.title}>{programName} 멘토링 일지</Text>
        <Text style={styles.sessionNoLabel}>멘토링 회차 {sessionNo}</Text>
        <View style={styles.table}>
            <View style={styles.row}>
              <View style={[styles.cell, styles.headerCell, styles.col1]}>
                <Text style={styles.headerText}>멘토링 일시</Text>
              </View>
              <View style={[styles.cell, styles.col2]}>
                <Text style={styles.valueText}>{formatDateTime(mentoredAt)}</Text>
              </View>
              <View style={[styles.cell, styles.headerCell, styles.col3]}>
                <Text style={styles.headerText}>장소</Text>
              </View>
              <View style={[styles.cell, styles.col4, styles.lastColumn]}>
                <Text style={styles.valueText}>{place?.trim() || "-"}</Text>
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.cell, styles.headerCell, styles.doubleLeft]}>
                <Text style={styles.headerText}>멘토(Mentor)</Text>
              </View>
              <View style={[styles.cell, styles.headerCell, styles.doubleRight, styles.lastColumn]}>
                <Text style={styles.headerText}>멘티(Mentee)</Text>
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.cell, styles.headerCell, styles.col1]}>
                <Text style={styles.headerText}>소속/직위</Text>
              </View>
              <View style={[styles.cell, styles.headerCell, styles.col2]}>
                <Text style={styles.headerText}>성명</Text>
              </View>
              <View style={[styles.cell, styles.headerCell, styles.col3]}>
                <Text style={styles.headerText}>소속학과/팀명</Text>
              </View>
              <View style={[styles.cell, styles.headerCell, styles.col4, styles.lastColumn]}>
                <Text style={styles.headerText}>성명</Text>
              </View>
            </View>

            <View style={[styles.row, styles.lastRow]}>
              <View style={[styles.cell, styles.col1, styles.lastRowCell]}>
                <Text style={styles.valueCenterText}>{mentorOrgTitle}</Text>
              </View>
              <View style={[styles.cell, styles.col2, styles.lastRowCell]}>
                <Text style={styles.valueCenterText}>{mentorName || "-"}</Text>
              </View>
              <View style={[styles.cell, styles.col3, styles.lastRowCell]}>
                <Text style={styles.valueCenterText}>{companyName}</Text>
              </View>
              <View
                style={[
                  styles.cell,
                  styles.col4,
                  styles.lastColumn,
                  styles.lastRowCell,
                ]}
              >
                <Text style={styles.valueCenterText}>{representativeName || "-"}</Text>
              </View>
            </View>
          </View>

          <Text style={styles.sectionTitle}>□ 창업멘토링 내용 및 결과</Text>

          <View style={styles.contentTable}>
            <View style={styles.row}>
              <View style={[styles.cell, styles.headerCell, styles.itemLabel]}>
                <Text style={styles.headerText}>아이템 및 사업계획 명</Text>
              </View>
              <View style={[styles.cell, styles.itemValue, styles.lastColumn]}>
                <Text style={styles.valueText}>{itemName}</Text>
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.fullWidthCell, styles.contentCell]}>
                {bulletSections.map((section) => (
                  <View key={section.title} style={styles.contentSection}>
                    <Text style={styles.contentSectionTitle}>{section.title}</Text>
                    {section.items.map((item, index) => (
                      <View key={`${section.title}-${index}`} style={styles.bulletRow}>
                        <Text style={styles.bulletMark}>•</Text>
                        <Text style={styles.bulletText}>{item}</Text>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            </View>

            <View style={[styles.row, styles.lastRow]}>
              <View style={[styles.fullWidthCell, styles.submitCell]}>
                <Text style={styles.submitText}>
                  위와 같이 창업멘토링 멘토링일지를 제출합니다.
                </Text>
                <Text style={styles.submitDate}>{formatSubmitDate(mentoredAt)}</Text>
                <View style={styles.signatureRow}>
                  <Text style={styles.submitAuthorLabel}>
                    작성자(멘토): {mentorName || "-"}
                  </Text>
                  <View style={styles.signatureSlot}>
                    {mentorSignatureUrl ? (
                      <PImage src={mentorSignatureUrl} style={styles.signatureImage} />
                    ) : (
                      <Text style={styles.submitAuthorMark}>(인)</Text>
                    )}
                  </View>
                </View>
              </View>
            </View>
          </View>
        <Text
          fixed
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `[ ${pageNumber}/${totalPages} ]`}
        />
      </Page>

      {photoPages.map((photoPage, pageIndex) => (
        <Page key={`photo-page-${pageIndex}`} size="A4" style={styles.page}>
          {logoUrl ? (
            <View style={styles.logoHeader}>
              <View style={styles.logoRow}>
                <PImage src={logoUrl} style={styles.logoImage} />
              </View>
              <View style={styles.logoDivider} />
            </View>
          ) : null}
          <View style={styles.photoTable}>
              <View style={styles.row}>
                <View
                  style={[
                    styles.cell,
                    styles.headerCell,
                    styles.photoImageColumn,
                    styles.lastColumn,
                  ]}
                >
                  <Text style={styles.headerText}>사진</Text>
                </View>
              </View>
              {photoPage.map((photo, photoIndex) => {
                const isLastPhotoRow =
                  pageIndex === photoPages.length - 1 &&
                  photoIndex === photoPage.length - 1;

                return (
                  <View
                    key={photo.id}
                    style={[styles.row, ...(isLastPhotoRow ? [styles.lastRow] : [])]}
                    wrap={false}
                  >
                    <View
                      style={[
                        styles.cell,
                        styles.photoImageColumn,
                        styles.photoImageCell,
                        styles.lastColumn,
                        ...(isLastPhotoRow ? [styles.lastRowCell] : []),
                      ]}
                    >
                      <PImage
                        src={photo.download_url ?? photo.photo_path}
                        style={photoImageStyle}
                      />
                    </View>
                  </View>
                );
              })}
          </View>
          <Text
            fixed
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) => `[ ${pageNumber}/${totalPages} ]`}
          />
        </Page>
      ))}
    </Document>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    padding: 24,
    fontFamily: "Pretendard",
  },
  logoHeader: {
    marginBottom: 18,
  },
  logoRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 10,
  },
  logoImage: {
    width: 120,
    height: 40,
    objectFit: "contain",
  },
  logoDivider: {
    borderBottomWidth: 2,
    borderBottomColor: "#111827",
  },
  title: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: 700,
    color: "#111827",
    marginBottom: 12,
  },
  sessionNoLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: "#111827",
    marginBottom: 10,
  },
  table: {
    borderWidth: 1,
    borderColor: "#111827",
  },
  contentTable: {
    borderWidth: 1,
    borderColor: "#111827",
  },
  photoTable: {
    borderWidth: 1,
    borderColor: "#111827",
  },
  row: {
    flexDirection: "row",
    width: "100%",
  },
  cell: {
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#111827",
    paddingVertical: 8,
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  fullWidthCell: {
    width: "100%",
    borderBottomWidth: 1,
    borderColor: "#111827",
    paddingHorizontal: 12,
  },
  headerCell: {
    backgroundColor: "#f3f4f6",
  },
  headerText: {
    fontSize: 10,
    fontWeight: 600,
    textAlign: "center",
    color: "#111827",
  },
  valueText: {
    fontSize: 10.5,
    color: "#111827",
  },
  valueCenterText: {
    fontSize: 10.5,
    color: "#111827",
    textAlign: "center",
  },
  col1: {
    width: "18%",
  },
  col2: {
    width: "32%",
  },
  col3: {
    width: "20%",
  },
  col4: {
    width: "30%",
  },
  doubleLeft: {
    width: "50%",
  },
  doubleRight: {
    width: "50%",
  },
  itemLabel: {
    width: "30%",
  },
  itemValue: {
    width: "70%",
  },
  lastColumn: {
    borderRightWidth: 0,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  lastRowCell: {
    borderBottomWidth: 0,
  },
  sectionTitle: {
    marginTop: 18,
    marginBottom: 10,
    fontSize: 12,
    fontWeight: 600,
    color: "#111827",
  },
  contentCell: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  contentSection: {
    marginBottom: 14,
  },
  contentSectionTitle: {
    fontSize: 11,
    fontWeight: 600,
    color: "#111827",
    marginBottom: 8,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    marginBottom: 6,
  },
  bulletMark: {
    width: 10,
    fontSize: 11,
    color: "#111827",
  },
  bulletText: {
    flex: 1,
    fontSize: 10.5,
    lineHeight: 1.6,
    color: "#1f2937",
  },
  submitCell: {
    borderBottomWidth: 0,
    paddingTop: 18,
    paddingBottom: 14,
  },
  submitText: {
    textAlign: "center",
    fontSize: 11,
    color: "#111827",
    marginBottom: 18,
  },
  submitDate: {
    textAlign: "center",
    fontSize: 11,
    color: "#111827",
    marginBottom: 18,
  },
  signatureRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 8,
  },
  submitAuthorLabel: {
    fontSize: 11,
    color: "#111827",
  },
  signatureSlot: {
    width: 82,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },
  signatureImage: {
    width: 72,
    height: 32,
    objectFit: "contain",
  },
  submitAuthorMark: {
    fontSize: 11,
    color: "#111827",
  },
  photoImageColumn: {
    width: "100%",
  },
  photoImageCell: {
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  photoImage: {
    width: "100%",
    height: 330,
    objectFit: "contain",
  },
  photoImageWithLogo: {
    height: 280,
  },
  pageNumber: {
    position: "absolute",
    right: 24,
    bottom: 18,
    fontSize: 10,
    color: "#4b5563",
  },
});
