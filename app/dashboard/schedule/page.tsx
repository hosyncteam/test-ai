"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Calendar, Play } from "lucide-react";
import { VideoMessage } from "@/lib/types";

export default function SchedulePage() {
  const [videos, setVideos] = useState<VideoMessage[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<VideoMessage[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScheduledVideos();
  }, []);

  useEffect(() => {
    filterVideos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videos, filter]);

  const fetchScheduledVideos = async () => {
    try {
      const response = await fetch("/api/schedule");
      const data = await response.json();
      if (data.success) {
        setVideos(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch scheduled videos:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterVideos = () => {
    let filtered = [...videos];

    if (filter === "to_others") {
      filtered = filtered.filter((v) => v.type === "TO_OTHERS");
    } else if (filter === "to_myself") {
      filtered = filtered.filter((v) => v.type === "TO_SELF");
    }

    setFilteredVideos(filtered);
  };

  const getVideosByMonth = () => {
    const byMonth: { [key: string]: VideoMessage[] } = {};

    filteredVideos.forEach((video) => {
      if (!video.deliveryAt) return;
      const date = new Date(video.deliveryAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      if (!byMonth[monthKey]) {
        byMonth[monthKey] = [];
      }
      byMonth[monthKey].push(video);
    });

    return byMonth;
  };

  const formatMonthYear = (monthKey: string) => {
    const [year, month] = monthKey.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-200 rounded-lg w-1/3" />
          <div className="h-96 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  const videosByMonth = getVideosByMonth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Schedule Delivery</h1>
        <p className="text-gray-600 mt-1">View all your scheduled messages</p>
      </div>

      <div className="flex gap-4">
        <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All messages</option>
          <option value="to_others">To others</option>
          <option value="to_myself">To myself</option>
        </Select>
      </div>

      {videos.length === 0 ? (
        <Card className="border-2 border-dashed border-gray-300">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-primary-blue/10 flex items-center justify-center mb-6">
              <Calendar className="w-10 h-10 text-primary-blue" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              No scheduled deliveries
            </h3>
            <p className="text-gray-600 mb-6 max-w-md">
              Schedule your first video message to see it here
            </p>
          </CardContent>
        </Card>
      ) : filteredVideos.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600">No messages match your filter</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.keys(videosByMonth)
            .sort()
            .map((monthKey) => (
              <div key={monthKey}>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {formatMonthYear(monthKey)}
                </h2>
                <div className="space-y-4">
                  {videosByMonth[monthKey]
                    .sort((a, b) => {
                      const dateA = a.deliveryAt ? new Date(a.deliveryAt).getTime() : 0;
                      const dateB = b.deliveryAt ? new Date(b.deliveryAt).getTime() : 0;
                      return dateA - dateB;
                    })
                    .map((video) => (
                      <Card key={video.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="w-24 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                              {video.thumbnailUrl ? (
                                <img
                                  src={video.thumbnailUrl}
                                  alt={video.title}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                <Play className="w-8 h-8 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <h3 className="font-semibold text-gray-900 truncate">
                                  {video.title}
                                </h3>
                                <Badge
                                  variant={video.type === "TO_SELF" ? "self" : "scheduled"}
                                >
                                  {video.type === "TO_SELF" ? "To Myself" : "To Others"}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span>
                                  {video.deliveryAt &&
                                    new Date(video.deliveryAt).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                      hour: "numeric",
                                      minute: "2-digit",
                                    })}
                                </span>
                                {video.recipients && video.recipients.length > 0 && (
                                  <span>
                                    {video.recipients.length}{" "}
                                    {video.recipients.length === 1 ? "recipient" : "recipients"}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
