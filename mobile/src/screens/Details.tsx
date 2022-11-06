import { useRoute } from "@react-navigation/native";
import { HStack, VStack } from "native-base";
import { useEffect, useState } from "react";
import { Share } from "react-native";
import { EmptyMyPoolList } from "../components/EmptyMyPoolList";
import { Guesses } from "../components/Guesses";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { Option } from "../components/Option";
import { PoolCardProps } from "../components/PoolCard";
import { PoolHeader } from "../components/PoolHeader";
import { api } from "../services/api";

interface RouteParams {
  id: string;
}

export function Details() {
  const [isLoading, setIsloading] = useState(true);
  const [poolDetails, setPoolDetails] = useState<PoolCardProps>(
    {} as PoolCardProps
  );
  const [optionSelected, setOptionSelected] = useState<"guesses" | "ranking">(
    "guesses"
  );

  const route = useRoute();

  const { id } = route.params as RouteParams;

  async function handleCodeShare() {
    await Share.share({
      message: poolDetails.code
    })
  }

  async function fetchPoolDetails() {
    try {
      setIsloading(true);

      const response = await api.get(`/pools/${id}`);
      setPoolDetails(response.data.pool);
    } catch (error) {
    } finally {
      setIsloading(false);
    }
  }

  if (isLoading) {
    return <Loading />;
  }

  useEffect(() => {
    fetchPoolDetails();
  }, [id]);

  return (
    <VStack flex={1} bgColor={"gray.900"}>
      <Header onShare={handleCodeShare} title={poolDetails.title} showBackButton showShareButton />

      {poolDetails._count?.participants > 0 ? (
        <VStack px={5} flex={1}>
          <PoolHeader data={poolDetails} />

          <HStack bgColor="gray.800" p={1} rounded="sm" mb={5}>
            <Option
              title="Seus Palpites"
              isSelected={optionSelected === "guesses"}
              onPress={() => setOptionSelected("guesses")}
            />
            <Option
              title="Ranking do grupo"
              isSelected={optionSelected === "ranking"}
              onPress={() => setOptionSelected("ranking")}
            />
          </HStack>

          <Guesses poolId={poolDetails.id} />
        </VStack>
      ) : (
        <EmptyMyPoolList code={poolDetails.code} />
      )}
    </VStack>
  );
}
