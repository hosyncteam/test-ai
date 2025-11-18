import { NextResponse } from 'next/server';
import { mockDb } from '@/lib/db';
import { getMockUser } from '@/lib/utils';
import { ApiResponse, VideoMessage } from '@/lib/types';

export async function GET() {
  try {
    const user = getMockUser();

    const scheduledVideos = mockDb.videos.filter(
      (v) => v.userId === user.id && v.deliveryAt && v.status === 'SCHEDULED'
    );

    const videosWithRecipients = scheduledVideos.map((video) => {
      const videoRecipients = mockDb.videoRecipients.filter(
        (vr) => vr.videoId === video.id
      );

      const recipients = videoRecipients.map((vr) => {
        const recipient = vr.recipientId
          ? mockDb.recipients.find((r) => r.id === vr.recipientId)
          : undefined;

        return {
          ...vr,
          recipient,
        };
      });

      return {
        ...video,
        recipients,
      };
    });

    return NextResponse.json<ApiResponse<VideoMessage[]>>({
      success: true,
      data: videosWithRecipients,
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}
