"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Video } from "lucide-react";
import { Recipient } from "@/lib/types";

export default function NewVideoPage() {
  const router = useRouter();
  const [step, setStep] = useState<"type" | "details">("type");
  const [videoType, setVideoType] = useState<"TO_OTHERS" | "TO_SELF" | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [status, setStatus] = useState<"DRAFT" | "SCHEDULED">("DRAFT");
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [emailReminder, setEmailReminder] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (videoType === "TO_OTHERS") {
      fetchRecipients();
    }
  }, [videoType]);

  const fetchRecipients = async () => {
    try {
      const response = await fetch("/api/recipients");
      const data = await response.json();
      if (data.success) {
        setRecipients(data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch recipients:", error);
    }
  };

  const handleTypeSelect = (type: "TO_OTHERS" | "TO_SELF") => {
    setVideoType(type);
    setStep("details");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const deliveryAt =
        deliveryDate && deliveryTime
          ? new Date(`${deliveryDate}T${deliveryTime}`).toISOString()
          : null;

      const response = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description: videoType === "TO_OTHERS" ? description : undefined,
          notes: videoType === "TO_SELF" ? notes : undefined,
          type: videoType,
          videoUrl: "https://example.com/mock-video.mp4",
          status,
          deliveryAt,
          recipientIds: videoType === "TO_OTHERS" ? selectedRecipients : undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push("/dashboard/videos");
      }
    } catch (error) {
      console.error("Failed to create video:", error);
    } finally {
      setLoading(false);
    }
  };

  if (step === "type") {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Create New Memory Box</h1>
          <p className="text-gray-600 mt-1">Choose who you want to send this message to</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card
            className="cursor-pointer hover:border-primary-blue transition-colors"
            onClick={() => handleTypeSelect("TO_OTHERS")}
          >
            <CardHeader>
              <div className="w-16 h-16 rounded-full bg-primary-blue flex items-center justify-center mb-4">
                <Video className="w-8 h-8 text-white" />
              </div>
              <CardTitle>Send to someone else</CardTitle>
              <CardDescription>
                Create a video message for your loved ones to receive on a future date
              </CardDescription>
            </CardHeader>
          </Card>

          <Card
            className="cursor-pointer hover:border-golden-sand transition-colors"
            onClick={() => handleTypeSelect("TO_SELF")}
          >
            <CardHeader>
              <div className="w-16 h-16 rounded-full bg-golden-sand flex items-center justify-center mb-4">
                <Video className="w-8 h-8 text-primary-blue" />
              </div>
              <CardTitle>Send to your future self</CardTitle>
              <CardDescription>
                Record a message for yourself to open in the future
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Button variant="ghost" onClick={() => setStep("type")}>
          ← Back
        </Button>
        <h1 className="text-3xl font-semibold text-gray-900 mt-4">
          {videoType === "TO_SELF" ? "Message to Your Future Self" : "Message to Others"}
        </h1>
        <p className="text-gray-600 mt-1">Fill in the details for your video message</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Video Upload</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Upload your video or record one</p>
              <p className="text-sm text-gray-500">MP4, MOV, or WebM (max 500MB)</p>
              <Button type="button" variant="secondary" className="mt-4">
                Choose File
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Message Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Give your message a title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {videoType === "TO_OTHERS" ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Add a description for this message"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Recipients</Label>
                  {recipients.length === 0 ? (
                    <p className="text-sm text-gray-600">
                      No recipients yet.{" "}
                      <a href="/dashboard/recipients" className="text-primary-blue hover:underline">
                        Add recipients
                      </a>
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {recipients.map((recipient) => (
                        <label key={recipient.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                          <input
                            type="checkbox"
                            checked={selectedRecipients.includes(recipient.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedRecipients([...selectedRecipients, recipient.id]);
                              } else {
                                setSelectedRecipients(selectedRecipients.filter((id) => id !== recipient.id));
                              }
                            }}
                            className="w-4 h-4"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{recipient.name}</p>
                            <p className="text-sm text-gray-600">{recipient.email}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="notes">Why are you recording this message?</Label>
                  <Textarea
                    id="notes"
                    placeholder="Share your thoughts about why you're creating this message for your future self"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-golden-sand/10 rounded-lg">
                  <div>
                    <Label>Send me an email reminder</Label>
                    <p className="text-sm text-gray-600">Get notified when your message is delivered</p>
                  </div>
                  <Switch
                    checked={emailReminder}
                    onCheckedChange={setEmailReminder}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Delivery Schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="deliveryDate">Delivery Date</Label>
                <Input
                  id="deliveryDate"
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deliveryTime">Delivery Time</Label>
                <Input
                  id="deliveryTime"
                  type="time"
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as "DRAFT" | "SCHEDULED")}
              >
                <option value="DRAFT">Save as Draft</option>
                <option value="SCHEDULED">Schedule for Delivery</option>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? "Creating..." : videoType === "TO_SELF" ? "Schedule Future Self Message" : "Schedule Message"}
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.push("/dashboard/videos")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
