"use client";

import { useMemo } from "react";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { buildClientSchema, getIntrospectionQuery, type IntrospectionQuery } from "graphql";

const IntrospectionDocument = gql(getIntrospectionQuery());

export function useClientSchema() {
  const { data, error, loading } = useQuery<IntrospectionQuery>(IntrospectionDocument);
  const schema = useMemo(() => (data ? buildClientSchema(data) : undefined), [data]);

  return { schema, error, isLoading: loading };
}
