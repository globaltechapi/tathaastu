import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getRegistryReservations,
  getRegistryStats,
} from "@/services/registryService";
import { supabase } from "@/lib/supabase";
import { formatDistanceToNow } from "date-fns";
import { ShoppingCart, Search } from "lucide-react";

type RecentActivityProps = {
  registryId: string;
};

export default function RecentActivity({ registryId }: RecentActivityProps) {
  const [reservations, setReservations] = useState<any[]>([]);
  const [stats, setStats] = useState({ views: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!registryId) return;

      try {
        setLoading(true);

        // Direct query first to ensure we get the most up-to-date data
        try {
          const { data: directItems, error: directError } = await supabase
            .from("registry_items")
            .select(
              "id, name, purchased, purchased_at, purchaser_name, purchaser_email, invoice_url",
            )
            .eq("registry_id", registryId)
            .eq("purchased", true);

          console.log("Direct query results:", directItems);

          if (directItems && directItems.length > 0 && !directError) {
            const formattedItems = directItems.map((item) => ({
              id: item.id,
              item_name: item.name,
              purchased_at: item.purchased_at || new Date().toISOString(),
              purchaser_name: item.purchaser_name || "Guest",
              purchaser_email: item.purchaser_email || "guest@example.com",
              invoice_url: item.invoice_url || null,
            }));
            setReservations(formattedItems);
          }
        } catch (directError) {
          console.error("Error in direct query:", directError);
        }

        // Fetch reservations through the service as backup
        const reservationData = await getRegistryReservations(registryId);
        console.log("Fetched reservation data:", reservationData);

        if (reservationData && reservationData.length > 0) {
          setReservations(reservationData);
        }

        // Fetch registry stats for view count
        try {
          const statsData = await getRegistryStats(registryId);
          setStats({ views: statsData.views });
        } catch (statsError) {
          console.error("Error fetching stats:", statsError);
          setStats({ views: 0 });
        }
      } catch (err) {
        console.error("Error fetching activity data:", err);
        setError("Failed to load recent activity");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Set up polling to refresh data every 5 seconds
    const pollingInterval = setInterval(async () => {
      if (!registryId) return;

      try {
        // Direct query for most up-to-date data
        const { data: directItems, error: directError } = await supabase
          .from("registry_items")
          .select(
            "id, name, purchased, purchased_at, purchaser_name, purchaser_email, invoice_url",
          )
          .eq("registry_id", registryId)
          .eq("purchased", true);

        if (directItems && directItems.length > 0 && !directError) {
          const formattedItems = directItems.map((item) => ({
            id: item.id,
            item_name: item.name,
            purchased_at: item.purchased_at || new Date().toISOString(),
            purchaser_name: item.purchaser_name || "Guest",
            purchaser_email: item.purchaser_email || "guest@example.com",
            invoice_url: item.invoice_url || null,
          }));
          setReservations(formattedItems);
        }

        // Also try the service function
        const reservationData = await getRegistryReservations(registryId);
        if (reservationData && reservationData.length > 0) {
          setReservations(reservationData);
        }

        // Fetch registry stats for view count
        const statsData = await getRegistryStats(registryId);
        setStats({ views: statsData.views });
      } catch (err) {
        console.error("Error refreshing activity data:", err);
      }
    }, 5000);

    return () => clearInterval(pollingInterval);
  }, [registryId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            See who has viewed or purchased items from your registry.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-6">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error && reservations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            See who has viewed or purchased items from your registry.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground text-center py-6">
            {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          See who has viewed or purchased items from your registry.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {reservations.length > 0 || stats.views > 0 ? (
          <div className="space-y-4">
            {reservations.map((reservation) => (
              <div
                key={reservation.id}
                className="flex items-center gap-4 p-3 rounded-lg border"
              >
                <div className="bg-primary/10 p-2 rounded-full">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">
                    {reservation.purchaser_name} reserved{" "}
                    {reservation.item_name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(reservation.purchased_at).toLocaleString()}
                  </p>
                  {reservation.invoice_url && (
                    <div className="mt-1">
                      <a
                        href={reservation.invoice_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs inline-flex items-center gap-1 text-primary hover:text-primary/80 bg-primary/5 px-2 py-1 rounded-md"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        View Invoice
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}

            <div className="flex items-center gap-4 p-3 rounded-lg border">
              <div className="bg-primary/10 p-2 rounded-full">
                <Search className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">
                  {stats.views} {stats.views === 1 ? "person" : "people"} viewed
                  your registry
                </p>
                <p className="text-sm text-muted-foreground">Total views</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground">
              No activity yet. Share your registry to see activity here.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
