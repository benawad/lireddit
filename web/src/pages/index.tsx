import { Box, Button, Flex, Heading, Link, Stack, Text } from "@chakra-ui/core";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import { useState } from "react";
import { EditDeletePostButtons } from "../components/EditDeletePostButtons";
import { Layout } from "../components/Layout";
import { UpdootSection } from "../components/UpdootSection";
import { usePostsQuery, PostsQueryVariables } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

type Props = {
  variables: PostsQueryVariables;
  isLastPage: boolean;
  onLoadMore: (cursor: string) => void;
};

const Page = ({ variables, isLastPage, onLoadMore }: Props) => {
  const [{ data, fetching }] = usePostsQuery({
    variables,
  });

  return (
    <>
      <Stack spacing={8}>
        {data?.posts.posts.map((p) =>
          !p ? null : (
            <Flex key={p.id} p={5} shadow="md" borderWidth="1px">
              <UpdootSection post={p} />
              <Box flex={1}>
                <NextLink href="/post/[id]" as={`/post/${p.id}`}>
                  <Link>
                    <Heading fontSize="xl">{p.title}</Heading>
                  </Link>
                </NextLink>
                <Text>posted by {p.creator.username}</Text>
                <Flex align="center">
                  <Text flex={1} mt={4}>
                    {p.textSnippet}
                  </Text>
                  <Box ml="auto">
                    <EditDeletePostButtons id={p.id} creatorId={p.creator.id} />
                  </Box>
                </Flex>
              </Box>
            </Flex>
          )
        )}
      </Stack>
      {(isLastPage && fetching) || (isLastPage && data?.posts.hasMore) ? (
        <Flex>
          <Button
            onClick={() => {
              if (data?.posts) {
                onLoadMore(
                  data.posts.posts[data.posts.posts.length - 1].createdAt
                );
              }
            }}
            isLoading={fetching}
            m="auto"
            my={8}
          >
            load more
          </Button>
        </Flex>
      ) : null}
    </>
  );
};

const limit = 15;

const Index = () => {
  const [pageVariables, setPageVariables] = useState([
    {
      limit,
      cursor: null as null | string,
    },
  ]);

  return (
    <Layout>
      {pageVariables.map((variables, i) => {
        return (
          <Page
            key={"" + variables.cursor}
            variables={variables}
            isLastPage={i === pageVariables.length - 1}
            onLoadMore={(cursor) =>
              setPageVariables([...pageVariables, { cursor, limit }])
            }
          />
        );
      })}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
