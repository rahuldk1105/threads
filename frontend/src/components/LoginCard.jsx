import {
	Flex,
	Box, // Keep Box inside HStack if needed, or adjust HStack styling
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	HStack,
	InputRightElement,
	Stack,
	Button,
	Heading,
	Text,
	useColorModeValue,
	Link,
	Image, // Import Image
	Card,  // Import Card components
	CardHeader,
	CardBody,
	CardFooter,
	useColorMode, // Import useColorMode
	IconButton, // Import IconButton for password toggle
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useSetRecoilState } from "recoil";
import authScreenAtom from "../atoms/authAtom";
import useShowToast from "../hooks/useShowToast";
import userAtom from "../atoms/userAtom";

export default function SignupCard() {
	const [showPassword, setShowPassword] = useState(false);
	const setAuthScreen = useSetRecoilState(authScreenAtom);
	const [inputs, setInputs] = useState({
		name: "",
		username: "",
		email: "",
		password: "",
	});
	const [loading, setLoading] = useState(false); // Added loading state
	const { colorMode } = useColorMode(); // Get color mode
	const showToast = useShowToast();
	const setUser = useSetRecoilState(userAtom);

	const handleSignup = async () => {
		setLoading(true); // Set loading true
		try {
			const res = await fetch("/api/users/signup", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(inputs),
			});
			const data = await res.json();

			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}

			localStorage.setItem("user-threads", JSON.stringify(data));
			setUser(data);
		} catch (error) {
			showToast("Error", error?.message || "An error occurred", "error"); // More specific error
		} finally {
			setLoading(false); // Set loading false
		}
	};

	// Define colors based on mode for consistency
	const focusBorderColor = useColorModeValue("gray.300", "gray.600");
	const logoSrc = colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg";

	return (
		<Flex align={"center"} justify={"center"} minH={"calc(100vh - 100px)"}>
			<Card
				// Slightly wider for signup form compared to login
				w={{ base: "full", sm: "450px" }} 
				variant="outline"
				p={4} // Padding for the card
				borderRadius="lg" // Match Login Card
			>
				<CardHeader align="center">
					<Image
						boxSize="40px"
						src={logoSrc}
						alt="Threads Logo"
						mb={4}
					/>
					<Heading fontSize={"2xl"} textAlign={"center"}>
						Sign Up
					</Heading>
					<Text fontSize="sm" color={useColorModeValue("gray.600", "gray.400")} mt={1}>
						Create your Threads account.
					</Text>
				</CardHeader>

				<CardBody>
					{/* Increased spacing for form elements */}
					<Stack spacing={4}> 
						<HStack spacing={3}> {/* Adjust spacing in HStack if needed */}
							<Box flex={1}> {/* Use Flexbox for equal width */}
								<FormControl isRequired id="full-name">
									<FormLabel fontSize="sm">Full name</FormLabel>
									<Input
										type="text"
										onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
										value={inputs.name}
										variant="filled"
										focusBorderColor={focusBorderColor}
										_placeholder={{ color: useColorModeValue("gray.500", "gray.500") }}
									/>
								</FormControl>
							</Box>
							<Box flex={1}> {/* Use Flexbox for equal width */}
								<FormControl isRequired id="username-signup">
									<FormLabel fontSize="sm">Username</FormLabel>
									<Input
										type="text"
										onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
										value={inputs.username}
										variant="filled"
										focusBorderColor={focusBorderColor}
										_placeholder={{ color: useColorModeValue("gray.500", "gray.500") }}
									/>
								</FormControl>
							</Box>
						</HStack>
						<FormControl isRequired id="email-signup">
							<FormLabel fontSize="sm">Email address</FormLabel>
							<Input
								type="email"
								onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
								value={inputs.email}
								variant="filled"
								focusBorderColor={focusBorderColor}
								_placeholder={{ color: useColorModeValue("gray.500", "gray.500") }}
							/>
						</FormControl>
						<FormControl isRequired id="password-signup">
							<FormLabel fontSize="sm">Password</FormLabel>
							<InputGroup>
								<Input
									type={showPassword ? "text" : "password"}
									onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
									value={inputs.password}
									variant="filled"
									focusBorderColor={focusBorderColor}
									_placeholder={{ color: useColorModeValue("gray.500", "gray.500") }}
								/>
								<InputRightElement h={"full"}>
									{/* Changed to IconButton like in LoginCard */}
									<IconButton
										size="sm"
										variant={"ghost"}
										onClick={() => setShowPassword((showPassword) => !showPassword)}
										aria-label={showPassword ? "Hide password" : "Show password"}
										icon={showPassword ? <ViewIcon /> : <ViewOffIcon />}
										color={useColorModeValue("gray.600", "gray.400")}
									/>
								</InputRightElement>
							</InputGroup>
						</FormControl>
						<Stack spacing={6} pt={2}>
							<Button
								loadingText="Submitting..."
								size="lg"
								colorScheme="blue" // Match Login Button
								onClick={handleSignup}
								isLoading={loading} // Use loading state
								w="full" // Make button full width like Login
							>
								Sign up
							</Button>
						</Stack>
					</Stack>
				</CardBody>

				<CardFooter pt={0}>
					<Text align={"center"} fontSize="sm" w="full">
						Already a user?{" "}
						<Link 
							color={"blue.400"} 
							onClick={() => setAuthScreen("login")}
							fontWeight="medium" // Match Login Link
							_hover={{ textDecoration: 'underline' }} // Match Login Link
						>
							Login
						</Link>
					</Text>
				</CardFooter>
			</Card>
		</Flex>
	);
}
