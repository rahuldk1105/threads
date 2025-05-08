import {
	Flex,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
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
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useSetRecoilState } from "recoil";
import authScreenAtom from "../atoms/authAtom";
import useShowToast from "../hooks/useShowToast";
import userAtom from "../atoms/userAtom";

export default function LoginCard() {
	const [showPassword, setShowPassword] = useState(false);
	const setAuthScreen = useSetRecoilState(authScreenAtom);
	const setUser = useSetRecoilState(userAtom);
	const [loading, setLoading] = useState(false);
	const { colorMode } = useColorMode(); // Get color mode

	const [inputs, setInputs] = useState({
		username: "",
		password: "",
	});
	const showToast = useShowToast();

	const handleLogin = async () => {
		setLoading(true);
		try {
			const res = await fetch("/api/users/login", {
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
			showToast("Error", error, "error");
		} finally {
			setLoading(false);
		}
	};

	return (
		// Use Flex to center the card vertically and horizontally
		<Flex align={"center"} justify={"center"} minH={"calc(100vh - 100px)"}> 
			<Card
				w={{ base: "full", sm: "400px" }}
				variant="outline" // Add a subtle outline
				p={4} // Add padding to the Card itself
				borderRadius="lg" // Add some border radius
			>
				<CardHeader align="center">
					{/* Display Logo based on color mode */}
					<Image
						boxSize="40px" // Adjust size as needed
						src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
						alt="Threads Logo"
						mb={4} // Margin bottom for spacing
					/>
					<Heading fontSize={"2xl"} textAlign={"center"}>
						Login
					</Heading>
					{/* Optional: Add a subtitle */}
					<Text fontSize="sm" color={useColorModeValue("gray.600", "gray.400")} mt={1}>
						Welcome back! Sign in to continue.
					</Text>
				</CardHeader>

				<CardBody>
					<Stack spacing={4}> {/* Adjust spacing between form elements */}
						<FormControl isRequired>
							<FormLabel fontSize="sm">Username</FormLabel>
							<Input
								type="text"
								value={inputs.username}
								onChange={(e) => setInputs((inputs) => ({ ...inputs, username: e.target.value }))}
								variant="filled" // Use filled variant for inputs
								focusBorderColor={useColorModeValue("gray.300", "gray.600")} // Subtle focus color
								_placeholder={{ color: useColorModeValue("gray.500", "gray.500") }}
							/>
						</FormControl>
						<FormControl isRequired>
							<FormLabel fontSize="sm">Password</FormLabel>
							<InputGroup>
								<Input
									type={showPassword ? "text" : "password"}
									value={inputs.password}
									onChange={(e) => setInputs((inputs) => ({ ...inputs, password: e.target.value }))}
									variant="filled" // Use filled variant
									focusBorderColor={useColorModeValue("gray.300", "gray.600")} // Subtle focus color
									_placeholder={{ color: useColorModeValue("gray.500", "gray.500") }}
								/>
								<InputRightElement h={"full"}>
									<Button
										variant={"ghost"}
										onClick={() => setShowPassword((showPassword) => !showPassword)}
										aria-label={showPassword ? "Hide password" : "Show password"} // Accessibility
									>
										{showPassword ? <ViewIcon /> : <ViewOffIcon />}
									</Button>
								</InputRightElement>
							</InputGroup>
						</FormControl>
						<Stack spacing={6} pt={2}> {/* Add slight top padding before button */}
							<Button
								loadingText="Logging in..."
								size="lg" // Make button large
								colorScheme="blue" // Use a standard color scheme
								onClick={handleLogin}
								isLoading={loading}
							>
								Login
							</Button>
						</Stack>
					</Stack>
				</CardBody>

				<CardFooter pt={0}> {/* Reduce top padding for footer */}
					{/* Ensure footer text is centered */}
					<Text align={"center"} fontSize="sm" w="full"> 
						Don&apos;t have an account?{" "}
						<Link color={"blue.400"} onClick={() => setAuthScreen("signup")} fontWeight="medium"> {/* Make link slightly bolder */}
							Sign up
						</Link>
					</Text>
				</CardFooter>
			</Card>
		</Flex>
	);
}
