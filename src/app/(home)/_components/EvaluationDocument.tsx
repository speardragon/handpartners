"use client";

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Font,
  StyleSheet,
} from "@react-pdf/renderer";
import {
  CompanyInfo,
  EvaluationItem,
  UserProfile,
} from "@/types/evaluation-type";

Font.register({
  family: "Pretendard",
  fonts: [
    {
      src: "../fonts/Pretendard-Regular.ttf",
      fontWeight: "300" as "normal",
    },
    {
      src: "../fonts/Pretendard-SemiBold.ttf",
      fontWeight: "600" as "semibold",
    },
    {
      src: "../fonts/Pretendard-Bold.ttf",
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
};

const EvaluationDocument = ({ evaluationReport }: Props) => {
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
                <Text style={styles.headerText}>
                  실전창업교육 데모데이 심사 평가표
                </Text>
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
                    styles.bgBlue100,
                    styles.fontBold,
                    styles.textCenter,
                    { flex: 1, borderRightWidth: 0 },
                  ]}
                >
                  합계
                </Text>
                <Text
                  style={[
                    styles.tableCell,
                    { flex: 3, textAlign: "center", borderLeftWidth: 0 },
                  ]}
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
                <Text style={styles.judgeCell}>
                  {report.user_profile.affiliation || ""}
                </Text>
                <Text style={styles.judgeCell}>
                  {report.user_profile.position || ""}
                </Text>
                <View style={styles.judgeCellLastContainer}>
                  {/* 왼쪽 영역: 빈 뷰 (좌우 균형을 맞추기 위해 flex: 1 할당) */}
                  <View style={styles.judgeLeft} />

                  {/* 가운데 영역: 이름을 표시하는 텍스트 */}
                  <View style={styles.judgeCenter}>
                    <Text>{report.user_profile.name || ""}</Text>
                  </View>

                  {/* 오른쪽 영역: 우측 끝에 “(서명)” 배치 */}
                  <View style={styles.judgeRight}>
                    <Text>(서명)</Text>
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
    paddingTop: 48,
  },
  section: {
    marginBottom: 10, // space-y-10: 2.5rem * 16 = 40px
  },
  headerContainer: {
    height: 82, // h-36: 9rem * 16 = 144px
    width: "100%",
    borderRadius: 4, // rounded-md ~4px
    borderWidth: 1,
    borderColor: "#ffffff",
    // Tailwind had a gradient: bg-gradient-to-r from-blue-100 to-blue-300
    // React-pdf doesn't support gradient, using from-blue-100 (#DBEAFE) as fallback
    backgroundColor: "#DBEAFE",
    paddingTop: 4, // py-1 ~4px top/bottom
    paddingBottom: 4,
    justifyContent: "center",
  },
  headerInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
    backgroundColor: "#ffffff",
  },
  headerText: {
    fontSize: 24, // text-4xl: ~2.25rem * 16 = 36px
    textAlign: "center",
    fontWeight: "semibold",
  },
  // Table styles
  tableContainer: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#D1D5DB", // gray-300
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#DBEAFE", // bg-blue-100
    textAlign: "center",
  },
  tableHeaderCell: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    justifyContent: "center",
    padding: 8,
    fontWeight: "bold", // font-bold
    fontSize: 12,
  },
  tableCell: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    padding: 8,
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
  signTextRight: {
    position: "absolute",
    flex: 1,
    right: 4,
  },
  fontBold: {
    fontWeight: "bold",
  },
  bgBlue100: {
    backgroundColor: "#DBEAFE",
  },
  // For company info table
  infoTableContainer: {
    flexDirection: "column",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  infoTableRow: {
    flexDirection: "row",
    borderColor: "#D1D5DB",
  },
  infoTableLabel: {
    backgroundColor: "#DBEAFE",
    borderRightWidth: 1,
    borderColor: "#D1D5DB",
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
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  opinionRow: {
    flexDirection: "row",
  },
  opinionLabel: {
    backgroundColor: "#DBEAFE",
    borderRightWidth: 1,
    borderColor: "#D1D5DB",
    paddingVertical: 64, // py-24 ~24*4px=96px
    paddingHorizontal: 48, // px-12 ~12*4px=48px
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 12,
    width: 144,
  },
  opinionValue: {
    borderColor: "#D1D5DB",
    flex: 1,
    padding: 16,
    fontSize: 12,
  },
  // For judge info table
  judgeContainer: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  judgeHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#DBEAFE",
    fontWeight: "bold",
    textAlign: "center",
  },
  judgeHeaderCell: {
    borderColor: "#D1D5DB",
    borderRightWidth: 1,
    padding: 8,
    fontSize: 12,
    flex: 1,
  },
  judgeHeaderCellLast: {
    borderColor: "#D1D5DB",
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
    borderColor: "#D1D5DB",
    borderRightWidth: 1,
    padding: 8,
    fontSize: 12,
    flex: 1,
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
    alignItems: "flex-end",
  },
  judgeCellLast: {
    borderColor: "#D1D5DB",
    padding: 8,
    fontSize: 12,
    flex: 1,
    textAlign: "right",
  },
});

export default EvaluationDocument;
