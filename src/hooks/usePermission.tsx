import { useProfile } from "./useProfile";

export type PermissionProps = {
    path: string[];
}

export function usePermission({ path }: PermissionProps) {
  const { data } = useProfile();
  const allowedEndpoints = data?.allowedEndpoints;
  const isAllowed = path.every((p) => allowedEndpoints?.includes(p));
  return { isAllowed };
}