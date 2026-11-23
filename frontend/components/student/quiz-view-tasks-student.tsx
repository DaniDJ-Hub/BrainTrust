"use client";
import React, { useState, useRef } from 'react';

import { X } from "lucide-react";
import { Assignment} from '@/app/domain/entities';
import { Document } from '@/app/domain/valueObjects';
import { Submission } from '@/app/shared/models/assignment.model';
import { getTimeRemaining } from './task/task-utils';
import { TaskAIAnalysis } from './task/task-ai-analysis';
import { TaskResourcesCard, TaskSummaryCard } from './task/task-overview';
import { TaskSubmissionForm } from './task/task-submission-form';
import { TaskSidebar } from './task/task-sidebar';
import { TaskEmptyDialog, TaskExitDialog, TaskSubmitDialog } from './task/task-dialogs';
import { PageHeader } from '@/components/common';

interface TaskSubmissionViewProps {
  assignment: Assignment;
  existingSubmission?: Submission;
  onSubmit: (submission: {
    content: string;
    attachments: File[];
  }) => Promise<void>;
  onDownloadAttachment: (attachment: Document) => void;
  isSubmitting?: boolean;
  onExit?: () => void;
  /** "h2" when rendered inside an overlay on top of a page that already has an h1. */
  headingLevel?: "h1" | "h2";
}

export const TaskSubmissionView: React.FC<TaskSubmissionViewProps> = ({
  assignment,
  existingSubmission,
  onSubmit,
  onDownloadAttachment,
  isSubmitting = false,
  onExit,
  headingLevel = "h1"
}) => {
  const [content, setContent] = useState(existingSubmission?.content || '');
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showEmptyConfirm, setShowEmptyConfirm] = useState(false);
  const [showAllLinks, setShowAllLinks] = useState(false);
  const [showAllAttachments, setShowAllAttachments] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isLate = existingSubmission?.status === 'LATE_SUBMITTED';
  const isSubmitted = existingSubmission?.status === 'SUBMITTED' || existingSubmission?.status === 'LATE_SUBMITTED' || existingSubmission?.status === 'GRADED';
  const isGraded = existingSubmission?.status === 'GRADED';
  const isClosedForLate =
    !!assignment.dueDate &&
    new Date(assignment.dueDate).getTime() < Date.now() &&
    !assignment.allowLateSubmissions;
  const hasAIResult = existingSubmission?.aiAnalysis !== undefined;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    setFiles(prev => [...prev, ...selectedFiles]);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setUploadProgress(0);
      }
    }, 100);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!content.trim() && files.length === 0) {
      setShowSubmitConfirm(false);
      setShowEmptyConfirm(true);
      return;
    }
    await submitNow();
  };

  const submitNow = async () => {
    try {
      await onSubmit({ content, attachments: files });
      setShowSubmitConfirm(false);
      if (!existingSubmission) {
        setContent('');
        setFiles([]);
      }
    } catch (error) {
      console.error('Error al enviar:', error);
    }
  };

  const handleSubmitConfirm = () => {
    setShowSubmitConfirm(true);
  };

  const handleExitConfirm = () => {
    setShowExitConfirm(false);
    onExit?.();
  };

  const timeRemaining = getTimeRemaining(assignment.dueDate);

  const displayedLinks = showAllLinks ? assignment.links : assignment.links.slice(0, 3);
  const displayedAttachments = showAllAttachments ? assignment.attachments : assignment.attachments.slice(0, 3);
return (
  <>
    <div className="bg-background p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        <PageHeader
          as={headingLevel}
          eyebrow="Tarea"
          title={assignment.title}
          actions={
            <button
              type="button"
              data-overlay-close
              onClick={() => setShowExitConfirm(true)}
              className="btn-secondary"
            >
              <X className="size-4" aria-hidden="true" />
              Salir
            </button>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          <div className="lg:col-span-3 space-y-5">

            <TaskSummaryCard assignment={assignment} timeRemaining={timeRemaining} />

            {(assignment.urls.length > 0 || assignment.attachments.length > 0 || assignment.links.length > 0) && (
              <TaskResourcesCard
                assignment={assignment}
                displayedLinks={displayedLinks}
                displayedAttachments={displayedAttachments}
                showAllLinks={showAllLinks}
                onToggleLinks={() => setShowAllLinks(!showAllLinks)}
                showAllAttachments={showAllAttachments}
                onToggleAttachments={() => setShowAllAttachments(!showAllAttachments)}
                onDownloadAttachment={onDownloadAttachment}
              />
            )}

            {hasAIResult && existingSubmission?.aiAnalysis && <TaskAIAnalysis aiResult={existingSubmission.aiAnalysis} />}

            <TaskSubmissionForm
              assignment={assignment}
              existingSubmission={existingSubmission}
              content={content}
              onContentChange={setContent}
              files={files}
              uploadProgress={uploadProgress}
              fileInputRef={fileInputRef}
              onFileSelect={handleFileSelect}
              onRemoveFile={removeFile}
              onDownloadAttachment={onDownloadAttachment}
              onSubmitClick={handleSubmitConfirm}
              isSubmitting={isSubmitting}
              isSubmitted={isSubmitted}
              isGraded={isGraded}
              isLate={isLate}
              isClosedForLate={isClosedForLate}
            />
          </div>

          <TaskSidebar
            assignment={assignment}
            existingSubmission={existingSubmission}
            timeRemaining={timeRemaining}
            isSubmitted={isSubmitted}
            isGraded={isGraded}
            isLate={isLate}
            hasAIResult={hasAIResult}
          />
        </div>
      </div>
    </div>

    <TaskExitDialog
      open={showExitConfirm}
      onOpenChange={setShowExitConfirm}
      isSubmitted={isSubmitted}
      onConfirm={handleExitConfirm}
    />

    <TaskSubmitDialog
      open={showSubmitConfirm}
      onOpenChange={setShowSubmitConfirm}
      files={files}
      onConfirm={handleSubmit}
    />

    <TaskEmptyDialog
      open={showEmptyConfirm}
      onOpenChange={setShowEmptyConfirm}
      onConfirm={submitNow}
    />
  </>
);
};
