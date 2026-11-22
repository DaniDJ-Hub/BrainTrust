
"use client";

import { studentSubmissionKeys } from "@/app/infraestructure/api/course/student/student-key";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


import {
  getStudentTaskSubmission,
  submitTask,
} from "@/components/student/api/student-submission";

import {
  getStudentQuizSubmission,
  submitQuiz,
} from "@/components/teacher-student/api/quiz-teacher";

export function useStudentTaskSubmission(
    assignmentId: string | null,
    studentId: string | null
) {
  return useQuery({
    queryKey: studentSubmissionKeys.taskSubmission(
        assignmentId || "",
        studentId || ""
    ),
    queryFn: () => getStudentTaskSubmission(assignmentId!, studentId!),
    enabled: !!assignmentId && !!studentId,
    staleTime: 5 * 60 * 1000,
  });
}

const SUBMISSION_RULE_MESSAGES = [
  "La fecha límite pasó",
  "La tarea está cerrada",
];

const toSubmissionToastMessage = (message: string): string =>
  SUBMISSION_RULE_MESSAGES.some((prefix) => message.startsWith(prefix))
    ? message
    : "No se pudo enviar la tarea. Inténtalo de nuevo.";

export function useTaskSubmission() {
  const queryClient = useQueryClient();

  const submitTaskMutation = useMutation({
    mutationFn: async (params: Parameters<typeof submitTask>[0]) => {
      const result = await submitTask(params);
      if (!result.ok) {
        throw new Error(result.message);
      }
      return result.submission;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: studentSubmissionKeys.taskSubmission(
            variables.assignmentId,
            variables.studentId
        ),
      });
    },
    onError: (error: Error) => {
      console.error("Error submitting task:", error.message);
      toast.error(toSubmissionToastMessage(error.message));
    },
  });

  return {
    submitTask: submitTaskMutation,
    isSubmitting: submitTaskMutation.isPending,
  };
}

export function useStudentQuizSubmission(
    quizId: string | null,
    studentId: string | null
) {
  return useQuery({
    queryKey: studentSubmissionKeys.quizSubmission(quizId || "", studentId || ""),
    queryFn: () => getStudentQuizSubmission(quizId!, studentId!),
    enabled: !!quizId && !!studentId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useQuizSubmission() {
  const queryClient = useQueryClient();

  const submitQuizMutation = useMutation({
    mutationFn: submitQuiz,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: studentSubmissionKeys.quizSubmission(
            variables.quizId,
            variables.studentId
        ),
      });
    },
    onError: (error: Error) => {
      console.error("Error submitting quiz:", error.message);
    },
  });

  return {
    submitQuiz: submitQuizMutation,
    isSubmitting: submitQuizMutation.isPending,
  };
}