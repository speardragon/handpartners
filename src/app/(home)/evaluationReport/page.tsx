export default function Page() {
  return (
    <div className="flex flex-col max-w-5xl mx-auto p-6 font-sans space-y-10">
      <div className="h-36 w-full rounded-md bg-gradient-to-r from-blue-100 to-blue-300 border border-white py-1">
        <div className="flex h-full w-full items-center justify-center bg-white">
          <h2 className="text-4xl font-semibold text-center">
            실전창업교육 데모데이 심사 평가표
          </h2>
        </div>
      </div>

      <div className="flex flex-col">
        <table className="w-full border border-gray-300">
          <tbody>
            <tr>
              <td className="flex min-w-36 bg-blue-100 border-b border-gray-300 p-4 font-bold">
                (예정)창업기업
              </td>
              <td className="w-full border border-gray-300 p-4">
                {"기업 이름"}
              </td>
            </tr>
            <tr>
              <td className="flex min-w-36 bg-blue-100  border-gray-300 p-4 font-bold">
                제품 / 서비스
              </td>
              <td className="w-full border border-gray-300 p-4">
                {"기업 설명"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <table className="w-full border border-gray-300 text-left">
        <thead className="bg-blue-100">
          <tr className="text-center">
            <th className="w-36 border border-gray-300 p-2">평가 항목</th>
            <th className="border border-gray-300 p-2">평가 내용</th>
            <th className="border border-gray-300 p-2">배점</th>
            <th className="border border-gray-300 p-2">점수</th>
          </tr>
        </thead>
        <tbody className="text-center text-balance">
          <tr>
            <td className="border border-gray-300 p-2">창업역량 및 인적구성</td>
            <td className="border border-gray-300 p-2">
              창업자의 경력 및 전문성, 사업의지
            </td>
            <td className="border border-gray-300 p-2">20</td>
            <td className="border border-gray-300 p-2">20</td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-2">기술성</td>
            <td className="border border-gray-300 p-2">
              아이디어의 독창성 및 혁신성
            </td>
            <td className="border border-gray-300 p-2">20</td>
            <td className="border border-gray-300 p-2">20</td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-2">시장성</td>
            <td className="border border-gray-300 p-2">
              시장분석의 정확성 및 시장진입 계획
            </td>
            <td className="border border-gray-300 p-2">30</td>
            <td className="border border-gray-300 p-2">30</td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-2">성장성</td>
            <td className="border border-gray-300 p-2">
              사업화 전략, 사업계획의 명확성 및 구체성
            </td>
            <td className="border border-gray-300 p-2">30</td>
            <td className="border border-gray-300 p-2">30</td>
          </tr>
          {/* 합계 */}
          <tr>
            <td
              className="border border-gray-300 p-2 font-bold text-center bg-blue-100"
              colSpan={3}
            >
              합계
            </td>
            <td className="border border-gray-300 p-2 text-center">100</td>
          </tr>
        </tbody>
      </table>

      <div className="mt-6">
        <table className="w-full border border-gray-300 table-auto">
          <tbody>
            <tr>
              <td className="bg-blue-100 border py-24 px-12 text-center border-gray-300 font-bold p-4 whitespace-nowrap">
                평가 의견
              </td>
              <td className="border w-full border-gray-300 p-4 py-6">좋음</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <table className="w-full border border-gray-300 table-auto">
          <thead className="bg-blue-100 font-bold">
            <tr>
              <th className="border border-gray-300 p-4 text-center">
                소속기관
              </th>
              <th className="border border-gray-300 p-4 text-center">
                직위(직급)
              </th>
              <th className="border border-gray-300 p-4 text-center">성명</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 p-4 text-center">
                공유책장
              </td>
              <td className="border border-gray-300 p-4 text-center">대표</td>
              <td className="border border-gray-300 p-4 text-right">(성명)</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
