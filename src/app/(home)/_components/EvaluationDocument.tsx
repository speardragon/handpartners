"use client";

import {
  Document,
  Page,
  Text,
  View,
  Font,
  Image as PImage,
  StyleSheet,
} from "@react-pdf/renderer";
import {
  CompanyInfo,
  EvaluationItem,
  UserProfile,
} from "@/types/evaluation-type";
import { ProgramRow } from "@/actions/program-action";

Font.register({
  family: "Pretendard",
  fonts: [
    {
      src: "../../../../fonts/Pretendard-Regular.ttf",
      fontWeight: "300" as "normal",
    },
    {
      src: "../../../../fonts/Pretendard-SemiBold.ttf",
      fontWeight: "600" as "semibold",
    },
    {
      src: "../../../../fonts/Pretendard-Bold.ttf",
      fontWeight: "700" as "bold",
    },
  ],
});

type EvaluationReportItem = {
  company: CompanyInfo;
  evaluations: EvaluationItem[];
  user_profile: UserProfile;
};

type Props = {
  evaluationReport: EvaluationReportItem[];
  programInfo: ProgramRow;
};

const EvaluationDocument = ({ evaluationReport, programInfo }: Props) => {
  return (
    <Document>
      {evaluationReport.map((report, index) => {
        const totalScore = report.evaluations.reduce(
          (sum, ev) => sum + ev.grade,
          0
        );

        return (
          <Page key={index} size="A4" style={styles.page}>
            {/* 헤더 */}
            <View style={[styles.headerContainer, styles.section]}>
              <View style={styles.headerInner}>
                <Text style={styles.headerText}>{programInfo.name}</Text>
              </View>
            </View>

            {/* 기업 정보 섹션 */}
            <View style={[styles.infoTableContainer, styles.section]}>
              <View style={styles.infoTableRow}>
                <Text style={styles.infoTableLabel}>기업</Text>
                <Text style={styles.infoTableValue}>{report.company.name}</Text>
              </View>
              <View style={styles.infoTableRow}>
                <Text style={styles.infoTableLabel}>제품 / 서비스</Text>
                <Text style={styles.infoTableValue}>
                  {report.company.description || ""}
                </Text>
              </View>
            </View>

            {/* 평가 항목 테이블 */}
            <View style={[styles.tableContainer, styles.section]}>
              {/* 헤더 */}
              <View style={styles.tableHeaderRow}>
                <Text style={[styles.tableHeaderCell, styles.w36]}>
                  평가 항목
                </Text>
                <Text style={[styles.tableHeaderCell, styles.flex1]}>
                  평가 내용
                </Text>
                <Text style={[styles.tableHeaderCell, styles.w20]}>배점</Text>
                <Text style={[styles.tableHeaderCell, styles.w20]}>점수</Text>
              </View>
              {/* 평가 데이터 행 */}
              {report.evaluations.map((ev, i) => (
                <View key={i} style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.w36]}>
                    {ev.evaluation_criterion.item_name}
                  </Text>
                  <Text style={[styles.tableCell, styles.flex1]}>
                    {ev.evaluation_criterion.description || ""}
                  </Text>
                  <Text style={[styles.tableCell, styles.w20]}>
                    {ev.evaluation_criterion.points}
                  </Text>
                  <Text style={[styles.tableCell, styles.w20]}>{ev.grade}</Text>
                </View>
              ))}
              {/* 합계 */}
              <View style={styles.tableRow}>
                <Text
                  style={[
                    styles.tableCell,
                    styles.w36,
                    styles.bgTotal,
                    styles.fontBold,
                    styles.textCenter,
                    { flex: 1 },
                  ]}
                >
                  합계
                </Text>
                <Text
                  style={[styles.tableCell, { flex: 3, textAlign: "center" }]}
                >
                  {totalScore}
                </Text>
              </View>
            </View>

            {/* 평가 의견 */}
            <View style={[styles.opinionContainer, styles.section]}>
              <View style={styles.opinionRow}>
                <Text style={styles.opinionLabel}>평가 의견</Text>
                <Text style={styles.opinionValue}>
                  {report.evaluations.length !== 0
                    ? report.evaluations[0].feedback
                    : ""}
                </Text>
              </View>
            </View>

            {/* 심사위원 정보 */}
            <View style={[styles.judgeContainer, styles.section]}>
              <View style={styles.judgeHeaderRow}>
                <Text style={styles.judgeHeaderCell}>소속기관</Text>
                <Text style={styles.judgeHeaderCell}>직위(직급)</Text>
                <Text style={styles.judgeHeaderCellLast}>성명</Text>
              </View>
              <View style={styles.judgeRow}>
                <View style={styles.judgeCell}>
                  <Text>{report.user_profile.affiliation || ""}</Text>
                </View>
                <View style={styles.judgeCell}>
                  <Text>{report.user_profile.position || ""}</Text>
                </View>
                <View style={styles.judgeCellLastContainer}>
                  {/* 왼쪽 영역: 빈 뷰 (좌우 균형을 맞추기 위해 flex: 1 할당) */}
                  <View style={styles.judgeLeft} />

                  {/* 가운데 영역: 이름을 표시하는 텍스트 */}
                  <View style={styles.judgeCenter}>
                    <Text>{report.user_profile.name || ""}</Text>
                  </View>

                  {/* 오른쪽 영역: 우측 끝에 "(서명)" 배치 + 서명 이미지 오버레이 */}
                  <View style={styles.judgeRight}>
                    {report.user_profile?.signature_url ? (
                      <PImage
                        src={report.user_profile.signature_url}
                        style={styles.signatureImage}
                      />
                    ) : (
                      <Text>(서명)</Text>
                    )}
                  </View>
                </View>
              </View>
            </View>
          </Page>
        );
      })}
    </Document>
  );
};

