"use client";

import { Pencil } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRole } from "@/lib/role/use-role";

const EDIT_DENIED_REASON = "Only Admins can edit apps";

export function EditLink({ slug }: { slug: string }) {
  const { canEdit } = useRole();

  if (canEdit) {
    return (
      <Button asChild variant="outline" size="sm">
        <Link href={`/apps/${slug}/edit`}>
          <Pencil aria-hidden strokeWidth={1.5} />
          Edit
        </Link>
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      aria-disabled
      aria-label={`Edit. ${EDIT_DENIED_REASON}`}
      title={EDIT_DENIED_REASON}
      className="cursor-not-allowed opacity-50"
    >
      <Pencil aria-hidden strokeWidth={1.5} />
      Edit
    </Button>
  );
}
