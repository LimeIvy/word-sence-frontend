import { type HandleOAuthCallbackParams } from "@clerk/types";

import SSOCallback from "../../../../features/auth/components/SSOCallback";

export interface SSOCallbackPageProps {
  searchParams: HandleOAuthCallbackParams;
}

export default function SSOCallbackPage({ searchParams }: SSOCallbackPageProps) {
  return (
    <div className="flex items-center justify-center">
      <SSOCallback searchParams={searchParams} />
    </div>
  );
}
