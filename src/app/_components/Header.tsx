import Image from "next/image";
import Link from "next/link";
import handpartnersLogo from "../../../public/images/handpartners_logo.png";

export default function Header() {
  return (
    <header className="sticky inset-x-0 top-0 left-0 z-50 text-gray-700 bg-white border-b border-gray-600">
      {/* <header className=" z-50 text-gray-700 bg-white border-b border-gray-600"> */}
      <div className="flex justify-between items-center font-medium text-gray-900 px-4 w-full">
        <Link href="/">
          <Image
            alt="logo"
            src={handpartnersLogo}
            // className="-mr-1"
            width={180}
            height={180}
            priority={true}
          />
        </Link>
        <div>로그아웃</div>
      </div>
    </header>
  );
}
