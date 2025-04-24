import { useEffect, useState } from "react";
import { Show } from "../types/Show";
import { MediaRow } from "./MediaRow";
import { useAuth } from "./AuthContext";

interface PersonalizedCarouselProps {
  title: string;
}

export const PersonalizedCarousel = ({ title }: PersonalizedCarouselProps) => {
  const [shows, setShows] = useState<Show[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchPersonalizedShows = async () => {
      if (!isAuthenticated || !user?.uid) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/pbs-api/top-picks/${user.uid}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch personalized shows: ${response.status}`);
        }

        const data = await response.json();
        setShows(data.topPicks || []);
      } catch (error) {
        console.error("Error fetching personalized shows:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPersonalizedShows();
  }, [isAuthenticated, user]);

  if (!isAuthenticated || !user) {
    return null;
  }

  if (isLoading) {
    return null;
  }

  if (shows.length === 0) {
    return null;
  }

  return <MediaRow title={title} shows={shows} />;
};