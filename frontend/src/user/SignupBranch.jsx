import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Center,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { CustomToast } from "../component/CustomToast.jsx";
import { Postcode } from "./component/Postcode.jsx";

export function SignUpBranch() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [branchName, setBranchName] = useState("");
  const [isCheckedEmail, setIsCheckedEmail] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [passwordCheck, setPasswordCheck] = useState("");
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [isCheckedBranchName, setIsCheckedBranchName] = useState(false);
  const [address, setAddress] = useState("");
  const navigate = useNavigate();
  const { successToast, errorToast, infoToast } = CustomToast();
  const handleAddressSelect = (fullAddress) => {
    setAddress(fullAddress);
  };

  function handleSignup() {
    axios
      .post("/api/user/branch", {
        email,
        password,
        branchName,
        address,
      })
      .then(() => {
        successToast("지점 가입에 성공하였습니다.");
        navigate("/login");
      })
      .catch(() => errorToast("지점 가입에 실패하였습니다."));
  }

  function handleBranchCheckEmail() {
    axios
      .get(`/api/user/branch/email/${email}`, email)
      .then(() => {
        successToast("회원가입 가능한 이메일입니다.");
        setIsCheckedEmail(true);
      })
      .catch((err) => {
        if (err.response.status === 409) {
          errorToast("이미 존재하는 이메일입니다.");
        } else {
          infoToast("회원가입이 가능한 이메일입니다.");
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
    if (branchName.trim() !== "") {
      axios
        .get(`/api/user/branch/branchName/${branchName}`, branchName)
        .then((response) => {
          if (response.status === 200) {
            setIsCheckedBranchName(true);
          }
        })
        .catch(() => {
          setIsCheckedBranchName(false);
        });
    } else {
      setIsCheckedBranchName(true);
    }
  }, [branchName]);
  return (
    <>
      <Center>
        <Box w={520} mt={10}>
          <Center mt={5} mb={10} fontSize={"25px"} fontWeight={"bold"}>
            <Text>지점 회원가입</Text>
          </Center>
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
                      onClick={handleBranchCheckEmail}
                      size={"sm"}
                      colorScheme={"blue"}
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
                    placeholder={"비밀번호를 한번 더 입력해주세요"}
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
                <FormLabel>지점명</FormLabel>
                <InputGroup>
                  <Input
                    value={branchName}
                    placeholder={"지점명을 입력해주세요"}
                    onChange={(e) => {
                      setBranchName(e.target.value.trim());
                    }}
                  />
                </InputGroup>
                {isCheckedBranchName || (
                  <FormHelperText color={"#dc7b84"}>
                    중복된 지점명입니다.
                  </FormHelperText>
                )}
              </FormControl>
            </Box>
            <Box mb={7}>
              <FormControl isRequired>
                <FormLabel>주소</FormLabel>
                <Postcode onAddressSelect={handleAddressSelect} />
              </FormControl>
            </Box>
            <Input value={address} readOnly placeholder="주소" />
            <Center mt={5} mb={5}>
              <Button
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
