import { NextRequest, NextResponse } from 'next/server';
import { mockDb } from '@/lib/db';
import { getMockUser } from '@/lib/utils';
import { ApiResponse, VideoMessage } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const user = getMockUser();
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    let videos = mockDb.videos.filter((v) => v.userId === user.id);

    if (status) {
      videos = videos.filter((v) => v.status === status);
    }

    if (type) {
      videos = videos.filter((v) => v.type === type);
    }

    const videosWithRecipients = videos.map((video) => {
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

export async function POST(request: NextRequest) {
  try {
    const user = getMockUser();
    const body = await request.json();
    const {
      title,
      description,
      type,
      videoUrl,
      thumbnailUrl,
      status,
      deliveryAt,
      notes,
      recipientIds,
    } = body;

    if (!title || !type || !videoUrl) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Title, type, and videoUrl are required',
      }, { status: 400 });
    }

    const newVideo = {
      id: `video-${Date.now()}`,
      userId: user.id,
      title,
      description: description || '',
      type,
      videoUrl,
      thumbnailUrl: thumbnailUrl || '',
      status: status || 'DRAFT',
      deliveryAt: deliveryAt || null,
      notes: notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockDb.videos.push(newVideo);

    if (type === 'TO_SELF') {
      const videoRecipient = {
        id: `vr-${Date.now()}`,
        videoId: newVideo.id,
        recipientId: null,
        isSelf: true,
      };
      mockDb.videoRecipients.push(videoRecipient);
    } else if (recipientIds && Array.isArray(recipientIds)) {
      recipientIds.forEach((recipientId: string, index: number) => {
        const videoRecipient = {
          id: `vr-${Date.now()}-${index}`,
          videoId: newVideo.id,
          recipientId,
          isSelf: false,
        };
        mockDb.videoRecipients.push(videoRecipient);
      });
    }

    return NextResponse.json<ApiResponse<VideoMessage>>({
      success: true,
      data: newVideo,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}
