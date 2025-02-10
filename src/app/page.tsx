import { JejuMap } from "@/components/JejuMap";
import { promises as fs } from "fs";
import Image from "next/image";
import Link from "next/link";
import path from "path";

async function getData() {
  const dir = path.join(process.cwd(), "asset");
  const json = await fs.readFile(dir + "/data.json", "utf8");
  return JSON.parse(json);
}

export default async function Home() {
  const data = await getData();

  return (
    <main>
      <div className="flex flex-col md:flex-row min-h-screen">
        <div className="w-full md:w-[400px] bg-white">
          <div className="bg-black p-4 flex flex-col gap-4">
            <Link href="https://www.alphaca.kr/">
              <Image
                src="/logo.svg"
                alt="logo"
                width={200}
                height={300}
                className="mx-auto"
              />
            </Link>
            <p className="text-white text-sm text-center">
              공공데이터 포털에서 제공하는 데이터를 활용하였습니다.
            </p>
          </div>
        </div>
        <JejuMap items={data} />
      </div>
    </main>
  );
}
