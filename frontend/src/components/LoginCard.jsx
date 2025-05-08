import {
	Flex,
	Box, // Keep Box for structure if needed, but maybe style Flex directly
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
	Image,
	useColorMode,
	VStack, // Use VStack for vertical stacking
	IconButton, // For the show/hide password button
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
	const { colorMode } = useColorMode();
	const showToast = useShowToast();

	const [inputs, setInputs] = useState({
		username: "",
		password: "",
	});

	// Define colors based on mode for better consistency
	const bgColor = useColorModeValue("gray.50", "gray.900"); // Slightly off-white/dark background for the page
	const formBgColor = useColorModeValue("white", "gray.800"); // Background for the form area
	const inputBgColor = useColorModeValue("gray.100", "gray.700");
	const focusBorderColor = useColorModeValue("blue.400", "blue.300");
	const logoSrc = colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg";
	const textColor = useColorModeValue("gray.700", "gray.200");
	const subtleTextColor = useColorModeValue("gray.600", "gray.400");

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
			showToast("Error", error?.message || "An error occurred", "error"); // More specific error
		} finally {
			setLoading(false);
		}
	};

	return (
		// Full height flex container to center content vertically and horizontally
		<Flex
			minH={"100vh"} // Use full viewport height
			align={"center"}
			justify={"center"}
			bg={bgColor} // Apply background to the whole page area
			px={4} // Add padding on mobile
		>
			<Stack
				spacing={8} // Increased spacing between elements like logo, heading, form, footer
				mx={"auto"}
				w={"full"} // Full width on mobile
				maxW={"md"} // Max width on larger screens
				py={12}
				px={6}
				bg={formBgColor} // Background for the form container
				rounded={"xl"} // More rounded corners
				boxShadow={"lg"} // Subtle shadow for depth
			>
				<VStack spacing={2} align="center">
					<Image boxSize="45px" src={logoSrc} alt="Threads Logo" />
					<Heading fontSize={{base: "2xl", md: "3xl"}} textAlign={"center"} color={textColor}>
						Log in to Threads
					</Heading>
					<Text fontSize={"md"} color={subtleTextColor}>
						Welcome back!
					</Text>
				</VStack>

				<Box> {/* Box to contain the form controls */}
					<Stack spacing={5}> {/* Increased spacing inside the form */}
						<FormControl isRequired id="username"> {/* Added id for accessibility */}
							<FormLabel fontSize="sm" fontWeight="medium" color={subtleTextColor}>Username</FormLabel>
							<Input
								type="text"
								value={inputs.username}
								onChange={(e) => setInputs((prev) => ({ ...prev, username: e.target.value }))}
								bg={inputBgColor} // Input background color
								borderColor={useColorModeValue("gray.300", "gray.600")}
								focusBorderColor={focusBorderColor} // Clear focus indication
								borderRadius="md" // Consistent border radius
								_placeholder={{ color: "gray.500" }}
							/>
						</FormControl>
						<FormControl isRequired id="password"> {/* Added id for accessibility */}
							<FormLabel fontSize="sm" fontWeight="medium" color={subtleTextColor}>Password</FormLabel>
							<InputGroup>
								<Input
									type={showPassword ? "text" : "password"}
									value={inputs.password}
									onChange={(e) => setInputs((prev) => ({ ...prev, password: e.target.value }))}
									bg={inputBgColor}
									borderColor={useColorModeValue("gray.300", "gray.600")}
									focusBorderColor={focusBorderColor}
									borderRadius="md"
									_placeholder={{ color: "gray.500" }}
								/>
								<InputRightElement>
									{/* Use IconButton for better semantics and spacing */}
									<IconButton
										size="sm"
										variant="ghost"
										aria-label={showPassword ? "Hide password" : "Show password"}
										icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
										onClick={() => setShowPassword(!showPassword)}
										color={subtleTextColor} // Subtle color for icon button
									/>
								</InputRightElement>
							</InputGroup>
						</FormControl>
						<Stack spacing={6} pt={3}> {/* More spacing, added top padding */}
							<Button
								loadingText="Logging in..."
								size="lg"
								bg={useColorModeValue("gray.800", "gray.200")} // Stronger button colors
								color={useColorModeValue("white", "gray.800")}
								_hover={{
									bg: useColorModeValue("gray.900", "gray.300"), // Darken/lighten on hover
								}}
								_active={{ // Add active state
									bg: useColorModeValue("gray.700", "gray.400"),
									transform: "scale(0.98)" // Subtle press effect
								}}
								onClick={handleLogin}
								isLoading={loading}
								w="full" // Make button full width
								borderRadius="md"
							>
								Login
							</Button>
						</Stack>
					</Stack>
				</Box>

				<Stack pt={2}> {/* Reduced top padding for footer */}
					<Text align={"center"} color={subtleTextColor} fontSize="sm">
						Don&apos;t have an account?{" "}
						<Link
							color={useColorModeValue("blue.500", "blue.300")} // Use theme blue color
							onClick={() => setAuthScreen("signup")}
							fontWeight="medium" // Make link slightly bolder
							_hover={{ textDecoration: 'underline' }} // Add underline on hover
						>
							Sign up
						</Link>
					</Text>
				</Stack>
			</Stack>
		</Flex>
	);
}
