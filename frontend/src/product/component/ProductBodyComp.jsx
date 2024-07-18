import {
  Box,
  Card,
  CardBody,
  Image,
  SimpleGrid,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// TODO : 품절 체크
export function ProductBodyComp({ mainCategory, subCategory }) {
  const [data, setData] = useState([]);
  const toast = useToast();
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(`/api/products/list?main=${mainCategory}&sub=${subCategory}`)
      .then((response) => {
        if (response.data != null) {
          setData(response.data);
        }
        console.log("Response:", response.data);
      })
      .catch((error) => {
        toast({
          status: "error",
          description: "상품 조회 중 문제가 발생하였습니다.",
          position: "top",
          duration: 1500,
        });
        console.error("Error:", error);
      })
      .finally();
  }, [mainCategory, subCategory]);
  return (
    <Box mt={"50px"}>
      <SimpleGrid
        spacing={4}
        templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
      >
        {data.map((product) => (
          <Card
            key={product.id}
            height={"330px"}
            onClick={() => navigate(`/product/${product.id}`)}
            cursor={"pointer"}
          >
            <CardBody>
              <VStack spacing={4}>
                <Image
                  height={"200px"}
                  border={"1px solid red"}
                  objectFit="cover"
                  src={`https://huistudybucket01.s3.ap-northeast-2.amazonaws.com/${product.file_path}`}
                />
                <Text
                  fontSize="lg"
                  as={"b"}
                  w={"100%"}
                  height={"30px"}
                  textAlign={"center"}
                  overflow={"hidden"}
                >
                  {product.title}
                </Text>
                <Text as={"b"}>{product.price} 원</Text>
              </VStack>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
    </Box>
  );
}