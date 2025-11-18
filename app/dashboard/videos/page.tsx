"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Plus, Play, Edit, Trash2, Video as VideoIcon } from "lucide-react";
import { VideoMessage } from "@/lib/types";

export default function VideosPage() {
  const [videos, setVideos] = useState<VideoMessage[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<VideoMessage[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, []);

  useEffect(() => {
    filterVideos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videos, statusFilter, typeFilter]);

  const fetchVideos = async () => {
    try {
      const response = await fetch("/api/videos");
      const data = await response.json();
      if (data.success) {
        setVideos(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch videos:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterVideos = () => {
    let filtered = [...videos];

    if (statusFilter !== "all") {
      filtered = filtered.filter((v) => v.status === statusFilter);
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((v) => v.type === typeFilter);
    }

    setFilteredVideos(filtered);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this video?")) return;

    try {
      const response = await fetch(`/api/videos/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setVideos(videos.filter((v) => v.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete video:", error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-200 rounded-lg w-1/3" />
          <div className="h-64 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">My Videos</h1>
          <p className="text-gray-600 mt-1">Manage all your video messages</p>
        </div>
        <Link href="/dashboard/videos/new">
          <Button className="gap-2">
            <Plus className="w-5 h-5" />
            Create New Video
          </Button>
        </Link>
      </div>

      {videos.length === 0 ? (
        <Card className="border-2 border-dashed border-gray-300">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-primary-blue/10 flex items-center justify-center mb-6">
              <VideoIcon className="w-10 h-10 text-primary-blue" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              No videos yet
            </h3>
            <p className="text-gray-600 mb-6 max-w-md">
              Create your first video message to get started
            </p>
            <Link href="/dashboard/videos/new">
              <Button size="lg" className="gap-2">
                <Plus className="w-5 h-5" />
                Create your first video
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex gap-4">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="DRAFT">Draft</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="DELIVERED">Delivered</option>
            </Select>
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="TO_OTHERS">To Others</option>
              <option value="TO_SELF">To Myself</option>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <Card key={video.id} className="overflow-hidden">
                <div className="aspect-video bg-gray-200 flex items-center justify-center">
                  {video.thumbnailUrl ? (
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Play className="w-16 h-16 text-gray-400" />
                  )}
                </div>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-gray-900 line-clamp-2">
                      {video.title}
                    </h3>
                    <Badge
                      variant={
                        video.status === "DRAFT"
                          ? "draft"
                          : video.status === "SCHEDULED"
                          ? "scheduled"
                          : "delivered"
                      }
                    >
                      {video.status}
                    </Badge>
                  </div>
                  {video.type === "TO_SELF" && (
                    <Badge variant="self">To Myself</Badge>
                  )}
                  {video.deliveryAt && (
                    <p className="text-sm text-gray-600">
                      Delivery: {new Date(video.deliveryAt).toLocaleDateString()}
                    </p>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Link href={`/dashboard/videos/${video.id}`} className="flex-1">
                      <Button variant="secondary" size="sm" className="w-full gap-2">
                        <Edit className="w-4 h-4" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(video.id)}
                      className="text-rose-heart hover:bg-rose-heart/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