const styles = StyleSheet.create({
  page: {
    fontFamily: "Pretendard",
    padding: 24, // p-6: 1.5rem * 16 = 24px
  },
  section: {
    marginBottom: 10, // space-y-10: 2.5rem * 16 = 40px
  },
  headerContainer: {
    height: 82, // h-36: 9rem * 16 = 144px
    width: "100%",
    backgroundColor: "#ffffff",
    justifyContent: "center",
  },
  headerInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
    backgroundColor: "transparent",
  },
  headerText: {
    fontSize: 24, // text-4xl: ~2.25rem * 16 = 36px
    textAlign: "center",
    fontWeight: "semibold",
    color: "#000000",
  },
  // Table styles
  tableContainer: {
    width: "100%",
    borderWidth: 0.5,
    borderColor: "#000000",
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#DFE6F7",
    textAlign: "center",
  },
  tableHeaderCell: {
    borderWidth: 0.5,
    borderColor: "#000000",
    justifyContent: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
    fontWeight: "bold",
    fontSize: 12,
  },
  tableCell: {
    borderWidth: 0.5,
    borderColor: "#000000",
    paddingVertical: 4,
    paddingHorizontal: 8,
    fontSize: 12,
    justifyContent: "center",
    textAlign: "center",
  },
  // Width-specific cells
  w36: {
    width: 144, // w-36: 9rem * 16 = 144px
  },
  w20: {
    width: 80, // approximate for a small width cell
  },
  flex1: {
    flex: 1,
  },
  textCenter: {
    textAlign: "center",
    flex: 1,
  },
  textRight: {
    textAlign: "right",
    flex: 1,
  },
  signatureImage: {
    width: 60,
    height: 30,
    objectFit: "contain",
  },
  signTextRight: {
    position: "absolute",
    flex: 1,
    right: 4,
  },
  fontBold: {
    fontWeight: "bold",
  },
  bgTotal: {
    backgroundColor: "#E2E8F0", // gray-200
  },
  // For company info table
  infoTableContainer: {
    flexDirection: "column",
    borderWidth: 0.5,
    borderColor: "#000000",
  },
  infoTableRow: {
    flexDirection: "row",
    borderColor: "#000000",
    borderBottomWidth: 0.5,
  },
  infoTableLabel: {
    backgroundColor: "#DFE6F7",
    borderRightWidth: 0.5,
    borderColor: "#000000",
    padding: 8,
    fontWeight: "bold",
    width: 144,
    fontSize: 12,
  },
  infoTableValue: {
    padding: 8,
    flex: 1,
    fontSize: 12,
  },
  // For evaluation opinion
  opinionContainer: {
    borderWidth: 0.5,
    borderColor: "#000000",
  },
  opinionRow: {
    flexDirection: "row",
  },
  opinionLabel: {
    backgroundColor: "#DFE6F7",
    borderRightWidth: 0.5,
    borderColor: "#000000",
    paddingVertical: 32,
    paddingHorizontal: 48,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 12,
    width: 144,
  },
  opinionValue: {
    borderColor: "#000000",
    flex: 1,
    padding: 16,
    fontSize: 12,
  },
  // For judge info table
  judgeContainer: {
    borderWidth: 0.5,
    borderColor: "#000000",
  },
  judgeHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#DFE6F7",
    fontWeight: "bold",
    textAlign: "center",
  },
  judgeHeaderCell: {
    borderColor: "#000000",
    borderRightWidth: 0.5,
    padding: 8,
    fontSize: 12,
    flex: 1,
  },
  judgeHeaderCellLast: {
    borderColor: "#000000",
    padding: 8,
    fontSize: 12,
    flex: 1,
    textAlign: "center",
  },
  judgeRow: {
    flexDirection: "row",
    textAlign: "center",
  },
  judgeCell: {
    borderColor: "#000000",
    borderRightWidth: 0.5,
    padding: 8,
    fontSize: 12,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  judgeCellLastContainer: {
    position: "relative",
    flex: 1,
    flexDirection: "row",
    justifyContent: "center", // 중앙과 오른쪽으로 배치
    alignItems: "center",
    fontSize: 12,
    padding: 8,
  },
  judgeLeft: {
    flex: 1,
  },
  judgeCenter: {
    // 가운데 이름 표시부 (굳이 flex를 주지 않아도 됨)
    // 필요하면 textAlign 등을 적용
  },
  judgeRight: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    flexDirection: "column",
  },
  judgeCellLast: {
    borderColor: "#000000",
    padding: 8,
    fontSize: 12,
    flex: 1,
    textAlign: "right",
  },
});

export default EvaluationDocument;
