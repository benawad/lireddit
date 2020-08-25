import { utimes } from "fs";
import { useRouter } from "next/router";
import { usePostQuery } from "../generated/graphql";
import { useGetIntId } from "./useGetIntId";

export const useGetPostFromUrl = () => {
  const intId = useGetIntId();
  return usePostQuery({
    skip: intId === -1,
    variables: {
      id: intId,
    },
  });
};
