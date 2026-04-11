import { useAuth } from "@/contexts/auth-context";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { apiRequest } from "@/lib/queryClient";

export default function UserProfile() {
  const { user, logout, refreshUser } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await logout();
      toast({
        title: "Signed out successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to sign out",
        description: "Please try again",
      });
    }
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Your Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || "Profile"}
                  className="h-20 w-20 rounded-full"
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-2xl">
                    {user.displayName?.[0]?.toUpperCase() || "U"}
                  </span>
                </div>
              )}
              <div>
                <h2 className="text-xl font-semibold">{user.displayName}</h2>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Joined {format(new Date(user.metadata.creationTime), 'MMMM d, yyyy')}</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Button
                variant="destructive"
                onClick={handleSignOut}
                className="w-full sm:w-auto"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>

              <Button
                variant="outline"
                onClick={async () => {
                  if (confirm("Reset account freemium status for testing?")) {
                    try {
                      const res = await apiRequest("POST", "/api/auth/reset-test-account", { userId: user.dbId });
                      const data = await res.json();
                      console.log("[RESET] Server response:", data);
                      // Hard reload to force Firebase auth to re-sync user from DB
                      window.location.href = "/";
                    } catch (error) {
                      toast({ variant: "destructive", title: "Reset Failed", description: "Could not reset account." });
                    }
                  }
                }}
                className="w-full sm:w-auto"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Reset Account for Testing
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
