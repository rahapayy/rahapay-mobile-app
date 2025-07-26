import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
} from "react-native";
import { COLORS, SPACING } from "@/constants/ui";
import { Loading } from "@/components/common/ui/loading";
import { getItem, removeItem, setItem } from "@/utils/storage";
import { useAuth } from "@/services/AuthContext";
import {
  MediumText,
  RegularText,
} from "@/components/common/Text";
import { FaceIdIcon, TouchIdIcon } from "@/components/common/ui/icons";
import { Spacer } from "@/components/Spacer";
import Button from "@/components/common/ui/buttons/Button";
import { BasicPasswordInput } from "@/components/common/ui/forms/BasicPasswordInput";
import { useBiometrics } from "@/context/BiometricContext";
import { services } from "@/services";

const ExistingUserScreen: React.FC<any> = ({ navigation }) => {
  const [isPasswordMode, setIsPasswordMode] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUserInfo, setIsLoadingUserInfo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setIsAuthenticated, userInfo, setUserInfo, logOut, setIsFreshLogin, isAppReady } = useAuth();
  const { 
    isBiometricEnabled, 
    isBiometricAvailable, 
    biometricType, 
    authenticateWithBiometrics 
  } = useBiometrics();

  // Helper to get display name for biometric type
  const getBiometricDisplayName = () => {
    if (biometricType.toLowerCase().includes('touch')) {
      return 'Fingerprint';
    }
    return biometricType;
  };

  // Helper to get the best display name
  const getDisplayName = () => {
    if (!userInfo) return "";
    
    if (userInfo.userName) return userInfo.userName;
    if (userInfo.fullName) return userInfo.fullName;
    if (userInfo.email) return userInfo.email.split('@')[0]; // Use email prefix as fallback
    return ""; // Return empty string if no user info available
  };

  // Determine initial mode based on biometric settings
  useEffect(() => {
    // If biometrics are not enabled or not available, show password mode
    if (!isBiometricEnabled || !isBiometricAvailable) {
      setIsPasswordMode(true);
    } else {
      setIsPasswordMode(false);
    }
  }, [isBiometricEnabled, isBiometricAvailable]);





  // Load user info from storage for display purposes only
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        setIsLoadingUserInfo(true);
        const storedUserInfo = await getItem("USER_INFO", true);
        if (storedUserInfo) {
          const parsedUserInfo = JSON.parse(storedUserInfo);
          setUserInfo(parsedUserInfo);
        }
      } catch (error) {
        console.error("Failed to load user info from storage:", error);
      } finally {
        setIsLoadingUserInfo(false);
      }
    };

    loadUserInfo();
  }, []); // Run only once when component mounts

  const handleBiometricAuth = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const isAuthenticated = await authenticateWithBiometrics(
        `Authenticate with ${getBiometricDisplayName()}`
      );

      if (isAuthenticated) {
        // Get stored password and email for login
        const storedPassword = await getItem("USER_PASSWORD", true);
        const storedEmail = await getItem("LAST_USER_EMAIL", true);
        
        if (!storedPassword || !storedEmail) {
          setError("Stored credentials not found. Please log in with password.");
          setIsPasswordMode(true);
          return;
        }

        // Call login API with stored credentials to get fresh tokens
        const response = await services.authService.login({
          id: storedEmail,
          password: storedPassword,
        });

        // Clear all lock-related state before setting new tokens
        await Promise.all([
          removeItem("IS_LOCKED"),
          removeItem("BACKGROUND_TIMESTAMP"),
          removeItem("WAS_TERMINATED"),
          removeItem("LOCK_TIMESTAMP"),
        ]);

        // Store new tokens
        if (response.data.accessToken && response.data.refreshToken) {
          await Promise.all([
            setItem("ACCESS_TOKEN", response.data.accessToken, true),
            setItem("REFRESH_TOKEN", response.data.refreshToken, true),
          ]);
        }

        // Get user details from API (same as LoginScreen)
        const userResponse = await services.authServiceToken.getUserDetails();
        setIsAuthenticated(true);
        setUserInfo(userResponse.data);
        setIsFreshLogin(true);

        // Store the user email and user info for future use (same as LoginScreen)
        await Promise.all([
          setItem("LAST_USER_EMAIL", userResponse.data.email, true),
          setItem("USER_INFO", JSON.stringify(userResponse.data), true),
        ]);

        // Clear all lock states
        await Promise.all([
          removeItem("SECURITY_LOCK"),
          removeItem("IS_LOCKED"),
          removeItem("WAS_TERMINATED"),
          removeItem("BACKGROUND_TIMESTAMP"),
          removeItem("LOCK_TIMESTAMP"),
        ]);
        
        // Set current timestamp as last active
        await setItem("LAST_ACTIVE_TIMESTAMP", Date.now().toString());
        
        // Delay to ensure AuthContext state updates are processed before navigation
        setTimeout(() => {
          if (navigation && navigation.reset) {
            navigation.reset({
              index: 0,
              routes: [{ name: "AppStack" }],
            });
          }
        }, 300);
      } else {
        setError("Biometric authentication failed");
      }
    } catch (error) {
      setError("Biometric authentication error");
      setIsPasswordMode(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordAuth = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Try to get user email from multiple sources
      let userEmail = userInfo?.email;
      
      // If userInfo is not available, try to get from secure storage
      if (!userEmail) {
        // Try to get the last logged in user email from secure storage
        const lastUserEmail = await getItem("LAST_USER_EMAIL", true);
        if (lastUserEmail) {
          userEmail = lastUserEmail;
        }
      }
      
      if (!userEmail) {
        setError("User information not found. Please log in again.");
        return;
      }

      // Call the login endpoint using the same pattern as LoginScreen
      const response = await services.authService.login({
        id: userEmail,
        password: password,
      });

      // Clear all lock-related state before setting new tokens (same as LoginScreen)
      await Promise.all([
        removeItem("IS_LOCKED"),
        removeItem("BACKGROUND_TIMESTAMP"),
        removeItem("WAS_TERMINATED"),
        removeItem("LOCK_TIMESTAMP"),
      ]);

      // Store tokens from response.data
      if (response.data.accessToken && response.data.refreshToken) {
        await Promise.all([
          setItem("ACCESS_TOKEN", response.data.accessToken, true),
          setItem("REFRESH_TOKEN", response.data.refreshToken, true),
        ]);
      }

      // Get user details from API (same as LoginScreen)
      const userResponse = await services.authServiceToken.getUserDetails();
      setIsAuthenticated(true);
      setUserInfo(userResponse.data);
      setIsFreshLogin(true);

      // Store the user email, user info, and password for future use (same as LoginScreen)
      await Promise.all([
        setItem("LAST_USER_EMAIL", userResponse.data.email, true),
        setItem("USER_INFO", JSON.stringify(userResponse.data), true),
        setItem("USER_PASSWORD", password, true), // Store password securely for biometric auth
      ]);

      // Unlock the app and ensure all lock states are cleared
      await Promise.all([
        removeItem("SECURITY_LOCK"),
        removeItem("IS_LOCKED"),
        removeItem("WAS_TERMINATED"),
        removeItem("BACKGROUND_TIMESTAMP"),
        removeItem("LOCK_TIMESTAMP"),
      ]);
      
      // Set current timestamp as last active
      await setItem("LAST_ACTIVE_TIMESTAMP", Date.now().toString());
      
      // Set authentication state
      setIsAuthenticated(true);
      setPassword("");

      // Force a small delay to ensure all state updates are processed
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Delay to ensure AuthContext state updates are processed before navigation
      setTimeout(() => {
        if (navigation && navigation.reset) {
          navigation.reset({
            index: 0,
            routes: [{ name: "AppStack" }],
          });
        }
      }, 300);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Login failed. Please try again.";
      setError(errorMessage);
      setPassword("");
    } finally {
      setIsLoading(false);
    }
  };

  const switchToPasswordMode = () => {
    setIsPasswordMode(true);
    setError(null);
  };

  const switchToBiometricMode = () => {
    setIsPasswordMode(false);
    setError(null);
    setPassword("");
  };

  const renderBiometricMode = () => (
    <View style={styles.content}>
      <View style={styles.headerSection}>
        <Image source={require("@/assets/images/logo-horizontal-black.png")} style={styles.logo} />
        <MediumText color="primary" size="xlarge" center marginBottom={8}>
          {isLoadingUserInfo 
            ? "Loading..." 
            : `Welcome back${getDisplayName() ? ", " + getDisplayName() : ""}`
          }
        </MediumText>
        <RegularText color="light" center>
          Unlock your account to continue
        </RegularText>
      </View>
      
      <Spacer size={SPACING * 6} />

      <View style={styles.biometricSection}>
        <View style={styles.biometricCircle}>
          <View style={styles.biometricIconWrapper}>
            {biometricType.toLowerCase().includes('face') ? (
              <FaceIdIcon width={32} height={32} fill={COLORS.brand.primary} />
            ) : (
              <TouchIdIcon width={32} height={32} fill={COLORS.brand.primary} />
            )}
          </View>
        </View>

        <Spacer size={SPACING * 2} />

        <RegularText color="black" size="base" center marginBottom={12}>
          Click to authenticate with {getBiometricDisplayName()}
        </RegularText>

        <Spacer size={SPACING * 2} />
        
        <Button
          title={`Use ${getBiometricDisplayName()}`}
          onPress={handleBiometricAuth}
          style={{
            width: "70%",
            paddingHorizontal: SPACING * 2,
          }}
        />
      </View>
    </View>
  );

  const renderPasswordMode = () => (
    <View style={styles.content}>
      <View style={styles.headerSection}>
      <Image source={require("@/assets/images/logo-horizontal-black.png")} style={styles.logo} />
        <MediumText color="primary" size="xlarge" center marginBottom={10}>
          {isLoadingUserInfo 
            ? "Loading..." 
            : `Welcome back${getDisplayName() ? ", " + getDisplayName() : ""}`
          }
        </MediumText>
        <RegularText color="light" center>
          Enter your password to continue
        </RegularText>
      </View>
      
      <View style={styles.formSection}>
        <BasicPasswordInput
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          error={error || undefined}
        />

        {error && (
          <View style={styles.errorContainer}>
            <RegularText color="error" center>
              {error}
            </RegularText>
          </View>
        )}

        <Spacer size={SPACING * 4} />

        <Button
          title={"Sign In"}
          onPress={handlePasswordAuth}
          disabled={isLoading || !password.trim()}
          style={styles.primaryButton}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.contentWrapper}>
        {isPasswordMode ? renderPasswordMode() : renderBiometricMode()}
        
        <View style={styles.footerSection}>
          <Button
            title="Switch account"
            onPress={async () => {
              try {
                // Use the centralized logout function from AuthContext
                await logOut();
                
                // Clear security lock to ensure user goes to auth stack
                await Promise.all([
                  removeItem("SECURITY_LOCK"),
                  removeItem("LAST_ACTIVE_TIMESTAMP"),
                ]);
                
                // The AuthContext will automatically handle navigation to auth stack
                // by setting isAuthenticated to false, which triggers Router to show AuthRoute
              } catch (error) {
                console.error("Error switching account:", error);
              }
            }}
            style={{
              width: isBiometricEnabled && isBiometricAvailable ? "50%" : "100%",
            }}
          />
          {isBiometricEnabled && isBiometricAvailable && (
            <Button
              title={isPasswordMode ? `Use ${getBiometricDisplayName()}` : "Login with password"}
              onPress={isPasswordMode ? switchToBiometricMode : switchToPasswordMode}
              borderOnly
              style={{
                width: "50%",
              }}
            />
          )}
        </View>
      </View>
      {(isLoading || (isLoadingUserInfo && !userInfo)) && <Loading size="large" color={COLORS.brand.primary} />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  contentWrapper: {
    flex: 1,
    zIndex: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: SPACING * 6,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: SPACING,
  },
  biometricSection: {
    alignItems: "center",
    marginBottom: SPACING,
  },
  biometricCircle: {
    width: 70,
    height: 70,
    borderRadius: 40,
    backgroundColor: COLORS.brand.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING * 1.5,
  },
  biometricIconWrapper: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  formSection: {
    width: "100%",
    marginBottom: SPACING * 2,
  },
  inputContainer: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: "Outfit-Regular",
    marginBottom: SPACING * 1.5,
  },
  errorContainer: {
    marginBottom: SPACING * 1.5,
  },
  primaryButton: {
    width: "100%",
    height: 50,
    backgroundColor: COLORS.brand.primary,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  secondaryButton: {
    paddingVertical: 10,
  },
  footerSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: SPACING * 4,
    paddingHorizontal: SPACING * 2,
    gap: SPACING,
  },
  passwordInput: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: "Outfit-Regular",
  },
  logo: {
    width: 160,
    height: 40,
    marginBottom: SPACING * 2,
  },
});

export default ExistingUserScreen;
