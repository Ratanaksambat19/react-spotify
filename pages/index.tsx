import { Box, Flex, Text } from "@chakra-ui/layout";
import { Image } from "@chakra-ui/react";
import GradientLayout from "../components/gradientLayout";
import prisma from "../lib/prisma";
import { useMe } from "../lib/hooks";

const Home = ({ artists }) => {
  const { user } = useMe();

  return (
    <GradientLayout
      roundImage
      color="green"
      subtitle="Profile"
      description={`${user?.playlistsCount} public playlists`}
      title={`${user?.firstName} ${user?.lastName}`}
      image="https://picsum.photos/400?random"
    >
      <Box color="white" paddingX="20px">
        <Box marginBottom="40px">
          <Text fontSize="2xl" fontWeight="bold">
            Top artist this month
          </Text>
          <Text fontSize="md">Only visible to you</Text>
        </Box>
        <Flex>
          {artists.map((artist) => (
            <Box paddingX="10px" width="20%" key={artist.name}>
              <Box bg="gray.900" borderRadius="4px" padding="15px" width="100%">
                <Image
                  src={`https://placekitten.com/300/${artist.id + 300}`}
                  borderRadius="100%"
                />
                <Box marginTop="20px" width="100%">
                  <Text fontSize="large">{artist.name}</Text>
                  <Text fontSize="small" color="gray.500">
                    Artist
                  </Text>
                </Box>
              </Box>
            </Box>
          ))}
        </Flex>
      </Box>
    </GradientLayout>
  );
};

export const getServerSideProps = async () => {
  const artists = await prisma.artist.findMany({});

  return {
    props: { artists },
  };
};

export default Home;
