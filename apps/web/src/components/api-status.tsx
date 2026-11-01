import { graphql } from "@miseboard/schema";
import { getClient } from "@/lib/apollo/server-client";

const VenueCountQuery = graphql(`
  query VenueCount {
    venues {
      id
    }
  }
`);

export async function ApiStatus() {
  const venueCount = await fetchVenueCount();

  if (venueCount === null) {
    return (
      <StatusLine tone="bg-destructive">
        Can&apos;t reach the API. Start it on port 4000, then reload.
      </StatusLine>
    );
  }

  return (
    <StatusLine tone="bg-success">
      Connected to the API · {venueCount} {venueCount === 1 ? "venue" : "venues"}
    </StatusLine>
  );
}

async function fetchVenueCount() {
  try {
    const { data } = await (await getClient()).query({ query: VenueCountQuery });
    return data?.venues.length ?? null;
  } catch {
    return null;
  }
}

function StatusLine({ tone, children }: { tone: string; children: React.ReactNode }) {
  return (
    <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
      <span aria-hidden className={`size-1.5 rounded-full ${tone}`} />
      {children}
    </p>
  );
}
