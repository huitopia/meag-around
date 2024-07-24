import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { CustomToast } from "../component/CustomToast.jsx";

export function SignUpCustomer() {
  const [email, setEmail] = useState("");
  const [isCheckedEmail, setIsCheckedEmail] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [nickName, setNickName] = useState("");
  const [isCheckedNickName, setIsCheckedNickName] = useState(false);
  const navigate = useNavigate();
  const { successToast, errorToast, infoToast } = CustomToast();

  function handleSignup() {
    if (!isCheckedEmail) {
      alert("이메일 중복확인을 실행해주세요");
    } else {
      axios
        .post("/api/user/customer", { email, password, nickName })
        .then(() => {
          successToast("회원 가입에 성공하였습니다.");
          navigate("/login");
        })
        .catch(() => errorToast("회원가입에 실패하였습니다."));
    }
  }

  function handleCustomerCheckEmail() {
    axios
      .get(`/api/user/customer/email/${email}`, email)
      .then(() => {
        infoToast("회원가입 가능한 이메일입니다.");
        setIsCheckedEmail(true);
      })
      .catch((err) => {
        if (err.response.status === 409) {
          errorToast("이미 존재하는 이메일입니다.");
        } else {
          errorToast("유효하지 않은 이메일입니다.");
        }
      });
  }

  const passwordPattern =
    /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*?_]).{8,20}$/;
  useEffect(() => {
    if (passwordPattern.test(password)) {
      setIsValidPassword(true);
    } else {
      setIsValidPassword(false);
    }
  }, [password]);

  let isCheckedPassword;
  if (password === passwordCheck) {
    isCheckedPassword = true;
  }

  useEffect(() => {
    if (nickName.trim() !== "") {
      axios
        .get(`/api/user/customer/nickName/${nickName}`, nickName)
        .then((response) => {
          if (response.status === 200) {
            setIsCheckedNickName(true);
          }
        })
        .catch(() => {
          setIsCheckedNickName(false);
        });
    } else {
      setIsCheckedNickName(true);
    }
  }, [nickName]);
  return (
    <>
      <Center>
        <Box w={520}>
          <Flex mb={10} justifyContent={"space-between"}>
            <Heading>고객 회원 가입</Heading>
            <Button
              colorScheme={"teal"}
              borderRadius={"unset"}
              variant={"outline"}
              onClick={() => navigate("/signup/branch")}
            >
              지점 회원가입
            </Button>
          </Flex>
          <Box>
            <Box mb={7}>
              <FormControl isRequired>
                <FormLabel>이메일</FormLabel>
                <InputGroup>
                  <Input
                    type={"email"}
                    placeholder={"email@exmaple.com"}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setIsCheckedEmail(false);
                      setIsValidEmail(!e.target.validity.typeMismatch);
                    }}
                  />
                  <InputRightElement w={"90px"} mr={1} colorScheme={"red"}>
                    <Button
                      isDisabled={!isValidEmail || email.trim().length == 0}
                      onClick={handleCustomerCheckEmail}
                      size={"sm"}
                    >
                      중복확인
                    </Button>
                  </InputRightElement>
                </InputGroup>
                {email.length > 0 &&
                  (isCheckedEmail || (
                    <FormHelperText color={"#dc7b84"}>
                      유효한 이메일을 입력하고 중복확인 버튼을 눌러주세요.
                    </FormHelperText>
                  ))}
              </FormControl>
            </Box>
            <Box mb={7}>
              <FormControl isRequired>
                <FormLabel>비밀번호</FormLabel>
                <InputGroup>
                  <Input
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={"8-20자의 영문/숫자/특수문자 조합으로 입력"}
                    value={password}
                  />
                  <InputRightElement>
                    {password.length > 0 &&
                      (isValidPassword ? (
                        <CheckIcon color="green.500" />
                      ) : (
                        <CloseIcon color="red.500" />
                      ))}
                  </InputRightElement>
                </InputGroup>
                {password.length > 0 &&
                  (isValidPassword || (
                    <FormHelperText color={"#dc7b84"}>
                      영문 대/소문자, 숫자, 특수문자를 하나 이상 포함하여 8-20자
                      이내로 입력해 주세요.
                    </FormHelperText>
                  ))}
              </FormControl>
            </Box>
            <Box mb={7}>
              <FormControl isRequired>
                <FormLabel>비밀번호 재입력</FormLabel>
                <InputGroup>
                  <Input
                    onChange={(e) => setPasswordCheck(e.target.value)}
                    placeholder={"비밀번호 재입력"}
                  />
                  <InputRightElement>
                    {passwordCheck.length > 0 &&
                      (isCheckedPassword ? (
                        <CheckIcon color="green.500" />
                      ) : (
                        <CloseIcon color="red.500" />
                      ))}
                  </InputRightElement>
                </InputGroup>
                {passwordCheck.length > 0 &&
                  (isCheckedPassword || (
                    <FormHelperText color={"#dc7b84"}>
                      비밀번호가 일치하지 않습니다
                    </FormHelperText>
                  ))}
              </FormControl>
            </Box>
            <Box mb={7}>
              <FormControl isRequired>
                <FormLabel>닉네임</FormLabel>
                <InputGroup>
                  <Input
                    value={nickName}
                    placeholder={"닉네임을 입력해주세요"}
                    onChange={(e) => {
                      setNickName(e.target.value.trim());
                    }}
                  />
                </InputGroup>
                {isCheckedNickName || (
                  <FormHelperText color={"#dc7b84"}>
                    중복된 닉네임입니다.
                  </FormHelperText>
                )}
              </FormControl>
            </Box>
            <Center mt={10}>
              <Button
                // borderColor={"#fdd000"}
                // variant={"outline"}
                // bg={"white"}
                // color={"black"}
                // width={"200px"}
                // fontSize={"14px"}
                // borderRadius={"40"}
                bg={"black"}
                color={"white"}
                width={"200px"}
                fontSize={"14px"}
                borderRadius={"40"}
                // isLoading={isLoading}
                // isDisabled={isDisabled}
                onClick={handleSignup}
              >
                가입하기
              </Button>
            </Center>
          </Box>
        </Box>
      </Center>
    </>
  );
}
