"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Play, Edit, Trash2, User } from "lucide-react";
import { VideoMessage } from "@/lib/types";

export default function FutureSelfPage() {
  const [videos, setVideos] = useState<VideoMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await fetch("/api/videos?type=TO_SELF");
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

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

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
          <h1 className="text-3xl font-semibold text-gray-900">Messages to Your Future Self</h1>
          <p className="text-gray-600 mt-1">
            Record or upload a video and schedule it to be delivered to your future self
          </p>
        </div>
        <Link href="/dashboard/videos/new">
          <Button variant="accent" className="gap-2">
            <Plus className="w-5 h-5" />
            Record New Message
          </Button>
        </Link>
      </div>

      {videos.length === 0 ? (
        <Card className="border-2 border-dashed border-golden-sand/50">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-golden-sand/20 flex items-center justify-center mb-6">
              <User className="w-10 h-10 text-golden-sand" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              You haven&apos;t created any messages for your future self yet
            </h3>
            <p className="text-gray-600 mb-6 max-w-md">
              Send yourself a message to open in 1, 5, or 10 years. Reflect on your journey and growth.
            </p>
            <Link href="/dashboard/videos/new">
              <Button variant="accent" size="lg" className="gap-2">
                <Plus className="w-5 h-5" />
                Record your first message
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <Card key={video.id} className="overflow-hidden border-golden-sand/30">
              <div className="aspect-video bg-golden-sand/10 flex items-center justify-center">
                {video.thumbnailUrl ? (
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Play className="w-16 h-16 text-golden-sand" />
                )}
              </div>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-gray-900 line-clamp-2">
                    {video.title}
                  </h3>
                  <Badge variant="self">To Myself</Badge>
                </div>
                {video.deliveryAt && (
                  <p className="text-sm text-gray-600">
                    Open on: {new Date(video.deliveryAt).toLocaleDateString()}
                  </p>
                )}
                {video.notes && (
                  <p className="text-sm text-gray-600 line-clamp-2">{video.notes}</p>
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
      )}
    </div>
  );
}
