import Link from "next/link";
import { Button } from "@/shared/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-4xl font-bold text-primary">404</h1>
      <p className="text-muted">페이지를 찾을 수 없습니다</p>
      <Link href="/">
        <Button>홈으로 돌아가기</Button>
      </Link>
    </div>
  );
}
