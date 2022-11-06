import { Heading, Input, useToast, VStack } from "native-base";
import { Header } from "../components/Header";

import { Button } from "../components/Button";
import { useState } from "react";
import { api } from "../services/api";
import { useNavigation } from "@react-navigation/native";

export function Find() {
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState("");
  const toast = useToast();

  const navigation = useNavigation();

  async function handleJoinPool() {
    try {
      setIsLoading(true);

      if(!code.trim()) {
        toast.show({
          title: "Informe o codigo",
          placement: "top",
          bgColor: "red.500",
        });
      }

      await api.post('/pools/join', { code });
      navigation.navigate('pools');

    } catch (error) {
      setIsLoading(false);
      if (error.response?.data?.message === "Pool not found") {
        return toast.show({
          title: "Bolão não encontrado",
          placement: "top",
          bgColor: "red.500",
        });
      }
    }
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Buscar por código" showBackButton />

      <VStack mt={8} mx={5} alignItems="center">
        <Heading
          fontFamily={"heading"}
          color="white"
          fontSize="xl"
          mb={8}
          textAlign="center"
        >
          Encontre um bolão através de seu código único
        </Heading>

        <Input
          autoCapitalize="characters"
          onChangeText={setCode}
          mb={2}
          placeholder="Qual o código do bolão?"
        />

        <Button
          isLoading={isLoading}
          title="BUSCAR BOLÃO"
          onPress={handleJoinPool}
        />
      </VStack>
    </VStack>
  );
}
