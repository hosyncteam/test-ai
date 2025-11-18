"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Users, Calendar, Clock, Plus } from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalVideos: 0,
    scheduledDeliveries: 0,
    recipients: 0,
    nextDelivery: null as string | null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [videosRes, recipientsRes, scheduleRes] = await Promise.all([
          fetch("/api/videos"),
          fetch("/api/recipients"),
          fetch("/api/schedule"),
        ]);

        const videosData = await videosRes.json();
        const recipientsData = await recipientsRes.json();
        const scheduleData = await scheduleRes.json();

        const videos = videosData.data || [];
        const recipients = recipientsData.data || [];
        const scheduled = scheduleData.data || [];

        const nextScheduled = scheduled
          .filter((v: { deliveryAt?: string }) => v.deliveryAt)
          .sort((a: { deliveryAt?: string }, b: { deliveryAt?: string }) => 
            new Date(a.deliveryAt || 0).getTime() - new Date(b.deliveryAt || 0).getTime()
          )[0];

        setStats({
          totalVideos: videos.length,
          scheduledDeliveries: scheduled.length,
          recipients: recipients.length,
          nextDelivery: nextScheduled?.deliveryAt || null,
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const hasContent = stats.totalVideos > 0 || stats.recipients > 0;

  return (
    <div className="space-y-8">
      {/* Welcome Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Welcome back, John</CardTitle>
          <CardDescription>
            {hasContent
              ? "Here's an overview of your memory boxes"
              : "Get started by creating your first memory box"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/dashboard/videos/new">
            <Button size="lg" className="gap-2">
              <Plus className="w-5 h-5" />
              Create new Memory Box
            </Button>
          </Link>
        </CardContent>
      </Card>

      {hasContent ? (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
                <Video className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary-blue">{stats.totalVideos}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Scheduled Deliveries</CardTitle>
                <Calendar className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary-blue">{stats.scheduledDeliveries}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recipients</CardTitle>
                <Users className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary-blue">{stats.recipients}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Next Delivery</CardTitle>
                <Clock className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-primary-blue">
                  {stats.nextDelivery
                    ? new Date(stats.nextDelivery).toLocaleDateString()
                    : "None scheduled"}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <Card className="border-2 border-dashed border-gray-300">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-primary-blue/10 flex items-center justify-center mb-6">
              <Video className="w-10 h-10 text-primary-blue" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              You haven&apos;t created any videos yet
            </h3>
            <p className="text-gray-600 mb-6 max-w-md">
              Start preserving your memories by creating your first video message. It only takes a few minutes.
            </p>
            <Link href="/dashboard/videos/new">
              <Button size="lg" className="gap-2">
                <Plus className="w-5 h-5" />
                Create your first video
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
