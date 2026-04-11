import { createContext, useContext, useEffect, useState } from "react";
import { auth, facebookProvider } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup, signOut, type User } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

// Extend the Firebase User type to include our custom properties
interface ExtendedUser extends User {
  dbId?: number;
  freeScanUsed?: number;
  freeInjuryScanUsed?: number;
  vetChatCredits?: number;
}

interface AuthContextType {
  user: ExtendedUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Sync user with our database
          const response = await apiRequest("POST", "/api/auth/sync", {
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            firebaseId: firebaseUser.uid,
          });

          if (!response.ok) {
            throw new Error('Failed to sync user');
          }

          const dbUser = await response.json();
          // Create an extended user with the database ID
          const extendedUser: ExtendedUser = {
            ...firebaseUser,
            dbId: dbUser.id,
            freeScanUsed: Number(dbUser.freeScanUsed ?? 0),
            freeInjuryScanUsed: Number(dbUser.freeInjuryScanUsed ?? 0),
            vetChatCredits: Number(dbUser.vetChatCredits ?? 2)
          };

          setUser(extendedUser);
        } catch (error) {
          console.error("Error syncing user with database:", error);
          setUser(firebaseUser);
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({
        title: "Signed in successfully",
      });
    } catch (error: any) {
      console.error("Error signing in with Google:", error);

      if (error.code === 'auth/popup-closed-by-user') {
        return;
      }

      const errorMessage = error.code === 'auth/network-request-failed'
        ? "Network error. Please check your internet connection."
        : "Failed to sign in with Google. Please try again.";

      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: errorMessage,
      });
    }
  };

  const signInWithFacebook = async () => {
    try {
      await signInWithPopup(auth, facebookProvider);
      toast({
        title: "Signed in successfully with Facebook",
      });
    } catch (error: any) {
      console.error("Error signing in with Facebook:", error);

      if (error.code === 'auth/popup-closed-by-user') {
        return;
      }

      const errorMessage = error.code === 'auth/account-exists-with-different-credential'
        ? "An account already exists with the same email address but different sign-in credentials."
        : error.code === 'auth/network-request-failed'
        ? "Network error. Please check your internet connection."
        : "Failed to sign in with Facebook. Please try again.";

      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: errorMessage,
      });
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: "Please try again",
      });
      throw error;
    }
  };

  const refreshUser = async () => {
    if (!auth.currentUser) return;
    try {
      const response = await apiRequest("POST", "/api/auth/sync", {
        email: auth.currentUser.email,
        displayName: auth.currentUser.displayName,
        photoURL: auth.currentUser.photoURL,
        firebaseId: auth.currentUser.uid,
      });
      if (response.ok) {
        const dbUser = await response.json();
        
        setUser(prev => {
          if (!prev) return {
            ...auth.currentUser!,
            dbId: dbUser.id,
            freeScanUsed: Number(dbUser.freeScanUsed ?? 0),
            freeInjuryScanUsed: Number(dbUser.freeInjuryScanUsed ?? 0),
            vetChatCredits: Number(dbUser.vetChatCredits ?? 2)
          };

          // DEFENSIVE SYNC: Only update flags if dbUser explicitly has them
          // This prevents "flickering" if the DB hits a stale node
          return {
            ...prev,
            dbId: dbUser.id,
            email: dbUser.email || prev.email,
            displayName: dbUser.displayName || prev.displayName,
            photoURL: dbUser.photoURL || prev.photoURL,
            freeScanUsed: dbUser.freeScanUsed !== undefined && dbUser.freeScanUsed !== null ? Number(dbUser.freeScanUsed) : prev.freeScanUsed,
            freeInjuryScanUsed: dbUser.freeInjuryScanUsed !== undefined && dbUser.freeInjuryScanUsed !== null ? Number(dbUser.freeInjuryScanUsed) : prev.freeInjuryScanUsed,
            vetChatCredits: dbUser.vetChatCredits !== undefined && dbUser.vetChatCredits !== null ? Number(dbUser.vetChatCredits) : prev.vetChatCredits
          };
        });
      }
    } catch (error) {
      console.error("Error refreshing user:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInWithFacebook, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}