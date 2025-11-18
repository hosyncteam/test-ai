import { NextRequest, NextResponse } from 'next/server';
import { mockDb } from '@/lib/db';
import { getMockUser } from '@/lib/utils';
import { ApiResponse, VideoMessage } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getMockUser();
    const { id } = await params;

    const video = mockDb.videos.find((v) => v.id === id && v.userId === user.id);

    if (!video) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Video not found',
      }, { status: 404 });
    }

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

    const videoWithRecipients = {
      ...video,
      recipients,
    };

    return NextResponse.json<ApiResponse<VideoMessage>>({
      success: true,
      data: videoWithRecipients,
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getMockUser();
    const { id } = await params;
    const body = await request.json();

    const videoIndex = mockDb.videos.findIndex(
      (v) => v.id === id && v.userId === user.id
    );

    if (videoIndex === -1) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Video not found',
      }, { status: 404 });
    }

    mockDb.videos[videoIndex] = {
      ...mockDb.videos[videoIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    if (body.recipientIds) {
      mockDb.videoRecipients = mockDb.videoRecipients.filter(
        (vr) => vr.videoId !== id
      );

      if (mockDb.videos[videoIndex].type === 'TO_SELF') {
        const videoRecipient = {
          id: `vr-${Date.now()}`,
          videoId: id,
          recipientId: null,
          isSelf: true,
        };
        mockDb.videoRecipients.push(videoRecipient);
      } else {
        body.recipientIds.forEach((recipientId: string, index: number) => {
          const videoRecipient = {
            id: `vr-${Date.now()}-${index}`,
            videoId: id,
            recipientId,
            isSelf: false,
          };
          mockDb.videoRecipients.push(videoRecipient);
        });
      }
    }

    return NextResponse.json<ApiResponse<VideoMessage>>({
      success: true,
      data: mockDb.videos[videoIndex],
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getMockUser();
    const { id } = await params;

    const videoIndex = mockDb.videos.findIndex(
      (v) => v.id === id && v.userId === user.id
    );

    if (videoIndex === -1) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Video not found',
      }, { status: 404 });
    }

    mockDb.videos.splice(videoIndex, 1);

    mockDb.videoRecipients = mockDb.videoRecipients.filter(
      (vr) => vr.videoId !== id
    );

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { message: 'Video deleted successfully' },
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}
